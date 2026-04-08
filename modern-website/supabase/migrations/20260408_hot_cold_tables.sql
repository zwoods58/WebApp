-- =====================================================
-- MIGRATION: 20260408_hot_cold_tables
-- PURPOSE: Create hot/cold separation for all major tables
-- AUTHOR: BeeZee Engineering
-- DATE: 2025-04-08
-- =====================================================

BEGIN;

-- 1. Create hot tables (active data - fast access)
CREATE TABLE IF NOT EXISTS expenses_hot (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    description TEXT,
    category TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Indexes for performance
    INDEX idx_expenses_hot_user_date (user_id, created_at DESC),
    INDEX idx_expenses_hot_status (status) WHERE status = 'pending',
    INDEX idx_expenses_hot_amount (amount) WHERE amount > 1000
);

CREATE TABLE IF NOT EXISTS transactions_hot (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('income', 'expense', 'transfer')),
    amount DECIMAL(10,2) NOT NULL,
    description TEXT,
    counterparty TEXT,
    reference_number TEXT UNIQUE,
    status TEXT DEFAULT 'completed',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    INDEX idx_transactions_hot_user_date (user_id, created_at DESC),
    INDEX idx_transactions_hot_reference (reference_number),
    INDEX idx_transactions_hot_status (status) WHERE status = 'pending'
);

CREATE TABLE IF NOT EXISTS appointments_hot (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    customer_name TEXT NOT NULL,
    customer_phone TEXT,
    appointment_date TIMESTAMPTZ NOT NULL,
    duration_minutes INTEGER DEFAULT 30,
    service_type TEXT,
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    INDEX idx_appointments_hot_user_date (user_id, appointment_date),
    INDEX idx_appointments_hot_status_date (status, appointment_date)
);

CREATE TABLE IF NOT EXISTS credit_owed_hot (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    counterparty_name TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    type TEXT CHECK (type IN ('owed_to_me', 'i_owe_them')),
    due_date DATE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    INDEX idx_credit_hot_user_status (user_id, status),
    INDEX idx_credit_hot_due_date (due_date) WHERE status = 'pending'
);

-- 2. Create cold tables (archive - historical data)
CREATE TABLE IF NOT EXISTS expenses_cold (
    LIKE expenses_hot INCLUDING ALL,
    archived_at TIMESTAMPTZ DEFAULT NOW(),
    original_id UUID
);

CREATE TABLE IF NOT EXISTS transactions_cold (
    LIKE transactions_hot INCLUDING ALL,
    archived_at TIMESTAMPTZ DEFAULT NOW(),
    original_id UUID
);

CREATE TABLE IF NOT EXISTS appointments_cold (
    LIKE appointments_hot INCLUDING ALL,
    archived_at TIMESTAMPTZ DEFAULT NOW(),
    original_id UUID
);

CREATE TABLE IF NOT EXISTS credit_owed_cold (
    LIKE credit_owed_hot INCLUDING ALL,
    archived_at TIMESTAMPTZ DEFAULT NOW(),
    original_id UUID
);

-- 3. Create chat messages index table (metadata only)
CREATE TABLE IF NOT EXISTS chat_messages_index (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    chat_id UUID NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    message_path TEXT NOT NULL, -- Path in storage bucket
    message_length INTEGER,
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    INDEX idx_chat_index_chat_time (chat_id, sent_at DESC),
    INDEX idx_chat_index_user (user_id, sent_at DESC),
    INDEX idx_chat_index_unread (chat_id, read_at) WHERE read_at IS NULL
);

-- 4. Create system settings table for archive tracking
CREATE TABLE IF NOT EXISTS system_settings (
    key TEXT PRIMARY KEY,
    value TEXT,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES auth.users(id)
);

-- Insert archive tracking setting
INSERT INTO system_settings (key, value, description)
VALUES ('last_archive_run', NOW()::TEXT, 'Timestamp of last successful archive operation')
ON CONFLICT (key) DO NOTHING;

-- 5. Enable RLS on all tables
ALTER TABLE expenses_hot ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions_hot ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments_hot ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_owed_hot ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages_index ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS policies (users can only see their own data)
CREATE POLICY "Users can view own expenses"
    ON expenses_hot FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own expenses"
    ON expenses_hot FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own expenses"
    ON expenses_hot FOR UPDATE
    USING (auth.uid() = user_id);

-- Same policies for other tables...
CREATE POLICY "Users can view own transactions"
    ON transactions_hot FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view own appointments"
    ON appointments_hot FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view own credit"
    ON credit_owed_hot FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view own chat index"
    ON chat_messages_index FOR SELECT
    USING (auth.uid() = user_id);

-- 7. Create function to get database size
CREATE OR REPLACE FUNCTION get_database_size()
RETURNS TABLE (table_name TEXT, size_bytes BIGINT, size_pretty TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        relname::TEXT,
        pg_total_relation_size(relid)::BIGINT,
        pg_size_pretty(pg_total_relation_size(relid))::TEXT
    FROM pg_catalog.pg_statio_user_tables
    ORDER BY pg_total_relation_size(relid) DESC;
END;
$$;

COMMIT;
