# Drum Q Design System

> 🥁 **DrumQ — Drummer Queue Manager.** A personal SaaS for professional drummers: managing gig queues, subs, venues, rosters, and payments. Built in Next.js 14 with Tailwind. Minimal. Monochrome-first, with a single hot-red accent.

## Context

Drum Q is a productivity app for Thai gigging drummers. Its job is to answer three questions fast:
1. **Who's playing tonight?** (me, or a sub?)
2. **Am I owed money, or do I owe a sub?**
3. **Any clashes?** (concert nights, double-bookings)

The product ships as:
- **`/web`** — the main Next.js 14 App Router product (desktop sidebar + mobile bottom-tabs). Recreated here as the primary UI kit.
- **`/` (PWA)** — an older vanilla-JS PWA prototype. Same visual language, older tokens (orange-pink gradient). Not our target.
- **`/supabase`** — SQL schema for a future multi-user build. Not visual.

The design direction is **“Minimal White + Black + Red”** (per the product README). Black is the primary brand; red (`#e11d48`) is the hot accent used for alerts, the *unpaid* state, today markers, and calls to action that say *“now”*.

### Sources

- GitHub: `artwa74/drumq-app` — imported April 2026. Files live under `app/`, `components/`, `lib/`, `public/`, plus `tailwind.config.ts`.
- Key specs read verbatim:
  - `tailwind.config.ts` (design tokens)
  - `app/globals.css` (buttons, chips, inputs, list-row)
  - `components/{BrandLockup, Sidebar, Topbar, EventCard, StatCard, BottomTabs, EventForm}.tsx`
  - `app/{page, calendar/page, finance/page}.tsx`

---

## Index

| File | Purpose |
|---|---|
| `README.md` | This file — brand, content, visual foundations, iconography |
| `SKILL.md` | Agent Skill manifest — drop-in for Claude Code or other agent hosts |
| `colors_and_type.css` | Core tokens: colors, type, spacing, radii, shadows, semantic vars |
| `app/` `components/` `lib/` | Imported source from `artwa74/drumq-app` — single source of truth |
| `preview/` | Design System tab cards (typography, colors, spacing, components) |
| `ui_kits/web/` | Drum Q web dashboard — React JSX components + interactive `index.html` |

---

## Content Fundamentals

Drum Q's copy is bilingual-by-default (Thai primary, English for nav labels and numbers). It's terse, friendly, and emoji-positive.

**Voice.** First-person, casual-professional. Speaks drummer-to-drummer. Never corporate. Examples from the code:
- Hero on homepage: *“Overview”*, followed by Thai date string.
- Bulk-generate CTA: *“สร้างจากผัง — กระจายงานทั้งเดือน”*.
- Empty calendar state: *“ไม่มีคิวในอนาคต”*.
- Pro tip on homepage: *“ตั้งผังประจำให้ครบก่อน แล้วใช้ Bulk Generate สร้างงานทั้งเดือนใน 3 คลิก”*.
- Confirmation: *`ลบงาน "${e.venueName}"?`*.

**Tone.** Confident, minimal, slightly playful. Never *Oops!*. Never *Sorry for the inconvenience*.

**Casing.**
- Thai body copy in normal sentence form.
- English labels: Title Case for proper nouns / page titles (*Overview*, *Finance*), UPPERCASE + letter-spaced for eyebrows/pills (*`PRO TIP`, `LIVE`, `PAID`, `UNPAID`*).
- Numbers: tabular-nums everywhere via `.num` utility — Space Grotesk's rendering of digits is the *look*.

**Emoji usage** — **positive, frequent, and embedded in labels**, not decorative. Used as semantic icons inline with Thai text:
- `📅 วันที่`, `🏠 ร้าน`, `🎯 ประเภทงาน`, `👤 คนแทน`, `🕐 เริ่ม`, `💵 ค่าจ้าง`, `📝 หมายเหตุ` (from `EventForm.tsx`)
- Status chips: `🥁 งานวง`, `👤 จ้างแทน`, `🎤 ติดคอนเสิร์ต`
- Celebratory empty states: `ไม่มีค้างจ่ายคนแทน 🎉`
- Section headers in Finance: `❌ ค้างจ่าย`, `✅ จ่ายแล้ว`

This is the product's signature — **don't remove emoji; they are part of the UI vocabulary**.

**Person.** *คุณ* is implicit (dropped). *ฉัน / ผม* never used.

**Numbers & currency.** Always `฿` prefix, glued. `toLocaleString('th-TH')` for separators. Thai Buddhist year on calendar header (`{y + 543}`). Time in `HH:MM`, with en-dash between start–end.

**Bilingual pairing.** Thai labels pair with English eyebrows and nav (e.g. sidebar section labels *"Menu"* / *"Manage"* in English while items are Thai: *ปฏิทิน, การเงิน, ร้าน, นักดนตรี*).

---

## Visual Foundations

### Color

