-- Notifications System - wa.me Links Only (No API)
-- Replaces the previous WhatsApp API-based notification system

-- Drop old notification tables if they exist (from previous migration)
DROP TABLE IF EXISTS notification_analytics CASCADE;
DROP TABLE IF EXISTS notification_preferences CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;

-- ============================================
-- NOTIFICATIONS TABLE (In-App Only)
-- ============================================
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Notification type
    type VARCHAR(50) NOT NULL CHECK (type IN (
        'trial_reminder',
        'trial_day_3',
        'trial_ending',
        'payment_due',
        'payment_failed',
        'payment_success',
        'milestone',
        'weekly_summary',
        'insight',
        'feature_announcement',
        'inactivity_nudge'
    )),
    
    -- Content
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    
    -- Primary action (in-app navigation)
    action_label TEXT,
    action_url TEXT,
    
    -- WhatsApp support option (wa.me link)
    whatsapp_help_label TEXT,
    whatsapp_help_text TEXT, -- Pre-filled message for wa.me link
    
    -- Metadata
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high')),
    read BOOLEAN DEFAULT false,
    dismissed BOOLEAN DEFAULT false,
    
    -- Lifecycle
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE, -- Auto-hide after this date
    
    -- Analytics
    action_clicked BOOLEAN DEFAULT false,
    whatsapp_clicked BOOLEAN DEFAULT false,
    clicked_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for performance
CREATE INDEX idx_notifications_user_read ON notifications(user_id, read, created_at DESC);
CREATE INDEX idx_notifications_user_active ON notifications(user_id, dismissed, expires_at);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- ============================================
-- NOTIFICATION PREFERENCES TABLE (Simplified)
-- ============================================
CREATE TABLE IF NOT EXISTS notification_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    
    -- In-app notification preferences
    trial_reminders BOOLEAN DEFAULT true,
    payment_reminders BOOLEAN DEFAULT true,
    milestone_celebrations BOOLEAN DEFAULT true,
    weekly_summaries BOOLEAN DEFAULT true,
    insights BOOLEAN DEFAULT true,
    feature_announcements BOOLEAN DEFAULT true,
    inactivity_nudges BOOLEAN DEFAULT true,
    
    -- Quiet hours (no notifications during these times)
    quiet_hours_start TIME DEFAULT '21:00',
    quiet_hours_end TIME DEFAULT '07:00',
    timezone VARCHAR(50) DEFAULT 'Africa/Johannesburg',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notification_prefs_user_id ON notification_preferences(user_id);

-- ============================================
-- RLS POLICIES
-- ============================================
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

-- Users can view own notifications
CREATE POLICY "Users can view own notifications"
    ON notifications FOR SELECT
    USING (auth.uid() = user_id);

-- Users can update own notifications (mark as read, dismiss)
CREATE POLICY "Users can update own notifications"
    ON notifications FOR UPDATE
    USING (auth.uid() = user_id);

-- Users can view own preferences
CREATE POLICY "Users can view own notification preferences"
    ON notification_preferences FOR SELECT
    USING (auth.uid() = user_id);

-- Users can update own preferences
CREATE POLICY "Users can update own notification preferences"
    ON notification_preferences FOR UPDATE
    USING (auth.uid() = user_id);

-- Users can insert own preferences
CREATE POLICY "Users can insert own notification preferences"
    ON notification_preferences FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- ============================================
-- FUNCTION: Auto-create notification preferences for new users
-- ============================================
CREATE OR REPLACE FUNCTION create_notification_preferences_for_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO notification_preferences (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create preferences when user is created
DROP TRIGGER IF EXISTS create_notification_prefs_trigger ON users;
CREATE TRIGGER create_notification_prefs_trigger
    AFTER INSERT ON users
    FOR EACH ROW
    EXECUTE FUNCTION create_notification_preferences_for_user();

-- ============================================
-- FUNCTION: Clean up expired notifications (optional, can run via cron)
-- ============================================
CREATE OR REPLACE FUNCTION cleanup_expired_notifications()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM notifications
    WHERE expires_at IS NOT NULL
      AND expires_at < NOW()
      AND dismissed = true;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- HELPER FUNCTION: Get unread notification count
-- ============================================
CREATE OR REPLACE FUNCTION get_unread_notification_count(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
    unread_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO unread_count
    FROM notifications
    WHERE user_id = p_user_id
      AND read = false
      AND dismissed = false
      AND (expires_at IS NULL OR expires_at > NOW());
    
    RETURN unread_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

