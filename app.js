// ==================== Drummer Queue Manager ====================
// Data stored in localStorage. 4 stores: events, roster, musicians, venues.

const DB_KEY = 'dqm_v1';
const DAYS_TH = ['อาทิตย์','จันทร์','อังคาร','พุธ','พฤหัสบดี','ศุกร์','เสาร์'];
const DAYS_SHORT = ['อา','จ','อ','พ','พฤ','ศ','ส'];

// ---- Storage ----
function loadDB() {
  const raw = localStorage.getItem(DB_KEY);
  if (raw) return JSON.parse(raw);
  return { events: [], roster: [], musicians: [], venues: [] };
}
function saveDB() { localStorage.setItem(DB_KEY, JSON.stringify(db)); }
let db = loadDB();

// ---- Utils ----
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2,7);
const $ = (s, p=document) => p.querySelector(s);
const el = (html) => { const d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstElementChild; };
const icon = (name, cls='ic') => `<svg class="${cls}"><use href="#i-${name}"/></svg>`;
function fmtDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()+543}`;
}
function fmtDateShort(iso) {
  const d = new Date(iso);
  return `${d.getDate()} ${['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'][d.getMonth()]}`;
}
function dayOfWeek(iso) { return DAYS_TH[new Date(iso).getDay()]; }
function todayISO() { return new Date().toISOString().slice(0,10); }
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'), 2000);
}
function money(n) { return Number(n||0).toLocaleString('th-TH'); }

// ---- Core lookup (Smart Auto-Fill logic) ----
function rosterLookup(venueName, dateISO) {
  if (!venueName || !dateISO) return null;
  const day = dayOfWeek(dateISO);
  return db.roster.find(r => r.venueName === venueName && r.dayOfWeek === day) || null;
}
function eventFinalSub(ev) { return ev.actualSub || (rosterLookup(ev.venueName, ev.date)?.regularSub) || ''; }
function eventFinalStart(ev) { return ev.actualStart || (rosterLookup(ev.venueName, ev.date)?.standardStart) || ''; }
function eventFinalEnd(ev) { return ev.actualEnd || (rosterLookup(ev.venueName, ev.date)?.standardEnd) || ''; }

// ---- Router ----
let currentTab = 'home';
function render() {
  const app = $('#app');
  app.innerHTML = '';
  ({ home:renderHome, calendar:renderCalendar, finance:renderFinance, settings:renderSettings }[currentTab] || renderHome)(app);
  window.scrollTo(0,0);
}

// ---- HOME ----
function renderHome(root) {
  const today = todayISO();
  const todays = db.events.filter(e => e.date === today);
  const unpaidEvents = db.events.filter(e=>!e.paid);
  const unpaidTotal = unpaidEvents.reduce((s,e)=>s+Number(e.fee||0),0);
  const upcoming = db.events.filter(e => e.date >= today).sort((a,b)=>a.date.localeCompare(b.date)).slice(0,8);
  const greetHour = new Date().getHours();
  const greeting = greetHour < 12 ? 'อรุณสวัสดิ์' : greetHour < 17 ? 'สวัสดียามบ่าย' : 'สวัสดียามค่ำ';

  root.innerHTML = `
    <div class="home-head">
      <div class="brand-lockup">
        <div class="brand-logo">${icon('drum')}</div>
        <div class="brand-text">
          <div class="name">DrumQ</div>
          <div class="tag">Queue Manager</div>
        </div>
      </div>
      <div class="avatar-top">${icon('users')}</div>
    </div>

    <h1>${greeting}</h1>
    <p class="greet">${new Date().toLocaleDateString('th-TH',{weekday:'long',day:'numeric',month:'long'})}</p>

    <div class="stat-row">
      <div class="stat hero">
        <div class="label">${icon('cal','ic sm')} งานวันนี้</div>
        <div class="value">${todays.length}</div>
        <div class="sub-label">${todays.length ? todays[0].venueName : 'ไม่มีงาน'}</div>
      </div>
      <div class="stat">
        <div class="label">${icon('wallet','ic sm')} ค้างจ่าย</div>
        <div class="value" style="color:var(--danger)">฿${money(unpaidTotal)}</div>
        <div class="sub-label">${unpaidEvents.length} รายการ</div>
      </div>
    </div>

    <div class="section-title">
      <h3>งานที่ใกล้ถึง</h3>
      ${upcoming.length ? `<a class="add-link" id="see-all">ดูทั้งหมด →</a>` : ''}
    </div>
    <div id="upcoming"></div>
  `;
  const seeAll = $('#see-all', root); if (seeAll) seeAll.onclick = () => { currentTab = 'calendar'; document.querySelectorAll('#tabbar button').forEach(b => b.classList.toggle('active', b.dataset.tab === 'calendar')); render(); };
  const list = $('#upcoming', root);
  if (upcoming.length === 0) {
    list.innerHTML = `<div class="empty"><svg width="64" height="64" style="color:var(--text-3);opacity:0.6"><use href="#i-drum"/></svg><div style="margin-top:14px">ยังไม่มีงานในคิว</div><small>กดปุ่ม + ด้านล่างเพื่อเพิ่มงาน</small></div>`;
  } else {
    upcoming.forEach(e => list.appendChild(eventCard(e)));
  }
}

function eventCard(e) {
  const sub = eventFinalSub(e);
  const start = eventFinalStart(e);
  const end = eventFinalEnd(e);
  const d = new Date(e.date);
  const dayNum = d.getDate();
  const monthShort = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'][d.getMonth()];
  const isToday = e.date === todayISO();
  const typeBadge = e.status === 'จ้างคนแทน' ? `<span class="badge wng">จ้างแทน</span>` : `<span class="badge band">งานวง</span>`;
  const payBadge = e.paid ? `<span class="badge paid">✓ จ่ายแล้ว</span>` : `<span class="badge unpaid">● ค้างจ่าย</span>`;
  const c = el(`
    <div class="card ${isToday?'today':''} ${e.paid?'paid':''}">
      <div class="date-chip">
        <div class="d">${dayNum}</div>
        <div class="m">${monthShort}</div>
      </div>
      <div class="body">
        <div class="venue">${e.venueName || '(ไม่ระบุร้าน)'}</div>
        <div class="meta">
          <span>👤 ${sub || '—'}</span>
          <span>🕐 ${start || '?'}–${end || '?'}</span>
          <span>฿${money(e.fee)}</span>
        </div>
        <div class="badges">${typeBadge}${payBadge}</div>
      </div>
      <div class="indicator"></div>
    </div>`);
  c.onclick = () => openEventDetail(e.id);
  return c;
}

function initials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  return (parts[0]?.[0] || '') + (parts[1]?.[0] || '');
}

// ---- CALENDAR ----
let calYear, calMonth;
function renderCalendar(root) {
  const now = new Date();
  if (calYear === undefined) { calYear = now.getFullYear(); calMonth = now.getMonth(); }
  const first = new Date(calYear, calMonth, 1);
  const daysInMonth = new Date(calYear, calMonth+1, 0).getDate();
  const startDow = first.getDay();
  const monthName = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'][calMonth];

  root.innerHTML = `
    <h1>ปฏิทิน</h1>
    <p class="greet">ดูคิวงานทั้งเดือน</p>
    <div class="cal-header">
      <button id="prev">‹</button>
      <h2>${monthName} ${calYear+543}</h2>
      <button id="next">›</button>
    </div>
    <div class="cal-grid" id="dow"></div>
    <div class="cal-grid" id="cells"></div>
    <h3>งานในเดือนนี้</h3>
    <div id="mlist"></div>
  `;
  const dow = $('#dow', root);
  DAYS_SHORT.forEach(d => dow.appendChild(el(`<div class="cal-dow">${d}</div>`)));
  const cells = $('#cells', root);
  for (let i=0; i<startDow; i++) cells.appendChild(el(`<div class="cal-cell other"></div>`));
  const todayStr = todayISO();
  const monthEvents = db.events.filter(e => {
    const d = new Date(e.date); return d.getFullYear()===calYear && d.getMonth()===calMonth;
  });
  for (let d=1; d<=daysInMonth; d++) {
    const iso = `${calYear}-${String(calMonth+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const evs = monthEvents.filter(e => e.date === iso);
    const cls = [
      'cal-cell',
      iso === todayStr ? 'today' : '',
      evs.length ? 'has-event' : '',
    ].join(' ');
    const cell = el(`<div class="${cls}"><span>${d}</span>${evs.length?'<div class="dot"></div>':''}</div>`);
    cell.onclick = () => { if (evs.length === 1) openEventDetail(evs[0].id); else if (evs.length > 1) { toast(`${evs.length} งานในวันนี้ — เลื่อนลงดูด้านล่าง`); } else openAddEvent(iso); };
    cells.appendChild(cell);
  }
  $('#prev', root).onclick = () => { calMonth--; if (calMonth<0){calMonth=11;calYear--;} render(); };
  $('#next', root).onclick = () => { calMonth++; if (calMonth>11){calMonth=0;calYear++;} render(); };

  const mlist = $('#mlist', root);
  const sorted = monthEvents.sort((a,b)=>a.date.localeCompare(b.date));
  if (sorted.length === 0) mlist.innerHTML = `<div class="empty">ไม่มีงาน</div>`;
  else sorted.forEach(e => mlist.appendChild(eventCard(e)));
}

