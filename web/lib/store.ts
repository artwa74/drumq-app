'use client';
import { useSyncExternalStore } from 'react';

export type DayOfWeek = 'อาทิตย์'|'จันทร์'|'อังคาร'|'พุธ'|'พฤหัสบดี'|'ศุกร์'|'เสาร์';
export type EventStatus = 'งานวง'|'จ้างคนแทน'|'ติดคอนเสิร์ต';
export const DAYS_TH: DayOfWeek[] = ['อาทิตย์','จันทร์','อังคาร','พุธ','พฤหัสบดี','ศุกร์','เสาร์'];

export type Venue = { id: string; name: string; address?: string; mapURL?: string; contact?: string; defaultFee?: number; };
export type Musician = { id: string; name: string; phone?: string; bankName?: string; bankAccount?: string; lineURL?: string; messengerURL?: string; notes?: string; photo?: string; };
export type RosterRow = { id: string; venueName: string; dayOfWeek: DayOfWeek; regularSub: string; standardStart: string; standardEnd: string; };
export type Event = {
  id: string; date: string; venueName: string; status: EventStatus;
  actualSub?: string; actualStart?: string; actualEnd?: string;
  fee?: number | string; paid: boolean; slip?: string; notes?: string;
};

export type DB = { events: Event[]; roster: RosterRow[]; musicians: Musician[]; venues: Venue[]; };

const KEY = 'drumq_v1';
const EMPTY: DB = { events: [], roster: [], musicians: [], venues: [] };

let state: DB = EMPTY;
const listeners = new Set<() => void>();

function load(): DB {
  if (typeof window === 'undefined') return EMPTY;
  try { const raw = localStorage.getItem(KEY); return raw ? JSON.parse(raw) : EMPTY; }
  catch { return EMPTY; }
}
function save() {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(state));
  listeners.forEach(l => l());
}
function emit() { listeners.forEach(l => l()); }

if (typeof window !== 'undefined') {
  state = load();
  window.addEventListener('storage', (e) => { if (e.key === KEY) { state = load(); emit(); } });
}

export function useDB(): DB {
  return useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => listeners.delete(cb); },
    () => state,
    () => EMPTY,
  );
}

export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

// ---------- Actions ----------
export const actions = {
  addEvent(e: Omit<Event, 'id'|'paid'> & { paid?: boolean }) {
    state = { ...state, events: [...state.events, { ...e, id: uid(), paid: e.paid ?? false }] };
    save();
  },
  updateEvent(id: string, patch: Partial<Event>) {
    state = { ...state, events: state.events.map(e => e.id === id ? { ...e, ...patch } : e) };
    save();
  },
  removeEvent(id: string) {
    state = { ...state, events: state.events.filter(e => e.id !== id) };
    save();
  },
  bulkAddEvents(list: Omit<Event,'id'>[]) {
    state = { ...state, events: [...state.events, ...list.map(e => ({ ...e, id: uid() }))] };
    save();
  },

  addVenue(v: Omit<Venue,'id'>) { state = { ...state, venues: [...state.venues, { ...v, id: uid() }] }; save(); },
  updateVenue(id: string, patch: Partial<Venue>) { state = { ...state, venues: state.venues.map(v => v.id === id ? { ...v, ...patch } : v) }; save(); },
  removeVenue(id: string) { state = { ...state, venues: state.venues.filter(v => v.id !== id) }; save(); },

  addMusician(m: Omit<Musician,'id'>) { state = { ...state, musicians: [...state.musicians, { ...m, id: uid() }] }; save(); },
  updateMusician(id: string, patch: Partial<Musician>) { state = { ...state, musicians: state.musicians.map(m => m.id === id ? { ...m, ...patch } : m) }; save(); },
  removeMusician(id: string) { state = { ...state, musicians: state.musicians.filter(m => m.id !== id) }; save(); },

  addRoster(r: Omit<RosterRow,'id'>) { state = { ...state, roster: [...state.roster, { ...r, id: uid() }] }; save(); },
  updateRoster(id: string, patch: Partial<RosterRow>) { state = { ...state, roster: state.roster.map(r => r.id === id ? { ...r, ...patch } : r) }; save(); },
  removeRoster(id: string) { state = { ...state, roster: state.roster.filter(r => r.id !== id) }; save(); },

  importAll(db: DB) { state = db; save(); },
  reset() { state = EMPTY; save(); },
};

// ---------- Smart auto-fill helpers ----------
export function rosterLookup(db: DB, venueName: string, dateISO: string) {
  if (!venueName || !dateISO) return null;
  const day = DAYS_TH[new Date(dateISO).getDay()];
  return db.roster.find(r => r.venueName === venueName && r.dayOfWeek === day) || null;
}
export function finalSub(db: DB, e: Event) { return e.actualSub || rosterLookup(db, e.venueName, e.date)?.regularSub || ''; }
export function finalStart(db: DB, e: Event) { return e.actualStart || rosterLookup(db, e.venueName, e.date)?.standardStart || ''; }
export function finalEnd(db: DB, e: Event) { return e.actualEnd || rosterLookup(db, e.venueName, e.date)?.standardEnd || ''; }
