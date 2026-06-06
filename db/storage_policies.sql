-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 1. Insert Policy
CREATE POLICY "Allow authenticated upload to user folder"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket = 'resumes' AND
  (storage.foldername(key))[1] = auth.uid()::text
);

-- 2. Update Policy
CREATE POLICY "Allow authenticated update to user folder"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket = 'resumes' AND
  (storage.foldername(key))[1] = auth.uid()::text
) WITH CHECK (
  bucket = 'resumes' AND
  (storage.foldername(key))[1] = auth.uid()::text
);

-- 3. Select Policy
CREATE POLICY "Allow authenticated read of user folder"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket = 'resumes' AND
  (storage.foldername(key))[1] = auth.uid()::text
);

-- 4. Delete Policy
CREATE POLICY "Allow authenticated delete of user folder"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket = 'resumes' AND
  (storage.foldername(key))[1] = auth.uid()::text
);
