-- Add Stripe support to payment gateway
-- Updates payment_gateway check constraint to include 'stripe'

-- Drop existing check constraint
ALTER TABLE subscription_payments 
DROP CONSTRAINT IF EXISTS subscription_payments_payment_gateway_check;

-- Add new constraint with Stripe support
ALTER TABLE subscription_payments 
ADD CONSTRAINT subscription_payments_payment_gateway_check 
CHECK (payment_gateway IN ('payfast', 'yoco', 'manual', 'stripe'));

-- Update payment_methods gateway constraint to include Stripe
ALTER TABLE payment_methods 
DROP CONSTRAINT IF EXISTS payment_methods_gateway_check;

ALTER TABLE payment_methods 
ADD CONSTRAINT payment_methods_gateway_check 
CHECK (gateway IN ('payfast', 'yoco', 'stripe'));

-- Add Stripe-specific columns to subscription_payments if needed
-- (stripe_subscription_id, stripe_customer_id, etc. can be stored in metadata JSONB)

