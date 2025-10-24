import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface PollingStation {
  id: string;
  lac: string;
  station_name: string;
  created_at: string;
}

export interface ManKiBatSubmission {
  id?: string;
  lac: string;
  polling_station: string;
  total_attendances: number;
  venue: string;
  eminent_guests: string[];
  front_image_url?: string;
  back_image_url?: string;
  created_at?: string;
  updated_at?: string;
}
