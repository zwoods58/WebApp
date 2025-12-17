# OpenRouter API Migration Guide

## ✅ Migration Complete

All Edge Functions have been updated to use **OpenRouter API with Gemini 3 Flash** instead of the direct Gemini API.

## 🔄 What Changed

### Updated Edge Functions:
1. ✅ `voice-to-transaction` - Voice transcription
2. ✅ `receipt-to-transaction` - Receipt OCR (image processing)
3. ✅ `generate-report` - Financial report generation
4. ✅ `financial-coach` - AI coaching responses
5. ✅ `voice-login` - Voice authentication

### API Changes:
- **Old**: Direct Gemini API (`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`)
- **New**: OpenRouter API (`https://openrouter.ai/api/v1/chat/completions`)
- **Model**: `google/gemini-3-flash` (via OpenRouter)

## 🔑 Environment Variable Update

### Before:
```bash
GEMINI_API_KEY=your-gemini-api-key
```

### After:
```bash
OPENROUTER_API_KEY=your-openrouter-api-key
```

## 📝 Setup Instructions

### 1. Get OpenRouter API Key
1. Visit [OpenRouter.ai](https://openrouter.ai)
2. Sign up / Log in
3. Go to **API Keys** section
4. Create a new API key
5. Copy the key (starts with `sk-or-v1-...`)

### 2. Update Supabase Secrets

**Remove old Gemini key:**
```bash
supabase secrets unset GEMINI_API_KEY
```

**Add OpenRouter key:**
```bash
supabase secrets set OPENROUTER_API_KEY=sk-or-v1-your-key-here
```

### 3. Update Local Environment (Optional)

If you have `.env.local` or similar files, update:
```bash
# Remove
GEMINI_API_KEY=...

# Add
OPENROUTER_API_KEY=sk-or-v1-your-key-here
```

## 🎯 Model Information

- **Model Name**: `google/gemini-3-flash`
- **Provider**: OpenRouter (aggregator)
- **Format**: OpenAI-compatible API
- **Features**: 
  - Text generation ✅
  - Image processing (Vision) ✅
  - Audio processing ✅

## ⚠️ Important Notes

### Audio Format
The voice-to-transaction function uses `input_audio` format. If you encounter issues with audio processing, you may need to adjust the format based on OpenRouter's specific requirements for Gemini models.

### Image Format
Receipt scanning uses the standard OpenAI-compatible image format:
```json
{
  "type": "image_url",
  "image_url": {
    "url": "data:image/jpeg;base64,..."
  }
}
```

### Error Handling
All functions now check for `OPENROUTER_API_KEY` and provide clear error messages if it's missing.

## 🧪 Testing

After updating the secret, test each function:

1. **Voice Transaction**: Record a voice note and process it
2. **Receipt Scanner**: Upload a receipt image
3. **Report Generator**: Generate a financial report
4. **Financial Coach**: Ask a coaching question
5. **Voice Login**: Test voice authentication

## 📚 Resources

- [OpenRouter Documentation](https://openrouter.ai/docs)
- [OpenRouter Models](https://openrouter.ai/models)
- [OpenRouter API Reference](https://openrouter.ai/docs/api-reference)

## 🔍 Troubleshooting

### Error: "OPENROUTER_API_KEY not configured"
- Make sure you've set the secret: `supabase secrets set OPENROUTER_API_KEY=...`
- Redeploy the Edge Functions after setting the secret

### Error: "401 Unauthorized"
- Check that your API key is correct
- Verify the key starts with `sk-or-v1-...`
- Check your OpenRouter account has credits/balance

### Error: "Model not found"
- Verify the model name: `google/gemini-3-flash`
- Check OpenRouter's available models page
- If Gemini 3 Flash isn't available, try `google/gemini-2.5-flash` or `google/gemini-2.0-flash-exp:free`

## 💰 Cost Comparison

**Before (Direct Gemini API):**
- Free tier: 15 RPM (requests per minute)
- Paid: Based on Google's pricing

**After (OpenRouter):**
- Check OpenRouter pricing for Gemini 3 Flash
- May have different rate limits
- Unified billing through OpenRouter

---

**Migration Date**: December 13, 2024
**Status**: ✅ Complete - Ready for testing

