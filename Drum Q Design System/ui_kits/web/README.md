# Drum Q — Web UI Kit

Interactive recreation of the Drum Q web app (Next.js 14 product at `/web` in the source repo).

## Components

| File | Exports | Role |
|---|---|---|
| `Icons.jsx` | `Home, Calendar, Wallet, Settings, Plus, Users, Building, Zap, Search, Bell, ArrowUR, Clock, User, AlertC, CheckC, Trend, Sparkle, ChL, ChR, X` | Lucide-shaped icons (24×24, 1.7 stroke) |
| `BrandLockup.jsx` | `BrandLockup` | Black rounded square + red dot + *Drum***Q** wordmark |
| `Chrome.jsx` | `Sidebar, Topbar` | 240px rail + 56px sticky topbar (search + bell) |
| `Overview.jsx` | `KPI, EventCard, TodayCard, OwedWidget, ShortcutWidget, TipWidget` | Home-screen surface |
| `Views.jsx` | `MiniCalendar, FinanceHero, SectionHeader, EventModal` | Calendar grid, red finance hero, detail modal |
| `App.jsx` | `App` | Router-lite shell — handles `/`, `/calendar`, `/finance`, stubs others |

## What's interactive

- **Sidebar nav** swaps the main surface between `Overview`, `ปฏิทิน`, and `การเงิน`. Unimplemented routes (`ร้าน`, `นักดนตรี`, `ผังประจำ`, `Bulk Generate`) show a stub card — matching the kit's "replicate, don't invent" rule.
- **Event cards** open a detail modal (venue, time, sub, fee, status).
- **Toggle Paid** in the modal flips the event's PAID/UNPAID pill live, recomputes KPIs, re-sorts the finance page, and drops rows off the "ค้างจ่าย" widget.
- **Mini-calendar** paginates months (prev / today / next). Cells with events are clickable.
- **Today card** pulses with the live red dot only on dates flagged `today: true`.

## What's intentionally not here

- **Bulk Generate flow** — code is in the source (`/app/settings/bulk/page.tsx`) but UI is a data-heavy form outside this kit's visual coverage.
- **Auth, persistence, PWA shell** — `lib/store.ts` is the real `useDB()`; we use a single seed array here.
- **Mobile bottom tabs** — desktop-only kit. See `components/BottomTabs.tsx` in source for the mobile pattern.
- **Slip upload** in event detail — not mocked.

## How to use in a design

1. Copy the whole `ui_kits/web/` folder + the root `colors_and_type.css`.
2. Include the React/Babel scripts from `index.html`.
3. `<App/>` is the full product. For one surface, mount `<OverviewPage/>` etc. directly.

## Seed data

9 events across April–May 2026, mix of own-gig / sub-hired, paid / unpaid. Two are flagged `today: true` to demo the live red-dot card.