// ---- FINANCE ----
function renderFinance(root) {
  const unpaid = db.events.filter(e=>!e.paid).sort((a,b)=>a.date.localeCompare(b.date));
  const paid = db.events.filter(e=>e.paid).sort((a,b)=>b.date.localeCompare(a.date));
  const unpaidTotal = unpaid.reduce((s,e)=>s+Number(e.fee||0),0);
  const paidTotal = paid.reduce((s,e)=>s+Number(e.fee||0),0);

  root.innerHTML = `
    <h1>การเงิน</h1>
    <p class="greet">ติดตามยอดจ่าย/ค้างจ่าย</p>
    <div class="stat-row">
      <div class="stat hero" style="background:linear-gradient(135deg,#ff4d6d 0%,#ff3d5a 100%)">
        <div class="label">❌ ค้างจ่าย</div>
        <div class="value">฿${money(unpaidTotal)}</div>
        <div class="sub-label">${unpaid.length} รายการ</div>
      </div>
      <div class="stat">
        <div class="label">✅ จ่ายแล้ว</div>
        <div class="value" style="color:var(--success)">฿${money(paidTotal)}</div>
        <div class="sub-label">${paid.length} รายการ</div>
      </div>
    </div>
    <button class="btn secondary" id="owed-btn" style="margin-bottom:8px">${icon('users','ic sm')} เช็คค่าจ้างแยกตามคนแทน</button>
    <h3>❌ ค้างจ่าย</h3>
    <div id="up"></div>
    <h3>✅ จ่ายแล้ว</h3>
    <div id="p"></div>
  `;
  const u = $('#up', root), p = $('#p', root);
  const owedBtn = $('#owed-btn', root); if (owedBtn) owedBtn.onclick = () => openOwedSummary();
  if (unpaid.length===0) u.innerHTML = `<div class="empty" style="padding:20px">ไม่มีรายการค้างจ่าย 🎉</div>`;
  else unpaid.forEach(e => u.appendChild(eventCard(e)));
  if (paid.length===0) p.innerHTML = `<div class="empty" style="padding:20px">—</div>`;
  else paid.forEach(e => p.appendChild(eventCard(e)));
}