Monochrome system with a **single chromatic accent** (hot red).

- **Brand / ink** `#0a0a0a` — the *primary* color. Used on the hero CTA (`btn-brand`), the KPI "งานวันนี้" inverted card, PAID pill, and the Tip widget background.
- **Brand hot** `#e11d48` — the accent. Appears on: active nav indicator (left rail), UNPAID pill, today chip, "live" pulsing dot on today's gig card, notification dot, and the red "ค้างจ่าย" hero tile.
- **Brand light** `#fef2f3` — very pale red wash (rare; dashed borders / hover states).
- **Brand deep** `#000000` — true black for the gradient `brand-grad` (`#0a0a0a → #000`).

Neutrals are a cool-leaning gray scale:
- `ink.DEFAULT` `#0c0c10` — body text
- `ink.soft` `#1a1a20` — dark surface
- `ink.mute` `#5a5a66` — secondary text
- `ink.dim` `#8e8e98` — tertiary / disabled
- `surface.DEFAULT` `#ffffff` — primary surface
- `surface.2` `#fafafa` — subtle wash
- `surface.3` `#f4f4f5` — deeper wash
- `line.DEFAULT` `#e5e5e5` — hairline
- `line.strong` `#d4d4d4` — hover border

No blues, greens, or purples as brand colors. Feedback colors (`rose-500`, `#12b981` success) appear only in content, never chrome.

### Typography

Three families, loaded as Next.js CSS variables.

- **Display**: `--font-display` → **Space Grotesk** (700). Used for H1 titles, KPI numbers (`.num`), brand wordmark, date chips, stat values, modal headers. Letter-spacing tight (`-0.02em` to `-0.035em`).
- **Sans / body**: `--font-inter` → **Inter**. Paired with IBM Plex Sans Thai for Thai glyphs via `--font-thai`. Body base `15px` with `letter-spacing: -0.011em`. Features enabled: `"ss01"`, `"cv11"`.
- **Thai**: `--font-thai` → **IBM Plex Sans Thai** (400/500/600/700).

No mono font in the product — `.num` utility on Space Grotesk + `font-variant-numeric: tabular-nums` does all tabular duty.

**Scale** (from real usage):
- H1 display `30–40px` / `-0.025 to -0.035em` / `font-weight: 700` / `line-height: 1`
- H2 `18–22px` / tight
- KPI value `24–34px` (`.num`, Space Grotesk bold)
- Body `15px` default, `13–13.5px` for secondary
- Eyebrow `10.5–11px` uppercase, `tracking-[0.12em]`, `font-weight: 600–700`
- Micro / pills `10–11px` semibold

### Spacing

Tailwind defaults. Common rhythms observed:
- Page padding: `px-5 lg:px-10`, `py-6 lg:py-10`
- Card padding: `p-4` for list cards, `p-5` for feature cards, `p-5 lg:p-7` for hero
- Section gap: `mb-8` (between header ↔ KPI row ↔ content)
- KPI grid gap: `gap-3`
- Sidebar width: fixed **240px**

### Radii

Soft-but-not-pillowy. Gradated by surface role.
- `rounded-md` (6px) — chips, inline pills
- `rounded-lg` (8px) — buttons, inputs, list-row, icon-circle
- `rounded-xl` (12px) — event cards, stat cards, side panels, calendar container
- `rounded-3xl` (24px) — the red hero "ค้างจ่าย" card in Finance (extracted `--r-lg` legacy from PWA)
- `rounded-full` — pulsing today dot, notification dot, kbd corners

### Shadows

Very soft. The system is **border-first, shadow-second**.
- `shadow-soft` `0 1px 2px rgba(0,0,0,0.04)` — resting cards
- `shadow-float` `0 4px 16px rgba(0,0,0,0.06)` — hover popovers
- `shadow-glow` `0 4px 12px -2px rgba(225,29,72,0.2)` — **reserved** for the red hero tile only (the "ค้างจ่าย" gradient card)

### Borders

**The workhorse of depth.** Every card has a `border border-line`. On hover, borders transition to `border-line-strong` (never to a colored border, except on ordered-list items where `hover:border-ink` / `hover:border-brand-hot/40` signals selection.)

### Backgrounds

Flat white (`#ffffff`) everywhere. The only gradient surfaces are:
1. The `bg-brand-grad` CTA (`#0a0a0a → #000`) — a near-flat black.
2. The finance "ค้างจ่าย" hero (`#ff4d6d → #ff2d55`) — the loudest moment in the product.
3. A radial soft-glow circle applied **inside** heroes (`bg-[radial-gradient(circle,rgba(255,255,255,0.22),transparent_70%)]`) as a top-right corner accent.

No full-bleed photography. No patterns. No noise. No decorative illustrations.

### Animation

