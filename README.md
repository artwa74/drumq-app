# 🥁 DrumQ — Drummer Queue Manager

แอปจัดการคิวงานดนตรี, ระบบหาคนแทน, และติดตามบัญชีค่าจ้างสำหรับมือกลอง

## 🎯 Features

- 📅 **ปฏิทิน** — ดูงานทั้งเดือน + event pills สี-โค้ด
- 🧠 **Smart Auto-Fill** — ตั้ง Roster แล้วระบบเติมคนแทน/เวลา/ราคาให้อัตโนมัติ
- 💬 **One-Click LINE/Messenger** — deeplink + generate ข้อความทักแชท
- 💰 **เช็คค่าจ้างคนแทน** — สรุปยอดค้างแยกตามคน
- 🎤 **ติดคอนเสิร์ต + เช็คชนคิว** — เตือนอัตโนมัติ
- ⚡ **Bulk Generate** — สร้างงานทั้งเดือนจาก Roster ในคลิกเดียว
- 📷 **รูปโปรไฟล์** นักดนตรี
- 🖼️ **สลิปการโอน** — อัปโหลด + ส่งทาง LINE
- 📆 **Google Calendar sync** — per-event link + bulk `.ics` export

## 🏗️ Stack

### `/web` — Next.js app (ตัวหลัก)
- **Next.js 14** App Router + RSC
- **Tailwind CSS 3** + custom tokens (ขาว · ดำ · แดง)
- **Space Grotesk** + Inter + IBM Plex Sans Thai
- **Lucide icons**
- **localStorage** store (personal use, ไม่ต้อง login)

### `/` — PWA vanilla (ต้นแบบ)
- HTML + vanilla JS + PWA manifest

### `/supabase` — SQL schema (สำหรับเวอร์ชัน multi-user อนาคต)
- Postgres + RLS + Storage bucket policies

## 🚀 Run

```bash
cd web
npm install
npm run dev
```

เปิด http://localhost:3000

## 📦 Build

```bash
cd web
npm run build
npm start
```

## 🎨 Theme

**Minimal White + Black + Red**
- Background: `#ffffff`
- Primary (ink): `#0a0a0a`
- Accent (hot): `#e11d48`
- Line: `#e5e5e5`

## 📱 Layout

| Device | Navigation |
|---|---|
| Desktop (≥1024px) | Sidebar 240px + Topbar |
| Mobile | Bottom tabs |

---

Made with 🥁 for drummers
