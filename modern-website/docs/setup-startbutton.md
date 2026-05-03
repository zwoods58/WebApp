# StartButton API Setup Guide

## 1. Add Your API Keys

Update your `.env.local` file with your actual StartButton API keys:

```bash
# StartButton Configuration
STARTBUTTON_PUBLIC_KEY=your_actual_public_key_here
STARTBUTTON_SECRET_KEY=your_actual_secret_key_here
STARTBUTTON_BASE_URL=https://api.startbutton.tech
```

## 2. Test Endpoints Created

The following API endpoints have been created for testing:

### Core Testing Endpoints:
- `POST /api/startbutton/test-payment` - Test payment initialization
- `POST /api/startbutton/test-transfer` - Test transfer initialization  
- `GET /api/startbutton/test-balance` - Test balance retrieval
- `GET /api/startbutton/test-fx?from=NGN&to=GHS` - Test FX rate conversion
- `GET /api/startbutton/test-status?reference=xxx` - Test transaction status

### Webhook Endpoint:
- `POST /api/webhook/startbutton` - Handle StartButton webhooks

## 3. Test UI

Visit `http://localhost:3000/test-startbutton` to access the testing interface.

## 4. Quick Test Commands

### Test Payment (curl):
```bash
curl -X POST http://localhost:3000/api/startbutton/test-payment \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "amount": 10000,
    "currency": "NGN"
  }'
```

### Test Transfer (curl):
```bash
curl -X POST http://localhost:3000/api/startbutton/test-transfer \
  -H "Content-Type: application/json" \
  -d '{
    "bankCode": "058",
    "accountNumber": "0123456789",
    "accountName": "Test Account",
    "amount": 10000,
    "currency": "NGN"
  }'
```

### Test Balance (curl):
```bash
curl http://localhost:3000/api/startbutton/test-balance
```

### Test FX Rate (curl):
```bash
curl "http://localhost:3000/api/startbutton/test-fx?from=NGN&to=GHS"
```

## 5. Supported Currencies

- NGN (Nigeria)
- GHS (Ghana) 
- KES (Kenya)
- ZAR (South Africa)
- UGX (Uganda)
- TZS (Tanzania)
- RWF (Rwanda)
- XOF (Côte d'Ivoire, Benin, Togo, Senegal, Mali, Burkina Faso)
- XAF (Cameroon)
- ZMW (Zambia)

## 6. Transaction Statuses

### For Collections:
- `initiated` - Transaction started
- `pending` - Transaction acknowledged
- `ongoing` - Waiting for customer authorization
- `verified` - Payment received and verified
- `successful` - Funds settled in your balance
- `abandoned` - Customer didn't complete payment

### For Transfers:
- `Initiated` - Transfer started
- `Pending` - Transfer picked up for processing
- `Processing` - Awaiting confirmation from payment partner
- `Successful` - Transfer completed successfully
- `Failed` - Transfer could not be processed
- `Reversed` - Transfer was reversed by recipient's bank

## 7. Webhook Events

- `collection.verified` - Payment verified
- `collection.completed` - Payment completed
- `transfer.pending` - Transfer pending
- `transfer.successful` - Transfer successful
- `transfer.failed` - Transfer failed
- `transfer.reversed` - Transfer reversed

## 8. Next Steps

1. Add your real API keys to `.env.local`
2. Start your development server: `npm run dev`
3. Visit `/test-startbutton` to run tests
4. Check the console for detailed logs
5. Set up webhook URL in your StartButton dashboard to point to: `https://your-domain.com/api/webhook/startbutton`

## 9. Important Notes

- Amounts are in fractional units (kobo for NGN, pesewas for GHS)
- Daily transfer limit: N1 million NGN or $500 equivalent for other currencies
- Always verify webhook signatures in production
- Use unique transaction references to avoid duplicates
- Test with sandbox keys before using production keys
