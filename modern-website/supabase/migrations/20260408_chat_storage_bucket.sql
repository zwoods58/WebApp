-- =====================================================
-- MIGRATION: 20260408_chat_storage_bucket
-- PURPOSE: Create storage bucket for chat messages
-- =====================================================

BEGIN;

-- 1. Create storage bucket for chat messages
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'beehive-messages',
    'beehive-messages',
    false, -- Not public - users need auth
    10485760, -- 10 MB limit per file
    ARRAY['text/plain', 'application/json', 'text/markdown']::TEXT[]
)
ON CONFLICT (id) DO NOTHING;

-- 2. Storage policies
CREATE POLICY "Users can upload their own messages"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'beehive-messages' 
    AND (storage.foldername(name))[1] = auth.uid()::TEXT
);

CREATE POLICY "Users can read their own messages"
ON storage.objects
FOR SELECT
TO authenticated
USING (
    bucket_id = 'beehive-messages' 
    AND (storage.foldername(name))[1] = auth.uid()::TEXT
);

CREATE POLICY "Users can delete their own messages"
ON storage.objects
FOR DELETE
TO authenticated
USING (
    bucket_id = 'beehive-messages' 
    AND (storage.foldername(name))[1] = auth.uid()::TEXT
);

-- 3. Function to clean old chat files (30+ days)
CREATE OR REPLACE FUNCTION cleanup_old_chat_files()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    old_messages RECORD;
BEGIN
    -- Get messages older than 30 days
    FOR old_messages IN 
        SELECT message_path FROM chat_messages_index
        WHERE sent_at < NOW() - INTERVAL '30 days'
    LOOP
        -- Delete from storage
        PERFORM storage.delete('beehive-messages', old_messages.message_path);
        
        -- Delete from index
        DELETE FROM chat_messages_index 
        WHERE message_path = old_messages.message_path;
    END LOOP;
    
    RAISE NOTICE 'Cleaned up old chat messages';
END;
$$;

COMMIT;
