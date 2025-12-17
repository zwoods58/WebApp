-- BeeZee Finance - Database Schema
-- PostgreSQL schema for Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    business_name VARCHAR(200),
    whatsapp_number VARCHAR(20),
    whatsapp_opted_in BOOLEAN DEFAULT false,
    subscription_status VARCHAR(20) DEFAULT 'trial' CHECK (subscription_status IN ('trial', 'active', 'expired', 'cancelled', 'grace_period')),
    trial_end_date TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '7 days',
    grace_period_end_date TIMESTAMP WITH TIME ZONE,
    subscription_start_date TIMESTAMP WITH TIME ZONE,
    subscription_end_date TIMESTAMP WITH TIME ZONE,
    voice_pin_enabled BOOLEAN DEFAULT false,
    voice_signature_url TEXT,
    voice_pin_name VARCHAR(100),
    language_preference VARCHAR(10) DEFAULT 'en',
    onboarding_completed BOOLEAN DEFAULT false,
    privacy_policy_accepted BOOLEAN DEFAULT false,
    privacy_policy_accepted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    login_count INTEGER DEFAULT 0,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone_number);
CREATE INDEX IF NOT EXISTS idx_users_subscription_status ON users(subscription_status);

-- ============================================
-- TRANSACTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(12, 2) NOT NULL,
    type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
    category VARCHAR(50) NOT NULL,
    description TEXT,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    synced BOOLEAN DEFAULT true,
    receipt_image_url TEXT,
    source VARCHAR(20) DEFAULT 'manual' CHECK (source IN ('manual', 'voice', 'receipt', 'whatsapp')),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category);
CREATE INDEX IF NOT EXISTS idx_transactions_user_date ON transactions(user_id, date DESC);

-- ============================================
-- REPORTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    report_type VARCHAR(50) NOT NULL CHECK (report_type IN ('profit_loss', 'cash_flow', 'expense_breakdown', 'income_analysis', 'monthly_summary')),
    date_range_start DATE NOT NULL,
    date_range_end DATE NOT NULL,
    generated_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_reports_user_id ON reports(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_type ON reports(report_type);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at DESC);

-- ============================================
-- COACHING SESSIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS coaching_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    context JSONB DEFAULT '{}',
    feedback_rating INTEGER CHECK (feedback_rating >= 1 AND feedback_rating <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_coaching_user_id ON coaching_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_coaching_created_at ON coaching_sessions(created_at DESC);

-- ============================================
-- NOTIFICATIONS TABLE (In-App Only with wa.me Links)
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
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_active ON notifications(user_id, dismissed, expires_at);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

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

CREATE INDEX IF NOT EXISTS idx_notification_prefs_user_id ON notification_preferences(user_id);

-- ============================================
-- SUBSCRIPTION PAYMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS subscription_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'ZAR',
    payment_method VARCHAR(50),
    payment_gateway VARCHAR(50) CHECK (payment_gateway IN ('payfast', 'yoco', 'manual')),
    payment_reference TEXT,
    payment_token TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded', 'cancelled')),
    failure_reason TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    paid_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON subscription_payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON subscription_payments(status);

-- ============================================
-- TRUSTED DEVICES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS trusted_devices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    device_fingerprint VARCHAR(255) NOT NULL,
    device_name VARCHAR(255),
    device_type VARCHAR(50),
    browser VARCHAR(100),
    os VARCHAR(100),
    ip_address VARCHAR(45),
    last_used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    trusted_until TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '30 days',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_trusted_devices_user_id ON trusted_devices(user_id);
CREATE INDEX IF NOT EXISTS idx_trusted_devices_fingerprint ON trusted_devices(device_fingerprint);
CREATE INDEX IF NOT EXISTS idx_trusted_devices_trusted_until ON trusted_devices(trusted_until);

-- ============================================
-- LOGIN ATTEMPTS TABLE (for rate limiting)
-- ============================================
CREATE TABLE IF NOT EXISTS login_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone_number VARCHAR(20) NOT NULL,
    attempt_type VARCHAR(20) CHECK (attempt_type IN ('otp', 'voice_pin')),
    status VARCHAR(20) CHECK (status IN ('success', 'failed', 'blocked')),
    ip_address VARCHAR(45),
    device_fingerprint VARCHAR(255),
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_login_attempts_phone ON login_attempts(phone_number);
CREATE INDEX IF NOT EXISTS idx_login_attempts_created_at ON login_attempts(created_at);
CREATE INDEX IF NOT EXISTS idx_login_attempts_ip ON login_attempts(ip_address);

-- ============================================
-- PAYMENT METHODS TABLE (stored payment info)
-- ============================================
CREATE TABLE IF NOT EXISTS payment_methods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    gateway VARCHAR(50) CHECK (gateway IN ('payfast', 'yoco')),
    payment_type VARCHAR(50) CHECK (payment_type IN ('card', 'eft', 'mobile')),
    card_last_four VARCHAR(4),
    card_brand VARCHAR(50),
    payment_token TEXT NOT NULL,
    is_default BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    expires_at DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payment_methods_user_id ON payment_methods(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_is_default ON payment_methods(is_default);

-- ============================================
-- OFFLINE QUEUE TABLE (for sync tracking)
-- ============================================
CREATE TABLE IF NOT EXISTS offline_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action_type VARCHAR(50) NOT NULL,
    payload JSONB NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'failed')),
    retry_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_queue_user_id ON offline_queue(user_id);
