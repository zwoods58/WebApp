-- First, ensure all required columns exist in the users table
DO $$ 
BEGIN
  -- Add full_name if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'full_name'
  ) THEN
    ALTER TABLE public.users ADD COLUMN full_name TEXT;
  END IF;

  -- Add email if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'email'
  ) THEN
    ALTER TABLE public.users ADD COLUMN email TEXT;
  END IF;

  -- Add country_code if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'country_code'
  ) THEN
    ALTER TABLE public.users ADD COLUMN country_code TEXT NOT NULL DEFAULT 'KE' CHECK (country_code IN ('KE', 'ZA', 'NG'));
  END IF;

  -- Add is_active if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'is_active'
  ) THEN
    ALTER TABLE public.users ADD COLUMN is_active BOOLEAN DEFAULT true;
  END IF;
END $$;

-- Now ensure all required columns exist in the transactions table
DO $$ 
BEGIN
  -- Add status if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'transactions' AND column_name = 'status'
  ) THEN
    ALTER TABLE public.transactions ADD COLUMN status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'cancelled'));
  END IF;

  -- Add amount if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'transactions' AND column_name = 'amount'
  ) THEN
    ALTER TABLE public.transactions ADD COLUMN amount DECIMAL(12,2) DEFAULT 0.00;
  END IF;

  -- Add currency if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'transactions' AND column_name = 'currency'
  ) THEN
    ALTER TABLE public.transactions ADD COLUMN currency TEXT DEFAULT 'KES';
  END IF;

  -- Add gross_amount if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'transactions' AND column_name = 'gross_amount'
  ) THEN
    ALTER TABLE public.transactions ADD COLUMN gross_amount DECIMAL(12,2) DEFAULT 0.00;
  END IF;

  -- Add tax_amount if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'transactions' AND column_name = 'tax_amount'
  ) THEN
    ALTER TABLE public.transactions ADD COLUMN tax_amount DECIMAL(12,2) DEFAULT 0.00;
  END IF;

  -- Add net_amount if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'transactions' AND column_name = 'net_amount'
  ) THEN
    ALTER TABLE public.transactions ADD COLUMN net_amount DECIMAL(12,2) DEFAULT 0.00;
  END IF;

  -- Add tax_rate if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'transactions' AND column_name = 'tax_rate'
  ) THEN
    ALTER TABLE public.transactions ADD COLUMN tax_rate DECIMAL(5,2) DEFAULT 0.00;
  END IF;

  -- Add payment_provider if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'transactions' AND column_name = 'payment_provider'
  ) THEN
    ALTER TABLE public.transactions ADD COLUMN payment_provider TEXT;
  END IF;

  -- Add dlocal_payment_id if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'transactions' AND column_name = 'dlocal_payment_id'
  ) THEN
    ALTER TABLE public.transactions ADD COLUMN dlocal_payment_id TEXT;
  END IF;

  -- Add order_id if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'transactions' AND column_name = 'order_id'
  ) THEN
    ALTER TABLE public.transactions ADD COLUMN order_id TEXT;
  END IF;

  -- Add description if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'transactions' AND column_name = 'description'
  ) THEN
    ALTER TABLE public.transactions ADD COLUMN description TEXT;
  END IF;

  -- Add paid_at if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'transactions' AND column_name = 'paid_at'
  ) THEN
    ALTER TABLE public.transactions ADD COLUMN paid_at TIMESTAMP WITH TIME ZONE;
  END IF;

  -- Add failed_at if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'transactions' AND column_name = 'failed_at'
  ) THEN
    ALTER TABLE public.transactions ADD COLUMN failed_at TIMESTAMP WITH TIME ZONE;
  END IF;

  -- Add created_at if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'transactions' AND column_name = 'created_at'
  ) THEN
    ALTER TABLE public.transactions ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;
END $$;

-- Now create the admin dashboard tables

-- Create user revenue statistics table
CREATE TABLE IF NOT EXISTS user_revenue_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  country_code TEXT NOT NULL CHECK (country_code IN ('KE', 'ZA', 'NG')),
  total_revenue DECIMAL(12,2) DEFAULT 0.00,
  transaction_count INTEGER DEFAULT 0,
  first_transaction_date TIMESTAMP WITH TIME ZONE,
  last_transaction_date TIMESTAMP WITH TIME ZONE,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin audit log table
CREATE TABLE IF NOT EXISTS admin_audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_user_id UUID,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create system metrics table
CREATE TABLE IF NOT EXISTS system_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_name TEXT NOT NULL,
  metric_value DECIMAL(12,2),
  metric_unit TEXT,
  country_code TEXT,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payment provider performance table
CREATE TABLE IF NOT EXISTS payment_provider_performance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_name TEXT NOT NULL,
  country_code TEXT NOT NULL,
  total_requests INTEGER DEFAULT 0,
  successful_requests INTEGER DEFAULT 0,
  failed_requests INTEGER DEFAULT 0,
  success_rate DECIMAL(5,2),
  average_response_time_ms INTEGER,
  total_volume DECIMAL(12,2),
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced transactions view with admin data
CREATE OR REPLACE VIEW vw_admin_transactions AS
SELECT 
  t.id,
  t.user_id,
  u.full_name,
  u.email,
  u.country_code,
  t.amount,
  t.currency,
  t.gross_amount,
  t.tax_amount,
  t.net_amount,
  t.tax_rate,
  t.status,
  t.payment_provider,
  t.dlocal_payment_id,
  t.order_id,
  t.description,
  t.created_at,
  t.paid_at,
  t.failed_at,
  CASE 
    WHEN t.status = 'paid' THEN 
      EXTRACT(EPOCH FROM (t.paid_at - t.created_at)) / 60
    ELSE NULL 
  END as processing_time_minutes,
  CASE 
    WHEN t.amount < 10 THEN 'micro'
    WHEN t.amount < 100 THEN 'small'
    WHEN t.amount < 1000 THEN 'medium'
    ELSE 'large'
  END as transaction_size_category