// ---- SETTINGS ----
function renderSettings(root) {
  root.innerHTML = `
    <h1>ตั้งค่า</h1>
    <p class="greet">จัดการข้อมูลหลังบ้าน</p>
    <h3>ข้อมูลหลัก</h3>
    <div class="list-row" id="m-venues"><div class="icon-circle">${icon('venue')}</div><div class="left"><div class="name">ร้าน</div><div class="sub">${db.venues.length} ร้าน</div></div><div class="right">${icon('chev')}</div></div>
    <div class="list-row" id="m-musicians"><div class="icon-circle">${icon('users')}</div><div class="left"><div class="name">นักดนตรี</div><div class="sub">${db.musicians.length} คน · คนแทน/เบอร์/บัญชี</div></div><div class="right">${icon('chev')}</div></div>
    <div class="list-row" id="m-roster"><div class="icon-circle">${icon('list')}</div><div class="left"><div class="name">ผังคนแทนประจำ</div><div class="sub">${db.roster.length} แถว · ร้าน × วัน</div></div><div class="right">${icon('chev')}</div></div>
    <h3>เครื่องมือ</h3>
    <div class="list-row" id="m-bulk"><div class="icon-circle" style="color:var(--brand)">${icon('cal')}</div><div class="left"><div class="name">สร้างงานจากผัง</div><div class="sub">เลือกช่วงวัน → สร้างลงปฏิทินอัตโนมัติ</div></div><div class="right">${icon('chev')}</div></div>
    <div class="list-row" id="m-owed"><div class="icon-circle" style="color:var(--brand)">${icon('wallet')}</div><div class="left"><div class="name">เช็คค่าจ้างคนแทน</div><div class="sub">สรุปว่าค้างใครเท่าไหร่</div></div><div class="right">${icon('chev')}</div></div>
    <div class="list-row" id="m-ics"><div class="icon-circle">${icon('cal')}</div><div class="left"><div class="name">Sync Google Calendar</div><div class="sub">Export .ics → import ได้ทุกปฏิทิน</div></div><div class="right">${icon('chev')}</div></div>
    <h3>ข้อมูล</h3>
    <div class="list-row" id="m-export"><div class="icon-circle">${icon('download')}</div><div class="left"><div class="name">Export ข้อมูล (JSON)</div><div class="sub">สำรองข้อมูลทั้งหมด</div></div><div class="right">${icon('chev')}</div></div>
    <div class="list-row" id="m-import"><div class="icon-circle">${icon('upload')}</div><div class="left"><div class="name">Import ข้อมูล (JSON)</div><div class="sub">กู้คืนจากไฟล์</div></div><div class="right">${icon('chev')}</div></div>
    <div class="list-row" id="m-reset"><div class="icon-circle" style="background:rgba(255,59,92,0.08);border-color:rgba(255,59,92,0.2);color:var(--danger)">${icon('trash')}</div><div class="left"><div class="name" style="color:var(--danger)">ล้างข้อมูลทั้งหมด</div><div class="sub">ย้อนกลับไม่ได้</div></div><div class="right">${icon('chev')}</div></div>
  `;
  $('#m-venues', root).onclick = () => openVenueList();
  $('#m-musicians', root).onclick = () => openMusicianList();
  $('#m-roster', root).onclick = () => openRosterList();
  $('#m-bulk', root).onclick = () => openBulkGenerate();
  $('#m-owed', root).onclick = () => openOwedSummary();
  $('#m-ics', root).onclick = () => exportICS();
  $('#m-export', root).onclick = exportData;
  $('#m-import', root).onclick = importData;
  $('#m-reset', root).onclick = () => {
    if (confirm('ลบข้อมูลทั้งหมดจริงหรือ? การกระทำนี้ย้อนกลับไม่ได้')) {
      db = { events:[], roster:[], musicians:[], venues:[] }; saveDB(); render(); toast('ล้างข้อมูลเรียบร้อย');
    }
  };
}

// ==================== Modals ====================
function openModal(title, contentBuilder) {
  const mr = $('#modal-root');
  mr.innerHTML = '';
  const overlay = el(`<div class="modal-overlay"><div class="modal"><div class="modal-header"><h2>${title}</h2><button class="close-btn">${icon('close','ic sm')}</button></div><div class="modal-body"></div></div></div>`);
  overlay.querySelector('.close-btn').onclick = closeModal;
  overlay.onclick = (ev) => { if (ev.target === overlay) closeModal(); };
  mr.appendChild(overlay);
  contentBuilder(overlay.querySelector('.modal-body'));
}
function closeModal() { $('#modal-root').innerHTML = ''; }

