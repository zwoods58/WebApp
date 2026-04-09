-- =====================================================
-- Phase 2: New Query Optimization Functions Only
-- Adds only brand new functions for 50k user scaling
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- =====================================================
-- Completely New Functions (no conflicts)
-- =====================================================

-- Get business summary v2 (new name to avoid conflicts)
CREATE OR REPLACE FUNCTION get_business_summary_v2(p_business_id UUID)
RETURNS TABLE(
  transactions BIGINT,
  expenses BIGINT,
  outstanding_credit DECIMAL,
  upcoming_appointments BIGINT,
  net_profit DECIMAL,
  total_revenue DECIMAL,
  total_expenses DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    WITH transaction_stats AS (
        SELECT 
            COUNT(*) as total_count,
            COALESCE(SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END), 0) as revenue
        FROM transactions
        WHERE business_id = p_business_id
        AND DATE_TRUNC('month', transaction_date) = DATE_TRUNC('month', CURRENT_DATE)
    ),
    expense_stats AS (
        SELECT 
            COUNT(*) as total_count,
            COALESCE(SUM(amount), 0) as total_amount
        FROM expenses
        WHERE business_id = p_business_id
        AND DATE_TRUNC('month', expense_date) = DATE_TRUNC('month', CURRENT_DATE)
    ),
    credit_stats AS (
        SELECT COALESCE(SUM(amount - paid_amount), 0) as outstanding
        FROM credit
        WHERE business_id = p_business_id
        AND status IN ('pending', 'partial')
    ),
    appointment_stats AS (
        SELECT COUNT(*) as upcoming_count
        FROM appointments
        WHERE business_id = p_business_id
        AND status = 'pending'
        AND appointment_date >= CURRENT_DATE
        AND appointment_date <= CURRENT_DATE + INTERVAL '30 days'
    )
    SELECT 
        ts.total_count,
        es.total_count,
        cs.outstanding,
        apt.upcoming_count,
        ts.revenue - es.total_amount,
        ts.revenue,
        es.total_amount
    FROM transaction_stats ts, expense_stats es, credit_stats cs, appointment_stats apt;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get monthly report v2 (new name to avoid conflicts)
