# Supabase Storage Setup for AI Builder Image Uploads

## Create Storage Bucket

1. **Go to Supabase Dashboard**
   - Navigate to your project: https://supabase.com/dashboard
   - Select your project

2. **Create `user-uploads` Bucket**
   - Go to **Storage** in the left sidebar
   - Click **"New bucket"**
   - Bucket name: `user-uploads`
   - Public bucket: **✓ Checked** (images need to be publicly accessible for AI analysis)
   - Click **"Create bucket"**

3. **Set Up Storage Policies**

   Go to **Storage** → **Policies** → `user-uploads` bucket

   **Policy 1: Allow authenticated users to upload**
   ```sql
   CREATE POLICY "Allow authenticated uploads"
   ON storage.objects
   FOR INSERT
   TO authenticated
   WITH CHECK (
     bucket_id = 'user-uploads' AND
     auth.uid()::text = (storage.foldername(name))[1]
   );
   ```

   **Policy 2: Allow public read access**
   ```sql
   CREATE POLICY "Allow public read"
   ON storage.objects
   FOR SELECT
   TO public
   USING (bucket_id = 'user-uploads');
   ```

   **Policy 3: Allow users to delete their own files**
   ```sql
   CREATE POLICY "Allow users to delete own files"
   ON storage.objects
   FOR DELETE
   TO authenticated
   USING (
     bucket_id = 'user-uploads' AND
     auth.uid()::text = (storage.foldername(name))[1]
   );
   ```

4. **Storage Structure**
   
   Images will be stored with this path pattern:
   ```
   user-uploads/
     ├── {user_id}/
     │   ├── {timestamp_1}.jpg
     │   ├── {timestamp_2}.png
     │   └── ...
   ```

5. **Test Upload**
   
   After setup, test by:
   - Going to AI Builder page
   - Logging in
   - Uploading an image
   - Check Supabase Storage to verify file appears

## Environment Variables Required

Ensure these are set in `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
OPENROUTER_API_KEY=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
CLAUDE_API_KEY=your_claude_api_key
```

## Image Upload Flow

1. **User uploads image** → Stored in browser temporarily
2. **User clicks "START BUILD"** → Triggers upload to Supabase Storage
3. **Image uploaded** → Returns public URL
4. **Public URL stored** in `draft_projects.metadata.uploaded_image_url`
5. **During generation**:
   - Gemini analyzes the image (color palette, style, description)
   - Claude receives image analysis + image URL
   - Claude uses the image as hero background and matches color scheme

## Fallback Behavior

If image upload fails or no image is provided:
- Gemini generates AI image suggestions from Unsplash
- Claude receives curated Unsplash image IDs
- Website still gets high-quality, relevant images

## Storage Limits

- File size limit: 5MB per image
- Supported formats: JPG, PNG, WebP, GIF
- Storage quota: Check your Supabase plan limits

