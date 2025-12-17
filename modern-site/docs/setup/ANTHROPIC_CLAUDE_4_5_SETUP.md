# Anthropic Claude Sonnet 4.5 Setup Guide

## ✅ Migration Complete

The AI Builder has been successfully configured to use **Anthropic Claude Sonnet 4.5** API.

## 🔑 API Configuration

### Model Used
- **Model ID**: `claude-sonnet-4-5` (latest alias, as of late 2025)
- **Alternative**: `claude-sonnet-4-5-20250929` (dated version)
- **Provider**: Anthropic
- **API Version**: `2023-06-01`

### Environment Variable

Add this to your `.env.local` file:

```env
ANTHROPIC_API_KEY=sk-ant-api03-...
```

**Note**: The system also supports `CLAUDE_API_KEY` for backward compatibility, but `ANTHROPIC_API_KEY` is preferred.

## 📝 What Changed

### 1. **Structure Generation**
- **API**: Anthropic Claude API
- **Model**: `claude-sonnet-4-5`
- **Max Tokens**: 4096 (optimized for speed)
- **Timeout**: 2 minutes

### 2. **Code Polishing**
- **API**: Anthropic Claude API
- **Model**: `claude-sonnet-4-5`
- **Max Tokens**: 4096 (optimized for speed)
- **Timeout**: 2 minutes

### 3. **Prompt Parsing**
- **API**: Anthropic Claude API
- **Model**: `claude-sonnet-4-5`
- **Max Tokens**: 1000
- **Timeout**: 30 seconds

## 🔍 API Request Format

All requests use the Anthropic format:

```typescript
fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": process.env.ANTHROPIC_API_KEY,
    "anthropic-version": "2023-06-01"
  },
  body: JSON.stringify({
    model: "claude-sonnet-4-5",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: "..."
      }
    ]
  })
})
```

## 📊 Response Format

Anthropic returns responses in this format:

```json
{
  "content": [
    {
      "type": "text",
      "text": "..."
    }
  ]
}
```

The code parses `data.content?.[0]?.text` to extract the response.

## ⚠️ Important Notes

### Model ID (Late 2025)

As of late 2025, Anthropic has standardized their 4.x family. The correct model IDs are:

- **Latest (Alias)**: `claude-sonnet-4-5` ✅ (Currently used)
- **Dated Version**: `claude-sonnet-4-5-20250929` (Alternative)

**Do NOT use**:
- ❌ `claude-3-5-sonnet-20241022` (This is the 3.5 series, not 4.5)
- ❌ `claude-sonnet-4.5` (Human-friendly name won't work)

### API Key Format

Anthropic API keys:
- **Must start with**: `sk-ant-`
- **Format**: `sk-ant-api03-xxxxxxxxxxxxx`
- **Get your key**: [Anthropic Console](https://console.anthropic.com/settings/keys)

### Beta Headers (Optional)

If you're using agentic/computer-use features, you may need to add beta headers:

```typescript
body: JSON.stringify({
  model: "claude-sonnet-4-5",
  betas: ["computer-use-2024-10-22"], // Only if using computer-use features
  // ... rest of config
})
```

**Note**: The current implementation doesn't use computer-use features, so this is not required.

## 🚀 Performance Optimizations

1. **Request Timeouts**:
   - Structure generation: 2 minutes
   - Code polishing: 2 minutes
   - Prompt parsing: 30 seconds

2. **Token Limits**:
   - Reduced from 8192 to 4096 for faster responses
   - Still sufficient for high-quality output

3. **Error Handling**:
   - Clear timeout messages
   - API key validation
   - Format verification

## 🔍 Debugging

### Verify Key is Loaded

The system automatically logs when the key is found:

```
✅ ANTHROPIC_API_KEY found: sk-ant-api...
```

If you see:
```
⚠️ ANTHROPIC_API_KEY not set. AI generation will fail.
```

**Solution**: Check your `.env.local` file and restart your dev server.

### Common Issues

1. **"Invalid x-api-key" (401)**
   - Check that your key starts with `sk-ant-`
   - Verify the key is active in [Console](https://console.anthropic.com/settings/keys)
   - Ensure no extra spaces or quotes in `.env.local`

2. **"Model not found" (404)**
   - Verify you're using `claude-sonnet-4-5` (not 3.5)
   - Check that your API key has access to Sonnet 4.5

3. **"Request timeout"**
   - The request took longer than 2 minutes
   - Try with a shorter prompt
   - Check your internet connection

## 📚 Resources

- [Anthropic API Documentation](https://platform.claude.com/docs/en/api/overview)
- [Model Overview](https://platform.claude.com/docs/en/about-claude/models/overview)
- [Get API Key](https://console.anthropic.com/settings/keys)
- [API Reference](https://platform.claude.com/docs/en/api/messages)

---

**Status**: ✅ Ready to use with `ANTHROPIC_API_KEY` in `.env.local`

