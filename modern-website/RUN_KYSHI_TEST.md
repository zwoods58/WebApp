# 🚀 Quick Start: Test Kyshi API

## Step 1: Add Your API Key (30 seconds)

Open `.env.local` and replace this line:
```
KYSHI_SECRET_KEY=sk_test_your_actual_key_here
```

With your actual Kyshi test API key:
```
KYSHI_SECRET_KEY=sk_test_abc123xyz...
```

## Step 2: Run the Test (10 seconds)

```bash
npx tsx scripts/test-kyshi-api.ts
```

That's it! ✅

---

## What You'll See

If successful:
```
✅ SUCCESS! Kyshi API is working correctly

📊 Plan Details:
   Plan Code: PLN_xxx_xxx
   Interval: weekly
   Amount: 500.00
```

If there's an error, the script will tell you exactly what to fix.

---

## Need Help?

See `KYSHI_API_TEST_GUIDE.md` for detailed troubleshooting.
