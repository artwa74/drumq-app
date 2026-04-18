# DrumQ — Next.js + Supabase

โครงแอปใหม่ (แยกจาก PWA `../index.html` — ไม่เกี่ยวกับโปรเจคอื่น)

## Setup

### 1) สร้างโปรเจค Supabase ใหม่
1. ไปที่ https://supabase.com → New project → ตั้งชื่อ `drumq`
2. เลือก region ใกล้ไทย (`Singapore` หรือ `Tokyo`)
3. บันทึก DB password

### 2) รัน schema
1. Dashboard → **SQL Editor** → New query
2. Copy เนื้อหาจาก `../supabase/schema.sql` → วาง → Run
3. Dashboard → **Storage** → New bucket ชื่อ `slips` (private)

### 3) เปิด Auth
Dashboard → **Authentication** → Providers
- เปิด **Email** (default)
- เปิด **Google** (แนะนำ) → ใส่ OAuth client ID/Secret

### 4) Env
```bash
cd web
cp .env.example .env.local
```
กรอก `NEXT_PUBLIC_SUPABASE_URL` และ `NEXT_PUBLIC_SUPABASE_ANON_KEY` จาก Project Settings → API

### 5) Install & Run
```bash
npm install
npm run dev
```
เปิด http://localhost:3000

## Stack
- **Next.js 14** (App Router, RSC)
- **Tailwind 3** + custom tokens (font Inter / Space Grotesk / IBM Plex Sans Thai)
- **Supabase** (Postgres + Auth + Storage + RLS)
- **Lucide icons**
- **Framer Motion** (เอาไว้ทำ transitions)

## สิ่งที่ scaffold แล้ว
- [x] Layout + bottom tab bar (glass morphism)
- [x] หน้า Home + hero stat cards
- [x] EventCard, StatCard, BrandLockup components
- [x] Supabase client (browser + server)
- [x] Types ทั้งหมดตรงกับ schema

## ยังต้องทำต่อ
- [ ] `/login` page (Supabase Auth UI)
- [ ] `/events/new` form + auto-fill จาก roster
- [ ] `/calendar` page
- [ ] `/events/[id]` detail + actions
- [ ] `/finance` + owed summary
- [ ] `/settings` (venues / musicians / roster / bulk generate)
- [ ] `/api/gcal/*` (Google Calendar two-way sync)
- [ ] `middleware.ts` (protect routes)
