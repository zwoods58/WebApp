-- Custom OTP System for wa.me Links
-- Replaces Supabase SMS OTP with WhatsApp links

CREATE TABLE IF NOT EXISTS otp_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    whatsapp_number VARCHAR(20) NOT NULL,
    code VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used BOOLEAN DEFAULT false,
    used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    attempts INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_otp_whatsapp_active ON otp_codes(whatsapp_number, used, expires_at);
CREATE INDEX IF NOT EXISTS idx_otp_code ON otp_codes(code, whatsapp_number, used);

-- Clean up expired OTPs (older than 10 minutes)
CREATE OR REPLACE FUNCTION cleanup_expired_otps()
RETURNS void AS $$
BEGIN
    DELETE FROM otp_codes
    WHERE expires_at < NOW() - INTERVAL '10 minutes';
END;
$$ LANGUAGE plpgsql;

-- Function to generate OTP code
CREATE OR REPLACE FUNCTION generate_otp_code()
RETURNS VARCHAR(6) AS $$
BEGIN
    -- Generate 6-digit random code
    RETURN LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- Function to verify OTP
CREATE OR REPLACE FUNCTION verify_otp_code(
    p_whatsapp_number VARCHAR(20),
    p_code VARCHAR(6)
)
RETURNS BOOLEAN AS $$
DECLARE
    v_otp_record otp_codes%ROWTYPE;
BEGIN
    -- Find valid, unused OTP
    SELECT * INTO v_otp_record
    FROM otp_codes
    WHERE whatsapp_number = p_whatsapp_number
      AND code = p_code
      AND used = false
      AND expires_at > NOW()
    ORDER BY created_at DESC
    LIMIT 1;

    -- If not found, return false
    IF NOT FOUND THEN
        -- Increment attempts for any matching code (for security)
        UPDATE otp_codes
        SET attempts = attempts + 1
        WHERE whatsapp_number = p_whatsapp_number
          AND code = p_code
          AND expires_at > NOW();
        RETURN false;
    END IF;

    -- Mark as used
    UPDATE otp_codes
    SET used = true,
        used_at = NOW()
    WHERE id = v_otp_record.id;

    -- Clean up old OTPs
    PERFORM cleanup_expired_otps();

    RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies
ALTER TABLE otp_codes ENABLE ROW LEVEL SECURITY;

-- Users can only view their own OTP codes (for verification)
DROP POLICY IF EXISTS "Users can view own OTP codes" ON otp_codes;
CREATE POLICY "Users can view own OTP codes" ON otp_codes
    FOR SELECT
    USING (true); -- OTP verification is done server-side

-- Only service role can insert/update OTP codes
DROP POLICY IF EXISTS "Service role manages OTP codes" ON otp_codes;
CREATE POLICY "Service role manages OTP codes" ON otp_codes
    FOR ALL
    USING (auth.role() = 'service_role');