CREATE OR REPLACE FUNCTION get_monthly_report_v2(
    p_business_id UUID,
    p_year INTEGER,
    p_month INTEGER
)
RETURNS TABLE(
  period TEXT,
  transactions BIGINT,
  expenses BIGINT,
  daily_breakdown JSON,
  net_profit DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    WITH monthly_transactions AS (
        SELECT 
            COUNT(*) as total_count,
            COALESCE(SUM(amount), 0) as total_amount,
            DATE(transaction_date) as tx_date
        FROM transactions
        WHERE business_id = p_business_id
        AND EXTRACT(YEAR FROM transaction_date) = p_year
        AND EXTRACT(MONTH FROM transaction_date) = p_month
        AND status = 'completed'
        GROUP BY DATE(transaction_date)
    ),
    monthly_expenses AS (
        SELECT 
            COUNT(*) as total_count,
            COALESCE(SUM(amount), 0) as total_amount,
            DATE(expense_date) as exp_date
        FROM expenses
        WHERE business_id = p_business_id
        AND EXTRACT(YEAR FROM expense_date) = p_year
        AND EXTRACT(MONTH FROM expense_date) = p_month
        GROUP BY DATE(expense_date)
    ),
    daily_breakdown AS (
        SELECT json_agg(
            json_build_object(
                'date', d.date,
                'transactions', COALESCE(tx.total_amount, 0),
                'expenses', COALESCE(exp.total_amount, 0),
                'net_profit', COALESCE(tx.total_amount, 0) - COALESCE(exp.total_amount, 0)
            )
        ) as breakdown
        FROM (
            SELECT generate_series(
                DATE(p_year || '-' || p_month || '-01'),
                DATE_TRUNC('month', DATE(p_year || '-' || p_month || '-01') + INTERVAL '1 month' - INTERVAL '1 day'),
                INTERVAL '1 day'
            )::date as date
        ) d
        LEFT JOIN monthly_transactions tx ON d.date = tx.tx_date
        LEFT JOIN monthly_expenses exp ON d.date = exp.exp_date
    ),
    totals AS (
        SELECT 
            COALESCE(SUM(total_count), 0) as total_transactions,
            COALESCE(SUM(total_amount), 0) as total_revenue
        FROM monthly_transactions
    ),
    expense_totals AS (
        SELECT 
            COALESCE(SUM(total_count), 0) as total_expenses_count,
            COALESCE(SUM(total_amount), 0) as total_expenses_amount
        FROM monthly_expenses
    )
    SELECT 
        p_year || '-' || LPAD(p_month::text, 2, '0'),
        totals.total_transactions,
        expense_totals.total_expenses_count,
        db.breakdown,
        totals.total_revenue - expense_totals.total_expenses_amount
    FROM totals, expense_totals, daily_breakdown db;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- Estimated Count Function (Avoid Full Table Scans)
-- =====================================================

-- Get estimated count using PostgreSQL statistics
CREATE OR REPLACE FUNCTION get_estimated_count(
    p_table_name TEXT,
    p_business_id UUID DEFAULT NULL
)
RETURNS TABLE(estimated_count BIGINT) AS $$
DECLARE
    v_schema_name TEXT := 'public';
    v_table_oid OID;
    v_estimated_rows BIGINT;
BEGIN
    -- Get table OID
    SELECT oid INTO v_table_oid
    FROM pg_class
    WHERE relname = p_table_name
    AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = v_schema_name);
    
    IF v_table_oid IS NULL THEN
        RAISE EXCEPTION 'Table % does not exist', p_table_name;
    END IF;
    
    -- Get estimated rows from pg_stats
    SELECT COALESCE(n_distinct * 1000, 1000) INTO v_estimated_rows
    FROM pg_stats
    WHERE schemaname = v_schema_name
    AND tablename = p_table_name
    AND attname = 'business_id';
    
    -- If no stats available, use reltuples as fallback
    IF v_estimated_rows IS NULL THEN
        SELECT reltuples INTO v_estimated_rows
        FROM pg_class
        WHERE oid = v_table_oid;
    END IF;
    
    -- Adjust for business_id filter
    IF p_business_id IS NOT NULL THEN
        -- Assume even distribution across businesses (rough estimate)
        v_estimated_rows := v_estimated_rows / 100; -- Assume ~100 businesses
    END IF;
    
    RETURN QUERY SELECT GREATEST(v_estimated_rows, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- Materialized Views for Performance
-- =====================================================

-- Daily transaction summaries materialized view
CREATE MATERIALIZED VIEW IF NOT EXISTS daily_transaction_summaries AS
SELECT 
    business_id,
    DATE(transaction_date) as date,
    COUNT(*) as transaction_count,
    COALESCE(SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END), 0) as revenue,
    COALESCE(SUM(amount), 0) as total_amount,
    COALESCE(AVG(amount), 0) as avg_amount,
    COUNT(DISTINCT customer_name) as unique_customers
FROM transactions
WHERE status = 'completed'
GROUP BY business_id, DATE(transaction_date);

-- Indexes for materialized view
CREATE INDEX IF NOT EXISTS idx_daily_summaries_business_date 
ON daily_transaction_summaries(business_id, date);

-- Monthly business metrics materialized view
CREATE MATERIALIZED VIEW IF NOT EXISTS monthly_business_metrics AS
SELECT 
    business_id,
    EXTRACT(YEAR FROM transaction_date) as year,
    EXTRACT(MONTH FROM transaction_date) as month,
    COUNT(*) as transaction_count,
    COALESCE(SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END), 0) as revenue,
    COALESCE(SUM(amount), 0) as total_amount,
    COALESCE(AVG(amount), 0) as avg_amount,
    COUNT(DISTINCT customer_name) as unique_customers,
    COUNT(DISTINCT DATE(transaction_date)) as active_days
FROM transactions
WHERE status = 'completed'
GROUP BY business_id, EXTRACT(YEAR FROM transaction_date), EXTRACT(MONTH FROM transaction_date);

-- Indexes for materialized view
CREATE INDEX IF NOT EXISTS idx_monthly_metrics_business_year_month 
ON monthly_business_metrics(business_id, year, month);

-- =====================================================
-- Materialized View Refresh Functions
-- =====================================================

