# Flutterwave Test Credentials

## Test Credentials (Development Only)

These are Flutterwave test credentials for development and testing. **Never use these in production.**

### Environment Variables

Add these to your `.env.local` file:

```env
# Flutterwave Test Credentials
FLUTTERWAVE_PUBLIC_KEY=14e67305-fa27-4750-a78e-ee1a2a0164ae
FLUTTERWAVE_SECRET_KEY=29hOnb4XREOjq8kKBV47xsALWD8UEpn8
FLUTTERWAVE_ENCRYPTION_KEY=7utUKn/NP4eMepW0xeS5eDnfc1Fj8Iu+vyXS48DYTHE=
FLUTTERWAVE_SECRET_HASH=your_webhook_secret_hash
```

### Credential Mapping

- **Client ID** → `FLUTTERWAVE_PUBLIC_KEY`
- **Client Secret** → `FLUTTERWAVE_SECRET_KEY`
- **Encrypted Key** → `FLUTTERWAVE_ENCRYPTION_KEY`

### Usage

These credentials are used by:
- `/api/ai-builder/payments/pro-subscription` - Pro subscription payments
- `/api/ai-builder/payments/buyout` - Project buyout payments
- `/api/ai-builder/payments/verify` - Payment verification
- `/api/ai-builder/payments/webhook` - Webhook handler
- `/api/checkout/create` - E-commerce checkout

### Testing

1. **Add to `.env.local`**:
   ```bash
   FLUTTERWAVE_PUBLIC_KEY=14e67305-fa27-4750-a78e-ee1a2a0164ae
   FLUTTERWAVE_SECRET_KEY=29hOnb4XREOjq8kKBV47xsALWD8UEpn8
   FLUTTERWAVE_ENCRYPTION_KEY=7utUKn/NP4eMepW0xeS5eDnfc1Fj8Iu+vyXS48DYTHE=
   ```

2. **Restart your development server**:
   ```bash
   npm run dev
   ```

3. **Test payment flow**:
   - Try subscribing to Pro plan
   - Try purchasing a buyout
   - Test checkout flow

### Security Notes

⚠️ **Important:**
- These are **test credentials only**
- Never commit `.env.local` to version control
- Use different credentials for production
- Test credentials won't process real payments
- Use Flutterwave test cards for testing payments

### Test Cards

Use these test card numbers with Flutterwave test credentials:

- **Success**: `5531886652142950`
- **Declined**: `4084084084084081`
- **Insufficient Funds**: `4084084084084085`

CVV: Any 3 digits  
Expiry: Any future date  
PIN: Any 4 digits  
OTP: `123456`

---

## Production Setup

For production, get your live credentials from:
1. Flutterwave Dashboard → Settings → API Keys
2. Copy your **Live Public Key** and **Live Secret Key**
3. Get your **Live Encryption Key** from Settings → Security
4. Set up webhook secret hash in Settings → Webhooks
5. Add to production environment variables (Vercel, etc.)