// ---- Add / Edit Event ----
function openAddEvent(presetDate) {
  openEventForm({ id: null, date: presetDate || todayISO(), venueName:'', status:'งานวง', actualSub:'', actualStart:'', actualEnd:'', fee:'', paid:false, slip:'', notes:'' });
}
function openEventForm(ev) {
  const isEdit = !!ev.id;
  openModal(isEdit ? '✏️ แก้ไขงาน' : '➕ เพิ่มงานใหม่', (body) => {
    const venueOptions = db.venues.map(v=>`<option value="${v.name}">${v.name}</option>`).join('');
    const musicianOptions = db.musicians.map(m=>`<option value="${m.name}">${m.name}</option>`).join('');
    body.innerHTML = `
      <div class="field">
        <label>📅 วันที่</label>
        <input type="date" id="f-date" value="${ev.date}" />
        <div class="hint" id="dow-hint"></div>
      </div>
      <div class="field">
        <label>🏠 ร้าน</label>
        <input list="venue-list" id="f-venue" value="${ev.venueName}" placeholder="พิมพ์หรือเลือกร้าน" />
        <datalist id="venue-list">${venueOptions}</datalist>
        <div class="hint"><a class="add-link" id="quick-venue" style="color:var(--accent);cursor:pointer">+ เพิ่มร้านใหม่</a></div>
      </div>
      <div class="field">
        <label>🎯 ประเภทงาน</label>
        <div class="chips" id="status-chips">
          <div class="chip ${ev.status==='งานวง'?'active':''}" data-v="งานวง">🥁 งานวง</div>
          <div class="chip ${ev.status==='จ้างคนแทน'?'active':''}" data-v="จ้างคนแทน">👤 จ้างแทน</div>
          <div class="chip ${ev.status==='ติดคอนเสิร์ต'?'active':''}" data-v="ติดคอนเสิร์ต">🎤 ติดคอนเสิร์ต</div>
        </div>
      </div>
      <div class="field">
        <label>👤 คนแทน <span class="hint" style="color:var(--accent)" id="sub-auto"></span></label>
        <input list="musician-list" id="f-sub" value="${ev.actualSub}" placeholder="เว้นว่าง = ใช้คนประจำ" />
        <datalist id="musician-list">${musicianOptions}</datalist>
        <div class="hint"><a class="add-link" id="quick-musician" style="color:var(--accent);cursor:pointer">+ เพิ่มนักดนตรีใหม่</a></div>
      </div>
      <div class="field-row">
        <div class="field">
          <label>🕐 เริ่ม <span id="start-auto" style="color:var(--accent);font-size:11px"></span></label>
          <input type="time" id="f-start" value="${ev.actualStart}" />
        </div>
        <div class="field">
          <label>🕐 เลิก <span id="end-auto" style="color:var(--accent);font-size:11px"></span></label>
          <input type="time" id="f-end" value="${ev.actualEnd}" />
        </div>
      </div>
      <div class="field">
        <label>💵 ค่าจ้าง (บาท)</label>
        <input type="number" id="f-fee" value="${ev.fee}" inputmode="numeric" />
      </div>
      <div class="field">
        <label>📝 หมายเหตุ</label>
        <textarea id="f-notes">${ev.notes||''}</textarea>
      </div>
      <button class="btn" id="save-btn">${isEdit?'บันทึกการแก้ไข':'บันทึกงาน'}</button>
      ${isEdit ? `<button class="btn danger" id="del-btn" style="margin-top:8px">🗑️ ลบงานนี้</button>` : ''}
    `;

    // Smart auto-fill preview
    const refreshPreview = () => {
      const date = $('#f-date', body).value;
      const venue = $('#f-venue', body).value;
      const hint = $('#dow-hint', body);
      if (date) {
        const clash = db.events.filter(x => x.date === date && x.id !== ev.id);
        const concertDay = clash.find(x => x.status === 'ติดคอนเสิร์ต');
        let msg = `วัน${dayOfWeek(date)}`;
        if (concertDay) msg += ` · ⚠️ มีคอนเสิร์ตที่ ${concertDay.venueName}`;
        else if (clash.length) msg += ` · มีงานแล้ว ${clash.length} รอบ`;
        hint.innerHTML = msg;
      }
      const r = rosterLookup(venue, date);
      $('#sub-auto', body).textContent = r ? `(ประจำ: ${r.regularSub})` : '';
      $('#start-auto', body).textContent = r ? `(ปกติ ${r.standardStart})` : '';
      $('#end-auto', body).textContent = r ? `(ปกติ ${r.standardEnd})` : '';
      const v = db.venues.find(x => x.name === venue);
      const feeInp = $('#f-fee', body);
      if (v?.defaultFee && !feeInp.value) feeInp.placeholder = `ราคาประจำ: ${v.defaultFee}`;
    };
    $('#f-date', body).oninput = refreshPreview;
    $('#f-venue', body).oninput = refreshPreview;
    refreshPreview();

    body.querySelectorAll('#status-chips .chip').forEach(c => {
      c.onclick = () => { body.querySelectorAll('#status-chips .chip').forEach(x=>x.classList.remove('active')); c.classList.add('active'); };
    });

    $('#quick-venue', body).onclick = () => openVenueForm({}, () => { openEventForm(collectForm()); });
    $('#quick-musician', body).onclick = () => openMusicianForm({}, () => { openEventForm(collectForm()); });

    function collectForm() {
      return {
        ...ev,
        date: $('#f-date', body).value,
        venueName: $('#f-venue', body).value.trim(),
        status: body.querySelector('#status-chips .chip.active')?.dataset.v || 'งานวง',
        actualSub: $('#f-sub', body).value.trim(),
        actualStart: $('#f-start', body).value,
        actualEnd: $('#f-end', body).value,
        fee: $('#f-fee', body).value,
        notes: $('#f-notes', body).value,
      };
    }

    $('#save-btn', body).onclick = () => {
      const data = collectForm();
      if (!data.date || !data.venueName) { toast('กรอกวันที่และร้านก่อน'); return; }
      if (!data.fee) {
        const v = db.venues.find(x=>x.name===data.venueName);
        if (v?.defaultFee) data.fee = v.defaultFee;
      }
      if (isEdit) {
        const i = db.events.findIndex(x=>x.id===ev.id); db.events[i] = {...db.events[i], ...data};
      } else {
        db.events.push({ ...data, id: uid(), paid:false, slip:'' });
      }
      saveDB(); closeModal(); render(); toast(isEdit?'บันทึกแล้ว':'เพิ่มงานเรียบร้อย');
    };
    if (isEdit) $('#del-btn', body).onclick = () => {
      if (confirm('ลบงานนี้?')) { db.events = db.events.filter(x=>x.id!==ev.id); saveDB(); closeModal(); render(); toast('ลบแล้ว'); }
    };
  });
}