-- Refresh daily transaction summaries
CREATE OR REPLACE FUNCTION refresh_daily_transaction_summaries()
RETURNS BOOLEAN AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY daily_transaction_summaries;
    RETURN TRUE;
EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Failed to refresh daily_transaction_summaries: %', SQLERRM;
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql;

-- Refresh monthly business metrics
CREATE OR REPLACE FUNCTION refresh_monthly_business_metrics()
RETURNS BOOLEAN AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY monthly_business_metrics;
    RETURN TRUE;
EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Failed to refresh monthly_business_metrics: %', SQLERRM;
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- Realtime-Specific Functions (Added for Phase 0 Integration)
-- =====================================================

-- Get pending transactions for realtime updates
CREATE OR REPLACE FUNCTION get_pending_realtime_transactions(p_business_id UUID, p_limit INTEGER DEFAULT 100)
RETURNS TABLE(
    id UUID,
    business_id UUID,
    amount DECIMAL,
    customer_name TEXT,
    transaction_date TIMESTAMP WITH TIME ZONE,
    status TEXT,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.id,
        t.business_id,
        t.amount,
        t.customer_name,
        t.transaction_date,
        t.status,
        t.created_at
    FROM transactions t
    WHERE t.business_id = p_business_id
    AND t.status IN ('pending', 'processing')
    ORDER BY t.created_at DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get pending expenses for realtime updates
CREATE OR REPLACE FUNCTION get_pending_realtime_expenses(p_business_id UUID, p_limit INTEGER DEFAULT 100)
RETURNS TABLE(
    id UUID,
    business_id UUID,
    amount DECIMAL,
    description TEXT,
    expense_date DATE,
    status TEXT,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.id,
        e.business_id,
        e.amount,
        e.description,
        e.expense_date,
        e.status,
        e.created_at
    FROM expenses e
    WHERE e.business_id = p_business_id
    AND e.status IN ('pending', 'processing')
    ORDER BY e.created_at DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- Grant Permissions
-- =====================================================

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION get_business_summary_v2(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_monthly_report_v2(UUID, INTEGER, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_estimated_count(TEXT, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION refresh_daily_transaction_summaries() TO authenticated;
GRANT EXECUTE ON FUNCTION refresh_monthly_business_metrics() TO authenticated;
GRANT EXECUTE ON FUNCTION get_pending_realtime_transactions(UUID, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_pending_realtime_expenses(UUID, INTEGER) TO authenticated;

-- Grant select permissions on materialized views
GRANT SELECT ON daily_transaction_summaries TO authenticated;
GRANT SELECT ON monthly_business_metrics TO authenticated;

-- Grant execute permissions to service role for admin operations
GRANT EXECUTE ON FUNCTION get_business_summary_v2(UUID) TO service_role;
GRANT EXECUTE ON FUNCTION get_monthly_report_v2(UUID, INTEGER, INTEGER) TO service_role;
GRANT EXECUTE ON FUNCTION get_estimated_count(TEXT, UUID) TO service_role;
GRANT EXECUTE ON FUNCTION refresh_daily_transaction_summaries() TO service_role;
GRANT EXECUTE ON FUNCTION refresh_monthly_business_metrics() TO service_role;
GRANT EXECUTE ON FUNCTION get_pending_realtime_transactions(UUID, INTEGER) TO service_role;
GRANT EXECUTE ON FUNCTION get_pending_realtime_expenses(UUID, INTEGER) TO service_role;

-- Grant select permissions on materialized views to service role
GRANT SELECT ON daily_transaction_summaries TO service_role;
GRANT SELECT ON monthly_business_metrics TO service_role;

-- =====================================================
-- Create Indexes for Realtime Optimization (Phase 0 Integration)
-- =====================================================

-- Realtime-specific indexes for pending status queries
CREATE INDEX IF NOT EXISTS idx_transactions_realtime 
ON transactions(business_id, status) 
WHERE status IN ('pending', 'processing');

CREATE INDEX IF NOT EXISTS idx_expenses_realtime 
ON expenses(business_id, status) 
WHERE status IN ('pending', 'processing');

-- User-based filtering index for realtime
CREATE INDEX IF NOT EXISTS idx_transactions_user_realtime 
ON transactions(business_id, customer_name, status) 
WHERE status IN ('pending', 'processing');
