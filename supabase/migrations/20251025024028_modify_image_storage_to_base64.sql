/*
  # Modify Image Storage to Use Base64

  1. Changes
    - Change front_image_url and back_image_url columns to text type for base64 storage
    - Rename columns to front_image_data and back_image_data for clarity
    - Remove dependency on Supabase Storage bucket
  
  2. Security
    - Maintains existing RLS policies
    - No changes to access controls
*/

-- Rename and modify columns to store base64 data
ALTER TABLE man_ki_bat_submissions 
  RENAME COLUMN front_image_url TO front_image_data;

ALTER TABLE man_ki_bat_submissions 
  RENAME COLUMN back_image_url TO back_image_data;

-- Ensure columns can handle large base64 strings
ALTER TABLE man_ki_bat_submissions 
  ALTER COLUMN front_image_data TYPE text;

ALTER TABLE man_ki_bat_submissions 
  ALTER COLUMN back_image_data TYPE text;
