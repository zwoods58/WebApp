# Beezee Database Schema Testing Guide

## 🧪 Testing Plan

This guide will help you test the complete database schema implementation to ensure everything is working correctly.

---

## Step 1: Test Business Creation & Business ID Generation

### 1.1 Create Test Businesses

Let's create businesses in different countries and industries to test the business ID system:

```sql
-- Test Kenya Retail Business
INSERT INTO businesses (phone_number, business_name, country, industry)
VALUES ('+254711111111', 'Kenya Retail Store', 'Kenya', 'retail')
RETURNING id, business_id, country_code, industry_code, home_currency;

-- Test Nigeria Salon Business  
INSERT INTO businesses (phone_number, business_name, country, industry)
VALUES ('+2348022222222', 'Nigeria Beauty Salon', 'Nigeria', 'salon')
RETURNING id, business_id, country_code, industry_code, home_currency;

-- Test South Africa Repairs Business
INSERT INTO businesses (phone_number, business_name, country, industry)
VALUES ('+27833333333', 'SA Auto Repairs', 'South Africa', 'repairs')
RETURNING id, business_id, country_code, industry_code, home_currency;
```

**Expected Results:**
- Kenya Retail: `KE-RT-XXXXXXX` with `KES` currency
- Nigeria Salon: `NG-SL-XXXXXXX` with `NGN` currency  
- South Africa Repairs: `ZA-RP-XXXXXXX` with `ZAR` currency

---

## Step 2: Test Multi-Currency Transactions

### 2.1 Add Transactions in Different Currencies

```sql
-- Add transaction for Kenya Retail (KES)
INSERT INTO transactions (
  business_id, industry, amount, currency, category, description, transaction_date
)
VALUES (
  (SELECT id FROM businesses WHERE phone_number = '+254711111111'),
  'retail', 5000.00, 'KES', 'Sales', 'Product sale to customer', CURRENT_DATE
)
RETURNING id, amount, currency, amount_home, exchange_rate;

-- Add transaction for Nigeria Salon (NGN)
INSERT INTO transactions (
  business_id, industry, amount, currency, category, description, transaction_date
)
VALUES (
  (SELECT id FROM businesses WHERE phone_number = '+2348022222222'),
  'salon', 15000.00, 'NGN', 'Services', 'Hair styling service', CURRENT_DATE
)
RETURNING id, amount, currency, amount_home, exchange_rate;

-- Add transaction for SA Repairs (ZAR)
INSERT INTO transactions (
  business_id, industry, amount, currency, category, description, transaction_date
)
VALUES (
  (SELECT id FROM businesses WHERE phone_number = '+27833333333'),
  'repairs', 1200.00, 'ZAR', 'Services', 'Car repair service', CURRENT_DATE
)
RETURNING id, amount, currency, amount_home, exchange_rate;
```

---

## Step 3: Test Row Level Security (RLS)

### 3.1 Test Business Data Isolation

We'll test that each business can only see their own data:

```sql
-- Set context for Kenya Retail Business
SELECT set_business_context(
  (SELECT id FROM businesses WHERE phone_number = '+254711111111'),
  'KE',
  'retail'
);

-- Query transactions - Should only show Kenya Retail transactions
SELECT 
  t.id, 
  t.amount, 
  t.currency,
  b.business_name,
  b.country
FROM transactions t
JOIN businesses b ON t.business_id = b.id;

-- Set context for Nigeria Salon Business  
SELECT set_business_context(
  (SELECT id FROM businesses WHERE phone_number = '+2348022222222'),
  'NG',
  'salon'
);

-- Query transactions - Should only show Nigeria Salon transactions
SELECT 
  t.id, 
  t.amount, 
  t.currency,
  b.business_name,
  b.country
FROM transactions t
JOIN businesses b ON t.business_id = b.id;
```

**Expected Results:** Each query should only return transactions for that specific business.

---

## Step 4: Test Beehive Country/Industry Filtering

### 4.1 Create Beehive Requests

```sql
-- Kenya Retail Request
INSERT INTO beehive_requests (
  business_id, country, industry, title, description, category
)
VALUES (
  (SELECT id FROM businesses WHERE phone_number = '+254711111111'),
  'KE', 'retail', 
  'Need better inventory tracking', 
  'Would like to see barcode scanning feature', 
  'Feature Request'
)
RETURNING id, country, industry, title;

-- Nigeria Salon Request
INSERT INTO beehive_requests (
  business_id, country, industry, title, description, category
)
VALUES (
  (SELECT id FROM businesses WHERE phone_number = '+2348022222222'),
  'NG', 'salon',
  'Appointment reminders needed',
  'SMS reminders for upcoming appointments',
  'Feature Request'
)
RETURNING id, country, industry, title;

-- South Africa Repairs Request  
INSERT INTO beehive_requests (
  business_id, country, industry, title, description, category
)
VALUES (
  (SELECT id FROM businesses WHERE phone_number = '+27833333333'),
  'ZA', 'repairs',
  'Parts inventory management',
  'Need to track auto parts stock',
  'Feature Request'
)
RETURNING id, country, industry, title;
```