CREATE INDEX IF NOT EXISTS idx_queue_status ON offline_queue(status);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE coaching_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE trusted_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE offline_queue ENABLE ROW LEVEL SECURITY;

-- Users table policies
DROP POLICY IF EXISTS "Users can view own profile" ON users;
CREATE POLICY "Users can view own profile"
    ON users FOR SELECT
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can update own profile"
    ON users FOR UPDATE
    USING (auth.uid() = id);

-- Transactions table policies
DROP POLICY IF EXISTS "Users can view own transactions" ON transactions;
CREATE POLICY "Users can view own transactions"
    ON transactions FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own transactions" ON transactions;
CREATE POLICY "Users can insert own transactions"
    ON transactions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own transactions" ON transactions;
CREATE POLICY "Users can update own transactions"
    ON transactions FOR UPDATE
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own transactions" ON transactions;
CREATE POLICY "Users can delete own transactions"
    ON transactions FOR DELETE
    USING (auth.uid() = user_id);

-- Reports table policies
DROP POLICY IF EXISTS "Users can view own reports" ON reports;
CREATE POLICY "Users can view own reports"
    ON reports FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own reports" ON reports;
CREATE POLICY "Users can insert own reports"
    ON reports FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Coaching sessions policies
DROP POLICY IF EXISTS "Users can view own coaching sessions" ON coaching_sessions;
CREATE POLICY "Users can view own coaching sessions"
    ON coaching_sessions FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own coaching sessions" ON coaching_sessions;
CREATE POLICY "Users can insert own coaching sessions"
    ON coaching_sessions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Notifications policies
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
CREATE POLICY "Users can view own notifications"
    ON notifications FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
CREATE POLICY "Users can update own notifications"
    ON notifications FOR UPDATE
    USING (auth.uid() = user_id);

-- Notification preferences policies
DROP POLICY IF EXISTS "Users can view own notification preferences" ON notification_preferences;
CREATE POLICY "Users can view own notification preferences"
    ON notification_preferences FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own notification preferences" ON notification_preferences;
CREATE POLICY "Users can update own notification preferences"
    ON notification_preferences FOR UPDATE
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own notification preferences" ON notification_preferences;
CREATE POLICY "Users can insert own notification preferences"
    ON notification_preferences FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Subscription payments policies
DROP POLICY IF EXISTS "Users can view own payments" ON subscription_payments;
CREATE POLICY "Users can view own payments"
    ON subscription_payments FOR SELECT
    USING (auth.uid() = user_id);

-- Offline queue policies
DROP POLICY IF EXISTS "Users can manage own queue" ON offline_queue;
CREATE POLICY "Users can manage own queue"
    ON offline_queue FOR ALL
    USING (auth.uid() = user_id);

