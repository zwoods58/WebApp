-- Notifications Migration
-- Creates notification system tables

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    notification_type VARCHAR(50) NOT NULL CHECK (notification_type IN (
        'welcome', 'trial_day_3', 'trial_day_6', 'trial_ending',
        'weekly_summary', 'inactivity_nudge', 'milestone',
        'payment_due', 'payment_failed', 'payment_success',
        'report_ready', 'coach_insight', 'reminder', 'alert', 'tip'
    )),
    channel VARCHAR(20) NOT NULL DEFAULT 'whatsapp' CHECK (channel IN ('whatsapp', 'sms', 'in_app', 'email')),
    title VARCHAR(255),
    message TEXT NOT NULL,
    wa_me_link TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'read', 'failed', 'bounced')),
    scheduled_for TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    read_at TIMESTAMP WITH TIME ZONE,
    clicked BOOLEAN DEFAULT false,
    clicked_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    twilio_sid VARCHAR(100),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_type ON notifications(notification_type);
CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_notifications_scheduled ON notifications(scheduled_for);
CREATE INDEX idx_notifications_sent_at ON notifications(sent_at);

-- ============================================
-- NOTIFICATION PREFERENCES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS notification_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    whatsapp_verified BOOLEAN DEFAULT false,
    whatsapp_verification_code VARCHAR(6),
    whatsapp_verification_expires_at TIMESTAMP WITH TIME ZONE,
    whatsapp_opted_in BOOLEAN DEFAULT false,
    whatsapp_opted_in_at TIMESTAMP WITH TIME ZONE,
    weekly_summaries BOOLEAN DEFAULT true,
    milestone_celebrations BOOLEAN DEFAULT true,
    inactivity_nudges BOOLEAN DEFAULT true,
    payment_reminders BOOLEAN DEFAULT true,
    coach_insights BOOLEAN DEFAULT true,
    quiet_hours_start TIME DEFAULT '21:00',
    quiet_hours_end TIME DEFAULT '07:00',
    timezone VARCHAR(50) DEFAULT 'Africa/Johannesburg',
    last_notification_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notification_prefs_user_id ON notification_preferences(user_id);

-- ============================================
-- NOTIFICATION ANALYTICS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS notification_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    notification_id UUID REFERENCES notifications(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL CHECK (event_type IN (
        'sent', 'delivered', 'read', 'clicked', 'failed', 'bounced', 'replied', 'unsubscribed'
    )),
    event_data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notification_analytics_notification_id ON notification_analytics(notification_id);
CREATE INDEX idx_notification_analytics_event_type ON notification_analytics(event_type);
CREATE INDEX idx_notification_analytics_created_at ON notification_analytics(created_at);