### 4.2 Test Beehive Filtering

```sql
-- Set context for Kenya Retail
SELECT set_business_context(
  (SELECT id FROM businesses WHERE phone_number = '+254711111111'),
  'KE',
  'retail'
);

-- Should see only Kenya + Retail requests
SELECT id, country, industry, title FROM beehive_requests;

-- Set context for Nigeria Salon
SELECT set_business_context(
  (SELECT id FROM businesses WHERE phone_number = '+2348022222222'),
  'NG', 
  'salon'
);

-- Should see only Nigeria + Salon requests
SELECT id, country, industry, title FROM beehive_requests;
```

**Expected Results:** Each query should only show requests from their country AND industry.

---

## Step 5: Test Voting and Comments

### 5.1 Test Voting System

```sql
-- Set context for Kenya Retail
SELECT set_business_context(
  (SELECT id FROM businesses WHERE phone_number = '+254711111111'),
  'KE',
  'retail'
);

-- Vote on their own request
INSERT INTO beehive_votes (request_id, business_id, vote_type)
VALUES (
  (SELECT id FROM beehive_requests WHERE country = 'KE' AND industry = 'retail'),
  (SELECT id FROM businesses WHERE phone_number = '+254711111111'),
  'upvote'
);

-- Check upvote count
SELECT id, title, upvotes FROM beehive_requests WHERE country = 'KE' AND industry = 'retail';
```

### 5.2 Test Comments

```sql
-- Add comment to Kenya Retail request
INSERT INTO beehive_comments (
  request_id, business_id, comment_text
)
VALUES (
  (SELECT id FROM beehive_requests WHERE country = 'KE' AND industry = 'retail'),
  (SELECT id FROM businesses WHERE phone_number = '+254711111111'),
  'This would really help our business!'
);

-- View comments
SELECT 
  c.comment_text, 
  b.business_name,
  c.created_at
FROM beehive_comments c
JOIN businesses b ON c.business_id = b.id
WHERE c.request_id = (SELECT id FROM beehive_requests WHERE country = 'KE' AND industry = 'retail');
```

---

## Step 6: Test Soft Deletes

### 6.1 Test Transaction Soft Delete

```sql
-- Set context for Kenya Retail
SELECT set_business_context(
  (SELECT id FROM businesses WHERE phone_number = '+254711111111'),
  'KE',
  'retail'
);

-- Soft delete a transaction
UPDATE transactions 
SET deleted_at = NOW(), deleted_by = (SELECT id FROM businesses WHERE phone_number = '+254711111111')
WHERE business_id = (SELECT id FROM businesses WHERE phone_number = '+254711111111')
LIMIT 1;

-- Query transactions - should not show deleted record
SELECT id, amount, deleted_at FROM transactions;

-- Query all records including deleted (admin view)
SELECT id, amount, deleted_at FROM transactions WHERE business_id = (SELECT id FROM businesses WHERE phone_number = '+254711111111');
```

---

## Step 7: Test Frontend Integration

### 7.1 Test useAuth Hook

In your React app, test the authentication flow:

```typescript
// Test login with one of the test phone numbers
const { signInDirect } = useAuth();

try {
  const result = await signInDirect('+254711111111');
  console.log('Login result:', result);
  // Should include business_id in the response
} catch (error) {
  console.error('Login failed:', error);
}
```

### 7.2 Test Data Fetching

```typescript
// Test fetching transactions after login
const { transactions, fetchTransactions } = useTransactions();

// Should only return transactions for the authenticated business
await fetchTransactions();
console.log('Fetched transactions:', transactions);
```

---

## Step 8: Test Performance

### 8.1 Test Query Performance

```sql
-- Test with indexes
EXPLAIN ANALYZE 
SELECT * FROM transactions 
WHERE business_id = (SELECT id FROM businesses WHERE phone_number = '+254711111111')
  AND deleted_at IS NULL
ORDER BY transaction_date DESC
LIMIT 10;

-- Test beehive filtering
EXPLAIN ANALYZE
SELECT * FROM beehive_requests 
WHERE country = 'KE' AND industry = 'retail' AND deleted_at IS NULL
ORDER BY created_at DESC;
```

---

## 🧪 Quick Test Script

Here's a complete test script you can run:

```sql
-- Complete Test Script
DO $$
DECLARE
  kenya_business_id UUID;
  nigeria_business_id UUID;
  sa_business_id UUID;
BEGIN
  -- Create test businesses
  INSERT INTO businesses (phone_number, business_name, country, industry)
  VALUES ('+254711111111', 'Kenya Retail Store', 'Kenya', 'retail')
  RETURNING id INTO kenya_business_id;
  
  INSERT INTO businesses (phone_number, business_name, country, industry)
  VALUES ('+2348022222222', 'Nigeria Beauty Salon', 'Nigeria', 'salon')
  RETURNING id INTO nigeria_business_id;
  
  INSERT INTO businesses (phone_number, business_name, country, industry)
  VALUES ('+27833333333', 'SA Auto Repairs', 'South Africa', 'repairs')
  RETURNING id INTO sa_business_id;
  
  -- Add transactions
  INSERT INTO transactions (business_id, industry, amount, currency, category, description, transaction_date)
  VALUES 
    (kenya_business_id, 'retail', 5000.00, 'KES', 'Sales', 'Product sale', CURRENT_DATE),
    (nigeria_business_id, 'salon', 15000.00, 'NGN', 'Services', 'Hair styling', CURRENT_DATE),
    (sa_business_id, 'repairs', 1200.00, 'ZAR', 'Services', 'Car repair', CURRENT_DATE);
  
  -- Add beehive requests
  INSERT INTO beehive_requests (business_id, country, industry, title, description, category)
  VALUES 
    (kenya_business_id, 'KE', 'retail', 'Need inventory tracking', 'Barcode scanning feature', 'Feature Request'),
    (nigeria_business_id, 'NG', 'salon', 'Appointment reminders', 'SMS reminders needed', 'Feature Request'),
    (sa_business_id, 'ZA', 'repairs', 'Parts inventory', 'Auto parts tracking', 'Feature Request');
  
  RAISE NOTICE 'Test data created successfully!';
END $$;

-- Test business ID generation
SELECT business_id, country_code, industry_code, home_currency 
FROM businesses 
WHERE phone_number IN ('+254711111111', '+2348022222222', '+27833333333')
ORDER BY phone_number;
```

---

## 📊 Expected Results Summary

1. **Business IDs**: Should be in format `XX-XX-XXXXXXX`
2. **RLS Isolation**: Each business sees only their data
3. **Beehive Filtering**: Users see only their country + industry posts
4. **Multi-Currency**: Amounts stored in original currency + home currency
5. **Soft Deletes**: Deleted records hidden from normal queries
6. **Performance**: Queries should use indexes efficiently

---

## 🚨 Troubleshooting

### If Business ID Generation Fails
- Check trigger: `SELECT * FROM pg_trigger WHERE tgname = 'before_insert_businesses_generate_id'`
- Check function: `SELECT * FROM pg_proc WHERE proname = 'generate_business_id'`

### If RLS Not Working
- Check RLS enabled: `SELECT schemaname, tablename, rowsecurity FROM pg_tables WHERE tablename IN ('transactions', 'beehive_requests')`
- Check policies: `SELECT schemaname, tablename, policyname FROM pg_policies`

### If Context Not Working
- Check function exists: `SELECT * FROM pg_proc WHERE proname = 'set_business_context'`
- Test manually: `SELECT set_business_context('your-business-id', 'KE', 'retail')`

---

## 🧹 Cleanup Test Data

```sql
-- Clean up test data
DELETE FROM beehive_comments WHERE request_id IN (
  SELECT id FROM beehive_requests WHERE business_id IN (
    SELECT id FROM businesses WHERE phone_number IN ('+254711111111', '+2348022222222', '+27833333333')
  )
);

DELETE FROM beehive_votes WHERE request_id IN (
  SELECT id FROM beehive_requests WHERE business_id IN (
    SELECT id FROM businesses WHERE phone_number IN ('+254711111111', '+2348022222222', '+27833333333')
  )
);

DELETE FROM beehive_requests WHERE business_id IN (
  SELECT id FROM businesses WHERE phone_number IN ('+254711111111', '+2348022222222', '+27833333333')
);

DELETE FROM transactions WHERE business_id IN (
  SELECT id FROM businesses WHERE phone_number IN ('+254711111111', '+2348022222222', '+27833333333')
);

DELETE FROM businesses WHERE phone_number IN ('+254711111111', '+2348022222222', '+27833333333');
```

---

## ✅ Success Checklist

- [ ] Business IDs generated correctly
- [ ] Multi-currency transactions working
- [ ] RLS policies isolating business data
- [ ] Beehive filtering by country + industry
- [ ] Voting system updating counts
- [ ] Comments system working
- [ ] Soft deletes functioning
- [ ] Frontend hooks working
- [ ] Performance indexes being used
- [ ] Test data cleaned up

Run through this checklist and let me know if any step fails!
