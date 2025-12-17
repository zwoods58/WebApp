-- Remove Automatic Notification Preferences Trigger
-- Better approach: Create preferences only when needed (lazy creation)

-- Drop the trigger that automatically creates notification preferences
DROP TRIGGER IF EXISTS create_notification_prefs_trigger ON users;

-- Drop the function (we'll create preferences manually when needed)
DROP FUNCTION IF EXISTS create_notification_preferences_for_user() CASCADE;

-- Note: Notification preferences will be created:
-- 1. When user opts into WhatsApp notifications (in handleWhatsAppSubmit)
-- 2. Or when needed elsewhere in the app
-- This avoids RLS issues during user creation

