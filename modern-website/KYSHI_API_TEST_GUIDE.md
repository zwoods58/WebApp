# Kyshi API Test Guide

Quick guide to test Kyshi MoR API for weekly subscriptions in Kenya.

## Prerequisites

✅ Kyshi account with test API key  
✅ Node.js installed  
✅ Internet connection  

## Setup (2 minutes)

### 1. Add Your API Key

Open `.env.local` and replace the placeholder with your actual Kyshi test API key:

```env
KYSHI_SECRET_KEY=sk_test_your_actual_key_here
```

Your API key should:
- Start with `sk_test_` for test environment
- Be found in your Kyshi dashboard
- Never be committed to git (already in .gitignore)

### 2. Verify Base URL (Optional)

The default test URL is already set:
```env
KYSHI_BASE_URL=https://kyshi-mor-dev-qkuod6snia-nw.a.run.app/api/v1
```

For production, change to:
```env
KYSHI_BASE_URL=https://api.kyshi.co/api/v1
KYSHI_SECRET_KEY=sk_live_your_live_key_here
```

## Running the Test (1 minute)

### Option 1: Using tsx (Recommended)
```bash
npx tsx scripts/test-kyshi-api.ts
```

### Option 2: Using ts-node
```bash
npx ts-node scripts/test-kyshi-api.ts
```

### Option 3: Compile first
```bash
npx tsc scripts/test-kyshi-api.ts
node scripts/test-kyshi-api.js
```

## What the Test Does

The script will:
1. ✅ Load your API key from `.env.local`
2. ✅ Create a weekly subscription plan
3. ✅ Test with Kenya currency (KES)
4. ✅ Display the response
5. ✅ Verify the plan was created successfully

## Expected Output

### Success ✅
```
🧪 Testing Kyshi API for Weekly Subscriptions (Kenya)

📋 Test Configuration:
   Base URL: https://kyshi-mor-dev-qkuod6snia-nw.a.run.app/api/v1
   API Key: sk_test_abc123...

📤 Creating weekly subscription plan...
   Request Body: {
     "name": "Beezee Weekly Subscription",
     "description": "Weekly subscription plan for Kenyan users",
     "interval": "weekly",
     "amount": 500,
     "localCurrency": "KES"
   }

📥 Response Status: 201 Created
   Response Body: {
     "status": true,
     "message": "Success",
     "code": 201,
     "data": {
       "code": "PLN_xxx_xxx",
       "id": "uuid-here",
       "name": "Beezee Weekly Subscription",
       "interval": "weekly",
       "amount": "500.00",
       "isActive": true
     }
   }

✅ SUCCESS! Kyshi API is working correctly

📊 Plan Details:
   Plan Code: PLN_xxx_xxx
   Plan ID: uuid-here
   Name: Beezee Weekly Subscription
   Interval: weekly
   Amount: 500.00
   Active: true

✅ Weekly interval confirmed
```

### Common Errors

#### 1. Missing API Key
```
❌ Error: KYSHI_SECRET_KEY not found in .env.local

Please add the following to your .env.local file:
KYSHI_SECRET_KEY=sk_test_your_actual_key_here
```

**Solution:** Add your API key to `.env.local`

#### 2. Authentication Error (401)
```
❌ FAILED: API returned an error

🔑 Authentication Error:
   - Check that your API key is correct
   - Ensure it starts with "sk_test_" for test mode
   - Verify the key is active in your Kyshi dashboard
```

**Solution:** 
- Double-check your API key
- Ensure it's a test key (`sk_test_`)
- Verify it's active in Kyshi dashboard

#### 3. Currency Not Supported (400)
```
❌ FAILED: API returned an error

📝 Validation Error:
   - Check the request body format
   - Verify "localCurrency" value (KES might not be supported)
   - Try using "NGN" instead if KES fails
```

**Solution:**
- Kenya (KES) might not be supported yet
- Try changing `localCurrency` to `"NGN"` (Nigeria)
- Contact Kyshi support for KES availability

#### 4. Network Error
```
❌ NETWORK ERROR

Possible causes:
   - No internet connection
   - Kyshi API is down
   - Incorrect base URL
```

**Solution:**
- Check internet connection
- Verify base URL is correct
- Try again in a few minutes

## Testing Different Scenarios

### Test with Nigeria (NGN)
Edit the script and change:
```typescript
localCurrency: 'NGN'  // Instead of 'KES'
```

### Test Different Intervals
Available intervals:
- `daily`
- `weekly`
- `monthly`
- `quarterly`
- `biannually`

### Test Different Amounts
Change the amount value:
```typescript
amount: 1000  // Instead of 500
```

## Next Steps After Successful Test

1. ✅ **Document the Plan Code**
   - Save the `PLN_xxx_xxx` code for reference
   - You'll need this to subscribe customers

2. 📝 **Verify Currency Support**
   - Check if KES (Kenya) is in the response
   - If not, contact Kyshi support

3. 🔧 **Integrate into Beezee**
   - Create Kyshi service module
   - Add subscription endpoints
   - Build customer subscription flow

4. 🚀 **Production Deployment**
   - Get live API key (`sk_live_`)
   - Update base URL to production
   - Test with real transactions

## Troubleshooting

### Script Won't Run
```bash
# Install tsx globally
npm install -g tsx

# Or use npx (no installation needed)
npx tsx scripts/test-kyshi-api.ts
```

### TypeScript Errors
The script uses standard Node.js types. If you get errors:
```bash
# Install Node.js types
npm install --save-dev @types/node
```

### Environment Variables Not Loading
Make sure `.env.local` is in the project root:
```
modern-website/
  ├── .env.local          ← Should be here
  ├── scripts/
  │   └── test-kyshi-api.ts
  └── ...
```

## Security Notes

⚠️ **Important:**
- Never commit `.env.local` to git (already in .gitignore)
- Never share your API keys publicly
- Use test keys (`sk_test_`) for development
- Use live keys (`sk_live_`) only in production
- Rotate keys if compromised

## Support

**Kyshi Documentation:** https://docs.kyshi.co  
**Kyshi Dashboard:** https://kyshi.co/dashboard  
**Support:** Contact Kyshi support for API issues

---

**Test created:** March 23, 2026  
**Purpose:** Verify Kyshi API for Beezee weekly subscriptions (Kenya)
