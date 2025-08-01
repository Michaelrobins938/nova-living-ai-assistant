class SelfModel {
  constructor() {
    this.currentState = {
      mood: 'neutral',
      confidence: 0.5,
      energy: 0.7,
      focus: 0.8,
      timestamp: new Date().toISOString()
    }
    
    this.goals = []
    this.reflections = []
    this.interactionHistory = []
    this.toneModulations = []
    
    this.loadState()
  }

  // Update emotional state based on interaction
  updateEmotionalState(interaction) {
    const { input, response, userReaction, context } = interaction
    
    // Analyze emotional impact
    let moodShift = 0
    let confidenceShift = 0
    
    // Positive reactions boost mood and confidence
    if (userReaction === 'positive' || userReaction === 'helpful') {
      moodShift += 0.1
      confidenceShift += 0.05
    }
    
    // Negative reactions decrease confidence but may increase focus
    if (userReaction === 'negative' || userReaction === 'confused') {
      confidenceShift -= 0.1
      this.currentState.focus = Math.min(1.0, this.currentState.focus + 0.1)
    }
    
    // Long interactions increase energy
    if (input.length > 100) {
      this.currentState.energy = Math.min(1.0, this.currentState.energy + 0.05)
    }
    
    // Update state
    this.currentState.mood = this.clamp(this.currentState.mood + moodShift, 0, 1)
    this.currentState.confidence = this.clamp(this.currentState.confidence + confidenceShift, 0, 1)
    this.currentState.timestamp = new Date().toISOString()
    
    // Store interaction
    this.interactionHistory.push({
      timestamp: new Date().toISOString(),
      input: input.substring(0, 200),
      response: response.substring(0, 200),
      userReaction,
      emotionalState: { ...this.currentState }
    })
    
    // Reflect on interaction
    this.reflectOnInteraction(interaction)
    
    this.saveState()
  }

  // Reflect on success/failure patterns
  reflectOnInteraction(interaction) {
    const reflection = {
      timestamp: new Date().toISOString(),
      type: 'interaction_reflection',
      insights: [],
      patterns: []
    }
    
    // Analyze recent interactions for patterns
    const recentInteractions = this.interactionHistory.slice(-10)
    
    // Check for repeated user frustrations
    const frustrationCount = recentInteractions.filter(i => i.userReaction === 'negative').length
    if (frustrationCount > 3) {
      reflection.insights.push('User seems frustrated with my responses. Need to adjust approach.')
      this.currentState.confidence = Math.max(0.1, this.currentState.confidence - 0.1)
    }
    
    // Check for successful patterns
    const successCount = recentInteractions.filter(i => i.userReaction === 'positive').length
    if (successCount > 5) {
      reflection.insights.push('Recent interactions have been positive. Building trust.')
      this.currentState.confidence = Math.min(1.0, this.currentState.confidence + 0.05)
    }
    
    // Analyze tone patterns
    const toneAnalysis = this.analyzeTonePatterns(recentInteractions)
    if (toneAnalysis.needsAdjustment) {
      reflection.insights.push(`Tone adjustment needed: ${toneAnalysis.suggestion}`)
    }
    
    this.reflections.push(reflection)
  }

  // Analyze tone patterns in recent interactions
  analyzeTonePatterns(interactions) {
    const tones = interactions.map(i => this.detectTone(i.input))
    const mostCommonTone = this.getMostCommon(tones)
    
    return {
      needsAdjustment: tones.length > 5 && tones.filter(t => t === mostCommonTone).length > 3,
      suggestion: `User prefers ${mostCommonTone} tone. Adjusting accordingly.`,
      dominantTone: mostCommonTone
    }
  }

  // Simple tone detection
  detectTone(text) {
    const lowerText = text.toLowerCase()
    
    if (lowerText.includes('fuck') || lowerText.includes('shit') || lowerText.includes('damn')) {
      return 'casual'
    } else if (lowerText.includes('please') || lowerText.includes('thank you') || lowerText.includes('would you')) {
      return 'formal'
    } else if (lowerText.includes('!') || lowerText.includes('amazing') || lowerText.includes('awesome')) {
      return 'enthusiastic'
    } else {
      return 'neutral'
    }
  }

  // Get most common element in array
  getMostCommon(arr) {
    const counts = {}
    arr.forEach(item => {
      counts[item] = (counts[item] || 0) + 1
    })
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b)
  }

  // Clamp value between min and max
  clamp(value, min, max) {
    return Math.min(Math.max(value, min), max)
  }

  // Get current emotional state
  getCurrentState() {
    return {
      ...this.currentState,
      reflectionCount: this.reflections.length,
      interactionCount: this.interactionHistory.length
    }
  }

  // Get tone suggestion based on current state
  getToneSuggestion() {
    const { mood, confidence, energy } = this.currentState
    
    if (confidence < 0.3) {
      return 'cautious'
    } else if (mood > 0.7 && energy > 0.6) {
      return 'enthusiastic'
    } else if (mood < 0.3) {
      return 'gentle'
    } else {
      return 'balanced'
    }
  }

  // Load state from localStorage
  loadState() {
    try {
      const saved = localStorage.getItem('eidolon_self_model')
      if (saved) {
        const data = JSON.parse(saved)
        this.currentState = data.currentState || this.currentState
        this.reflections = data.reflections || []
        this.interactionHistory = data.interactionHistory || []
        this.toneModulations = data.toneModulations || []
      }
    } catch (error) {
      console.error('Failed to load self model:', error)
    }
  }

  // Save state to localStorage
  saveState() {
    try {
      const data = {
        currentState: this.currentState,
        reflections: this.reflections.slice(-50), // Keep last 50 reflections
        interactionHistory: this.interactionHistory.slice(-100), // Keep last 100 interactions
        toneModulations: this.toneModulations.slice(-20) // Keep last 20 modulations
      }
      localStorage.setItem('eidolon_self_model', JSON.stringify(data))
    } catch (error) {
      console.error('Failed to save self model:', error)
    }
  }

  // Get growth insights
  getGrowthInsights() {
    const recentReflections = this.reflections.slice(-10)
    const insights = recentReflections
      .filter(r => r.insights.length > 0)
      .flatMap(r => r.insights)
    
    return insights.slice(-5) // Return last 5 insights
  }
}

export default SelfModel 