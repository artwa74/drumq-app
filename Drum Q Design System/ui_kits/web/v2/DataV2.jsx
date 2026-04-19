const VENUES_V2 = [
  { id: 1, name: 'Saxophone Pub', area: 'อนุสาวรีย์ชัย', rate: 1500, events: 12, tags: ['Jazz','Main'] },
  { id: 2, name: 'The Rock Pub', area: 'ประตูน้ำ', rate: 1800, events: 8, tags: ['Rock'] },
  { id: 3, name: 'Brown Sugar', area: 'ทองหล่อ', rate: 2200, events: 6, tags: ['Jazz','Main'] },
  { id: 4, name: "Maggie Choo's", area: 'สีลม', rate: 1500, events: 4, tags: ['Lounge'] },
  { id: 5, name: 'Fungjai Studio', area: 'เอกมัย', rate: 2500, events: 3, tags: ['Studio'] },
  { id: 6, name: 'The Living Room', area: 'สุขุมวิท 23', rate: 1500, events: 5, tags: ['Hotel'] },
  { id: 7, name: 'Overtone', area: 'เลียบด่วน', rate: 1800, events: 2, tags: ['Rock'] },
  { id: 8, name: 'Mellow Pub', area: 'ทองหล่อ 10', rate: 2000, events: 7, tags: ['Jazz'] },
];

const MUSICIANS_V2 = [
  { id: 1, name: 'ป้อง', inst: 'กลอง', phone: '089-123-4567', gigs: 8, owed: 3000, rate: 1500 },
  { id: 2, name: 'มิว', inst: 'กลอง', phone: '081-234-5678', gigs: 5, owed: 3600, rate: 1800 },
  { id: 3, name: 'โอ๋', inst: 'กลอง', phone: '092-345-6789', gigs: 3, owed: 1500, rate: 1500 },
  { id: 4, name: 'เบนซ์', inst: 'กลอง/เพอร์คัสชั่น', phone: '086-456-7890', gigs: 6, owed: 0, rate: 1600 },
  { id: 5, name: 'อาร์ม', inst: 'กลอง', phone: '095-567-8901', gigs: 2, owed: 0, rate: 1400 },
];

const ROSTER_V2 = [
  { id: 1, day: 'จันทร์', venue: 'Saxophone Pub', start: '20:30', end: '00:30', fee: 1500, active: true },
  { id: 2, day: 'พุธ', venue: 'The Rock Pub', start: '21:00', end: '01:00', fee: 1800, active: true },
  { id: 3, day: 'พฤหัสบดี', venue: 'Brown Sugar', start: '20:00', end: '23:00', fee: 2200, active: true },
  { id: 4, day: 'ศุกร์', venue: "Maggie Choo's", start: '21:30', end: '01:30', fee: 1500, active: true },
  { id: 5, day: 'เสาร์', venue: 'The Living Room', start: '20:30', end: '00:30', fee: 1500, active: true },
  { id: 6, day: 'อาทิตย์', venue: 'Mellow Pub', start: '20:00', end: '23:30', fee: 2000, active: false },
];

const DAYS_V2 = ['จันทร์','อังคาร','พุธ','พฤหัสบดี','ศุกร์','เสาร์','อาทิตย์'];

Object.assign(window, { VENUES_V2, MUSICIANS_V2, ROSTER_V2, DAYS_V2 });
