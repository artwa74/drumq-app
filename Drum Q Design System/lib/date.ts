const MONTHS_TH = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];
const DAYS_TH = ['อาทิตย์','จันทร์','อังคาร','พุธ','พฤหัสบดี','ศุกร์','เสาร์'] as const;

export const todayISO = () => new Date().toISOString().slice(0, 10);
export const isToday = (iso: string) => iso === todayISO();
export const formatMonthShort = (d: Date) => MONTHS_TH[d.getMonth()];
export const dayOfWeek = (iso: string) => DAYS_TH[new Date(iso).getDay()];
export const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'อรุณสวัสดิ์';
  if (h < 17) return 'สวัสดียามบ่าย';
  return 'สวัสดียามค่ำ';
};
export const fullThaiDate = (d = new Date()) =>
  d.toLocaleDateString('th-TH', { weekday: 'long', day: 'numeric', month: 'long' });
