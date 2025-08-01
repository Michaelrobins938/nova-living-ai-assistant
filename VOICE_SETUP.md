# ElevenLabs Voice Setup Guide

Nova uses ElevenLabs for high-quality, natural voice synthesis. This guide will help you set up your ElevenLabs API key and configure the voice.

## 🚀 Quick Setup

### 1. Get Your ElevenLabs API Key

1. **Visit ElevenLabs**: Go to [https://elevenlabs.io/api](https://elevenlabs.io/api)
2. **Create Account**: Sign up for a free account
3. **Generate Key**: Create a new API key
4. **Copy Key**: Your key will be a long string of characters

### 2. Configure Nova

1. **Start Nova**: Run `npm run dev` and open the app
2. **Open Settings**: Press `S` or click "AI Settings" in the control panel
3. **Enter Voice Key**: Paste your ElevenLabs API key
4. **Save**: Click "Save Voice Key"
5. **Test**: Try speaking to Nova and hear the difference!

## 🎙️ Voice Configuration

### **Current Voice ID**: `iLmeuTQNYy7TOalZwjP7`

This is the specific voice ID configured for Nova. It provides:
- **Natural Speech**: Human-like voice synthesis
- **Emotional Range**: Expresses emotions and tone
- **Clarity**: Crystal clear audio quality
- **Consistency**: Maintains the same voice across conversations

### **Voice Settings**
- **Stability**: 0.5 (balanced consistency and expressiveness)
- **Similarity Boost**: 0.75 (maintains voice characteristics)
- **Model**: `eleven_monolingual_v1` (high-quality English)

## 💰 Pricing

ElevenLabs offers generous free tiers:

- **Free Tier**: 10,000 characters per month
- **Paid Plans**: Starting at $5/month for 30,000 characters
- **Pay-per-use**: $0.30 per 1,000 characters after free tier

## 🎯 Voice Features

### **High-Quality Synthesis**
- **Natural Intonation**: Sounds like a real person
- **Emotional Expression**: Conveys mood and tone
- **Clear Pronunciation**: Perfect for AI assistants
- **Low Latency**: Fast response times

### **Voice Customization**
- **Stability**: Controls voice consistency (0-1)
- **Similarity Boost**: Maintains voice characteristics (0-1)
- **Model Selection**: Choose different quality levels

## 🔧 Advanced Configuration

### **Voice Settings Adjustment**

You can modify voice settings in the code:

```javascript
// In src/stores/aiStore.js
elevenLabsConfig: {
  stability: 0.5,        // 0 = more expressive, 1 = more stable
  similarityBoost: 0.75, // 0 = less similar, 1 = more similar
  modelId: 'eleven_monolingual_v1'
}
```

### **Different Voice Models**

- **eleven_monolingual_v1**: Best for English (current)
- **eleven_multilingual_v1**: Supports multiple languages
- **eleven_turbo_v2**: Faster generation

## 🛠️ Troubleshooting

### Common Issues

**"Voice synthesis error"**
- Check your ElevenLabs API key
- Verify your account has available characters
- Check your internet connection
- Try refreshing the page

**"Failed to get AI response"**
- This is separate from voice - check OpenRouter API
- Voice will fallback to browser synthesis if ElevenLabs fails

**"Audio not playing"**
- Check your browser's audio settings
- Ensure your speakers/headphones are working
- Try a different browser

### Getting Help

1. **Check ElevenLabs Dashboard**: [https://elevenlabs.io/dashboard](https://elevenlabs.io/dashboard)
2. **View Usage**: Monitor your character usage
3. **Contact Support**: ElevenLabs has excellent support

## 🔒 Security

- **API Keys**: Never share your API key publicly
- **Local Storage**: Keys are stored securely in your browser
- **HTTPS**: All API calls use secure connections
- **No Server**: Nova runs entirely in your browser

## 🎯 Best Practices

### **For Development**
- Use the free tier during development
- Monitor your character usage
- Set up usage alerts in ElevenLabs

### **For Production**
- Consider upgrading to paid plans for heavy usage
- Implement character usage monitoring
- Consider caching common responses

## 🌟 Pro Tips

1. **Character Optimization**: Keep responses concise to save characters
2. **Voice Consistency**: The current voice ID provides excellent consistency
3. **Quality vs Speed**: The current model balances quality and speed
4. **Fallback**: Browser synthesis works if ElevenLabs is unavailable
5. **Testing**: Test voice quality with different types of responses

## 📊 Usage Monitoring

Monitor your usage at [https://elevenlabs.io/dashboard](https://elevenlabs.io/dashboard):

- **Character Usage**: Track your monthly character count
- **Voice History**: See which voices you've used
- **Billing**: Set up payment methods and alerts
- **Analytics**: View usage patterns and trends

## 🎨 Voice Customization

### **Changing Voice ID**

To use a different voice:

1. **Find Voice ID**: Browse voices at [https://elevenlabs.io/voice-library](https://elevenlabs.io/voice-library)
2. **Copy Voice ID**: Get the ID from the voice URL
3. **Update Code**: Change the `voiceId` in `src/stores/aiStore.js`

### **Voice Settings**

Adjust voice characteristics:

- **Higher Stability**: More consistent but less expressive
- **Lower Stability**: More expressive but less consistent
- **Higher Similarity**: More similar to original voice
- **Lower Similarity**: More variation in voice

---

**Experience the future of AI voice interaction with Nova!** 🎙️✨ 