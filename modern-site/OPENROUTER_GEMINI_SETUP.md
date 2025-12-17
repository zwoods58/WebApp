# OpenRouter + Gemini 3 Pro Setup Guide

## ✅ Configuration Complete

The AI Builder is now configured to use **OpenRouter API with Gemini 2.0 Flash (Free)** for all generation tasks.

## 🔑 API Key Setup

You already have `OPENROUTER_API_KEY` in your `.env.local` file. Make sure it's set:

```env
OPENROUTER_API_KEY=sk-or-v1-...
```

## 📝 Current Model Configuration

**Model Used**: `google/gemini-2.0-flash-exp:free`

This is the latest free Gemini model available on OpenRouter. If you want to use a different Gemini model, you can update the model name in the code.

### Available Gemini Models on OpenRouter:

- `google/gemini-2.0-flash-exp:free` - Gemini 2.0 Flash (Free) ✅ Currently using
- `google/gemini-pro` - Gemini Pro (Paid)
- `google/gemini-1.5-pro` - Gemini 1.5 Pro (Paid)
- `google/gemma-3-27b-it:free` - Gemma 3 (Free, but different from Gemini)

**Note**: If "Gemini 3 Pro" becomes available on OpenRouter, we can update the model name. Currently, Gemini 2.0 Flash is the latest free Gemini model.

## 🔄 What Changed

1. **Removed all Claude API calls**
2. **Using OpenRouter API exclusively**
3. **All generation tasks use Gemini 2.0 Flash (Free)**
4. **Proper error handling for OpenRouter**

## 📍 API Endpoints Used

- **Structure Generation**: OpenRouter → Gemini 2.0 Flash
- **Design Polishing**: OpenRouter → Gemini 2.0 Flash
- **Prompt Parsing**: OpenRouter → Gemini 2.0 Flash

## ⚠️ Error Handling

The system now provides clear error messages if:
- `OPENROUTER_API_KEY` is not set
- API key is invalid (401 error)
- API request fails

## 🚀 Next Steps

1. Make sure `OPENROUTER_API_KEY` is in your `.env.local`
2. Restart your dev server
3. Try generating a website
4. Check console logs for any errors

## 📚 OpenRouter Documentation

- [OpenRouter API Docs](https://openrouter.ai/docs)
- [Get API Key](https://openrouter.ai/keys)
- [Available Models](https://openrouter.ai/models)

---

**Status**: ✅ Ready to use with OpenRouter + Gemini 2.0 Flash (Free)

