-- ============================================================
-- DrumQ — Drummer Queue Manager
-- Database Schema (PostgreSQL / Supabase)
-- Standalone project — ไม่เกี่ยวกับโปรเจคอื่น
-- ============================================================

-- Extensions
create extension if not exists "pgcrypto";

-- ============================================================
-- 1) VENUES — ร้านที่เล่นประจำ
-- ============================================================
create table public.venues (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  name            text not null,
  address         text,
  map_url         text,
  contact_person  text,
  default_fee     integer,                -- ค่าจ้างประจำ (บาท/รอบ)
  image_url       text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index venues_user_idx on public.venues(user_id);

-- ============================================================
-- 2) MUSICIANS — ทำเนียบนักดนตรี / คนแทน
-- ============================================================
create table public.musicians (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  name            text not null,
  phone           text,
  bank_name       text,
  bank_account    text,
  line_url        text,
  messenger_url   text,
  profile_image   text,
  notes           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index musicians_user_idx on public.musicians(user_id);

-- ============================================================
-- 3) ROSTER — ผังคนแทนประจำ (ร้าน × วัน × รอบ)
--    รองรับหลายรอบต่อวัน (unique ด้วย start_time)
-- ============================================================
create type day_of_week as enum ('อาทิตย์','จันทร์','อังคาร','พุธ','พฤหัสบดี','ศุกร์','เสาร์');

create table public.roster (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references auth.users(id) on delete cascade,
  venue_id            uuid not null references public.venues(id) on delete cascade,
  day_of_week         day_of_week not null,
  regular_musician_id uuid references public.musicians(id) on delete set null,
  standard_start      time,
  standard_end        time,
  created_at          timestamptz not null default now()
);
create index roster_user_idx on public.roster(user_id);
create index roster_lookup_idx on public.roster(venue_id, day_of_week);

-- ============================================================
-- 4) EVENTS — ตารางงานจริง
-- ============================================================
create type event_status as enum ('งานวง','จ้างคนแทน','ติดคอนเสิร์ต');

create table public.events (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  venue_id        uuid references public.venues(id) on delete set null,
  venue_name      text not null,                 -- เก็บซ้ำ กันร้านถูกลบแล้วงานหาย
  date            date not null,
  status          event_status not null default 'งานวง',

  -- คนแทนจริง (override จาก roster ได้)
  actual_musician_id uuid references public.musicians(id) on delete set null,
  actual_sub_name    text,                        -- allow other values (คนที่ไม่อยู่ใน musicians)
  actual_start       time,
  actual_end         time,

  fee             integer,
  paid            boolean not null default false,
  paid_at         timestamptz,
  slip_url        text,
  notes           text,

  -- Google Calendar two-way sync
  gcal_event_id   text,
  gcal_synced_at  timestamptz,

  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index events_user_idx on public.events(user_id);
create index events_date_idx on public.events(user_id, date);
create index events_unpaid_idx on public.events(user_id, paid) where paid = false;

-- ============================================================
-- 5) HELPER VIEWS — คำนวณ final values (Smart Auto-Fill)
-- ============================================================
create or replace view public.events_resolved as
select
  e.*,
  coalesce(e.actual_sub_name,
           (select m.name from public.musicians m where m.id = e.actual_musician_id),
           (select m.name from public.musicians m
            join public.roster r on r.regular_musician_id = m.id
            where r.venue_id = e.venue_id
              and r.day_of_week::text = to_char(e.date, 'TMDay')  -- note: may need locale
            limit 1)
  ) as final_sub_name,
  coalesce(e.actual_start,
           (select r.standard_start from public.roster r
            where r.venue_id = e.venue_id
              and r.day_of_week::text = to_char(e.date, 'TMDay')
            limit 1)
  ) as final_start,
  coalesce(e.actual_end,
           (select r.standard_end from public.roster r
            where r.venue_id = e.venue_id
              and r.day_of_week::text = to_char(e.date, 'TMDay')
            limit 1)
  ) as final_end
from public.events e;

-- ============================================================
-- 6) TRIGGERS — updated_at
-- ============================================================
create or replace function public.tg_set_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

create trigger venues_upd     before update on public.venues     for each row execute function public.tg_set_updated_at();
create trigger musicians_upd  before update on public.musicians  for each row execute function public.tg_set_updated_at();
create trigger events_upd     before update on public.events     for each row execute function public.tg_set_updated_at();

-- ============================================================
-- 7) ROW LEVEL SECURITY — each user sees only their own rows
-- ============================================================
alter table public.venues     enable row level security;
alter table public.musicians  enable row level security;
alter table public.roster     enable row level security;
alter table public.events     enable row level security;

create policy "own venues"    on public.venues    for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own musicians" on public.musicians for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own roster"    on public.roster    for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own events"    on public.events    for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================
-- 8) STORAGE BUCKET (for slip images) — run in Supabase Dashboard
-- ============================================================
-- Storage → New bucket: "slips" (public = false)
-- Policy: INSERT/SELECT/DELETE where auth.uid() = (storage.foldername(name))[1]::uuid
-- Upload path convention: {user_id}/{event_id}.jpg