// ---- Event Detail ----
function openEventDetail(id) {
  const ev = db.events.find(e=>e.id===id); if (!ev) return;
  const musician = db.musicians.find(m => m.name === eventFinalSub(ev));
  const venue = db.venues.find(v => v.name === ev.venueName);
  openModal('รายละเอียดงาน', (body) => {
    const sub = eventFinalSub(ev), start = eventFinalStart(ev), end = eventFinalEnd(ev);
    body.innerHTML = `
      <div class="detail-hero">
        <div class="big-date">${fmtDateShort(ev.date)} · ${dayOfWeek(ev.date)}</div>
        <div class="venue-name">${ev.venueName}</div>
        <div class="sub-line">${ev.status} · ฿${money(ev.fee)}</div>
      </div>
      <div class="info-grid">
        <div class="info-block"><div class="k">คนแทน</div><div class="v">${sub||'—'}</div></div>
        <div class="info-block"><div class="k">ค่าจ้าง</div><div class="v">฿${money(ev.fee)}</div></div>
        <div class="info-block"><div class="k">เริ่ม</div><div class="v">${start||'—'}</div></div>
        <div class="info-block"><div class="k">เลิก</div><div class="v">${end||'—'}</div></div>
        ${ev.notes ? `<div class="info-block full"><div class="k">หมายเหตุ</div><div class="v" style="font-size:14px;font-weight:400">${ev.notes}</div></div>` : ''}
      </div>

      <div class="btn-row">
        ${musician?.lineURL ? `<button class="btn small" id="chat-line">${icon('chat','ic sm')} LINE</button>` : ''}
        ${musician?.messengerURL ? `<button class="btn small" id="chat-msn">${icon('chat','ic sm')} Messenger</button>` : ''}
        ${musician?.phone ? `<button class="btn small secondary" id="call">${icon('phone','ic sm')} โทร</button>` : ''}
      </div>
      <button class="btn secondary" id="copy-msg">${icon('copy','ic sm')} คัดลอกข้อความทักแชท</button>
      ${venue?.mapURL ? `<button class="btn secondary" id="map">${icon('pin','ic sm')} เปิดแผนที่ร้าน</button>` : ''}
      <button class="btn secondary" id="gcal">${icon('cal','ic sm')} เพิ่มใน Google Calendar</button>

      <h3>สถานะการจ่าย</h3>
      <div class="switch-row">
        <div><div class="sw-label">โอนเงินให้คนแทนแล้ว</div><div class="sw-sub">${musician?.bankAccount ? musician.bankName+' '+musician.bankAccount : 'ยังไม่มีข้อมูลบัญชี'}</div></div>
        <div class="switch ${ev.paid?'on':''}" id="paid-sw"></div>
      </div>

      <h3>หลักฐานการโอน</h3>
      ${ev.slip ? `<img src="${ev.slip}" class="slip-img"/>` : ''}
      <label class="upload-box" for="slip-in">${icon('upload','ic sm')} ${ev.slip?'แตะเพื่อเปลี่ยนรูปสลิป':'อัปโหลดรูปสลิป'}</label>
      <input type="file" id="slip-in" accept="image/*" style="display:none" />
      ${ev.slip && musician?.lineURL ? `<button class="btn" id="send-slip" style="margin-top:10px">${icon('chat','ic sm')} ส่งสลิปทาง LINE</button>` : ''}

      <button class="btn secondary" id="edit-btn" style="margin-top:20px">${icon('edit','ic sm')} แก้ไขงาน</button>
    `;

    const chatMsg = `หวัดดีครับพี่ ${sub} วันที่ ${fmtDate(ev.date)} (${dayOfWeek(ev.date)}) เวลา ${start}-${end} ว่างแทนที่ร้าน ${ev.venueName} มั้ยครับ?`;
    const slipMsg = `โอนค่าจ้างวันที่ ${fmtDate(ev.date)} ร้าน ${ev.venueName} จำนวน ${money(ev.fee)} บาท เรียบร้อยครับ 🙏`;

    const attach = (id, fn) => { const b = $('#'+id, body); if (b) b.onclick = fn; };
    attach('chat-line', () => { navigator.clipboard.writeText(chatMsg); toast('คัดลอกข้อความแล้ว — เปิด LINE'); setTimeout(()=>window.open(musician.lineURL,'_blank'), 400); });
    attach('chat-msn', () => { navigator.clipboard.writeText(chatMsg); toast('คัดลอกข้อความแล้ว — เปิด Messenger'); setTimeout(()=>window.open(musician.messengerURL,'_blank'), 400); });
    attach('call', () => window.location.href = `tel:${musician.phone}`);
    attach('copy-msg', () => { navigator.clipboard.writeText(chatMsg); toast('คัดลอกข้อความแล้ว'); });
    attach('map', () => window.open(venue.mapURL,'_blank'));
    attach('gcal', () => window.open(gcalURL(ev), '_blank'));
    attach('edit-btn', () => openEventForm(ev));
    attach('send-slip', () => { navigator.clipboard.writeText(slipMsg); toast('คัดลอกข้อความ — เปิด LINE'); setTimeout(()=>window.open(musician.lineURL,'_blank'), 400); });

    $('#paid-sw', body).onclick = () => {
      ev.paid = !ev.paid; saveDB();
      $('#paid-sw', body).classList.toggle('on', ev.paid);
      toast(ev.paid?'ทำเครื่องหมายจ่ายแล้ว':'ยกเลิกการจ่าย');
    };
    $('#slip-in', body).onchange = async (e) => {
      const file = e.target.files[0]; if (!file) return;
      const reader = new FileReader();
      reader.onload = () => { ev.slip = reader.result; saveDB(); toast('อัปโหลดแล้ว'); openEventDetail(id); };
      reader.readAsDataURL(file);
    };
  });
}

// ---- Venue List / Form ----
function openVenueList() {
  openModal('🏠 ร้าน', (body) => {
    body.innerHTML = `<button class="btn" id="add">+ เพิ่มร้านใหม่</button><div id="list" style="margin-top:14px"></div>`;
    $('#add', body).onclick = () => openVenueForm({}, openVenueList);
    const list = $('#list', body);
    if (db.venues.length===0) list.innerHTML = `<div class="empty">ยังไม่มีร้าน</div>`;
    else db.venues.forEach(v => {
      const r = el(`<div class="list-row"><div class="icon-circle">${icon('venue')}</div><div class="left"><div class="name">${v.name}</div><div class="sub">${v.address||'—'}</div></div><div class="right">${icon('chev')}</div></div>`);
      r.onclick = () => openVenueForm(v, openVenueList);
      list.appendChild(r);
    });
  });
}
function openVenueForm(v, onDone) {
  const isEdit = !!v.id;
  openModal(isEdit?'แก้ไขร้าน':'เพิ่มร้าน', (body) => {
    body.innerHTML = `
      <div class="field"><label>ชื่อร้าน</label><input id="name" value="${v.name||''}" /></div>
      <div class="field"><label>ที่อยู่</label><input id="addr" value="${v.address||''}" /></div>
      <div class="field"><label>ราคาประจำ (บาท/รอบ)</label><input type="number" id="fee" value="${v.defaultFee||''}" placeholder="เช่น 1500" inputmode="numeric" /><div class="hint">ใช้เติมอัตโนมัติเมื่อเพิ่มงาน</div></div>
      <div class="field"><label>ลิงก์ Google Maps</label><input id="map" value="${v.mapURL||''}" placeholder="https://maps.app.goo.gl/..." /></div>
      <div class="field"><label>ผู้ติดต่อ</label><input id="contact" value="${v.contact||''}" /></div>
      <button class="btn" id="save">บันทึก</button>
      ${isEdit?'<button class="btn danger" id="del" style="margin-top:8px">ลบ</button>':''}
    `;
    $('#save', body).onclick = () => {
      const name = $('#name', body).value.trim(); if (!name) { toast('ใส่ชื่อร้าน'); return; }
      const data = { name, address:$('#addr',body).value, defaultFee:$('#fee',body).value, mapURL:$('#map',body).value, contact:$('#contact',body).value };
      if (isEdit) { Object.assign(v, data); } else { db.venues.push({ id:uid(), ...data }); }
      saveDB(); closeModal(); onDone && onDone();
    };
    if (isEdit) $('#del', body).onclick = () => { if (confirm('ลบร้านนี้?')) { db.venues = db.venues.filter(x=>x.id!==v.id); saveDB(); closeModal(); onDone && onDone(); } };
  });
}

