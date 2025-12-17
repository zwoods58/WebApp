-- Fix storage RLS for receipts uploads
-- Allow public inserts to receipts bucket for receipt images
-- This is needed because we're using custom auth, not Supabase Auth

-- Drop existing policies if they exist (for receipts bucket)
DROP POLICY IF EXISTS "Public can upload receipts" ON storage.objects;
DROP POLICY IF EXISTS "Public can read receipts" ON storage.objects;
DROP POLICY IF EXISTS "Public can delete receipts" ON storage.objects;

-- Allow public inserts to receipts bucket (for receipt images)
-- Files are stored as receipts/{user_id}/{filename}
CREATE POLICY "Public can upload receipts"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (
  bucket_id = 'receipts'
);

-- Allow public read access to receipts
CREATE POLICY "Public can read receipts"
ON storage.objects
FOR SELECT
TO public
USING (
  bucket_id = 'receipts'
);

-- Allow public delete access to receipts (for cleanup)
CREATE POLICY "Public can delete receipts"
ON storage.objects
FOR DELETE
TO public
USING (
  bucket_id = 'receipts'
);

