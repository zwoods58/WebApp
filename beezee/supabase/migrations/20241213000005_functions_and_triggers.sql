-- Functions and Triggers Migration
-- Creates database functions and triggers for automation

-- ============================================
-- TIMESTAMP UPDATE FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================
-- SUBSCRIPTION STATUS CHECK FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION check_subscription_status()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if trial has expired
    IF NEW.subscription_status = 'trial' AND NEW.trial_end_date < NOW() THEN
        NEW.subscription_status = 'grace_period';
        NEW.grace_period_end_date = NOW() + INTERVAL '2 days';
    END IF;
    
    -- Check if grace period has expired
    IF NEW.subscription_status = 'grace_period' AND NEW.grace_period_end_date IS NOT NULL AND NEW.grace_period_end_date < NOW() THEN
        NEW.subscription_status = 'expired';
    END IF;
    
    -- Check if active subscription has expired
    IF NEW.subscription_status = 'active' AND NEW.subscription_end_date IS NOT NULL AND NEW.subscription_end_date < NOW() THEN
        NEW.subscription_status = 'expired';
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================
-- CREATE DEFAULT NOTIFICATION PREFERENCES
-- ============================================
CREATE OR REPLACE FUNCTION create_default_notification_preferences()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO notification_preferences (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notification_prefs_updated_at BEFORE UPDATE ON notification_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_methods_updated_at BEFORE UPDATE ON payment_methods
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- TRIGGERS FOR SUBSCRIPTION STATUS
-- ============================================
CREATE TRIGGER check_user_subscription BEFORE INSERT OR UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION check_subscription_status();

-- ============================================
-- TRIGGER FOR DEFAULT NOTIFICATION PREFERENCES
-- ============================================
CREATE TRIGGER create_notification_prefs_for_new_user
    AFTER INSERT ON users
    FOR EACH ROW
    EXECUTE FUNCTION create_default_notification_preferences();

-- ============================================
-- LOG LOGIN ATTEMPT FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION log_login_attempt(
    p_phone_number VARCHAR(20),
    p_attempt_type VARCHAR(20),
    p_status VARCHAR(20),
    p_ip_address VARCHAR(45) DEFAULT NULL,
    p_device_fingerprint VARCHAR(255) DEFAULT NULL,
    p_error_message TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO login_attempts (
        phone_number,
        attempt_type,
        status,
        ip_address,
        device_fingerprint,
        error_message
    ) VALUES (
        p_phone_number,
        p_attempt_type,
        p_status,
        p_ip_address,
        p_device_fingerprint,
        p_error_message
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- CHECK RATE LIMIT FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION check_rate_limit(
    p_phone_number VARCHAR(20),
    p_attempt_type VARCHAR(20),
    p_time_window_minutes INTEGER DEFAULT 15,
    p_max_attempts INTEGER DEFAULT 3
)
RETURNS BOOLEAN AS $$
DECLARE
    attempt_count INTEGER;
BEGIN
    SELECT COUNT(*)
    INTO attempt_count
    FROM login_attempts
    WHERE phone_number = p_phone_number
      AND attempt_type = p_attempt_type
      AND status IN ('failed', 'blocked')
      AND created_at > NOW() - (p_time_window_minutes || ' minutes')::INTERVAL;
    
    RETURN attempt_count < p_max_attempts;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