// ---- Musicians ----
function openMusicianList() {
  openModal('👥 นักดนตรี', (body) => {
    body.innerHTML = `<button class="btn" id="add">+ เพิ่มนักดนตรี</button><div id="list" style="margin-top:14px"></div>`;
    $('#add', body).onclick = () => openMusicianForm({}, openMusicianList);
    const list = $('#list', body);
    if (db.musicians.length===0) list.innerHTML = `<div class="empty">ยังไม่มีรายชื่อ</div>`;
    else db.musicians.forEach(m => {
      const r = el(`<div class="list-row"><div class="avatar-initials">${initials(m.name)}</div><div class="left"><div class="name">${m.name}</div><div class="sub">${m.phone||'ไม่มีเบอร์'} · ${m.bankName||''} ${m.bankAccount||''}</div></div><div class="right">${icon('chev')}</div></div>`);
      r.onclick = () => openMusicianForm(m, openMusicianList);
      list.appendChild(r);
    });
  });
}
function openMusicianForm(m, onDone) {
  const isEdit = !!m.id;
  openModal(isEdit?'แก้ไขนักดนตรี':'เพิ่มนักดนตรี', (body) => {
    body.innerHTML = `
      <div class="field"><label>ชื่อ</label><input id="name" value="${m.name||''}" /></div>
      <div class="field"><label>เบอร์โทร</label><input id="phone" type="tel" value="${m.phone||''}" /></div>
      <div class="field-row">
        <div class="field"><label>ธนาคาร</label><input id="bank" value="${m.bankName||''}" placeholder="SCB / KBANK..." /></div>
        <div class="field"><label>เลขบัญชี</label><input id="acct" value="${m.bankAccount||''}" /></div>
      </div>
      <div class="field"><label>LINE URL</label><input id="line" value="${m.lineURL||''}" placeholder="https://line.me/ti/p/~lineid" /></div>
      <div class="field"><label>Messenger URL</label><input id="msn" value="${m.messengerURL||''}" placeholder="https://m.me/username" /></div>
      <div class="field"><label>หมายเหตุ</label><textarea id="notes">${m.notes||''}</textarea></div>
      <button class="btn" id="save">บันทึก</button>
      ${isEdit?'<button class="btn danger" id="del" style="margin-top:8px">ลบ</button>':''}
    `;
    $('#save', body).onclick = () => {
      const name = $('#name', body).value.trim(); if (!name) { toast('ใส่ชื่อ'); return; }
      const data = { name, phone:$('#phone',body).value, bankName:$('#bank',body).value, bankAccount:$('#acct',body).value, lineURL:$('#line',body).value, messengerURL:$('#msn',body).value, notes:$('#notes',body).value };
      if (isEdit) Object.assign(m, data); else db.musicians.push({ id:uid(), ...data });
      saveDB(); closeModal(); onDone && onDone();
    };
    if (isEdit) $('#del', body).onclick = () => { if (confirm('ลบ?')) { db.musicians = db.musicians.filter(x=>x.id!==m.id); saveDB(); closeModal(); onDone && onDone(); } };
  });
}

// ---- Roster ----
function openRosterList() {
  openModal('ผังคนแทนประจำ', (body) => {
    body.innerHTML = `<p class="greet" style="margin:0 0 14px">ตั้งว่าแต่ละวันของสัปดาห์เล่นร้านไหนบ้าง (เพิ่มหลายรอบต่อวันได้)</p>
    <button class="btn" id="add">+ เพิ่มรอบ</button>
    <div id="list" style="margin-top:16px"></div>`;
    $('#add', body).onclick = () => openRosterForm({}, openRosterList);
    const list = $('#list', body);
    if (db.roster.length===0) { list.innerHTML = `<div class="empty">ยังไม่มีข้อมูล</div>`; return; }
    DAYS_TH.forEach(day => {
      const rows = db.roster.filter(r => r.dayOfWeek === day).sort((a,b)=>(a.standardStart||'').localeCompare(b.standardStart||''));
      if (!rows.length) return;
      list.appendChild(el(`<h3 style="margin-top:18px">${day} · ${rows.length} รอบ</h3>`));
      rows.forEach(r => {
        const row = el(`<div class="list-row"><div class="icon-circle">${icon('venue')}</div><div class="left"><div class="name">${r.venueName}</div><div class="sub">${r.standardStart||'?'}–${r.standardEnd||'?'} · ${r.regularSub||'ยังไม่ระบุคนแทน'}</div></div><div class="right">${icon('chev')}</div></div>`);
        row.onclick = () => openRosterForm(r, openRosterList);
        list.appendChild(row);
      });
    });
  });
}
function openRosterForm(r, onDone) {
  const isEdit = !!r.id;
  openModal(isEdit?'แก้ไขผัง':'เพิ่มผัง', (body) => {
    const venueOpts = db.venues.map(v=>`<option ${r.venueName===v.name?'selected':''}>${v.name}</option>`).join('');
    const musOpts = db.musicians.map(m=>`<option ${r.regularSub===m.name?'selected':''}>${m.name}</option>`).join('');
    const dayOpts = DAYS_TH.map(d=>`<option ${r.dayOfWeek===d?'selected':''}>${d}</option>`).join('');
    body.innerHTML = `
      <div class="field"><label>ร้าน</label><select id="venue"><option value="">-- เลือก --</option>${venueOpts}</select></div>
      <div class="field"><label>วันในสัปดาห์</label><select id="dow"><option value="">-- เลือก --</option>${dayOpts}</select></div>
      <div class="field"><label>คนแทนประจำ</label><select id="sub"><option value="">-- เลือก --</option>${musOpts}</select></div>
      <div class="field-row">
        <div class="field"><label>เวลาเริ่มปกติ</label><input type="time" id="st" value="${r.standardStart||''}" /></div>
        <div class="field"><label>เวลาเลิกปกติ</label><input type="time" id="en" value="${r.standardEnd||''}" /></div>
      </div>
      <button class="btn" id="save">บันทึก</button>
      ${isEdit?'<button class="btn danger" id="del" style="margin-top:8px">ลบ</button>':''}
    `;
    $('#save', body).onclick = () => {
      const data = { venueName:$('#venue',body).value, dayOfWeek:$('#dow',body).value, regularSub:$('#sub',body).value, standardStart:$('#st',body).value, standardEnd:$('#en',body).value };
      if (!data.venueName || !data.dayOfWeek) { toast('เลือกร้านและวัน'); return; }
      if (isEdit) Object.assign(r, data); else db.roster.push({ id:uid(), ...data });
      saveDB(); closeModal(); onDone && onDone();
    };
    if (isEdit) $('#del', body).onclick = () => { if (confirm('ลบ?')) { db.roster = db.roster.filter(x=>x.id!==r.id); saveDB(); closeModal(); onDone && onDone(); } };
  });
}

