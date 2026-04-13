-- Migration: Kyshi Payment Link Integration Schema
-- Created: 2025-04-13
-- Purpose: Support new payment link flow with webhook confirmation

-- Create transactions table for payment link flow
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reference TEXT NOT NULL UNIQUE,
  payment_link_code TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  local_currency TEXT NOT NULL CHECK (local_currency IN ('KES', 'GHS', 'XOF')),
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'SUCCESSFUL', 'FAILED', 'TIMEOUT')),
  amount DECIMAL(10,2),
  local_amount DECIMAL(10,2),
  fx_rate DECIMAL(10,6),
  fees DECIMAL(10,2) DEFAULT 0,
  authorization_url TEXT,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  webhook_data JSONB
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_transactions_reference ON public.transactions(reference);
CREATE INDEX IF NOT EXISTS idx_transactions_customer_email ON public.transactions(customer_email);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON public.transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON public.transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_transactions_local_currency ON public.transactions(local_currency);

-- Create webhook logs table for debugging
CREATE TABLE IF NOT EXISTS public.kyshi_webhook_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  reference TEXT,
  payload JSONB NOT NULL,
  processed BOOLEAN DEFAULT FALSE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for webhook logs
CREATE INDEX IF NOT EXISTS idx_kyshi_webhook_logs_event_type ON public.kyshi_webhook_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_kyshi_webhook_logs_reference ON public.kyshi_webhook_logs(reference);
CREATE INDEX IF NOT EXISTS idx_kyshi_webhook_logs_created_at ON public.kyshi_webhook_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_kyshi_webhook_logs_processed ON public.kyshi_webhook_logs(processed);

-- Add RLS (Row Level Security) policies
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kyshi_webhook_logs ENABLE ROW LEVEL SECURITY;

-- Policy for transactions table (read-only for authenticated users)
CREATE POLICY "Users can view own transactions" ON public.transactions
  FOR SELECT USING (
    auth.uid() IS NOT NULL AND 
    customer_email = (
      SELECT email FROM public.businesses WHERE id = auth.uid()
    )
  );

-- Policy for webhook logs (service role only)
CREATE POLICY "Service role full access to webhook logs" ON public.kyshi_webhook_logs
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'service_role'
  );

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER handle_transactions_updated_at
  BEFORE UPDATE ON public.transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Grant permissions
GRANT ALL ON public.transactions TO authenticated;
GRANT ALL ON public.transactions TO service_role;
GRANT SELECT ON public.transactions TO anon;

GRANT ALL ON public.kyshi_webhook_logs TO service_role;
GRANT SELECT ON public.kyshi_webhook_logs TO authenticated;

-- Create view for transaction analytics
CREATE OR REPLACE VIEW public.transaction_analytics AS
SELECT 
  DATE_TRUNC('day', created_at) as date,
  local_currency,
  status,
  COUNT(*) as transaction_count,
  SUM(amount) as total_amount,
  SUM(fees) as total_fees,
  AVG(amount) as average_amount
FROM public.transactions
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE_TRUNC('day', created_at), local_currency, status
ORDER BY date DESC;

-- Grant access to analytics view
GRANT SELECT ON public.transaction_analytics TO authenticated;
GRANT SELECT ON public.transaction_analytics TO service_role;

-- Comments for documentation
COMMENT ON TABLE public.transactions IS 'Stores payment transactions from Kyshi payment link flow';
COMMENT ON COLUMN public.transactions.reference IS 'Unique transaction reference from Kyshi';
COMMENT ON COLUMN public.transactions.payment_link_code IS 'The payment link code used to initiate payment';
COMMENT ON COLUMN public.transactions.local_currency IS 'Local currency: KES, GHS, or XOF';
COMMENT ON COLUMN public.transactions.status IS 'Payment status: PENDING, SUCCESSFUL, FAILED, TIMEOUT';
COMMENT ON COLUMN public.transactions.webhook_data IS 'Full webhook response for debugging';

COMMENT ON TABLE public.kyshi_webhook_logs IS 'Logs all incoming Kyshi webhooks for debugging';
COMMENT ON COLUMN public.kyshi_webhook_logs.event_type IS 'Webhook event type (successful, failed, etc.)';
COMMENT ON COLUMN public.kyshi_webhook_logs.processed IS 'Whether the webhook was processed successfully';

COMMENT ON VIEW public.transaction_analytics IS 'Analytics view for transaction reporting';
