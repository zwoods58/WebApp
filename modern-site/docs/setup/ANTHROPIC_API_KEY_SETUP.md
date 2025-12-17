# Anthropic API Key Setup Guide

## ✅ Configuration Complete

The AI Builder is now configured to use **Claude Sonnet 4.5** (`claude-sonnet-4-5-20250929`) for all generation tasks.

## 🔑 API Key Requirements

According to the [Anthropic API documentation](https://platform.claude.com/docs/en/api/overview), you need:

1. **An Anthropic Console account**: [Sign up here](https://console.anthropic.com)
2. **An API key**: [Get your key here](https://console.anthropic.com/settings/keys)

## 📝 Environment Variable Setup

Add this to your `.env.local` file:

```env
ANTHROPIC_API_KEY=sk-ant-api03-...
```

### ✅ API Key Format Validation

The system now validates that your API key:
- **Starts with `sk-ant-`** (Anthropic API key format)
- **Is not empty**
- **Is properly configured**

If your key doesn't start with `sk-ant-`, you'll see a clear error message.

## 🔍 How to Get Your API Key

1. Go to [Anthropic Console](https://console.anthropic.com)
2. Sign in or create an account
3. Navigate to [Account Settings > API Keys](https://console.anthropic.com/settings/keys)
4. Click "Create Key"
5. Copy the key (it starts with `sk-ant-`)
6. Add it to your `.env.local` file:
   ```env
   ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxx
   ```
7. **Restart your dev server** for changes to take effect

## ⚠️ Common Issues

### Error: "invalid x-api-key" (401)

**Possible causes:**
1. **API key not set**: Make sure `ANTHROPIC_API_KEY` is in your `.env.local`
2. **Wrong format**: Key should start with `sk-ant-`
3. **Invalid key**: The key might be expired or revoked
4. **Wrong environment**: Make sure you're using the key in the correct environment (dev/prod)

**Solutions:**
- Check your `.env.local` file exists and has `ANTHROPIC_API_KEY=sk-ant-...`
- Verify the key at [Console](https://console.anthropic.com/settings/keys)
- Generate a new key if needed
- Restart your dev server after adding/changing the key

### Error: "API key not configured"

**Solution:**
- Add `ANTHROPIC_API_KEY=sk-ant-...` to your `.env.local` file
- Restart your dev server

## 📚 Model Information

**Current Model**: `claude-sonnet-4-5-20250929` (Claude Sonnet 4.5)

According to the [models documentation](https://platform.claude.com/docs/en/about-claude/models/overview):
- **Best for**: Complex agents and coding tasks
- **Context window**: 200K tokens (standard) / 1M tokens (beta)
- **Max output**: 64K tokens
- **Pricing**: $3 / input MTok, $15 / output MTok

## ✅ Verification Checklist

- [ ] API key starts with `sk-ant-`
- [ ] API key is in `.env.local` as `ANTHROPIC_API_KEY`
- [ ] Dev server restarted after adding key
- [ ] No typos in the API key
- [ ] Key is active in [Console](https://console.anthropic.com/settings/keys)

## 🚀 Next Steps

1. Add your `ANTHROPIC_API_KEY` to `.env.local`
2. Restart your dev server
3. Try generating a website again
4. Check the console for any error messages

---

**Need help?** Check the [Anthropic API documentation](https://platform.claude.com/docs/en/api/overview) or [support](https://support.claude.com/).