// ---- Google Calendar / ICS ----
function gcalURL(ev) {
  const sub = eventFinalSub(ev), start = eventFinalStart(ev) || '20:00', end = eventFinalEnd(ev) || '22:00';
  const fmt = (d, t) => d.replace(/-/g,'') + 'T' + (t||'00:00').replace(':','') + '00';
  const title = encodeURIComponent(`${ev.venueName} — ${ev.status}${sub?' ('+sub+')':''}`);
  const dates = `${fmt(ev.date,start)}/${fmt(ev.date,end)}`;
  const details = encodeURIComponent(`คนแทน: ${sub||'—'}\nค่าจ้าง: ${money(ev.fee)} บาท\n${ev.notes||''}`);
  const loc = encodeURIComponent(ev.venueName);
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${loc}`;
}
function exportICS() {
  const pad = n => String(n).padStart(2,'0');
  const dt = (d,t) => d.replace(/-/g,'') + 'T' + (t||'20:00').replace(':','') + '00';
  const now = new Date();
  const stamp = `${now.getUTCFullYear()}${pad(now.getUTCMonth()+1)}${pad(now.getUTCDate())}T${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}${pad(now.getUTCSeconds())}Z`;
  const esc = s => (s||'').replace(/[,;\\]/g,'\\$&').replace(/\n/g,'\\n');
  const lines = ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//DrumQ//TH','CALSCALE:GREGORIAN'];
  db.events.forEach(ev => {
    const sub = eventFinalSub(ev), start = eventFinalStart(ev) || '20:00', end = eventFinalEnd(ev) || '22:00';
    lines.push('BEGIN:VEVENT',
      `UID:${ev.id}@drumq`,
      `DTSTAMP:${stamp}`,
      `DTSTART:${dt(ev.date,start)}`,
      `DTEND:${dt(ev.date,end)}`,
      `SUMMARY:${esc(ev.venueName+' — '+ev.status+(sub?' ('+sub+')':''))}`,
      `LOCATION:${esc(ev.venueName)}`,
      `DESCRIPTION:${esc(`คนแทน: ${sub||'—'}\nค่าจ้าง: ${money(ev.fee)} บาท\n${ev.notes||''}`)}`,
      'END:VEVENT');
  });
  lines.push('END:VCALENDAR');
  const blob = new Blob([lines.join('\r\n')], {type:'text/calendar'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = `drumq-${todayISO()}.ics`; a.click();
  URL.revokeObjectURL(url); toast(`ส่งออก ${db.events.length} งาน`);
}

// ---- Bulk Generate ----
function openBulkGenerate() {
  openModal('สร้างงานจากผัง', (body) => {
    const today = todayISO();
    const weekLater = new Date(Date.now()+30*86400000).toISOString().slice(0,10);
    body.innerHTML = `
      <p class="greet" style="margin:0 0 14px">ระบบจะดึง Roster ของแต่ละวัน แล้วสร้าง events ลงปฏิทินให้อัตโนมัติ</p>
      <div class="field-row">
        <div class="field"><label>จากวันที่</label><input type="date" id="from" value="${today}" /></div>
        <div class="field"><label>ถึงวันที่</label><input type="date" id="to" value="${weekLater}" /></div>
      </div>
      <div class="field">
        <label>เลือกวัน</label>
        <div class="chips" id="days">
          ${DAYS_TH.map(d=>`<div class="chip active" data-d="${d}">${d.slice(0,2)}</div>`).join('')}
        </div>
      </div>
      <div class="field">
        <label>ประเภทเริ่มต้น</label>
        <div class="chips" id="stype">
          <div class="chip active" data-v="งานวง">🥁 งานวง</div>
          <div class="chip" data-v="จ้างคนแทน">👤 จ้างแทน</div>
        </div>
      </div>
      <div class="field">
        <label><input type="checkbox" id="skip" checked style="width:auto;margin-right:6px" /> ข้ามวันที่มี "ติดคอนเสิร์ต"</label>
      </div>
      <div id="preview" class="greet" style="margin:10px 0"></div>
      <button class="btn" id="gen">สร้างลงปฏิทิน</button>
    `;
    body.querySelectorAll('#days .chip').forEach(c => c.onclick = () => c.classList.toggle('active'));
    body.querySelectorAll('#stype .chip').forEach(c => c.onclick = () => { body.querySelectorAll('#stype .chip').forEach(x=>x.classList.remove('active')); c.classList.add('active'); updatePreview(); });
    ['from','to','skip'].forEach(id => $('#'+id, body).onchange = updatePreview);

    function collectPlan() {
      const from = $('#from',body).value, to = $('#to',body).value;
      const days = [...body.querySelectorAll('#days .chip.active')].map(c=>c.dataset.d);
      const type = body.querySelector('#stype .chip.active')?.dataset.v || 'งานวง';
      const skip = $('#skip',body).checked;
      if (!from || !to) return [];
      const plan = [];
      const start = new Date(from), end = new Date(to);
      for (let d = new Date(start); d <= end; d.setDate(d.getDate()+1)) {
        const iso = d.toISOString().slice(0,10);
        const day = DAYS_TH[d.getDay()];
        if (!days.includes(day)) continue;
        const rosterRows = db.roster.filter(r => r.dayOfWeek === day);
        if (!rosterRows.length) continue;
        const concert = db.events.find(e => e.date === iso && e.status === 'ติดคอนเสิร์ต');
        if (skip && concert) continue;
        rosterRows.forEach(r => {
          const dup = db.events.find(e => e.date === iso && e.venueName === r.venueName && eventFinalStart(e) === r.standardStart);
          if (dup) return;
          const venue = db.venues.find(v => v.name === r.venueName);
          plan.push({
            id: uid(), date: iso, venueName: r.venueName, status: type,
            actualSub: '', actualStart: '', actualEnd: '',
            fee: venue?.defaultFee || '', paid: false, slip: '', notes: ''
          });
        });
      }
      return plan;
    }
    function updatePreview() {
      const plan = collectPlan();
      $('#preview', body).innerHTML = plan.length ? `จะสร้าง <b style="color:var(--brand)">${plan.length}</b> งาน (ข้ามงานที่มีอยู่แล้ว)` : 'ไม่มีงานจะสร้าง ตรวจ Roster/ช่วงวันที่';
    }
    updatePreview();

    $('#gen', body).onclick = () => {
      const plan = collectPlan();
      if (!plan.length) { toast('ไม่มีงานจะสร้าง'); return; }
      if (!confirm(`สร้าง ${plan.length} งาน?`)) return;
      db.events.push(...plan); saveDB(); closeModal(); render(); toast(`เพิ่ม ${plan.length} งานแล้ว`);
    };
  });
}

// ---- Per-Musician Owed Summary ----
function openOwedSummary() {
  openModal('เช็คค่าจ้างคนแทน', (body) => {
    const unpaid = db.events.filter(e => !e.paid && e.status === 'จ้างคนแทน' && eventFinalSub(e));
    const byName = {};
    unpaid.forEach(e => {
      const n = eventFinalSub(e);
      if (!byName[n]) byName[n] = { name: n, total: 0, events: [] };
      byName[n].total += Number(e.fee||0);
      byName[n].events.push(e);
    });
    const rows = Object.values(byName).sort((a,b)=>b.total-a.total);
    const grand = rows.reduce((s,r)=>s+r.total,0);
    body.innerHTML = `
      <div class="stat hero" style="margin-bottom:16px">
        <div class="label">ยอดค้างจ่ายคนแทนทั้งหมด</div>
        <div class="value">฿${money(grand)}</div>
        <div class="sub-label">${unpaid.length} งาน · ${rows.length} คน</div>
      </div>
      <div id="list"></div>`;
    const list = $('#list', body);
    if (!rows.length) { list.innerHTML = `<div class="empty">ไม่มีค้างจ่าย 🎉</div>`; return; }
    rows.forEach(r => {
      const m = db.musicians.find(x => x.name === r.name);
      const block = el(`<div class="card" style="display:block">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px">
          <div class="avatar-initials">${initials(r.name)}</div>
          <div style="flex:1">
            <div style="font-weight:700;font-size:16px">${r.name}</div>
            <div style="color:var(--text-2);font-size:12px">${r.events.length} งาน · ${m?.bankName||''} ${m?.bankAccount||''}</div>
          </div>
          <div class="num" style="font-size:20px;font-weight:700;color:var(--danger)">฿${money(r.total)}</div>
        </div>
        <div class="evs" style="border-top:1px solid var(--line);padding-top:8px"></div>
      </div>`);
      const evs = block.querySelector('.evs');
      r.events.forEach(e => {
        const row = el(`<div style="display:flex;justify-content:space-between;padding:6px 0;font-size:13px"><span style="color:var(--text-2)">${fmtDateShort(e.date)} · ${e.venueName}</span><span class="num" style="font-weight:600">฿${money(e.fee)}</span></div>`);
        row.onclick = () => { closeModal(); setTimeout(()=>openEventDetail(e.id), 200); };
        row.style.cursor = 'pointer';
        evs.appendChild(row);
      });
      list.appendChild(block);
    });
  });
}
// ---- Export / Import ----
function exportData() {
  const blob = new Blob([JSON.stringify(db, null, 2)], { type:'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = `drummer-queue-${todayISO()}.json`; a.click();
  URL.revokeObjectURL(url); toast('ดาวน์โหลดเรียบร้อย');
}
function importData() {
  const inp = document.createElement('input'); inp.type='file'; inp.accept='.json';
  inp.onchange = async () => {
    const f = inp.files[0]; if (!f) return;
    try {
      const txt = await f.text(); const data = JSON.parse(txt);
      if (!data.events || !data.roster) throw new Error('invalid');
      if (confirm('แทนที่ข้อมูลปัจจุบัน?')) { db = data; saveDB(); render(); toast('Import สำเร็จ'); }
    } catch(e) { toast('ไฟล์ไม่ถูกต้อง'); }
  };
  inp.click();
}

// ==================== Wire up ====================
document.querySelectorAll('#tabbar button').forEach(btn => {
  btn.onclick = () => {
    const tab = btn.dataset.tab;
    if (tab === 'add') { openAddEvent(); return; }
    currentTab = tab;
    document.querySelectorAll('#tabbar button').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
    render();
  };
});

// Seed example data on first run
if (db.venues.length===0 && db.musicians.length===0 && db.events.length===0) {
  db.venues.push({ id:uid(), name:'ร้านตัวอย่าง A', address:'ถนนสุขุมวิท', mapURL:'', contact:'พี่โอ๋ 081-xxx' });
  db.musicians.push({ id:uid(), name:'พี่ต้น', phone:'0812345678', bankName:'SCB', bankAccount:'123-4-56789-0', lineURL:'', messengerURL:'', notes:'' });
  saveDB();
}

render();
