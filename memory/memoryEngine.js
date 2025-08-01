class MemoryEngine {
  constructor() {
    this.memories = []
    this.embeddings = []
    this.emotionalContext = []
    this.userProfile = null
    this.assistantPersona = null
    this.loadProfiles()
  }

  // Load user and assistant profiles
  async loadProfiles() {
    try {
      const userResponse = await fetch('/identity/userProfile.json')
      this.userProfile = await userResponse.json()
      
      const personaResponse = await fetch('/identity/assistantPersona.json')
      this.assistantPersona = await personaResponse.json()
      
      console.log('🔄 Profiles loaded:', { user: this.userProfile, persona: this.assistantPersona })
    } catch (error) {
      console.error('❌ Failed to load profiles:', error)
    }
  }

  // Create embedding for memory storage
  async createEmbedding(text) {
    try {
      const apiKey = localStorage.getItem('nova_openai_api_key')
      if (!apiKey) {
        console.error('❌ No OpenAI API key found for embeddings')
        return null
      }
      
      const response = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'text-embedding-3-small',
          input: text
        })
      })
      
      const data = await response.json()
      return data.data[0].embedding
    } catch (error) {
      console.error('❌ Embedding creation failed:', error)
      return null
    }
  }

  // Store memory with emotional context
  async storeMemory(input, response, emotionalContext = {}) {
    const memory = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      input: input,
      response: response,
      emotionalContext: {
        userMood: emotionalContext.userMood || 'neutral',
        intensity: emotionalContext.intensity || 0.5,
        triggers: emotionalContext.triggers || [],
        keywords: emotionalContext.keywords || []
      },
      embedding: await this.createEmbedding(`${input} ${response}`)
    }

    this.memories.push(memory)
    this.saveMemories()
    
    console.log('💾 Memory stored:', memory.id)
    return memory
  }

  // Recall relevant memories based on similarity
  async recallMemories(query, limit = 5) {
    if (this.memories.length === 0) return []

    const queryEmbedding = await this.createEmbedding(query)
    if (!queryEmbedding) return []

    const similarities = this.memories.map(memory => ({
      memory,
      similarity: this.cosineSimilarity(queryEmbedding, memory.embedding)
    }))

    similarities.sort((a, b) => b.similarity - a.similarity)
    return similarities.slice(0, limit).map(item => item.memory)
  }

  // Calculate cosine similarity
  cosineSimilarity(vecA, vecB) {
    if (!vecA || !vecB) return 0
    
    const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0)
    const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0))
    const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0))
    
    return dotProduct / (magnitudeA * magnitudeB)
  }

  // Track emotional patterns
  trackEmotionalPattern(input, detectedMood) {
    const emotionalEntry = {
      timestamp: new Date().toISOString(),
      input: input,
      detectedMood: detectedMood,
      intensity: this.calculateIntensity(input)
    }

    this.emotionalContext.push(emotionalEntry)
    this.saveEmotionalContext()
    
    // Update user profile with emotional state
    if (this.userProfile) {
      this.userProfile.user.emotional_state.current_mood = detectedMood
      this.userProfile.user.emotional_state.last_emotional_shift = new Date().toISOString()
    }
  }

  // Calculate emotional intensity from text
  calculateIntensity(text) {
    const intensityKeywords = {
      high: ['urgent', 'emergency', 'panic', 'desperate', 'critical'],
      medium: ['frustrated', 'annoyed', 'concerned', 'worried'],
      low: ['calm', 'relaxed', 'peaceful', 'content']
    }

    const lowerText = text.toLowerCase()
    let maxIntensity = 0

    Object.entries(intensityKeywords).forEach(([level, keywords]) => {
      const matches = keywords.filter(keyword => lowerText.includes(keyword)).length
      if (matches > 0) {
        const intensity = level === 'high' ? 0.8 : level === 'medium' ? 0.5 : 0.2
        maxIntensity = Math.max(maxIntensity, intensity)
      }
    })

    return maxIntensity
  }

  // Get emotional summary
  getEmotionalSummary() {
    if (this.emotionalContext.length === 0) return null

    const recentMoods = this.emotionalContext.slice(-10)
    const moodCounts = {}
    
    recentMoods.forEach(entry => {
      moodCounts[entry.detectedMood] = (moodCounts[entry.detectedMood] || 0) + 1
    })

    const dominantMood = Object.entries(moodCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'neutral'

    const averageIntensity = recentMoods.reduce((sum, entry) => sum + entry.intensity, 0) / recentMoods.length

    return {
      dominantMood,
      averageIntensity,
      recentPatterns: recentMoods.map(entry => entry.detectedMood)
    }
  }

  // Save memories to localStorage
  saveMemories() {
    try {
      localStorage.setItem('nova_memories', JSON.stringify(this.memories))
    } catch (error) {
      console.error('❌ Failed to save memories:', error)
    }
  }

  // Load memories from localStorage
  loadMemories() {
    try {
      const saved = localStorage.getItem('nova_memories')
      if (saved) {
        this.memories = JSON.parse(saved)
        console.log('🔄 Loaded memories:', this.memories.length)
      }
    } catch (error) {
      console.error('❌ Failed to load memories:', error)
    }
  }

  // Save emotional context
  saveEmotionalContext() {
    try {
      localStorage.setItem('nova_emotional_context', JSON.stringify(this.emotionalContext))
    } catch (error) {
      console.error('❌ Failed to save emotional context:', error)
    }
  }

  // Load emotional context
  loadEmotionalContext() {
    try {
      const saved = localStorage.getItem('nova_emotional_context')
      if (saved) {
        this.emotionalContext = JSON.parse(saved)
        console.log('🔄 Loaded emotional context:', this.emotionalContext.length)
      }
    } catch (error) {
      console.error('❌ Failed to load emotional context:', error)
    }
  }

  // Initialize memory system
  async initialize() {
    this.loadMemories()
    this.loadEmotionalContext()
    await this.loadProfiles()
    console.log('🧠 Memory engine initialized')
  }
}

export default MemoryEngine 