export type DayOfWeek = 'อาทิตย์'|'จันทร์'|'อังคาร'|'พุธ'|'พฤหัสบดี'|'ศุกร์'|'เสาร์';
export type EventStatus = 'งานวง'|'จ้างคนแทน'|'ติดคอนเสิร์ต';

export type Venue = {
  id: string;
  user_id: string;
  name: string;
  address: string | null;
  map_url: string | null;
  contact_person: string | null;
  default_fee: number | null;
  image_url: string | null;
};

export type Musician = {
  id: string;
  user_id: string;
  name: string;
  phone: string | null;
  bank_name: string | null;
  bank_account: string | null;
  line_url: string | null;
  messenger_url: string | null;
  profile_image: string | null;
  notes: string | null;
};

export type RosterRow = {
  id: string;
  venue_id: string;
  day_of_week: DayOfWeek;
  regular_musician_id: string | null;
  standard_start: string | null;
  standard_end: string | null;
};

export type Event = {
  id: string;
  user_id: string;
  venue_id: string | null;
  venue_name: string;
  date: string;
  status: EventStatus;
  actual_musician_id: string | null;
  actual_sub_name: string | null;
  actual_start: string | null;
  actual_end: string | null;
  fee: number | null;
  paid: boolean;
  paid_at: string | null;
  slip_url: string | null;
  notes: string | null;
  gcal_event_id: string | null;
  // view-computed
  final_sub_name?: string | null;
  final_start?: string | null;
  final_end?: string | null;
};
