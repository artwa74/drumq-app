---
name: drum-q-design
description: Use this skill to generate well-branded interfaces and assets for Drum Q (a SaaS queue manager for Thai gigging drummers), either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Quick anchors

- `README.md` — brand overview, content voice, visual foundations, iconography
- `colors_and_type.css` — all tokens as CSS vars (import from HTML or paste into Tailwind config)
- `ui_kits/web/` — pixel-level React JSX recreation of the Drum Q web app (Sidebar, Topbar, EventCard, KPIs, MiniCalendar, FinanceHero, EventModal). Drop-in for static prototypes
- `preview/` — 18 Design System tab cards (don't redistribute; they're the swatches/specimens)
- `app/` `components/` `lib/` — imported source from `artwa74/drumq-app`; treat as source of truth if something conflicts

## Non-negotiables

- **Color**: black primary (`#0a0a0a`), hot-red accent (`#e11d48`), monochrome everything else. No blues/greens/purples in chrome.
- **Type**: Space Grotesk display + Inter body + IBM Plex Sans Thai for ภาษาไทย. Tabular nums via `.num` class.
- **Emoji in labels**: `📅 วันที่`, `💵 ค่าจ้าง`, `❌ ค้างจ่าย` — keep them, don't replace with Lucide.
- **Borders over shadows**: every card gets `1px solid #e5e5e5`. Shadows are whisper-soft.
- **Red = now/unpaid/alert** only. Not for decoration.
