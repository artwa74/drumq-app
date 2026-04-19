/* global React */
const { useState } = React;

// ---------- Lucide-ish icons (24x24, 1.7 stroke, currentColor) ----------
const I = (d, sw = 1.7) => (props) => (
  <svg width={props.size || 16} height={props.size || 16} viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth={props.strokeWidth || sw} strokeLinecap="round" strokeLinejoin="round"
       style={props.style}>{d}</svg>
);
const Home = I(<><path d="M3 12l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/></>);
const Calendar = I(<><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></>);
const Wallet = I(<><rect x="3" y="6" width="18" height="13" rx="2"/><path d="M16 13h2"/></>);
const Settings = I(<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>);
const Plus = I(<path d="M12 5v14M5 12h14"/>);
const Users = I(<><circle cx="9" cy="8" r="4"/><path d="M3 20c1.5-4 4-6 6-6s4.5 2 6 6"/><path d="M16 4a4 4 0 0 1 0 8"/><path d="M19 20c-.5-2.5-1.5-4-3-5"/></>);
const Building = I(<><rect x="4" y="3" width="16" height="18" rx="1"/><path d="M9 8h1M14 8h1M9 12h1M14 12h1M9 16h6"/></>);
const Zap = I(<path d="M13 2L3 14h7l-1 8 10-12h-7z"/>);
const Search = I(<><circle cx="10" cy="10" r="7"/><path d="M21 21l-5-5"/></>);
const Bell = I(<><path d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8"/><path d="M10 20a2 2 0 0 0 4 0"/></>);
const Command = I(<path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/>);
const ArrowUR = I(<><path d="M7 17L17 7"/><path d="M8 7h9v9"/></>);
const Clock = I(<><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>);
const User = I(<><circle cx="12" cy="8" r="4"/><path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6"/></>);
const AlertC = I(<><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h0"/></>);
const CheckC = I(<><circle cx="12" cy="12" r="10"/><path d="M8 12l3 3 5-6"/></>);
const Trend = I(<><path d="M23 6l-9.5 9.5-5-5L1 18"/><path d="M17 6h6v6"/></>);
const Sparkle = I(<path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/>);
const ChL = I(<path d="M15 6l-6 6 6 6"/>);
const ChR = I(<path d="M9 6l6 6-6 6"/>);
const X = I(<path d="M6 6l12 12M18 6L6 18"/>);
const Filter = I(<path d="M3 5h18M6 12h12M10 19h4"/>);
const Phone = I(<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>);

Object.assign(window, { Home, Calendar, Wallet, Settings, Plus, Users, Building, Zap, Search, Bell, Command, ArrowUR, Clock, User, AlertC, CheckC, Trend, Sparkle, ChL, ChR, X, Filter, Phone });
