-- =====================================================
-- MIGRATION: 20260408_archive_functions
-- PURPOSE: Archive functions for hot/cold data separation
-- =====================================================

BEGIN;

-- 1. Main archive function
CREATE OR REPLACE FUNCTION archive_old_data()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    archive_date DATE;
    archive_cutoff DATE;
    rows_archived INTEGER := 0;
    result JSONB;
BEGIN
    -- Archive data older than 3 months
    archive_cutoff := CURRENT_DATE - INTERVAL '3 months';
    archive_date := archive_cutoff;
    
    -- 1. Archive expenses
    WITH archived AS (
        INSERT INTO expenses_cold (original_id, user_id, amount, description, category, status, created_at, updated_at, archived_at)
        SELECT id, user_id, amount, description, category, status, created_at, updated_at, NOW()
        FROM expenses_hot
        WHERE created_at < archive_date
        RETURNING original_id
    )
    SELECT COUNT(*) INTO rows_archived FROM archived;
    
    DELETE FROM expenses_hot
    WHERE created_at < archive_date;
    
    RAISE NOTICE 'Archived % expenses', rows_archived;
    
    -- 2. Archive transactions
    WITH archived AS (
        INSERT INTO transactions_cold (original_id, user_id, type, amount, description, counterparty, reference_number, status, created_at, updated_at, archived_at)
        SELECT id, user_id, type, amount, description, counterparty, reference_number, status, created_at, updated_at, NOW()
        FROM transactions_hot
        WHERE created_at < archive_date
        RETURNING original_id
    )
    SELECT COUNT(*) INTO rows_archived FROM archived;
    
    DELETE FROM transactions_hot
    WHERE created_at < archive_date;
    
    RAISE NOTICE 'Archived % transactions', rows_archived;
    
    -- 3. Archive completed appointments
    WITH archived AS (
        INSERT INTO appointments_cold (original_id, user_id, customer_name, customer_phone, appointment_date, duration_minutes, service_type, status, notes, created_at, updated_at, archived_at)
        SELECT id, user_id, customer_name, customer_phone, appointment_date, duration_minutes, service_type, status, notes, created_at, updated_at, NOW()
        FROM appointments_hot
        WHERE appointment_date < archive_date
        AND status IN ('completed', 'cancelled', 'no_show')
        RETURNING original_id
    )
    SELECT COUNT(*) INTO rows_archived FROM archived;
    
    DELETE FROM appointments_hot
    WHERE appointment_date < archive_date
    AND status IN ('completed', 'cancelled', 'no_show');
    
    RAISE NOTICE 'Archived % appointments', rows_archived;
    
    -- 4. Archive paid credit items
    WITH archived AS (
        INSERT INTO credit_owed_cold (original_id, user_id, counterparty_name, amount, type, due_date, status, notes, created_at, updated_at, archived_at)
        SELECT id, user_id, counterparty_name, amount, type, due_date, status, notes, created_at, updated_at, NOW()
        FROM credit_owed_hot
        WHERE status = 'paid'
        AND updated_at < archive_date
        RETURNING original_id
    )
    SELECT COUNT(*) INTO rows_archived FROM archived;
    
    DELETE FROM credit_owed_hot
    WHERE status = 'paid'
    AND updated_at < archive_date;
    
    RAISE NOTICE 'Archived % credit items', rows_archived;
    
    -- 5. Update last archive run timestamp
    UPDATE system_settings
    SET value = NOW()::TEXT,
        updated_at = NOW()
    WHERE key = 'last_archive_run';
    
    -- Return summary
    result := jsonb_build_object(
        'success', true,
        'archive_date', archive_date,
        'tables_processed', ARRAY['expenses', 'transactions', 'appointments', 'credit'],
        'timestamp', NOW()
    );
    
    RETURN result;
    
EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object(
        'success', false,
        'error', SQLERRM,
        'timestamp', NOW()
    );
END;
$$;

-- 2. Function to restore data from cold storage (if needed)
CREATE OR REPLACE FUNCTION restore_from_cold(
    table_name TEXT,
    start_date DATE,
    end_date DATE
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    restored_count INTEGER := 0;
BEGIN
    IF table_name = 'expenses' THEN
        INSERT INTO expenses_hot
        SELECT 
            original_id as id,
            user_id,
            amount,
            description,
            category,
            status,
            created_at,
            updated_at
        FROM expenses_cold
        WHERE created_at BETWEEN start_date AND end_date
        ON CONFLICT (id) DO NOTHING;
        
        GET DIAGNOSTICS restored_count = ROW_COUNT;
        
        DELETE FROM expenses_cold
        WHERE created_at BETWEEN start_date AND end_date;
        
    ELSIF table_name = 'transactions' THEN
        INSERT INTO transactions_hot
        SELECT 
            original_id as id,
            user_id,
            type,
            amount,
            description,
            counterparty,
            reference_number,
            status,
            created_at,
            updated_at
        FROM transactions_cold
        WHERE created_at BETWEEN start_date AND end_date
        ON CONFLICT (id) DO NOTHING;
        
        GET DIAGNOSTICS restored_count = ROW_COUNT;
        
        DELETE FROM transactions_cold
        WHERE created_at BETWEEN start_date AND end_date;
    END IF;
    
    RETURN restored_count;
END;
$$;

-- 3. Function to get storage metrics
CREATE OR REPLACE FUNCTION get_storage_metrics()
RETURNS TABLE (
    metric_name TEXT,
    metric_value TEXT,
    metric_unit TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Database size
    RETURN QUERY
    SELECT 
        'database_size'::TEXT,
        pg_size_pretty(pg_database_size(current_database()))::TEXT,
        'bytes'::TEXT;
    
    -- Hot table sizes
    RETURN QUERY
    SELECT 
        'expenses_hot_size'::TEXT,
        pg_size_pretty(pg_total_relation_size('expenses_hot'))::TEXT,
        'bytes'::TEXT;
    
    RETURN QUERY
    SELECT 
        'transactions_hot_size'::TEXT,
        pg_size_pretty(pg_total_relation_size('transactions_hot'))::TEXT,
        'bytes'::TEXT;
    
    -- Cold table sizes
    RETURN QUERY
    SELECT 
        'expenses_cold_size'::TEXT,
        pg_size_pretty(pg_total_relation_size('expenses_cold'))::TEXT,
        'bytes'::TEXT;
    
    -- Row counts
    RETURN QUERY
    SELECT 
        'expenses_hot_count'::TEXT,
        (SELECT COUNT(*)::TEXT FROM expenses_hot),
        'rows'::TEXT;
    
    RETURN QUERY
    SELECT 
        'expenses_cold_count'::TEXT,
        (SELECT COUNT(*)::TEXT FROM expenses_cold),
        'rows'::TEXT;
    
    -- Chat storage
    RETURN QUERY
    SELECT 
        'chat_messages_count'::TEXT,
        (SELECT COUNT(*)::TEXT FROM chat_messages_index),
        'messages'::TEXT;
    
    -- Last archive run
    RETURN QUERY
    SELECT 
        'last_archive_run'::TEXT,
        COALESCE((SELECT value FROM system_settings WHERE key = 'last_archive_run'), 'never'),
        'timestamp'::TEXT;
END;
$$;

COMMIT;
