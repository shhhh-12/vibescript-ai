# Vibe Script Creator - Setup Guide

## Getting Started

This application uses OpenRouter AI to generate scripts. You'll need to provide your own OpenRouter API key to get started.

### Step 1: Get Your OpenRouter API Key

1. Visit [OpenRouter](https://openrouter.ai/)
2. Sign up for an account
3. Go to [API Keys](https://openrouter.ai/keys)
4. Create a new API key
5. Copy the key (it starts with `sk-or-v1-`)

### Step 2: Configure the App

1. **First Time Setup**: When you first visit the app, you'll see a setup screen
2. **Enter API Key**: Paste your OpenRouter API key in the input field
3. **Validate**: Click "Save API Key" to validate and store your key
4. **Start Creating**: Once validated, you can start generating scripts!

### Security Notes

- Your API key is stored locally in your browser's localStorage
- It's never sent to our servers
- You can remove the key at any time using the "Remove API Key" button
- The key persists between browser sessions

### Troubleshooting

**"API Key Not Configured" Error**
- Make sure you've entered your API key in the setup section
- Check that the key is valid and active on OpenRouter

**"Invalid API Key" Error**
- Verify your API key is correct
- Ensure your OpenRouter account has sufficient credits
- Check if the key has expired

**Script Generation Fails**
- Verify your internet connection
- Check if OpenRouter services are available
- Ensure your API key has the necessary permissions

### API Key Format

Your OpenRouter API key should look like this:
```
sk-or-v1-1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
```

### Support

If you continue to have issues:
1. Check the [OpenRouter Status Page](https://status.openrouter.ai/)
2. Verify your API key in the [OpenRouter Dashboard](https://openrouter.ai/keys)
3. Ensure your account has sufficient credits

---

**Note**: This app is designed to work entirely client-side. Your API key and all data processing happens in your browser for maximum privacy and security.
