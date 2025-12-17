# OpenRouter + Claude AI Integration for AI Builder

## Overview

The AI Builder now uses a **two-model approach** for generating websites:

1. **Gemini (via OpenRouter)** - Image analysis and selection
2. **Claude (Anthropic)** - Website code generation

This creates a powerful workflow inspired by **bolt.new** and **lovable.dev**.

---

## Architecture

### **Workflow: With Uploaded Image**

```
User uploads image
    ↓
Image stored in Supabase Storage
    ↓
Gemini analyzes image via OpenRouter
    → Extracts colors, style, description
    ↓
Analysis passed to Claude Haiku (structure)
    ↓
Analysis + image passed to Claude Sonnet (polish)
    ↓
Final website uses uploaded image as hero background
```

### **Workflow: Without Uploaded Image**

```
User provides prompt only
    ↓
Gemini selects perfect Unsplash images via OpenRouter
    → Based on business type and aesthetic
    ↓
Image suggestions passed to Claude Haiku (structure)
    ↓
Image URLs passed to Claude Sonnet (polish)
    ↓
Final website uses AI-selected images
```

---

## Setup Instructions

### 1. Add OpenRouter API Key

Add to `.env.local`:

```bash
OPENROUTER_API_KEY=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
```

### 2. Set Up Supabase Storage

Follow instructions in `SUPABASE_STORAGE_SETUP.md` to create the `user-uploads` bucket.

### 3. Verify All Environment Variables

Ensure you have:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# AI Models
OPENROUTER_API_KEY=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
CLAUDE_API_KEY=your_claude_api_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Test the Integration

1. Start dev server: `npm run dev`
2. Go to `/ai-builder`
3. Log in or sign up
4. Enter a prompt: "Create a coffee shop website in Nairobi"
5. **Option A:** Upload an image (logo, hero, product photo)
6. **Option B:** Skip image upload (AI will select images)
7. Click "START BUILD ✨"
8. Watch the generation process:
   - Step 0: Image analysis/selection (Gemini)
   - Step 1: Analyzing requirements
   - Step 2: Designing structure
   - Step 3: Building structure (Claude Haiku)
   - Step 4: Polishing design (Claude Sonnet)
   - Step 5: Adding JavaScript
   - Step 6: Making responsive
   - Step 7: Creating preview

---

## File Structure

### New Files Created

```
modern-site/
├── ai_builder/lib/ai/
│   └── openrouter.ts              # OpenRouter service for Gemini
├── app/api/ai-builder/generate/
│   └── route.ts                   # Updated with image workflow
├── app/ai-builder/
│   └── page.tsx                   # Updated with image upload UI
├── SUPABASE_STORAGE_SETUP.md      # Supabase Storage instructions
└── OPENROUTER_AI_INTEGRATION.md   # This file
```

### Modified Files

- `app/api/ai-builder/generate/route.ts` - Added image analysis step
- `app/ai-builder/page.tsx` - Added image upload field
- `ai_builder/lib/ai/openrouter.ts` - New OpenRouter service

---

## API Usage

### OpenRouter API

**Model:** `google/gemini-2.0-flash-exp:free`

**Endpoints Used:**
1. `analyzeUploadedImage()` - Analyzes user-uploaded images
2. `generateImageSuggestions()` - Selects Unsplash images when no upload

**Cost:** Free tier (no charges)

### Claude API

**Models:**
1. **Haiku** - Fast structure generation
2. **Sonnet 3.5** - High-quality polish

**Cost:** Pay-per-token (ensure Claude API key has credits)

---

## Image Analysis Output

When Gemini analyzes an image, it returns:

```typescript
{
  description: "Modern coffee shop interior with warm lighting...",
  suggestedImages: ["hero", "about"],
  colorPalette: ["#8B4513", "#D2691E", "#F5DEB3"],
  styleRecommendations: "Warm, inviting, rustic aesthetic"
}
```

This data is then injected into Claude's prompts:

