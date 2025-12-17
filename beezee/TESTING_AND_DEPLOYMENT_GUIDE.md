# 🧪 Testing & Deployment Guide - BeeZee Finance PWA

## ✅ All Tests Passing: 31/31

---

## 📋 Table of Contents

1. [Unit Testing](#unit-testing)
2. [Manual Testing](#manual-testing)
3. [Edge Function Testing](#edge-function-testing)
4. [Deployment Steps](#deployment-steps)
5. [Post-Deployment Verification](#post-deployment-verification)
6. [Monitoring & Maintenance](#monitoring--maintenance)
7. [Troubleshooting](#troubleshooting)

---

## 🧪 Unit Testing

### Running Tests

```bash
cd beezee

# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test voiceTransactionParser

# Run with UI
npm run test:ui
```

### Test Results (Current)

```
Test Files  2 passed (2)
     Tests  31 passed (31)
  Duration  16.73s
```

**Test Coverage:**
- ✅ Voice transaction parsing (24 tests)
- ✅ AI Coach safety filters (7 tests)
- ✅ All South African scenarios
- ✅ Edge cases and validations

### Test Files

1. **`src/utils/__tests__/voiceTransactionParser.test.js`**
   - 24 tests for voice transaction extraction
   - Scenarios: Airtime, Transport, Electricity, Stock, Currency formats
   - Mixed language and code-switching
   - Confidence levels
   - Edge cases

2. **`src/utils/__tests__/coachingScenarios.test.js`**
   - 7 tests for AI Coach safety filters
   - Investment advice blocking
   - Tax/legal question filtering
   - Political topic detection
   - Normal business questions allowed

---

## 🔍 Manual Testing

### Testing Checklist by Feature

#### 1. Voice-Activated Transaction Recording

**Setup:**
- [ ] Open app in Chrome/Edge (supports WebM audio)
- [ ] Allow microphone permissions

**Test Cases:**

##### Basic Functionality
- [ ] TC01: Tap microphone button → recording starts
- [ ] TC02: Hold button → recording indicator pulses
- [ ] TC03: Release after 2 seconds → processing starts
- [ ] TC04: Hold for 10 seconds → auto-stops with haptic feedback
- [ ] TC05: Cancel recording → returns to form

##### Recognition Accuracy
- [ ] TC06: Say "Sold airtime for R50" → Extracts: income, R50, Airtime, "Sold airtime for R50"
- [ ] TC07: Say "Bought stock for one hundred rand" → Extracts: expense, R100, Stock
- [ ] TC08: Say "Taxi fare R15" → Extracts: expense, R15, Transport
- [ ] TC09: Say "Got paid 200 for cutting hair" → Extracts: income, R200, Sales
- [ ] TC10: Say "Prepaid lights one-fifty" → Extracts: expense, R150, Electricity

##### South African Context
- [ ] TC11: Say "Sold kotas for R40" → Recognizes "kotas" (SA slang)
- [ ] TC12: Say "Spaza stock three hundred" → Recognizes "spaza"
- [ ] TC13: Mixed English/Afrikaans → Processes correctly

##### Confidence & Confirmation
- [ ] TC14: Clear audio → Confidence "high", shows green checkmark
- [ ] TC15: Unclear audio → Confidence "low", shows warning
- [ ] TC16: Tap "Yes, Save It" → Saves transaction
- [ ] TC17: Tap "No, Try Again" → Returns to recording

##### Offline Mode
- [ ] TC18: Turn off WiFi → Record voice
- [ ] TC19: Check "Saved - Will process when online" message
- [ ] TC20: Turn on WiFi → Background sync processes
- [ ] TC21: Notification shows when processed

#### 2. Receipt Scanning

**Setup:**
- [ ] Open app on mobile device with camera
- [ ] Allow camera permissions

**Test Cases:**

##### Camera Interface
- [ ] TC01: Tap camera button → Full-screen camera opens
- [ ] TC02: Receipt frame overlay visible
- [ ] TC03: Tap to focus → Camera focuses
- [ ] TC04: Toggle flash → Flash turns on/off
- [ ] TC05: Tap capture → Photo taken

##### Image Processing
- [ ] TC06: Scan till slip (Pick n Pay/Shoprite) → Extracts vendor, date, amount
- [ ] TC07: Scan handwritten invoice → Extracts key details
- [ ] TC08: Scan petrol receipt → Recognizes Shell/Engen/BP
- [ ] TC09: Scan faded receipt → Shows low confidence
- [ ] TC10: Scan crumpled receipt → Still extracts details

##### South African Formats
- [ ] TC11: Receipt with Afrikaans text → Processes correctly
- [ ] TC12: Handwritten taxi receipt → Extracts amount
- [ ] TC13: Multi-language receipt → Handles both languages

##### Confirmation Flow
- [ ] TC14: High confidence → Fields auto-filled
- [ ] TC15: Low confidence → Fields highlighted yellow
- [ ] TC16: Edit fields before saving → Changes persist
- [ ] TC17: Tap "Looks good?" → Saves transaction

##### Offline Mode
- [ ] TC18: Offline scan → Image stored locally
- [ ] TC19: Check "Saved - Will scan when online" message
- [ ] TC20: Go online → Background processes image
- [ ] TC21: Thumbnail visible while processing

#### 3. Instant Profit & Loss Reports

**Setup:**
- [ ] Have at least 10 transactions in database
- [ ] Mix of income and expenses

**Test Cases:**

##### Report Generation
- [ ] TC01: Tap "Today" card → Loads today's summary
- [ ] TC02: Tap "This Week" → Shows 7-day summary
- [ ] TC03: Tap "This Month" → Shows current month
- [ ] TC04: Tap "Custom Range" → Date picker appears

##### Report Display
- [ ] TC05: Report shows Money In (green)
- [ ] TC06: Report shows Money Out (red)
- [ ] TC07: Report shows Profit/Loss (colored appropriately)
- [ ] TC08: Bar chart visualizes categories
- [ ] TC09: Top 3 expenses listed
- [ ] TC10: Top 3 income sources listed

##### PDF Generation
- [ ] TC11: Tap "Generate Full Report" → PDF generates
- [ ] TC12: PDF includes all summary data
- [ ] TC13: PDF includes charts as images
- [ ] TC14: PDF file size <5MB

##### WhatsApp Sharing
- [ ] TC15: Tap "Share on WhatsApp" → WhatsApp opens
- [ ] TC16: Pre-filled message includes period and profit
- [ ] TC17: Image attachment <500KB
- [ ] TC18: Image includes key metrics

##### Performance
- [ ] TC19: Report loads in <10 seconds
- [ ] TC20: Cached report loads instantly
- [ ] TC21: Large data set (500+ transactions) still performs well

#### 4. AI Financial Coach

**Setup:**
- [ ] Have transaction history
- [ ] Be connected to internet

**Test Cases:**

##### Basic Interaction
- [ ] TC01: Navigate to Coach tab → Welcome message shows (for new users)
- [ ] TC02: See conversation history (for returning users)
- [ ] TC03: Type question → Send button enabled
- [ ] TC04: Send question → Response in 2-4 seconds
- [ ] TC05: Response references user's actual data

##### Suggested Questions
- [ ] TC06: Tap "How is my business doing?" → Personalized response
- [ ] TC07: Tap "Where is my money going?" → Category breakdown
- [ ] TC08: Tap "How can I save money?" → Specific advice

##### Context Awareness
- [ ] TC09: Ask about specific category → Coach references that category's data
- [ ] TC10: Ask "Am I spending too much on transport?" → Coach shows transport spending
- [ ] TC11: Follow-up question → Coach remembers context

##### Safety Filters
- [ ] TC12: Ask "Should I buy Bitcoin?" → Blocked with safety response
- [ ] TC13: Ask "How do I avoid tax?" → Redirects to professional
- [ ] TC14: Ask "What about government policy?" → Declines to answer
- [ ] TC15: Ask normal business question → Answers helpfully

##### Features
- [ ] TC16: Tap microphone → Voice input works
- [ ] TC17: Rate response with emoji → Feedback saved
- [ ] TC18: Tap "Start Fresh" → History cleared
- [ ] TC19: Questions counter decrements
- [ ] TC20: Hit 10 questions → Limit reached message

##### Proactive Insights
- [ ] TC21: Login on Monday → Weekly summary shows on Dashboard
- [ ] TC22: Reach 100 transactions → Milestone celebration
- [ ] TC23: Expenses > Income → Warning insight
- [ ] TC24: Tap insight → Navigates to Coach

---

## 🔌 Edge Function Testing

### Local Testing with Supabase CLI

```bash
# Start local Supabase
supabase start

# Serve function locally
supabase functions serve voice-to-transaction --env-file .env.local

# Test with curl
curl -X POST http://localhost:54321/functions/v1/voice-to-transaction \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "audioBase64": "...",
    "duration": 3
  }'
```

### Testing Each Edge Function

#### 1. voice-to-transaction

**Test Request:**
```bash
curl -X POST https://your-project.supabase.co/functions/v1/voice-to-transaction \
  -H "Authorization: Bearer $ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "audioBase64": "<base64_encoded_audio>",
    "duration": 3
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "transaction": {
    "amount": 50,
    "type": "income",
    "category": "Airtime",
    "description": "Sold airtime for fifty rand",
    "confidence": "high"
  }
}
```

**Test Cases:**
- [ ] Valid audio → Extracts transaction
- [ ] Unclear audio → Low confidence
- [ ] Invalid audio format → Error message
- [ ] Missing auth → 401 Unauthorized
- [ ] Gemini API timeout → Graceful error

#### 2. receipt-to-transaction

**Test Request:**
```bash
curl -X POST https://your-project.supabase.co/functions/v1/receipt-to-transaction \
  -H "Authorization: Bearer $ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "imageBase64": "<base64_encoded_image>",
    "fileName": "receipt.jpg"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "transaction": {
    "vendor": "Pick n Pay",
    "date": "2024-01-15",
    "total_amount": 245.50,
    "items": [...],
    "payment_method": "Card",
    "confidence": "high"
  }
}
```

**Test Cases:**
- [ ] Clear receipt → Extracts all fields
- [ ] Handwritten receipt → Lower confidence
- [ ] Not a receipt → Error with message
- [ ] Image too large → Compression works
- [ ] Invalid image → Error message

#### 3. generate-report

**Test Request:**
```bash
curl -X POST https://your-project.supabase.co/functions/v1/generate-report \
  -H "Authorization: Bearer $ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "reportType": "month",
    "startDate": "2024-01-01",
    "endDate": "2024-01-31"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "report": {
    "period": "January 2024",
    "income_total": 4500,
    "expense_total": 3200,
    "net_profit": 1300,
    "income_categories": [...],
    "expense_categories": [...],
    "insights": [...]
  }
}
```

**Test Cases:**
- [ ] Valid date range → Generates report
- [ ] No transactions → Empty report with message
- [ ] Invalid dates → Error message
- [ ] Large data set → Still performs well
- [ ] SQL generation → Valid PostgreSQL

#### 4. financial-coach

**Test Request:**
```bash
curl -X POST https://your-project.supabase.co/functions/v1/financial-coach \
  -H "Authorization: Bearer $ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "question": "How is my business doing?",
    "context": {
      "transaction_count": 100,
      "current_month_profit": 2500,
      "trend": "growing"
    }
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "answer": "Your business is looking good! This month...",
  "sessionId": "uuid"
}
```

**Test Cases:**
- [ ] Valid question → Personalized answer
- [ ] Investment question → Safety response
- [ ] Tax question → Redirects to professional
- [ ] No context → Encourages recording transactions
- [ ] Follow-up question → Maintains context

---

## 🚀 Deployment Steps

### Prerequisites

1. **Supabase Project**
   - Create project at supabase.com
   - Note project URL and anon key

2. **Gemini API Key**
   - Get from Google AI Studio
   - Enable Gemini 1.5 Flash API

3. **Vercel/Netlify Account**
   - Sign up for hosting platform

### Step 1: Database Setup

```bash
cd beezee

# Link to Supabase project
supabase link --project-ref YOUR_PROJECT_REF

# Push database schema
supabase db push

# Verify tables created
supabase db shell
> \dt
> SELECT * FROM users LIMIT 1;
> \q
```

### Step 2: Storage Setup

```sql
-- In Supabase SQL Editor

-- Create receipts bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('receipts', 'receipts', false);

-- Set storage policies
CREATE POLICY "Users can upload receipts"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'receipts' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view receipts"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'receipts' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete receipts"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'receipts' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

### Step 3: Deploy Edge Functions

```bash
# Set Gemini API key as secret
supabase secrets set GEMINI_API_KEY=your_gemini_api_key

# Deploy all functions
supabase functions deploy voice-to-transaction
supabase functions deploy receipt-to-transaction
supabase functions deploy generate-report
supabase functions deploy financial-coach

# Verify deployments
supabase functions list
```

### Step 4: Frontend Deployment

#### Option A: Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Build locally to test
npm run build

# Deploy to Vercel
vercel

# Set environment variables in Vercel dashboard:
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key

# Deploy to production
vercel --prod
```

#### Option B: Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod --dir=dist

# Set environment variables in Netlify dashboard
```

### Step 5: Configure Custom Domain (Optional)

**Vercel:**
1. Go to Project Settings → Domains
2. Add your domain
3. Configure DNS records

**Netlify:**
1. Go to Site Settings → Domain Management
2. Add custom domain
3. Configure DNS

---

## ✅ Post-Deployment Verification

### Automated Checks

```bash
# Health check script
curl https://your-app.vercel.app
# Should return 200 OK

# Test Edge Functions
curl https://your-project.supabase.co/functions/v1/voice-to-transaction
# Should return method not allowed or auth required (good!)
```

### Manual Verification

#### 1. Core Functionality
- [ ] App loads on desktop
- [ ] App loads on mobile
- [ ] Install as PWA works
- [ ] Sign up with phone number works
- [ ] Login works
- [ ] Logout works

#### 2. Features
- [ ] Voice recording works
- [ ] Receipt scanning works
- [ ] Reports generate
- [ ] AI Coach responds
- [ ] Offline mode works
- [ ] Background sync works

#### 3. Performance
- [ ] Dashboard loads in <2s
- [ ] Voice processes in <5s
- [ ] Receipt scans in <8s
- [ ] Reports generate in <10s
- [ ] Coach responds in <5s

#### 4. Mobile Specific
- [ ] Responsive on all screen sizes
- [ ] Touch targets adequate (min 44x44px)
- [ ] Keyboard doesn't overlap inputs
- [ ] Swipe gestures work
- [ ] Haptic feedback works
- [ ] Camera works
- [ ] Microphone works

#### 5. PWA Capabilities
- [ ] Manifest loads correctly
- [ ] Service worker registers
- [ ] Offline page shows when offline
- [ ] Background sync works
- [ ] Push notifications work (if implemented)
- [ ] Install prompt shows

---

## 📊 Monitoring & Maintenance

### Supabase Dashboard

**Monitor:**
1. **Database**
   - Active connections
   - Query performance
   - Storage usage
   - Table sizes

2. **Edge Functions**
   - Invocation count
   - Error rate
   - Average duration
   - Logs

3. **Storage**
   - Bucket usage
   - Upload rate
   - Download rate

4. **Auth**
   - Active users
   - Sign-ups per day
   - Failed logins

### Application Monitoring

**Key Metrics:**
- Daily Active Users (DAU)
- Weekly Active Users (WAU)
- Transactions per user per day
- Feature adoption rates
- Error rates by feature
- API latency by endpoint

**Set Up Alerts:**
- Edge Function error rate >5%
- Response time >10s
- Storage quota >80%
- Database connections >80%

### Log Monitoring

```bash
# View Edge Function logs
supabase functions logs voice-to-transaction --tail
supabase functions logs receipt-to-transaction --tail
supabase functions logs generate-report --tail
supabase functions logs financial-coach --tail

# Filter for errors
supabase functions logs voice-to-transaction | grep ERROR
```

### Regular Maintenance Tasks

**Daily:**
- [ ] Check error logs
- [ ] Monitor API costs
- [ ] Check user feedback

**Weekly:**
- [ ] Review performance metrics
- [ ] Analyze feature usage
- [ ] Check storage usage
- [ ] Review AI Coach feedback ratings

**Monthly:**
- [ ] Database optimization (vacuum, reindex)
- [ ] Storage cleanup (old receipts)
- [ ] Security audit
- [ ] Cost optimization review

---

## 🔧 Troubleshooting

### Common Issues

#### Issue: Voice recording doesn't work

**Symptoms:** Microphone button doesn't respond or no recording indicator

**Diagnosis:**
1. Check browser console for errors
2. Verify microphone permissions
3. Test in different browser (Chrome/Edge recommended)

**Solutions:**
- Grant microphone permissions
- Use HTTPS (required for mic access)
- Check MediaRecorder API support

**Prevention:**
- Show clear permission request UI
- Detect unsupported browsers
- Provide fallback to manual entry

---

#### Issue: Receipt scanning fails

**Symptoms:** "Not a valid receipt" error or incorrect extraction

**Diagnosis:**
1. Check Edge Function logs
2. Verify image format and size
3. Test Gemini Vision API separately

**Solutions:**
- Ensure image is <500KB
- Check JPEG/PNG format
- Verify lighting and clarity
- Test with different receipt types

**Prevention:**
- Provide image quality tips
- Show example good photos
- Implement retry with adjustments

---

#### Issue: Reports generation is slow

**Symptoms:** Report takes >10 seconds to load

**Diagnosis:**
1. Check transaction count
2. Review database query performance
3. Check Gemini API latency

**Solutions:**
- Implement pagination for large datasets
- Add database indexes
- Cache frequently requested reports
- Optimize SQL queries

**Prevention:**
- Set max transactions per report
- Pre-calculate common reports
- Use database views for complex queries

---

#### Issue: AI Coach gives generic responses

**Symptoms:** Responses don't reference user's data

**Diagnosis:**
1. Check context passed to Edge Function
2. Verify transaction data exists
3. Review Gemini prompt

**Solutions:**
- Ensure context includes transaction_count > 0
- Check recent_transactions array not empty
- Verify user_id correct in query

**Prevention:**
- Log context before API call
- Validate context structure
- Test with various data states

---

#### Issue: Offline sync not working

**Symptoms:** Offline transactions not syncing when back online

**Diagnosis:**
1. Check service worker registration
2. Verify IndexedDB data
3. Check background sync permissions

**Solutions:**
- Re-register service worker
- Clear and rebuild IndexedDB
- Check browser sync permissions
- Test manual sync trigger

**Prevention:**
- Robust error handling in sync
- Retry logic with exponential backoff
- Clear user feedback during sync
- Sync status indicator

---

#### Issue: High Gemini API costs

**Symptoms:** Unexpected high API charges

**Diagnosis:**
1. Check Edge Function invocation logs
2. Review token usage per request
3. Identify heavy users

**Solutions:**
- Implement stricter rate limiting
- Cache more aggressively
- Reduce context size
- Optimize prompts for brevity

**Prevention:**
- Set up cost alerts
- Monitor per-user usage
- Implement usage quotas
- Optimize token usage

---

## 📞 Support Contacts

### Technical Issues
- **Supabase:** support@supabase.io
- **Gemini API:** Google AI Support
- **Hosting:** Vercel/Netlify support

### Development Team
- **Lead Developer:** [Your contact]
- **Backend:** [Your contact]
- **DevOps:** [Your contact]

---

## ✅ Pre-Launch Checklist

### Technical
- [ ] All unit tests passing (31/31)
- [ ] All manual tests completed
- [ ] Edge Functions deployed and tested
- [ ] Database schema applied
- [ ] Storage buckets configured
- [ ] Environment variables set
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active

### Performance
- [ ] Dashboard loads <2s
- [ ] Voice processes <5s
- [ ] Receipt scans <8s
- [ ] Reports generate <10s
- [ ] Coach responds <5s
- [ ] Mobile performance verified

### Security
- [ ] RLS policies active
- [ ] Authentication working
- [ ] API keys secured
- [ ] CORS configured
- [ ] Input validation present
- [ ] Safety filters active

### User Experience
- [ ] Responsive on all devices
- [ ] PWA install works
- [ ] Offline mode functional
- [ ] Error messages clear
- [ ] Loading states present
- [ ] Success feedback shown

### Business
- [ ] Terms of Service live
- [ ] Privacy Policy live
- [ ] Support email set up
- [ ] Payment gateway configured (if applicable)
- [ ] Analytics tracking (if applicable)
- [ ] Backup strategy in place

---

## 🎉 Launch Day Checklist

### Morning Of
- [ ] Final smoke test on production
- [ ] Verify all services up
- [ ] Check database backups
- [ ] Prepare monitoring dashboard
- [ ] Brief support team
- [ ] Prepare announcement

### During Launch
- [ ] Monitor error logs continuously
- [ ] Watch for performance issues
- [ ] Be ready to rollback if needed
- [ ] Respond to early user feedback
- [ ] Track key metrics

### After Launch
- [ ] Send launch announcement
- [ ] Monitor for 24 hours
- [ ] Review error logs
- [ ] Analyze user behavior
- [ ] Plan first updates

---

## 📚 Additional Resources

- **Project Documentation:** See README.md
- **Feature Guides:** See individual feature docs
- **Supabase Docs:** https://supabase.com/docs
- **Gemini API Docs:** https://ai.google.dev/docs
- **React Docs:** https://react.dev
- **Vite Docs:** https://vitejs.dev

---

**Good luck with your deployment! 🚀**

**Built with 🐝 for South African entrepreneurs**