-- Trusted devices policies
DROP POLICY IF EXISTS "Users can view own trusted devices" ON trusted_devices;
CREATE POLICY "Users can view own trusted devices"
    ON trusted_devices FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own trusted devices" ON trusted_devices;
CREATE POLICY "Users can manage own trusted devices"
    ON trusted_devices FOR ALL
    USING (auth.uid() = user_id);

-- Login attempts policies (read-only for users, write for service)
DROP POLICY IF EXISTS "Users can view own login attempts" ON login_attempts;
CREATE POLICY "Users can view own login attempts"
    ON login_attempts FOR SELECT
    USING (phone_number IN (SELECT phone_number FROM users WHERE id = auth.uid()));

-- Payment methods policies
DROP POLICY IF EXISTS "Users can view own payment methods" ON payment_methods;
CREATE POLICY "Users can view own payment methods"
    ON payment_methods FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own payment methods" ON payment_methods;
CREATE POLICY "Users can manage own payment methods"
    ON payment_methods FOR ALL
    USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_transactions_updated_at ON transactions;
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_notification_prefs_updated_at ON notification_preferences;
CREATE TRIGGER update_notification_prefs_updated_at BEFORE UPDATE ON notification_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_payment_methods_updated_at ON payment_methods;
CREATE TRIGGER update_payment_methods_updated_at BEFORE UPDATE ON payment_methods
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create default notification preferences for new users
CREATE OR REPLACE FUNCTION create_notification_preferences_for_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO notification_preferences (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS create_notification_prefs_trigger ON users;
CREATE TRIGGER create_notification_prefs_trigger
    AFTER INSERT ON users
    FOR EACH ROW
    EXECUTE FUNCTION create_notification_preferences_for_user();

-- Function to check and update subscription status
CREATE OR REPLACE FUNCTION check_subscription_status()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if trial has expired
    IF NEW.subscription_status = 'trial' AND NEW.trial_end_date < NOW() THEN
        NEW.subscription_status = 'expired';
    END IF;
    
    -- Check if subscription has expired
    IF NEW.subscription_status = 'active' AND NEW.subscription_end_date IS NOT NULL AND NEW.subscription_end_date < NOW() THEN
        NEW.subscription_status = 'expired';
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS check_user_subscription ON users;
CREATE TRIGGER check_user_subscription BEFORE INSERT OR UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION check_subscription_status();

-- ============================================
-- CATEGORIES REFERENCE TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL,
    type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense', 'both')),
    icon VARCHAR(50),
    is_default BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default categories (ignore if already exist)
INSERT INTO categories (name, type, icon) VALUES
-- Income categories
('Sales', 'income', 'trending-up'),
('Services', 'income', 'briefcase'),
('Other Income', 'income', 'plus-circle'),

-- Expense categories
('Stock/Inventory', 'expense', 'package'),
('Rent', 'expense', 'home'),
('Utilities', 'expense', 'zap'),
('Transport', 'expense', 'truck'),
('Salaries', 'expense', 'users'),
('Marketing', 'expense', 'megaphone'),
('Supplies', 'expense', 'shopping-bag'),
('Maintenance', 'expense', 'tool'),
('Taxes', 'expense', 'file-text'),
('Other Expenses', 'expense', 'minus-circle')
ON CONFLICT DO NOTHING;

-- ============================================
-- VIEWS FOR REPORTING
-- ============================================

-- Monthly summary view
CREATE OR REPLACE VIEW monthly_summaries AS
SELECT 
    user_id,
    DATE_TRUNC('month', date) AS month,
    SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS total_income,
    SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS total_expenses,
    SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END) AS net_profit,
    COUNT(*) AS transaction_count
FROM transactions
GROUP BY user_id, DATE_TRUNC('month', date);

-- Category breakdown view
CREATE OR REPLACE VIEW category_summaries AS
SELECT 
    user_id,
    category,
    type,
    DATE_TRUNC('month', date) AS month,
    SUM(amount) AS total_amount,
    COUNT(*) AS transaction_count,
    AVG(amount) AS avg_amount
FROM transactions
GROUP BY user_id, category, type, DATE_TRUNC('month', date);
