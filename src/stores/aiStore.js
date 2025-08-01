import { create } from 'zustand';

const useAIStore = create((set, get) => ({
  // AI Status
  aiStatus: 'idle', // idle, loading, ready, error
  isApiConfigured: false,
  isElevenLabsConfigured: false,
  
  // Model Management
  currentModel: 'gpt-4',
  availableModels: [
    'gpt-4',
    'gpt-3.5-turbo',
    'claude-3-opus',
    'claude-3-sonnet',
    'claude-3-haiku'
  ],
  
  // Conversation State
  conversation: [],
  interimTranscript: '',
  
  // API Keys
  openaiApiKey: '',
  openrouterApiKey: '',
  elevenLabsApiKey: '',
  voiceId: 'iLmeuTQNYy7TOalZwjP7',
  
  // Initialize AI
  initializeAI: async () => {
    set({ aiStatus: 'loading' });
    try {
      // Check if API keys are configured
      const keys = get().getApiKeys();
      if (keys.openai || keys.openrouter) {
        set({ 
          isApiConfigured: true,
          aiStatus: 'ready' 
        });
      } else {
        set({ 
          isApiConfigured: false,
          aiStatus: 'error' 
        });
      }
      
      // Check ElevenLabs configuration
      if (keys.elevenlabs) {
        set({ isElevenLabsConfigured: true });
      }
    } catch (error) {
      console.error('Failed to initialize AI:', error);
      set({ aiStatus: 'error' });
    }
  },
  
  // Get API Keys
  getApiKeys: () => {
    const state = get();
    return {
      openai: state.openaiApiKey,
      openrouter: state.openrouterApiKey,
      elevenlabs: state.elevenLabsApiKey,
      voiceId: state.voiceId
    };
  },
  
  // Set API Keys
  setApiKeys: (keys) => {
    set({
      openaiApiKey: keys.openai || '',
      openrouterApiKey: keys.openrouter || '',
      elevenLabsApiKey: keys.elevenlabs || '',
      voiceId: keys.voiceId || 'iLmeuTQNYy7TOalZwjP7'
    });
  },
  
  // Model Management
  switchModel: (model) => {
    set({ currentModel: model });
  },
  
  getCurrentModel: () => {
    return get().currentModel;
  },
  
  getAvailableModels: () => {
    return get().availableModels;
  },
  
  // Conversation Management
  addMessage: (message) => {
    const conversation = get().conversation;
    set({ conversation: [...conversation, message] });
  },
  
  clearConversation: () => {
    set({ conversation: [] });
  },
  
  getInterimTranscript: () => {
    return get().interimTranscript;
  },
  
  setInterimTranscript: (transcript) => {
    set({ interimTranscript: transcript });
  },
  
  // AI Response Generation
  generateResponse: async (message) => {
    set({ aiStatus: 'loading' });
    try {
      const keys = get().getApiKeys();
      const model = get().currentModel;
      
      // Use OpenRouter if available, otherwise OpenAI
      const apiKey = keys.openrouter || keys.openai;
      const apiUrl = keys.openrouter 
        ? 'https://openrouter.ai/api/v1/chat/completions'
        : 'https://api.openai.com/v1/chat/completions';
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          ...(keys.openrouter && { 'HTTP-Referer': window.location.origin })
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: 'system', content: 'You are a helpful AI assistant.' },
            { role: 'user', content: message }
          ],
          max_tokens: 1000,
          temperature: 0.7
        })
      });
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }
      
      const data = await response.json();
      const aiResponse = data.choices[0].message.content;
      
      // Add to conversation
      get().addMessage({ role: 'user', content: message });
      get().addMessage({ role: 'assistant', content: aiResponse });
      
      set({ aiStatus: 'ready' });
      return aiResponse;
      
    } catch (error) {
      console.error('Failed to generate response:', error);
      set({ aiStatus: 'error' });
      throw error;
    }
  },
  
  // Text-to-Speech
  speakText: async (text) => {
    try {
      const keys = get().getApiKeys();
      if (!keys.elevenlabs) {
        throw new Error('ElevenLabs API key not configured');
      }
      
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${keys.voiceId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': keys.elevenlabs
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5
          }
        })
      });
      
      if (!response.ok) {
        throw new Error(`ElevenLabs API request failed: ${response.status}`);
      }
      
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
      
    } catch (error) {
      console.error('Failed to speak text:', error);
      throw error;
    }
  }
}));

export default useAIStore; 