```typescript
// Structure Prompt (Haiku)
`
🎨 UPLOADED IMAGE ANALYSIS (from Gemini AI):
Description: Modern coffee shop interior...
Extracted Color Palette: #8B4513, #D2691E, #F5DEB3
Style Recommendations: Warm, inviting, rustic aesthetic
`

// Polish Prompt (Sonnet)
`
🚨 CRITICAL: Use the UPLOADED IMAGE as hero background
Color Palette: #8B4513, #D2691E, #F5DEB3
Match these colors throughout the design
`
```

---

## AI Image Selection (No Upload)

When no image is uploaded, Gemini selects Unsplash images:

```typescript
{
  heroImage: "1555939596-4b03f3b8c8b0",      // Coffee shop interior
  aboutImage: "1504674900247-0877df9cc836",   // Barista preparing coffee
  serviceImages: [
    "1556910096-6f5e5b160d33",  // Coffee beans
    "1493770348161-369560ae357d", // Latte art
    "1543362906-acfc16c67564",  // Espresso machine
    "1565958011703-44f9829ba187"  // Coffee tasting
  ],
  imageDescriptions: [
    "Hero: Warm coffee shop interior",
    "About: Professional barista",
    "Service 1: Premium coffee beans",
    ...
  ]
}
```

Claude receives these curated images and uses them throughout the website.

---

## Error Handling

### Image Upload Fails
- Alert shown to user
- Generation continues without image
- Fallback: Gemini selects Unsplash images

### Gemini Analysis Fails
- Logged to console
- Generation continues with default images
- Claude still generates high-quality website

### Gemini Image Selection Fails
- Falls back to hardcoded Unsplash IDs by industry
- Ensures website always has images

---

## Testing Checklist

- [ ] Image upload works (file selection)
- [ ] Image preview shows after upload
- [ ] Remove image button works
- [ ] Upload without image triggers AI selection
- [ ] Gemini analysis returns valid JSON
- [ ] Claude receives image context
- [ ] Generated website uses uploaded image
- [ ] Generated website uses AI-selected images (no upload)
- [ ] Color palette matches uploaded image
- [ ] Build compiles successfully

---

## Future Enhancements

### Phase 2 (Next Steps)
- [ ] Support multiple image uploads (logo + hero + products)
- [ ] Image editing/cropping in UI
- [ ] AI-generated images (DALL-E, Midjourney)
- [ ] Image optimization and compression
- [ ] Background removal for logos

### Phase 3 (Advanced)
- [ ] Real-time image analysis preview
- [ ] Style transfer between images
- [ ] Brand color extraction and palette generation
- [ ] Automatic image tagging and SEO alt text

---

## Cost Estimates

### OpenRouter (Gemini)
- **Free tier:** No cost for `gemini-2.0-flash-exp:free`
- Usage: 2 calls per generation (analysis + selection)

### Claude API
- **Haiku:** ~$0.01 per generation (4K tokens)
- **Sonnet 3.5:** ~$0.05 per generation (8K tokens)
- **Total:** ~$0.06 per website generation

### Supabase Storage
- **Free tier:** 1GB storage
- Average image: 500KB
- **Capacity:** ~2000 images before paid plan

---

## Troubleshooting

### "OPENROUTER_API_KEY not set"
- Add key to `.env.local`
- Restart dev server

### "Supabase configuration missing"
- Verify all Supabase env vars are set
- Check Supabase dashboard for correct values

### "Image upload failed"
- Check Supabase Storage bucket exists
- Verify storage policies are set
- Ensure file size < 5MB

### "Image analysis returned no data"
- Check OpenRouter API key is valid
- Verify image URL is publicly accessible
- Review console logs for detailed error

---

## Support

For issues or questions:
1. Check console logs for detailed errors
2. Verify all environment variables
3. Test Supabase Storage manually
4. Verify OpenRouter API key works (test with curl)

---

## Summary

✅ **Gemini** analyzes images and selects perfect Unsplash images  
✅ **Claude** generates high-quality website code  
✅ **Seamless workflow** with or without user-uploaded images  
✅ **Fallback systems** ensure generation never fails  
✅ **Cost-effective** using free Gemini tier + Claude pay-per-use  

**Result:** Professional, image-rich websites generated in seconds! 🚀

