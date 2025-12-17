# Claude API Setup Guide

## Environment Variables

Add the following to your `.env.local` file in the `modern-site` folder:

```bash
# Claude API Configuration
CLAUDE_API_KEY=your-anthropic-api-key-here
```

## Getting Your Claude API Key

1. Go to https://console.anthropic.com/
2. Sign up or log in to your account
3. Navigate to **API Keys** in the dashboard
4. Click **Create Key**
5. Copy the API key
6. Add it to your `.env.local` file

## Current Model Configuration

The AI builder is currently configured to use:
- **Model**: `claude-3-haiku-20240307` (Claude Haiku - fast and cost-effective)
- **Max Tokens**: 16000
- **API Version**: 2023-06-01

## Available Claude Models

You can change the model in `app/api/ai-builder/generate/route.ts`:

- `claude-3-haiku-20240307` - Fastest, most cost-effective (currently used)
- `claude-3-sonnet-20240229` - Balanced performance
- `claude-3-5-sonnet-20240620` - Most capable, slower

## Troubleshooting

### 404 Error
- Make sure your API key is correct
- Verify the API key is in `.env.local` (not `.env`)
- Restart your dev server after adding the key
- Check that the API key has the correct permissions

### 401 Unauthorized
- Your API key might be invalid or expired
- Generate a new API key from Anthropic console

### Rate Limits
- Haiku has higher rate limits than Sonnet
- If you hit rate limits, consider upgrading your Anthropic plan


