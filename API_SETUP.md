# OpenRouter API Setup Guide

Nova uses OpenRouter to access multiple AI models including GPT-4, Claude, Gemini, and more. This guide will help you set up your API key.

## 🚀 Quick Setup

### 1. Get Your API Key

1. **Visit OpenRouter**: Go to [https://openrouter.ai/keys](https://openrouter.ai/keys)
2. **Create Account**: Sign up for a free account
3. **Generate Key**: Create a new API key
4. **Copy Key**: Your key will start with `sk-or-`

### 2. Configure Nova

1. **Start Nova**: Run `npm run dev` and open the app
2. **Open Settings**: Press `S` or click "AI Settings" in the control panel
3. **Enter API Key**: Paste your OpenRouter API key
4. **Save**: Click "Save API Key"
5. **Select Model**: Choose your preferred AI model

## 🤖 Available AI Models

Nova supports multiple AI models through OpenRouter:

### **OpenAI Models**
- **GPT-4**: Most capable, best for complex tasks
- **GPT-4 Turbo**: Faster, more cost-effective
- **GPT-3.5 Turbo**: Good balance of speed and capability

### **Anthropic Models**
- **Claude 3 Opus**: Most advanced Claude model
- **Claude 3 Sonnet**: Fast and capable
- **Claude 3 Haiku**: Lightweight and fast

### **Google Models**
- **Gemini Pro**: Google's latest AI model

### **Open Source Models**
- **Llama 2 70B**: Meta's open-source model
- **Mistral 7B**: Fast and efficient

## 💰 Pricing

OpenRouter uses a pay-per-use model:

- **Free Tier**: $5 credit to start
- **GPT-4**: ~$0.03 per 1K tokens
- **Claude 3**: ~$0.015 per 1K tokens
- **Gemini Pro**: ~$0.0005 per 1K tokens
- **Open Source**: Often free or very cheap

## 🔧 Advanced Configuration

### Environment Variables (Optional)

Create a `.env` file in your project root:

```bash
VITE_OPENROUTER_API_KEY=sk-or-your-api-key-here
```

### Model Selection

Different models excel at different tasks:

- **Creative Writing**: GPT-4, Claude 3 Opus
- **Code Generation**: GPT-4, Claude 3 Sonnet
- **Fast Responses**: GPT-3.5 Turbo, Mistral 7B
- **Cost-Effective**: Gemini Pro, Open Source models

### API Limits

- **Rate Limits**: Vary by model
- **Token Limits**: 4K-32K tokens per request
- **Concurrent Requests**: Usually 5-10 per minute

## 🛠️ Troubleshooting

### Common Issues

**"API key is required"**
- Make sure you've entered the correct API key
- Check that the key starts with `sk-or-`
- Verify the key is saved in settings

**"Failed to get AI response"**
- Check your internet connection
- Verify your API key is valid
- Check your OpenRouter account balance
- Try a different model

**"Speech recognition error"**
- Allow microphone access in your browser
- Check that your microphone is working
- Try refreshing the page

### Getting Help

1. **Check OpenRouter Dashboard**: [https://openrouter.ai/dashboard](https://openrouter.ai/dashboard)
2. **View API Usage**: Monitor your usage and costs
3. **Contact Support**: OpenRouter has excellent support

## 🔒 Security

- **API Keys**: Never share your API key publicly
- **Local Storage**: Keys are stored securely in your browser
- **HTTPS**: All API calls use secure connections
- **No Server**: Nova runs entirely in your browser

## 🎯 Best Practices

### For Development
- Use cheaper models during development
- Monitor your API usage
- Set up usage alerts in OpenRouter

### For Production
- Use appropriate models for your use case
- Implement rate limiting if needed
- Consider caching responses

## 🌟 Pro Tips

1. **Model Switching**: Try different models for different tasks
2. **Cost Optimization**: Use cheaper models for simple queries
3. **Response Quality**: GPT-4 and Claude 3 provide the best responses
4. **Speed**: GPT-3.5 Turbo and Gemini Pro are fastest
5. **Customization**: Each model has different strengths

## 📊 Usage Monitoring

Monitor your usage at [https://openrouter.ai/dashboard](https://openrouter.ai/dashboard):

- **Daily Usage**: Track your daily API calls
- **Cost Analysis**: See which models cost the most
- **Usage Patterns**: Understand your usage patterns
- **Billing**: Set up payment methods and alerts

---

**Ready to experience the future of AI interaction with Nova!** 🚀 