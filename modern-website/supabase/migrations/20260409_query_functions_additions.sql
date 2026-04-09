-- =====================================================
-- Phase 2: Additional Query Optimization Functions
-- Adds new functions for 50k user scaling
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- =====================================================
-- New Functions Only (avoiding conflicts with existing functions)
-- =====================================================

-- Get business summary with all metrics (new function name)
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

-- Get monthly report data (new function name)
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
-- Customer Analytics Functions
-- =====================================================

-- Get customer analytics with top customers
CREATE OR REPLACE FUNCTION get_customer_analytics(p_business_id UUID, p_limit INTEGER DEFAULT 50)
RETURNS TABLE(
  summary JSON,
  top_customers JSON
) AS $$
BEGIN
    RETURN QUERY
    WITH customer_stats AS (
        SELECT 
            customer_name,
            COUNT(*) as transaction_count,
            COALESCE(SUM(amount), 0) as total_spent,
            MAX(transaction_date) as last_transaction,
            AVG(amount) as avg_transaction
        FROM transactions
        WHERE business_id = p_business_id
        AND status = 'completed'
        AND customer_name IS NOT NULL
        GROUP BY customer_name
    ),
    summary_stats AS (
        SELECT 
            json_build_object(
                'total_customers', COUNT(*),
                'total_transactions', SUM(transaction_count),
                'total_revenue', SUM(total_spent),
                'avg_customer_value', AVG(total_spent),
                'repeat_customers', COUNT(*) FILTER (WHERE transaction_count > 1)
            ) as summary
        FROM customer_stats
    ),
    top_customers AS (
        SELECT json_agg(
            json_build_object(
                'customer_name', customer_name,
                'transaction_count', transaction_count,
                'total_spent', total_spent,
                'last_transaction', last_transaction,
                'avg_transaction', avg_transaction
            ) ORDER BY total_spent DESC
        ) as top_customers
        FROM (
            SELECT * FROM customer_stats
            ORDER BY total_spent DESC
            LIMIT p_limit
        ) top
    )
    SELECT ss.summary, tc.top_customers
    FROM summary_stats ss, top_customers tc;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- Quick Stats Function
-- =====================================================

-- Get quick stats for monitoring dashboard
CREATE OR REPLACE FUNCTION get_quick_stats(p_business_id UUID)
RETURNS TABLE(
  total_transactions BIGINT,
  total_expenses BIGINT,
  total_appointments BIGINT,
  total_credit DECIMAL,
  today_activity JSON,
  upcoming_appointments BIGINT,
  outstanding_credit DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    WITH transaction_stats AS (
        SELECT COUNT(*) as total_count
        FROM transactions
        WHERE business_id = p_business_id
    ),
    expense_stats AS (
        SELECT COUNT(*) as total_count
        FROM expenses
        WHERE business_id = p_business_id
    ),
    appointment_stats AS (
        SELECT COUNT(*) as total_count
        FROM appointments
        WHERE business_id = p_business_id
    ),
    credit_stats AS (
        SELECT COALESCE(SUM(amount), 0) as total_credit
        FROM credit
        WHERE business_id = p_business_id
    ),
    today_activity AS (
        SELECT json_build_object(
            'transactions_today', tx_count.today_count,
            'expenses_today', exp_count.today_count,
            'revenue_today', COALESCE(SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END), 0)
        ) as activity
        FROM (
            SELECT COUNT(*) as today_count
            FROM transactions
            WHERE business_id = p_business_id
            AND DATE(transaction_date) = CURRENT_DATE
        ) tx_count,
        (
            SELECT COUNT(*) as today_count
            FROM expenses
            WHERE business_id = p_business_id
            AND DATE(expense_date) = CURRENT_DATE
        ) exp_count,
        transactions
        WHERE business_id = p_business_id
        AND DATE(transaction_date) = CURRENT_DATE
    ),
    upcoming_appt_stats AS (
        SELECT COUNT(*) as upcoming_count
        FROM appointments
        WHERE business_id = p_business_id
        AND status = 'pending'
        AND appointment_date >= CURRENT_DATE
        AND appointment_date <= CURRENT_DATE + INTERVAL '30 days'
    ),
    outstanding_credit_stats AS (
        SELECT COALESCE(SUM(amount - paid_amount), 0) as outstanding
        FROM credit
        WHERE business_id = p_business_id
        AND status IN ('pending', 'partial')
    )
    SELECT 
        ts.total_count,
        es.total_count,
        apt.total_count,
        cs.total_credit,
        ta.activity,
        uas.upcoming_count,
        ocs.outstanding
    FROM transaction_stats ts, expense_stats es, appointment_stats apt,
         credit_stats cs, today_activity ta, upcoming_appt_stats uas,
         outstanding_credit_stats ocs;
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
    v_where_clause TEXT := '';
BEGIN
    -- Get table OID
    SELECT oid INTO v_table_oid
    FROM pg_class
    WHERE relname = p_table_name
    AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = v_schema_name);
    
    IF v_table_oid IS NULL THEN
        RAISE EXCEPTION 'Table % does not exist', p_table_name;
    END IF;
    
    -- Build WHERE clause if business_id is provided
    IF p_business_id IS NOT NULL THEN
        v_where_clause := 'business_id = ''' || p_business_id::TEXT || '''';
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
        -- This is a heuristic - in production you'd want better statistics
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
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON daily_transaction_summaries TO authenticated;
GRANT SELECT ON monthly_business_metrics TO authenticated;

-- Grant execute permissions to service role for admin operations
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO service_role;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO service_role;

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
