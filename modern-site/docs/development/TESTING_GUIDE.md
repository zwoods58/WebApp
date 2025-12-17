# AI Website Builder - Testing Guide

## Pre-Testing Checklist

### 1. Environment Variables
Make sure these are set in `.env.local`:

```env
# Supabase (should already be set)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Claude API (REQUIRED for testing)
CLAUDE_API_KEY=your-claude-api-key

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Database Migrations
✅ Run the migration in Supabase:
- Go to Supabase Dashboard → SQL Editor
- Run `20250102000000_account_tiers_schema.sql`
- Verify tables exist: `user_accounts`, `draft_projects`, etc.

### 3. Start Development Server
```bash
npm run dev
```

## Testing Flow

### Step 1: Access the AI Builder
1. Navigate to: `http://localhost:3000/ai-builder`
2. You should see the 4-step form

### Step 2: Complete the Form

**Step 1 - Business Fundamentals:**
- Business Name: (e.g., "TechFlow Solutions")
- Business Location: (e.g., "Nairobi, Kenya")
- Business Description: (e.g., "We provide cutting-edge software solutions for African businesses")
- Email: (your test email)

**Step 2 - Target Audience & Voice:**
- Ideal Customer: (e.g., "Small to medium businesses in Kenya")
- Key Differentiator: (e.g., "Local expertise with global standards")
- Target Keywords: (e.g., "software, technology, Kenya")
- Tone of Voice: (e.g., "Professional and approachable")

**Step 3 - Branding & Aesthetic:**
- Preferred Colors: (e.g., "Blue and white")
- Aesthetic Style: (e.g., "Modern and minimal")
- Must-Have Pages: Select at least one (Home, About, Contact, etc.)
- Existing Links: (optional)

**Step 4 - Final Features:**
- Needs E-commerce: Yes/No
- Needs CRM: Yes/No
- Conversion Goal: (e.g., "Get a free consultation")

### Step 3: Start Build
1. Click "START BUILD" button
2. If not logged in, you'll see the login modal
3. Sign up or log in with your test account

### Step 4: Watch the Building Interface
1. You should see the split-screen building interface:
   - **Left**: AI chat showing progress steps
   - **Right**: Preview area (will show when ready)
2. Watch the progress steps:
   - Analyzing requirements
   - Designing structure
   - Generating HTML & CSS
   - Adding interactive features
   - Optimizing for mobile
   - Deploying preview

### Step 5: View Results
1. Once complete, you'll be redirected to `/ai-builder/dashboard`
2. You should see your draft project
3. Click "Preview" to see the generated website
4. Check the quality:
   - Does it look professional?
   - Does it match the industry standards?
   - Are Unsplash images used?
   - Is it responsive?
   - Does it match the aesthetic style?

## What to Look For

### ✅ Success Indicators:
- Building interface appears and shows progress
- Preview loads successfully
- Website looks professional and modern
- Industry-appropriate design (references major players)
- Unsplash images are used strategically
- Responsive design works on mobile
- All requested pages are included
- CTAs are prominent and clear
- Matches the aesthetic style requested

### ❌ Issues to Watch For:
- Error messages in console
- Preview doesn't load
- Generic/low-quality design
- Missing pages
- No images or broken images
- Not responsive
- Doesn't match aesthetic style

## Testing Different Business Types

### Test 1: E-commerce (Clothing)
- Business: "Fashion Forward"
- Type: Clothing store
- Needs E-commerce: Yes
- Expected: Nike/Adidas-style design, product grid, shopping cart

### Test 2: Tech/SaaS
- Business: "CloudSync Pro"
- Type: Software service
- Needs CRM: Yes
- Expected: Apple/Stripe-style design, clean, premium

### Test 3: Local Service
- Business: "Nairobi Cleaners"
- Type: Cleaning service
- Conversion Goal: "Book a service"
- Expected: Local-focused, trustworthy, clear contact methods

### Test 4: Food & Beverage
- Business: "Café Mocha"
- Type: Coffee shop
- Expected: Warm, inviting, food imagery, menu-focused

## Debugging

### If Building Interface Doesn't Appear:
1. Check browser console for errors
2. Verify user is logged in
3. Check network tab for API calls
4. Verify `CLAUDE_API_KEY` is set

### If Preview Doesn't Load:
1. Check `/api/preview/[draftId]` endpoint
2. Verify draft project was created in database
3. Check if HTML code exists in `metadata.html_code`
4. Check browser console for errors

### If Design Quality is Low:
1. Check the prompt in `app/api/ai-builder/generate/route.ts`
2. Verify Claude API is responding correctly
3. Check the generated HTML code
4. Try different business types to see if it's industry-specific

### If Regeneration Limit Reached:
- FREE tier: 3 regenerations max
- Check `generation_count` in database
- Try upgrading to Pro (or manually update in database for testing)

## Database Checks

### Verify Draft Project Created:
```sql
SELECT * FROM draft_projects 
ORDER BY created_at DESC 
LIMIT 1;
```

### Check User Account:
```sql
SELECT * FROM user_accounts 
WHERE email = 'your-test-email@example.com';
```

### Check Generation Count:
```sql
SELECT generation_count, max_generations, status 
FROM draft_projects 
WHERE user_id = 'your-user-id';
```

## Next Steps After Testing

1. **If Quality is Good:**
   - Test with different business types
   - Test regeneration limits
   - Test preview expiration (for FREE tier)

2. **If Quality Needs Improvement:**
   - Review generated HTML
   - Adjust prompt if needed
   - Test with different Claude models
   - Add more specific industry examples

3. **If Errors Occur:**
   - Check logs in terminal
   - Check Supabase logs
   - Verify all environment variables
   - Check API rate limits

## Production Readiness

Before going live:
- [ ] Test with multiple business types
- [ ] Verify preview expiration works
- [ ] Test regeneration limits
- [ ] Test buyout code download
- [ ] Set up payment webhooks
- [ ] Configure Vercel preview deployments
- [ ] Set up monitoring/logging
- [ ] Test on actual mobile devices
- [ ] Verify performance on slow connections

## Support

If you encounter issues:
1. Check the browser console
2. Check the terminal/console logs
3. Check Supabase logs
4. Review the generated HTML code
5. Test with a simpler business description


