# Stripe Payment Integration Setup

## Environment Variables Required

Create a `.env.local` file in your project root with the following variables:

```bash
# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# SendGrid Configuration (Optional)
SENDGRID_API_KEY=your_sendgrid_api_key_here
```

## Stripe Setup Steps

### 1. Create Stripe Account
- Go to [stripe.com](https://stripe.com) and create an account
- Complete the account verification process

### 2. Get API Keys
- Go to Stripe Dashboard > Developers > API Keys
- Copy your **Publishable key** (starts with `pk_test_`)
- Copy your **Secret key** (starts with `sk_test_`)

### 3. Set Up Webhook
- Go to Stripe Dashboard > Developers > Webhooks
- Click "Add endpoint"
- Set endpoint URL to: `https://yourdomain.com/api/payments/webhook`
- Select events:
  - `payment_intent.succeeded`
  - `payment_intent.payment_failed`
  - `invoice.payment_succeeded`
- Copy the webhook signing secret (starts with `whsec_`)

### 4. Test the Integration
- Use Stripe's test card numbers:
  - Success: `4242 4242 4242 4242`
  - Decline: `4000 0000 0000 0002`
  - 3D Secure: `4000 0025 0000 3155`

## Payment Flow

1. **Client selects service** → Gets custom quote
2. **Client schedules consultation** → Fills out form
3. **Client pays deposit** → 50% of total project cost
4. **Project begins** → Admin accepts consultation
5. **Project completes** → Invoice sent for remaining balance
6. **Final payment** → Client pays remaining 50%

## Security Features

- ✅ Webhook signature verification
- ✅ Server-side payment processing
- ✅ No card data stored locally
- ✅ PCI compliance through Stripe
- ✅ Rate limiting on API endpoints
- ✅ JWT authentication for admin routes

## Admin Dashboard Integration

The admin dashboard now shows:
- Payment status for each consultation
- Deposit amounts and remaining balances
- Payment history and transaction details
- Invoice management and tracking

## Testing

1. Start your development server: `npm run dev`
2. Go to `/services` page
3. Select a service and get a quote
4. Schedule a consultation
5. Complete the payment process
6. Check the admin dashboard at `/admin`

## Production Deployment

1. Update environment variables with live Stripe keys
2. Update webhook URL to your production domain
3. Test with real payment methods
4. Monitor webhook delivery in Stripe Dashboard
