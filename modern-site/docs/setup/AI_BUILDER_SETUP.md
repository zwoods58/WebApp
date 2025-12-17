# AI Website Builder Setup Guide

This guide explains how to set up and configure the AI Website Builder system.

## Prerequisites

1. Supabase project with migrations run
2. Claude API key (for testing) or OpenRouter API key (for production)
3. Vercel account (for preview deployments)
4. Environment variables configured

## Environment Variables

Add these to your `.env.local`:

```env
# Supabase (already configured)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# AI Provider
CLAUDE_API_KEY=your-claude-api-key
# OR for production:
# OPENROUTER_API_KEY=your-openrouter-key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Installation

### 1. Install Dependencies

```bash
npm install jszip
```

### 2. Run Database Migrations

1. Go to Supabase Dashboard → SQL Editor
2. Run `20250101120000_initial_schema.sql` (if not already run)
3. Run `20250102000000_account_tiers_schema.sql`

### 3. Verify Tables Created

Check that these tables exist:
- `user_accounts`
- `draft_projects`
- `subscriptions`
- `payments`
- `buyouts`

## How It Works

### User Flow

1. **User Signs Up** → Automatically assigned to `default_draft` (FREE) tier
2. **User Completes Form** → Creates `draft_project` record
3. **User Clicks "Start Build"** → Triggers AI generation
4. **Building Interface Shows**:
   - Left: AI chat with progress steps
   - Right: Live preview (updates as generation progresses)
5. **Generation Complete** → Preview URL created
6. **User Can**:
   - View preview (FREE: 14 days, Pro: unlimited)
   - Regenerate (FREE: 3 times, Pro: 10/month)
   - Upgrade to Pro ($20/month)
   - Purchase Buyout ($150) → Download code

### API Endpoints

#### `POST /api/ai-builder/generate`
- Generates website using Claude API
- Streams progress via SSE
- Creates preview URL
- Updates draft project

#### `GET /api/preview/[draftId]`
- Serves HTML preview
- Checks expiration for FREE tier
- Returns HTML code

#### `GET /api/ai-builder/download/[draftId]`
- Generates ZIP file with code
- Requires buyout purchase
- Returns downloadable ZIP

## AI Generation

### Current Setup (Claude)
- Model: `claude-3-5-sonnet-20240620`
- Max tokens: 16000
- Output: Single HTML file with inline CSS/JS

### Production Setup (OpenRouter)
To switch to OpenRouter:

1. Update `app/api/ai-builder/generate/route.ts`:
```typescript
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY!

// Use OpenRouter instead of Claude
const response = await fetch(OPENROUTER_API_URL, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'anthropic/claude-3.5-sonnet',
    messages: [{ role: 'user', content: prompt }],
  })
})
```

## Preview Deployment

### Current Implementation
- HTML stored in `draft_projects.metadata.html_code`
- Served via `/api/preview/[draftId]`
- Subdomain: `[slug]-[id].atarwebb.com` (generated but not yet deployed)

### Future: Vercel Integration
To deploy actual previews:

1. Install Vercel CLI: `npm i -g vercel`
2. Create Vercel project for each preview
3. Deploy HTML to Vercel
4. Map subdomain to Vercel deployment
5. Store deployment URL in database

## Regeneration Limits

- **FREE tier**: 3 total regenerations (tracked in `generation_count`)
- **Pro tier**: 10 regenerations per month (resets monthly)
- **Buyout**: No regenerations (they have the code)

## Preview Expiration

- **FREE tier**: 14 days from generation
- **Pro tier**: Active while subscription is active
- **Buyout**: Permanent (they own the code)

## Code Download (Buyout)

When user purchases buyout:
1. `has_buyout` flag set to `true` in `user_accounts`
2. Code available for download at `/api/ai-builder/download/[draftId]`
3. ZIP file includes:
   - `index.html` (complete website)
   - `README.md` (setup instructions)

## Testing

### Test Generation Flow

1. Sign up a test user
2. Complete the 4-step form
3. Click "Start Build"
4. Watch building interface
5. Verify preview loads
6. Test regeneration (should limit at 3 for FREE)
7. Test buyout download (requires `has_buyout = true`)

### Test Preview Expiration

1. Create draft with FREE tier user
2. Set `preview_expires_at` to past date
3. Try to access preview
4. Should show expiration message

## Troubleshooting

### "Draft not found" error
- Check if draft exists in database
- Verify user has access to draft

### "Generation limit reached"
- Check `generation_count` vs `max_generations`
- For Pro users, check monthly reset logic

### Preview not loading
- Check if `metadata.html_code` exists
- Verify preview expiration hasn't passed
- Check browser console for errors

### Claude API errors
- Verify `CLAUDE_API_KEY` is set
- Check API rate limits
- Verify API key has sufficient credits

## Next Steps

1. ✅ Basic generation flow
2. ✅ Preview system
3. ✅ Regeneration limits
4. ⏳ Vercel preview deployment
5. ⏳ Payment integration (Flutterwave)
6. ⏳ Custom domain connection
7. ⏳ Client dashboard for Pro users


