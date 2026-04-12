# Beezee Kyshi Plans Seeding Script

This script creates weekly subscription plans for five countries in Kyshi and populates the Supabase `kyshi_plans` table. It uses Kyshi's `list-plans`, `get-plan`, and `create-plan` endpoints to ensure idempotency and avoid duplicates.

## Features

- **Idempotent**: Safe to run multiple times - won't create duplicate plans
- **Smart Detection**: Checks existing plans before creating new ones
- **Verification**: Uses `get-plan` endpoint to verify plan details match requirements
- **Comprehensive Logging**: Detailed output of all operations
- **Error Handling**: Continues processing even if some operations fail

## Countries and Plans

| Country | Currency | Amount (weekly) | Plan Name |
|---------|----------|-----------------|-----------|
| Kenya (KE) | KES | 200 | "Beezee Weekly Kenya" |
| Ghana (GH) | GHS | 20 | "Beezee Weekly Ghana" |
| Nigeria (NG) | NGN | 500 | "Beezee Weekly Nigeria" |
| South Africa (ZA) | ZAR | 30 | "Beezee Weekly South Africa" |
| Côte d'Ivoire (CI) | XOF | 1000 | "Beezee Weekly Côte d'Ivoire" |

## Setup

### 1. Environment Variables

Create a `.env` file based on `.env.example`:

```bash
# Supabase
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Kyshi
KYSHI_SECRET_KEY=sk_test_your_actual_kyshi_secret_key
KYSHI_BASE_URL=https://api.kyshi.co/v1
```

### 2. Required Environment Variables

- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key for admin access
- `KYSHI_SECRET_KEY` - Your Kyshi test secret key (starts with `sk_test_`)
- `KYSHI_BASE_URL` - Kyshi API base URL (defaults to `https://api.kyshi.co/v1`)

## Usage

### Run the script

```bash
npm run seed:beezee-plans
```

Or directly with ts-node:

```bash
npx ts-node -r dotenv/config scripts/seed-beezee-plans.ts
```

## What the script does

1. **Lists existing plans** from Kyshi using `GET /v1/plans`
2. **For each target country**:
   - Searches for existing plans with matching names/amounts
   - If a potential match is found, uses `GET /v1/plans/{id}` to verify details
   - If no suitable plan exists, creates a new one using `POST /v1/plans`
3. **Upserts plan data** to the Supabase `kyshi_plans` table
4. **Provides detailed summary** of all operations

## Example Output

```
Beezee Kyshi Plans Seeding Script
=====================================
API URL: https://api.kyshi.co/v1

=== Step 1: Fetching existing plans from Kyshi ===
Found 3 existing plans in Kyshi

=== Step 2: Processing country plans ===

Processing KE: Beezee Weekly Kenya
Found exact match for KE: Beezee Weekly Kenya (KE_WEEKLY_200)
Successfully upserted plan for KE with code KE_WEEKLY_200

Processing GH: Beezee Weekly Ghana
Creating new plan: Beezee Weekly Ghana
Successfully created plan: Beezee Weekly Ghana (GH_WEEKLY_20)
Successfully upserted plan for GH with code GH_WEEKLY_20

=== Final Summary ===
Plans already existed: 1
Plans newly created: 1
Errors encountered: 0

=== Database Verification ===
Current plans in database:
  KE: Beezee Weekly Kenya - 200 KES (KE_WEEKLY_200)
  GH: Beezee Weekly Ghana - 20 GHS (GH_WEEKLY_20)

=== Seeding completed ===
Script completed successfully
```

## Troubleshooting

### Common Issues

1. **Missing environment variables**
   ```
   Error: Missing required environment variables:
     - KYSHI_SECRET_KEY
   ```
   Solution: Set up your `.env` file with the required variables.

2. **Invalid Kyshi API key**
   ```
   Kyshi API error: 401 Unauthorized - Invalid API key
   ```
   Solution: Verify your `KYSHI_SECRET_KEY` is correct and starts with `sk_test_`.

3. **Supabase permission errors**
   ```
   Error: insufficient privilege for table kyshi_plans
   ```
   Solution: Ensure you're using the `SUPABASE_SERVICE_ROLE_KEY` not the anon key.

### Debug Mode

The script includes detailed logging. To see all API requests and responses, run with normal verbosity - the script already logs all important operations.

## Database Schema

The script expects a `kyshi_plans` table with this structure:

```sql
CREATE TABLE kyshi_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  country_code TEXT NOT NULL,
  name TEXT NOT NULL,
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL,
  interval TEXT DEFAULT 'weekly',
  kyshi_plan_code TEXT UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Unique constraint on country_code to prevent duplicates
ALTER TABLE kyshi_plans ADD CONSTRAINT kyshi_plans_country_code_key UNIQUE (country_code);
```

## Testing

After running the script, you can verify the plans by:

1. **Check the database**:
   ```sql
   SELECT * FROM kyshi_plans ORDER BY country_code;
   ```

2. **Visit the test page**:
   Navigate to `/test/kyshi` in your application to see the plans in the dropdown.

3. **Check Kyshi dashboard**:
   Log into your Kyshi dashboard to see the created plans.

## API Endpoints Used

- `GET /v1/plans` - List all plans
- `GET /v1/plans/{planIdOrCode}` - Get specific plan details
- `POST /v1/plans` - Create new plan

## Security Notes

- Never commit your `.env` file to version control
- Use test keys for development, production keys for production
- The service role key has admin privileges - keep it secure
- The script only makes outbound API calls - no incoming connections needed
