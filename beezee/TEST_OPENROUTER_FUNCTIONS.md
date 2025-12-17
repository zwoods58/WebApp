# Testing OpenRouter Edge Functions

## 🧪 Test Plan

We'll test each function one by one to ensure OpenRouter integration is working.

---

## ✅ Test 1: Financial Coach (Easiest - Text Only)

**Function**: `financial-coach`  
**Location**: Coach page (`/coach`)

### Steps:
1. Navigate to `/coach` page in your app
2. Type a question like: "How can I save more money?"
3. Click Send
4. Check browser console for any errors
5. Verify you get a response

### Expected Result:
- ✅ Question is sent
- ✅ AI responds with financial advice
- ✅ No errors in console

### If Error:
- Check Edge Function logs: `supabase functions logs financial-coach`
- Verify `OPENROUTER_API_KEY` is set in Supabase secrets

---

## ✅ Test 2: Generate Report (Text Only)

**Function**: `generate-report`  
**Location**: Reports page (`/reports`)

### Steps:
1. Navigate to `/reports` page
2. Select a date range (e.g., last 30 days)
3. Click "Generate Report"
4. Wait for report to generate
5. Check browser console for errors

### Expected Result:
- ✅ Report generates successfully
- ✅ Shows financial summary
- ✅ AI insights are included
- ✅ No errors in console

### If Error:
- Check Edge Function logs: `supabase functions logs generate-report`
- Verify you have transactions in the database for the date range

---

## ✅ Test 3: Receipt Scanner (Image Processing)

**Function**: `receipt-to-transaction`  
**Location**: Add Transaction page → Receipt Scanner

### Steps:
1. Navigate to `/add-transaction` page
2. Click "Scan Receipt" button
3. Upload a receipt image (or take a photo)
4. Wait for processing
5. Check if transaction details are extracted

### Expected Result:
- ✅ Receipt image is uploaded
- ✅ Vendor, amount, date extracted
- ✅ Transaction is created automatically
- ✅ No errors in console

### If Error:
- Check Edge Function logs: `supabase functions logs receipt-to-transaction`
- Verify image is valid (JPG, PNG, WebP)
- Check image size (should be under 5MB)

---

## ✅ Test 4: Voice Transaction (Audio Processing)

**Function**: `voice-to-transaction`  
**Location**: Add Transaction page → Voice Recorder

### Steps:
1. Navigate to `/add-transaction` page
2. Click microphone button
3. Record yourself saying: "Sold 50 rand airtime"
4. Wait for processing (3-5 seconds)
5. Check if transaction is created

### Expected Result:
- ✅ Audio is recorded
- ✅ Amount, type, category extracted
- ✅ Transaction is created
- ✅ No errors in console

### If Error:
- Check Edge Function logs: `supabase functions logs voice-to-transaction`
- Verify microphone permissions are granted
- Check audio format (should be WAV/WebM)

---

## ✅ Test 5: Voice Login (Audio Authentication)

**Function**: `voice-login`  
**Location**: Login page → Voice Login option

### Steps:
1. Navigate to login page
2. Enter your WhatsApp number
3. Click "Voice Login" option
4. Record yourself saying: "My name is [your name]"
5. Wait for authentication

### Expected Result:
- ✅ Voice is recorded
- ✅ Voice is matched against your profile
- ✅ You're logged in successfully
- ✅ No errors in console

### If Error:
- Check Edge Function logs: `supabase functions logs voice-login`
- Verify you have a voice PIN set up in your profile
- Check that the voice matches your recorded sample

---

## 🔍 How to Check Edge Function Logs

### Option 1: Supabase Dashboard
1. Go to your Supabase Dashboard
2. Navigate to **Edge Functions** → **Logs**
3. Select the function you want to check
4. Look for errors or API responses

### Option 2: Supabase CLI
```bash
# View logs for a specific function
supabase functions logs voice-to-transaction

# View all function logs
supabase functions logs

# Follow logs in real-time
supabase functions logs --follow
```

---

## 🐛 Common Errors & Fixes

### Error: "OPENROUTER_API_KEY not configured"
**Fix**: 
```bash
supabase secrets set OPENROUTER_API_KEY=sk-or-v1-your-key-here
```

### Error: "401 Unauthorized"
**Fix**: 
- Check your OpenRouter API key is correct
- Verify key starts with `sk-or-v1-...`
- Check OpenRouter account has credits

### Error: "Model not found"
**Fix**: 
- The model `google/gemini-3-flash` might not be available
- Try changing to `google/gemini-2.5-flash` or `google/gemini-2.0-flash-exp:free`
- Update the `GEMINI_MODEL` constant in the Edge Function

### Error: "No response from OpenRouter"
**Fix**:
- Check OpenRouter API status
- Verify your account has available credits
- Check rate limits on your OpenRouter plan

---

## 📊 Testing Checklist

- [ ] Test 1: Financial Coach ✅
- [ ] Test 2: Generate Report ✅
- [ ] Test 3: Receipt Scanner ✅
- [ ] Test 4: Voice Transaction ✅
- [ ] Test 5: Voice Login ✅

---

## 🚀 Next Steps After Testing

Once all tests pass:
1. ✅ All functions working with OpenRouter
2. ✅ Remove old `GEMINI_API_KEY` from Supabase secrets (if still there)
3. ✅ Update documentation if needed
4. ✅ Deploy to production

---

**Ready to start testing!** Let's begin with Test 1 (Financial Coach) as it's the simplest.

