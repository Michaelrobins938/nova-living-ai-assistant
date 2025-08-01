import { create } from 'zustand';

const useAIStore = create((set, get) => ({
  // AI Status
  aiStatus: 'idle', // idle, loading, ready, error, listening, speaking
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
  conversationHistory: [],
  interimTranscript: '',
  lastVoiceTranscript: '',
  
  // API Keys
  openaiApiKey: '',
  openrouterApiKey: '',
  elevenLabsApiKey: '',
  voiceId: 'iLmeuTQNYy7TOalZwjP7',
  
  // Image Generation
  imageGenerationModels: [
    'openai/dall-e-3',
    'openai/dall-e-2',
    'stability-ai/stable-diffusion-xl-1024-v1-0'
  ],
  generatedImages: [],
  imageGenerationStatus: 'idle',
  
  // Tasks
  tasks: [],
  
  // Processing Status
  isProcessing: false,
  isProcessingMultimodal: false,
  
  // Computer Use & Code Interpreter
  computerUseStatus: 'idle',
  codeInterpreterStatus: 'idle',
  
  // Assistants
  assistants: [],
  currentAssistant: null,
  currentThread: null,
  
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
  
  getConversationHistory: () => {
    return get().conversation;
  },
  
  setConversationHistory: (history) => {
    set({ conversation: history });
  },
  
  getInterimTranscript: () => {
    return get().interimTranscript;
  },
  
  setInterimTranscript: (transcript) => {
    set({ interimTranscript: transcript });
  },
  
  setLastVoiceTranscript: (transcript) => {
    set({ lastVoiceTranscript: transcript });
  },
  
  getLastVoiceTranscript: () => {
    return get().lastVoiceTranscript;
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
  
  // Process User Input (alias for generateResponse)
  processUserInput: async (message) => {
    return get().generateResponse(message);
  },
  
  // Text-to-Speech
  speakText: async (text) => {
    try {
      const keys = get().getApiKeys();
      if (!keys.elevenlabs) {
        throw new Error('ElevenLabs API key not configured');
      }
      
      set({ aiStatus: 'speaking' });
      
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
      
      set({ aiStatus: 'ready' });
      
    } catch (error) {
      console.error('Failed to speak text:', error);
      set({ aiStatus: 'error' });
      throw error;
    }
  },
  
  // Voice Recognition
  startListening: () => {
    set({ aiStatus: 'listening' });
    // Implement voice recognition here
  },
  
  stopListening: () => {
    set({ aiStatus: 'ready' });
    // Stop voice recognition here
  },
  
  // Image Generation
  generateImage: async (prompt, model = 'openai/dall-e-3', size = '1024x1024', quality = 'standard') => {
    set({ imageGenerationStatus: 'generating' });
    try {
      const keys = get().getApiKeys();
      const apiKey = keys.openai;
      
      if (!apiKey) {
        throw new Error('OpenAI API key required for image generation');
      }
      
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          prompt: prompt,
          model: model,
          size: size,
          quality: quality,
          n: 1
        })
      });
      
      if (!response.ok) {
        throw new Error(`Image generation failed: ${response.status}`);
      }
      
      const data = await response.json();
      const imageUrl = data.data[0].url;
      
      const generatedImages = get().generatedImages;
      set({ 
        generatedImages: [...generatedImages, { url: imageUrl, prompt, timestamp: Date.now() }],
        imageGenerationStatus: 'completed'
      });
      
      return imageUrl;
      
    } catch (error) {
      console.error('Failed to generate image:', error);
      set({ imageGenerationStatus: 'error' });
      throw error;
    }
  },
  
  getImageGenerationModels: () => {
    return get().imageGenerationModels;
  },
  
  getImageGenerationStatus: () => {
    return get().imageGenerationStatus;
  },
  
  getGeneratedImages: () => {
    return get().generatedImages;
  },
  
  // API Testing
  testApiConnection: async () => {
    try {
      const keys = get().getApiKeys();
      const apiKey = keys.openrouter || keys.openai;
      
      if (!apiKey) {
        return false;
      }
      
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });
      
      return response.ok;
    } catch (error) {
      console.error('API connection test failed:', error);
      return false;
    }
  },
  
  // Processing Status
  getProcessingStatus: () => {
    return get().isProcessing;
  },
  
  setProcessingStatus: (status) => {
    set({ isProcessing: status });
  },
  
  setProcessingMultimodal: (status) => {
    set({ isProcessingMultimodal: status });
  },
  
  // Tasks Management
  addTask: (task) => {
    const tasks = get().tasks;
    set({ tasks: [...tasks, { ...task, id: Date.now(), completed: false }] });
  },
  
  getActiveTasks: () => {
    return get().tasks.filter(task => !task.completed);
  },
  
  completeTask: (taskId) => {
    const tasks = get().tasks;
    set({ 
      tasks: tasks.map(task => 
        task.id === taskId ? { ...task, completed: true } : task
      )
    });
  },
  
  removeTask: (taskId) => {
    const tasks = get().tasks;
    set({ tasks: tasks.filter(task => task.id !== taskId) });
  },
  
  // Computer Use & Code Interpreter
  startComputerUse: () => {
    set({ computerUseStatus: 'active' });
  },
  
  startCodeInterpreter: () => {
    set({ codeInterpreterStatus: 'active' });
  },
  
  getComputerUseStatus: () => {
    return get().computerUseStatus;
  },
  
  getCodeInterpreterStatus: () => {
    return get().codeInterpreterStatus;
  },
  
  // Assistants
  createAssistant: async (name, instructions) => {
    try {
      const keys = get().getApiKeys();
      const apiKey = keys.openai;
      
      if (!apiKey) {
        throw new Error('OpenAI API key required');
      }
      
      const response = await fetch('https://api.openai.com/v1/assistants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'OpenAI-Beta': 'assistants=v1'
        },
        body: JSON.stringify({
          name: name,
          instructions: instructions,
          model: 'gpt-4'
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to create assistant: ${response.status}`);
      }
      
      const assistant = await response.json();
      const assistants = get().assistants;
      set({ assistants: [...assistants, assistant] });
      
      return assistant;
      
    } catch (error) {
      console.error('Failed to create assistant:', error);
      throw error;
    }
  },
  
  createThread: async () => {
    try {
      const keys = get().getApiKeys();
      const apiKey = keys.openai;
      
      if (!apiKey) {
        throw new Error('OpenAI API key required');
      }
      
      const response = await fetch('https://api.openai.com/v1/threads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'OpenAI-Beta': 'assistants=v1'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to create thread: ${response.status}`);
      }
      
      const thread = await response.json();
      set({ currentThread: thread });
      
      return thread;
      
    } catch (error) {
      console.error('Failed to create thread:', error);
      throw error;
    }
  },
  
  runAssistant: async (assistantId, threadId, message) => {
    try {
      const keys = get().getApiKeys();
      const apiKey = keys.openai;
      
      if (!apiKey) {
        throw new Error('OpenAI API key required');
      }
      
      // Add message to thread
      await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'OpenAI-Beta': 'assistants=v1'
        },
        body: JSON.stringify({
          role: 'user',
          content: message
        })
      });
      
      // Run assistant
      const runResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'OpenAI-Beta': 'assistants=v1'
        },
        body: JSON.stringify({
          assistant_id: assistantId
        })
      });
      
      if (!runResponse.ok) {
        throw new Error(`Failed to run assistant: ${runResponse.status}`);
      }
      
      const run = await runResponse.json();
      return run;
      
    } catch (error) {
      console.error('Failed to run assistant:', error);
      throw error;
    }
  },
  
  getAssistants: () => {
    return get().assistants;
  }
}));

export default useAIStore; 