Restrained and functional.
- Hover: `transition` on `border-color` / `background` only.
- Active press: `active:scale-[0.98]` on buttons and cards.
- The **"today" gig card** has a pulsing red dot (`animate-ping` + solid dot on top) — the only animated element on the homepage.
- Modals (legacy PWA): `translateY(100%) → 0` at `cubic-bezier(0.32, 0.72, 0, 1)` in 280ms.
- Duration defaults: `120–150ms` for state, `200ms` for layout, `280–300ms` for overlay.

### Hover / press

- **Cards**: `hover:border-line-strong` (most) or `hover:border-ink` (selected-path), `hover:border-brand-hot/40` (today gig).
- **Buttons**: `btn-brand` darkens to `#262626` on hover. `btn-accent` darkens to `#be123c`. All buttons `active:scale-[0.98]`.
- **Nav items**: `hover:bg-surface-2 hover:text-ink` (otherwise muted). Active = `bg-surface-2 text-ink` + 3px red left-rail bar.
- **Inputs**: focus = `border-brand + ring-2 ring-brand/15` (black ring, not red).
- **Icon buttons** (Topbar bell, close-X): `hover:bg-surface-2`, rounded 8px.

### Transparency & blur

- Topbar: `bg-white/90 backdrop-blur` when sticky.
- Legacy PWA tab bar (not in `/web`): glassy `rgba(255,255,255,0.82)` + `saturate(180%) blur(24px)`.
- Modal overlays: `rgba(15,15,25,0.35)` + `blur(8px)` (PWA legacy).

### Imagery vibe

Zero product photography. Musician profiles use **circular avatars** (photo if uploaded, else initials-on-black square-rounded). Slip images are user-uploaded receipts and appear inline in event detail.

### Cards

Canonical pattern (most-used):
```
bg-white border border-line rounded-xl p-4
hover:border-line-strong transition
```
Feature cards bump to `p-5 rounded-xl`. The Tip widget is the single inverted card (`bg-ink text-white`).

### Layout

- **Desktop (≥1024px)**: fixed 240px sidebar (`lg:pl-[240px]` on main column) + 56px sticky topbar + `max-w-[1240px]` main.
- **Mobile (<1024px)**: no sidebar; BottomTabs (5 items, `Plus` in middle) fixed at bottom, safe-area-aware padding.

---

## Iconography

**System**: [`lucide-react`](https://lucide.dev) — loaded as JSX components in every `.tsx` file. This is the **only** icon system.

Observed usage (from imports):
- Nav: `Home, Calendar, Wallet, Settings, Plus, Users, Building2, Zap`
- Status / feedback: `AlertCircle, CheckCircle2, TrendingUp, Sparkles, Circle, Trash2`
- Chrome: `Search, Bell, Command, ChevronLeft, ChevronRight, ArrowUpRight, Clock, User, CalendarDays`

**Conventions**:
- Size: **`16px` in chrome** (buttons, nav items), **`22px` in stat rows**, `12–14px` inline with body text, `20px` in bottom-tab bar.
- Stroke: `strokeWidth={1.7}` default, `{2}` or `{2.2}` when *active* (nav item, selected tab). Bottom-tab active uses `strokeWidth={2}`.
- Color: `currentColor` — inherits from text. The Topbar bell includes a `rose-500` **unread dot** overlay.

**Lucide (on-brand) ✅ — keep.** Lucide's 1.5-ish stroke + rounded joins perfectly match Drum Q's soft-modern-minimal tone.

**Emoji as icons** — **yes, used alongside Lucide.** Labels in `EventForm` prefix Thai with emoji (`📅 วันที่`, `💵 ค่าจ้าง`). Status chips and finance section headers use emoji. This is a deliberate design choice; do not replace with Lucide.

**SVG logo**: `BrandLockup.tsx` draws a custom SVG (screen + dots, the "monitor" glyph) inside a black rounded-lg square, with a red dot in the top-right corner. Wordmark renders *Drum***Q** — display font, 17px, with the Q in `text-brand-hot`.

**Never used**: icon fonts, PNG icons, isometric illustrations, 3D renders.

---

## Caveats & next steps

- ⚠️ **Webfonts**: we rely on `next/font/google` to serve **Space Grotesk**, **Inter**, and **IBM Plex Sans Thai**. Outside Next.js, previews pull the same families from Google Fonts CDN. If offline support matters, drop the TTF/WOFF2s into `fonts/` and update `colors_and_type.css`.
- ⚠️ **No app icon / logo PNGs** found in the repo aside from `manifest.json` references. The SVG mark in `BrandLockup` is the canonical logo; we should export it at 16/32/192/512 at some point.
- ⚠️ **Favicon / manifest**: `app/manifest.json` references `/manifest.json` but no `/icon-*.png` files are in the imported tree. Flag for asset pass later.
- ⚠️ **UI kit** is limited to the surfaces observed in the imported code — we didn't invent new screens.

**Help me iterate →** tell me which surface feels least right (Overview, Calendar, Finance, Settings, Event detail) and I'll push it closer.
