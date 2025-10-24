/*
  # Man Ki Bat Program Data Collection Schema

  1. New Tables
    - `polling_stations`
      - `id` (uuid, primary key)
      - `lac` (text) - Legislative Assembly Constituency name
      - `station_name` (text) - Name of the polling station
      - `created_at` (timestamp)
    
    - `man_ki_bat_submissions`
      - `id` (uuid, primary key)
      - `lac` (text) - LAC name (Dhemaji, Sisiborgaon, Jonai)
      - `polling_station` (text) - Selected polling station
      - `total_attendances` (integer) - Number of attendees
      - `venue` (text) - Event venue
      - `eminent_guests` (jsonb) - Array of eminent guest names
      - `front_image_url` (text) - URL for front image
      - `back_image_url` (text) - URL for back image
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for public access (as no login required)

  3. Notes
    - Using JSONB for eminent_guests to allow flexible array storage
    - Public access enabled as per requirements (no login needed)
    - Images will be stored in Supabase Storage
*/

-- Create polling_stations table
CREATE TABLE IF NOT EXISTS polling_stations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lac text NOT NULL,
  station_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create man_ki_bat_submissions table
CREATE TABLE IF NOT EXISTS man_ki_bat_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lac text NOT NULL,
  polling_station text NOT NULL,
  total_attendances integer NOT NULL DEFAULT 0,
  venue text NOT NULL,
  eminent_guests jsonb DEFAULT '[]'::jsonb,
  front_image_url text,
  back_image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE polling_stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE man_ki_bat_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (no login required)
CREATE POLICY "Allow public read access to polling stations"
  ON polling_stations FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public read access to submissions"
  ON man_ki_bat_submissions FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert to submissions"
  ON man_ki_bat_submissions FOR INSERT
  TO anon
  WITH CHECK (true);

-- Insert sample polling stations for each LAC
INSERT INTO polling_stations (lac, station_name) VALUES
  ('Dhemaji', 'Dhemaji Town Polling Station 1'),
  ('Dhemaji', 'Dhemaji Town Polling Station 2'),
  ('Dhemaji', 'Dhemaji Rural Polling Station 1'),
  ('Dhemaji', 'Dhemaji Rural Polling Station 2'),
  ('Sisiborgaon', 'Sisiborgaon Central Polling Station'),
  ('Sisiborgaon', 'Sisiborgaon East Polling Station'),
  ('Sisiborgaon', 'Sisiborgaon West Polling Station'),
  ('Sisiborgaon', 'Sisiborgaon North Polling Station'),
  ('Jonai', 'Jonai Town Polling Station 1'),
  ('Jonai', 'Jonai Town Polling Station 2'),
  ('Jonai', 'Jonai Village Polling Station 1'),
  ('Jonai', 'Jonai Village Polling Station 2')
ON CONFLICT DO NOTHING;