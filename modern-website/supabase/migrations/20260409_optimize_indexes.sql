-- Database Index Optimization Migration
-- Phase 1: Database Schema Optimization
-- Creates performance indexes for 50k user scalability

-- Core business_id indexes for all main tables
CREATE INDEX IF NOT EXISTS idx_transactions_business_id ON transactions(business_id);
CREATE INDEX IF NOT EXISTS idx_expenses_business_id ON expenses(business_id);
CREATE INDEX IF NOT EXISTS idx_appointments_business_id ON appointments(business_id);
CREATE INDEX IF NOT EXISTS idx_credit_business_id ON credit(business_id);
CREATE INDEX IF NOT EXISTS idx_inventory_business_id ON inventory(business_id);

-- Composite indexes for dashboard queries (business + date)
CREATE INDEX IF NOT EXISTS idx_transactions_business_date ON transactions(business_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_expenses_business_date ON expenses(business_id, expense_date DESC);
CREATE INDEX IF NOT EXISTS idx_appointments_business_date ON appointments(business_id, appointment_date DESC);
CREATE INDEX IF NOT EXISTS idx_credit_business_date ON credit(business_id, date_given DESC);

-- Status filtering indexes for common queries
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_business_status ON transactions(business_id, status);
CREATE INDEX IF NOT EXISTS idx_expenses_business_category ON expenses(business_id, category);
CREATE INDEX IF NOT EXISTS idx_appointments_business_status ON appointments(business_id, status);
CREATE INDEX IF NOT EXISTS idx_credit_business_status ON credit(business_id, status);
CREATE INDEX IF NOT EXISTS idx_inventory_business_category ON inventory(business_id, category);

-- User lookup indexes for phone/email authentication
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_business_members_user_id ON business_members(user_id);
CREATE INDEX IF NOT EXISTS idx_business_members_business_id ON business_members(business_id);

-- Realtime-specific indexes for pending status queries
CREATE INDEX IF NOT EXISTS idx_transactions_realtime ON transactions(business_id, status) 
WHERE status IN ('pending', 'processing');
CREATE INDEX IF NOT EXISTS idx_expenses_realtime ON expenses(business_id) 
WHERE expense_date >= NOW() - INTERVAL '7 days';
CREATE INDEX IF NOT EXISTS idx_transactions_user_realtime ON transactions(business_id, created_by) 
WHERE created_at >= NOW() - INTERVAL '24 hours';

-- Performance indexes for high-volume queries
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_expenses_created_at ON expenses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_appointments_created_at ON appointments(created_at DESC);

-- Calendar/appointment specific indexes
CREATE INDEX IF NOT EXISTS idx_appointments_date_time ON appointments(appointment_date, appointment_time);
CREATE INDEX IF NOT EXISTS idx_appointments_customer ON appointments(customer_name);
CREATE INDEX IF NOT EXISTS idx_appointments_service ON appointments(service_id);

-- Inventory management indexes
CREATE INDEX IF NOT EXISTS idx_inventory_threshold ON inventory(business_id, quantity, threshold);
CREATE INDEX IF NOT EXISTS idx_inventory_supplier ON inventory(business_id, supplier);
CREATE INDEX IF NOT EXISTS idx_inventory_category ON inventory(business_id, category);

-- Credit management indexes
CREATE INDEX IF NOT EXISTS idx_credit_customer_phone ON credit(business_id, customer_phone);
CREATE INDEX IF NOT EXISTS idx_credit_due_date ON credit(business_id, due_date) 
WHERE due_date IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_credit_status_amount ON credit(business_id, status, amount);

-- Analytics and reporting indexes
CREATE INDEX IF NOT EXISTS idx_transactions_monthly ON transactions(business_id, DATE_TRUNC('month', date));
CREATE INDEX IF NOT EXISTS idx_expenses_monthly ON expenses(business_id, DATE_TRUNC('month', expense_date));
CREATE INDEX IF NOT EXISTS idx_credit_monthly ON credit(business_id, DATE_TRUNC('month', date_given));

-- Full-text search indexes (if needed)
CREATE INDEX IF NOT EXISTS idx_transactions_search ON transactions USING gin(to_tsvector('english', description || ' ' || COALESCE(customer_id::text, '')));
CREATE INDEX IF NOT EXISTS idx_expenses_search ON expenses USING gin(to_tsvector('english', description || ' ' || COALESCE(category, '')));

-- Operation queue indexes for offline sync
CREATE INDEX IF NOT EXISTS idx_operations_queue_business ON operations_queue(businessId, status);
CREATE INDEX IF NOT EXISTS idx_operations_queue_status_timestamp ON operations_queue(status, timestamp);

-- Partial indexes for common filtered queries
CREATE INDEX IF NOT EXISTS idx_transactions_active ON transactions(business_id, created_at) 
WHERE created_at >= NOW() - INTERVAL '90 days';
CREATE INDEX IF NOT EXISTS idx_expenses_recent ON expenses(business_id, expense_date) 
WHERE expense_date >= NOW() - INTERVAL '90 days';

-- Business member lookup optimization
CREATE INDEX IF NOT EXISTS idx_business_members_lookup ON business_members(user_id, business_id, role);

-- Session and authentication indexes
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id, expires_at);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);

-- Rate limiting indexes
CREATE INDEX IF NOT EXISTS idx_rate_limit_identifier ON rate_limit(identifier, created_at);

-- Comments for documentation
COMMENT ON INDEX idx_transactions_business_id IS 'Primary index for transaction queries by business';
COMMENT ON INDEX idx_transactions_business_date IS 'Dashboard queries with date filtering';
COMMENT ON INDEX idx_transactions_realtime IS 'Realtime queries for pending transactions';
COMMENT ON INDEX idx_users_phone IS 'User authentication by phone';
COMMENT ON INDEX idx_users_email IS 'User authentication by email';
COMMENT ON INDEX idx_business_members_user_id IS 'Business member lookups';
COMMENT ON INDEX idx_appointments_date_time IS 'Calendar scheduling queries';
COMMENT ON INDEX idx_inventory_threshold IS 'Stock level alerts';
COMMENT ON INDEX idx_credit_due_date IS 'Credit due date tracking';
COMMENT ON INDEX idx_transactions_monthly IS 'Monthly reporting analytics';

-- Create index usage monitoring view
CREATE OR REPLACE VIEW index_usage_stats AS
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan as scans,
    idx_tup_read as tuples_read,
    idx_tup_fetch as tuples_fetched,
    pg_size_pretty(pg_relation_size(indexrelid)) as index_size
FROM pg_stat_user_indexes 
ORDER BY idx_scan DESC;

-- Create missing indexes suggestion view
CREATE OR REPLACE VIEW missing_indexes AS
SELECT 
    schemaname,
    tablename,
    attname,
    n_distinct,
    correlation
FROM pg_stats 
WHERE schemaname = 'public' 
    AND tablename IN ('transactions', 'expenses', 'appointments', 'credit', 'inventory', 'businesses', 'users')
    AND n_distinct > 100
ORDER BY n_distinct DESC;

-- Grant permissions for monitoring views
GRANT SELECT ON index_usage_stats TO authenticated;
GRANT SELECT ON missing_indexes TO authenticated;
GRANT SELECT ON index_usage_stats TO service_role;
GRANT SELECT ON missing_indexes TO service_role;