FROM 
  transactions t
JOIN users u ON t.user_id = u.id;

-- Country performance metrics view
CREATE OR REPLACE VIEW vw_country_performance AS
SELECT 
  u.country_code,
  COUNT(t.id) as total_transactions,
  SUM(CASE WHEN t.status = 'paid' THEN t.gross_amount ELSE 0 END) as gross_revenue,
  SUM(CASE WHEN t.status = 'paid' THEN t.tax_amount ELSE 0 END) as total_tax,
  SUM(CASE WHEN t.status = 'paid' THEN t.net_amount ELSE 0 END) as net_revenue,
  AVG(CASE WHEN t.status = 'paid' THEN 
    EXTRACT(EPOCH FROM (t.paid_at - t.created_at)) / 60 
    ELSE NULL 
  END) as avg_processing_time_minutes,
  COUNT(CASE WHEN t.status = 'failed' THEN 1 END) as failed_transactions,
  COUNT(CASE WHEN t.status = 'paid' THEN 1 END) as successful_transactions,
  CASE 
    WHEN COUNT(t.id) > 0 
    THEN (COUNT(CASE WHEN t.status = 'paid' THEN 1 END) * 100.0 / COUNT(t.id))
    ELSE 0 
  END as success_rate,
  MIN(t.created_at) as first_transaction,
  MAX(t.created_at) as last_transaction,
  COUNT(DISTINCT t.user_id) as unique_users
FROM 
  users u
LEFT JOIN transactions t ON u.id = t.user_id
GROUP BY 
  u.country_code;

-- Real-time dashboard metrics
CREATE OR REPLACE VIEW vw_dashboard_metrics AS
SELECT 
  'total_users' as metric_name,
  COUNT(DISTINCT u.id)::DECIMAL as metric_value,
  'count' as metric_unit,
  NULL as country_code,
  NOW() as recorded_at
FROM users u

UNION ALL

SELECT 
  'total_revenue_' || COALESCE(t.currency, 'UNKNOWN') as metric_name,
  COALESCE(SUM(t.gross_amount), 0)::DECIMAL as metric_value,
  COALESCE(t.currency, 'UNKNOWN') as metric_unit,
  NULL as country_code,
  NOW() as recorded_at
FROM transactions t
WHERE t.status = 'paid'
GROUP BY t.currency

UNION ALL

SELECT 
  'active_users_today' as metric_name,
  COUNT(DISTINCT u.id)::DECIMAL as metric_value,
  'count' as metric_unit,
  NULL as country_code,
  NOW() as recorded_at
FROM users u
WHERE EXISTS (
  SELECT 1 FROM transactions t 
  WHERE t.user_id = u.id 
  AND DATE(t.created_at) = CURRENT_DATE
)

UNION ALL

SELECT 
  'failed_payments_today' as metric_name,
  COUNT(t.id)::DECIMAL as metric_value,
  'count' as metric_unit,
  NULL as country_code,
  NOW() as recorded_at
FROM transactions t
WHERE t.status = 'failed' 
AND DATE(t.created_at) = CURRENT_DATE;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_revenue_stats_user_country ON user_revenue_stats(user_id, country_code);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_admin_user ON admin_audit_log(admin_user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_system_metrics_name_date ON system_metrics(metric_name, recorded_at);
CREATE INDEX IF NOT EXISTS idx_payment_provider_performance ON payment_provider_performance(provider_name, country_code, recorded_at);

-- Add indexes for transactions table
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_transactions_user_status ON transactions(user_id, status);

-- Row Level Security for admin tables
ALTER TABLE user_revenue_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_provider_performance ENABLE ROW LEVEL SECURITY;

-- RLS Policies (only admin users can access)
CREATE POLICY "Admins can view all revenue stats" ON user_revenue_stats
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can view all audit logs" ON admin_audit_log
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can view all system metrics" ON system_metrics
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can view all performance data" ON payment_provider_performance
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Comments for documentation
COMMENT ON TABLE user_revenue_stats IS 'Tracks revenue and transaction statistics per user by country';
COMMENT ON TABLE admin_audit_log IS 'Audit log for all admin actions and changes';
COMMENT ON TABLE system_metrics IS 'System-wide metrics for monitoring and analytics';
COMMENT ON TABLE payment_provider_performance IS 'Performance metrics for payment providers by country';
COMMENT ON VIEW vw_admin_transactions IS 'Enhanced transactions view with admin-specific calculations and categorizations';
COMMENT ON VIEW vw_country_performance IS 'Country-specific performance metrics and KPIs';
COMMENT ON VIEW vw_dashboard_metrics IS 'Real-time dashboard metrics for admin interface';