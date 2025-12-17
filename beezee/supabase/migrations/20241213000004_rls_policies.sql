-- Row Level Security Policies Migration
-- Implements RLS for all tables

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE coaching_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE trusted_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE offline_queue ENABLE ROW LEVEL SECURITY;

-- ============================================
-- USERS TABLE POLICIES
-- ============================================
CREATE POLICY "Users can view own profile"
    ON users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON users FOR UPDATE
    USING (auth.uid() = id);

-- ============================================
-- TRANSACTIONS TABLE POLICIES
-- ============================================
CREATE POLICY "Users can view own transactions"
    ON transactions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
    ON transactions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transactions"
    ON transactions FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own transactions"
    ON transactions FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- REPORTS TABLE POLICIES
-- ============================================
CREATE POLICY "Users can view own reports"
    ON reports FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own reports"
    ON reports FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- ============================================
-- COACHING SESSIONS POLICIES
-- ============================================
CREATE POLICY "Users can view own coaching sessions"
    ON coaching_sessions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own coaching sessions"
    ON coaching_sessions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- ============================================
-- NOTIFICATIONS POLICIES
-- ============================================
CREATE POLICY "Users can view own notifications"
    ON notifications FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
    ON notifications FOR UPDATE
    USING (auth.uid() = user_id);

-- ============================================
-- NOTIFICATION PREFERENCES POLICIES
-- ============================================
CREATE POLICY "Users can view own notification preferences"
    ON notification_preferences FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notification preferences"
    ON notification_preferences FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notification preferences"
    ON notification_preferences FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- ============================================
-- NOTIFICATION ANALYTICS POLICIES
-- ============================================
CREATE POLICY "Users can view analytics for own notifications"
    ON notification_analytics FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM notifications n
            WHERE n.id = notification_analytics.notification_id
            AND n.user_id = auth.uid()
        )
    );

-- ============================================
-- SUBSCRIPTION PAYMENTS POLICIES
-- ============================================
CREATE POLICY "Users can view own payments"
    ON subscription_payments FOR SELECT
    USING (auth.uid() = user_id);

-- ============================================
-- TRUSTED DEVICES POLICIES
-- ============================================
CREATE POLICY "Users can view own trusted devices"
    ON trusted_devices FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own trusted devices"
    ON trusted_devices FOR ALL
    USING (auth.uid() = user_id);

-- ============================================
-- LOGIN ATTEMPTS POLICIES
-- ============================================
CREATE POLICY "Users can view own login attempts"
    ON login_attempts FOR SELECT
    USING (phone_number IN (SELECT phone_number FROM users WHERE id = auth.uid()));

-- ============================================
-- PAYMENT METHODS POLICIES
-- ============================================
CREATE POLICY "Users can view own payment methods"
    ON payment_methods FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own payment methods"
    ON payment_methods FOR ALL
    USING (auth.uid() = user_id);

-- ============================================
-- OFFLINE QUEUE POLICIES
-- ============================================
CREATE POLICY "Users can manage own queue"
    ON offline_queue FOR ALL
    USING (auth.uid() = user_id);

