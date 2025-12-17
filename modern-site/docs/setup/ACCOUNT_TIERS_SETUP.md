# Account Tiers System Setup

This document explains the three-tier account system for the AI Website Builder.

## Account Tiers Overview

### 1. Default Draft Builder Account (FREE)
- **Purpose**: Lead Generation & Pre-Sale Test
- **Features**:
  - Draft Preview: Access to view the single AI-generated website draft on a temporary URL
  - Draft Regeneration: Limited ability (3 times) to re-run the 4-step prompt
  - Pricing Portal: Access to view the Pro Subscription and Buyout options
- **Permissions**: READ-ONLY access to the draft. NO access to the Client Dashboard or live deployment.

### 2. AtarWebb Pro Account (Paid Subscription)
- **Price**: $20.00 MRR (Monthly Recurring Revenue)
- **Purpose**: Dynamic Growth Engine & Management
- **Features**:
  - Live Hosting (Vercel) & Managed Supabase Backend
  - Full Client Dashboard Access: User Management, E-commerce, Inventory, Analytics
  - Advanced Features: Client Login Area, 0% Platform Fees, Automated Daily Backups
- **Permissions**: Full Dynamic Access. Can manage and modify the data in the exclusive Supabase backend via the Client Dashboard.

### 3. Admin Account
- **Purpose**: System Operations & Management
- **Features**:
  - Superuser Access to manage all user accounts, billing, and system configuration
  - Infrastructure Tools (Vercel/Supabase monitoring)
- **Permissions**: Highest Permission Level. Can promote/demote users, handle compliance issues, and manage the core application code.

## Database Schema

### Tables Created

1. **user_accounts**: Main user account table with tier information
2. **draft_projects**: Stores form submissions and draft website data
3. **subscriptions**: Tracks Pro subscription details
4. **payments**: Records all payment transactions
5. **buyouts**: Tracks one-time buyout purchases

### Automatic User Creation

When a user signs up through Supabase Auth, a trigger automatically:
- Creates a `user_accounts` record
- Sets `account_tier` to `'default_draft'` (FREE tier)
- Links to the auth.users record

## User Flow

### 1. New User Signup
```
User signs up → Automatically assigned to 'default_draft' tier
```

### 2. Form Submission
```
User completes 4-step form → Draft project created in database
→ User can preview draft (3 regeneration limit for FREE tier)
```

### 3. Upgrade to Pro
```
User subscribes to Pro ($20/month) → upgrade_to_pro() function called
→ Account tier changed to 'pro_subscription'
→ Subscription record created
→ Payment record created
→ User gains access to Client Dashboard and live deployment
```

### 4. Missed Payment / Cancellation
```
Payment fails or user cancels → downgrade_from_pro() function called
→ Account tier reverted to 'default_draft'
→ Subscription status set to 'expired'
→ User loses access to Client Dashboard
→ Draft preview access remains
```

### 5. Buyout Purchase
```
User purchases $150 buyout → process_buyout() function called
→ Buyout record created
→ Payment processed
→ If user had Pro subscription, it's canceled
→ Account tier remains 'default_draft' (or reverts if was Pro)
→ Code delivered to user
→ User can no longer access managed services
```

## Database Functions

### `upgrade_to_pro(user_id, subscription_id, payment_id)`
Upgrades a user from FREE to Pro subscription.

### `downgrade_from_pro(user_id)`
Downgrades a user from Pro back to FREE tier (missed payment or cancellation).

### `process_buyout(user_id, draft_project_id, buyout_id, payment_id)`
Processes a buyout purchase and cancels any active subscriptions.

## TypeScript Utilities

Located in `src/lib/account-tiers.ts`:

- `getCurrentUserAccount()`: Get current user's account info
- `hasFeatureAccess()`: Check if user has access to a feature
- `canRegenerateDraft()`: Check regeneration limits
- `upgradeToPro()`: Upgrade user to Pro
- `downgradeFromPro()`: Downgrade from Pro
- `processBuyout()`: Process buyout purchase
- `createDraftProject()`: Create draft from form data

## Usage Example

```typescript
import { getCurrentUserAccount, hasFeatureAccess } from '@/lib/account-tiers'

// Check user's tier
const account = await getCurrentUserAccount()

// Check feature access
if (hasFeatureAccess(account, 'client_dashboard')) {
  // User has access to client dashboard
}

// Check regeneration limit
if (await canRegenerateDraft(userId, draftId)) {
  // User can regenerate
}
```

## Running the Migration

1. Go to Supabase Dashboard → SQL Editor
2. Copy the contents of `Supabase/migrations/20250102000000_account_tiers_schema.sql`
3. Run the migration
4. Verify tables and functions were created

## Next Steps

1. Integrate form submission to create draft projects
2. Set up payment webhooks (Flutterwave) to handle upgrades
3. Create Client Dashboard for Pro users
4. Set up cron job to check for expired subscriptions
5. Implement code delivery system for buyouts


