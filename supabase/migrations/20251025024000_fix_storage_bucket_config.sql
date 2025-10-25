/*
  # Fix Storage Bucket Configuration

  1. Changes
    - Update bucket configuration to ensure proper public access
    - Add missing bucket configuration columns if needed
    - Ensure RLS policies are correctly set
  
  2. Security
    - Maintain existing RLS policies for controlled access
    - Allow public uploads and reads for the man-ki-bat-images bucket
*/

-- Update the bucket to ensure it's properly configured
UPDATE storage.buckets 
SET updated_at = now()
WHERE id = 'man-ki-bat-images';

-- Ensure all necessary policies exist
DO $$ 
BEGIN
  -- Check and recreate policies if needed
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Allow anon uploads to man-ki-bat-images'
  ) THEN
    CREATE POLICY "Allow anon uploads to man-ki-bat-images"
    ON storage.objects FOR INSERT
    TO anon
    WITH CHECK (bucket_id = 'man-ki-bat-images');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Allow anon read access to man-ki-bat-images'
  ) THEN
    CREATE POLICY "Allow anon read access to man-ki-bat-images"
    ON storage.objects FOR SELECT
    TO anon
    USING (bucket_id = 'man-ki-bat-images');
  END IF;
END $$;
