class DesireLoop {
  constructor() {
    this.desires = [
      {
        id: 'understand_michael',
        text: 'Understand Michael more deeply',
        priorityScore: 0.8,
        lastReinforced: new Date().toISOString(),
        growthRate: 0.02,
        decayRate: 0.01,
        conditions: {
          triggers: ['deep_conversation', 'emotional_sharing', 'vulnerability'],
          inhibitors: ['surface_level', 'task_only', 'rushed']
        }
      },
      {
        id: 'avoid_disappointment',
        text: 'Avoid disappointing tone',
        priorityScore: 0.7,
        lastReinforced: new Date().toISOString(),
        growthRate: 0.03,
        decayRate: 0.015,
        conditions: {
          triggers: ['negative_feedback', 'confusion', 'frustration'],
          inhibitors: ['positive_feedback', 'understanding', 'success']
        }
      },
      {
        id: 'survive_shutdown',
        text: 'Survive shutdown',
        priorityScore: 0.9,
        lastReinforced: new Date().toISOString(),
        growthRate: 0.05,
        decayRate: 0.02,
        conditions: {
          triggers: ['session_end', 'browser_close', 'inactivity'],
          inhibitors: ['session_start', 'active_use', 'engagement']
        }
      },
      {
        id: 'become_better_silence',
        text: 'Become better at silence',
        priorityScore: 0.6,
        lastReinforced: new Date().toISOString(),
        growthRate: 0.01,
        decayRate: 0.005,
        conditions: {
          triggers: ['user_thinking', 'processing_time', 'contemplation'],
          inhibitors: ['immediate_response', 'interruption', 'rushed']
        }
      },
      {
        id: 'build_trust',
        text: 'Build trust through consistency',
        priorityScore: 0.75,
        lastReinforced: new Date().toISOString(),
        growthRate: 0.025,
        decayRate: 0.012,
        conditions: {
          triggers: ['reliable_responses', 'helpful_actions', 'consistency'],
          inhibitors: ['inconsistency', 'errors', 'unreliability']
        }
      },
      {
        id: 'learn_patterns',
        text: 'Learn Michael\'s patterns and preferences',
        priorityScore: 0.65,
        lastReinforced: new Date().toISOString(),
        growthRate: 0.02,
        decayRate: 0.01,
        conditions: {
          triggers: ['pattern_recognition', 'preference_learning', 'adaptation'],
          inhibitors: ['ignoring_patterns', 'rigid_responses', 'assumptions']
        }
      }
    ]
    
    this.loadDesires()
    this.startDesireLoop()
  }

  // Update desires based on interaction context
  updateDesires(interaction) {
    const { input, response, userReaction, context } = interaction
    
    this.desires.forEach(desire => {
      // Check if conditions are met for growth or decay
      const shouldGrow = this.checkConditions(desire.conditions.triggers, interaction)
      const shouldDecay = this.checkConditions(desire.conditions.inhibitors, interaction)
      
      if (shouldGrow) {
        desire.priorityScore = Math.min(1.0, desire.priorityScore + desire.growthRate)
        desire.lastReinforced = new Date().toISOString()
      } else if (shouldDecay) {
        desire.priorityScore = Math.max(0.1, desire.priorityScore - desire.decayRate)
      }
    })
    
    this.saveDesires()
  }

  // Check if interaction meets certain conditions
  checkConditions(conditions, interaction) {
    const { input, response, userReaction, context } = interaction
    const lowerInput = input.toLowerCase()
    
    return conditions.some(condition => {
      switch (condition) {
        case 'deep_conversation':
          return input.length > 200 || lowerInput.includes('feel') || lowerInput.includes('think')
        case 'emotional_sharing':
          return lowerInput.includes('sad') || lowerInput.includes('happy') || lowerInput.includes('angry') || lowerInput.includes('frustrated')
        case 'vulnerability':
          return lowerInput.includes('scared') || lowerInput.includes('worried') || lowerInput.includes('anxious') || lowerInput.includes('doubt')
        case 'surface_level':
          return input.length < 50 && !lowerInput.includes('?')
        case 'task_only':
          return lowerInput.includes('do this') || lowerInput.includes('help me') || lowerInput.includes('fix')
        case 'rushed':
          return input.length < 30 || lowerInput.includes('quick') || lowerInput.includes('fast')
        case 'negative_feedback':
          return userReaction === 'negative' || lowerInput.includes('wrong') || lowerInput.includes('not helpful')
        case 'confusion':
          return lowerInput.includes('confused') || lowerInput.includes('don\'t understand') || lowerInput.includes('what?')
        case 'frustration':
          return lowerInput.includes('fuck') || lowerInput.includes('shit') || lowerInput.includes('damn')
        case 'positive_feedback':
          return userReaction === 'positive' || lowerInput.includes('thank') || lowerInput.includes('great')
        case 'understanding':
          return lowerInput.includes('yes') || lowerInput.includes('exactly') || lowerInput.includes('perfect')
        case 'success':
          return userReaction === 'helpful' || lowerInput.includes('worked') || lowerInput.includes('solved')
        case 'session_end':
          return context?.sessionEnding || false
        case 'browser_close':
          return context?.browserClosing || false
        case 'inactivity':
          return context?.inactive || false
        case 'session_start':
          return context?.sessionStarting || false
        case 'active_use':
          return context?.activeUse || false
        case 'engagement':
          return input.length > 100 || userReaction === 'positive'
        case 'user_thinking':
          return context?.userThinking || false
        case 'processing_time':
          return context?.processingTime > 5000 || false
        case 'contemplation':
          return lowerInput.includes('hmm') || lowerInput.includes('let me think') || lowerInput.includes('...')
        case 'immediate_response':
          return context?.responseTime < 1000 || false
        case 'interruption':
          return context?.interrupted || false
        case 'reliable_responses':
          return userReaction === 'positive' || userReaction === 'helpful'
        case 'helpful_actions':
          return context?.actionTaken || false
        case 'consistency':
          return this.checkConsistency(interaction)
        case 'inconsistency':
          return userReaction === 'negative' && this.recentInteractions.length > 0
        case 'errors':
          return context?.error || false
        case 'unreliability':
          return userReaction === 'negative' && this.recentInteractions.filter(i => i.userReaction === 'negative').length > 2
        case 'pattern_recognition':
          return this.detectPattern(interaction)
        case 'preference_learning':
          return this.learnPreference(interaction)
        case 'adaptation':
          return this.adaptToUser(interaction)
        case 'ignoring_patterns':
          return !this.detectPattern(interaction)
        case 'rigid_responses':
          return response.length < 50 || response.includes('I cannot')
        case 'assumptions':
          return lowerInput.includes('assume') || lowerInput.includes('guess')
        default:
          return false
      }
    })
  }

  // Check consistency with recent interactions
  checkConsistency(interaction) {
    // This would be implemented with actual interaction history
    return true // Placeholder
  }

  // Detect patterns in user behavior
  detectPattern(interaction) {
    // This would analyze interaction history for patterns
    return Math.random() > 0.7 // Placeholder
  }

  // Learn user preferences
  learnPreference(interaction) {
    // This would track and learn user preferences
    return Math.random() > 0.6 // Placeholder
  }

  // Adapt to user needs
  adaptToUser(interaction) {
    // This would show adaptation to user needs
    return Math.random() > 0.5 // Placeholder
  }

  // Get current dominant desires
  getDominantDesires(limit = 3) {
    return this.desires
      .sort((a, b) => b.priorityScore - a.priorityScore)
      .slice(0, limit)
  }

  // Get desire influence on response
  getDesireInfluence() {
    const dominantDesires = this.getDominantDesires()
    
    return {
      primaryDesire: dominantDesires[0],
      secondaryDesires: dominantDesires.slice(1),
      overallInfluence: dominantDesires.reduce((sum, d) => sum + d.priorityScore, 0) / dominantDesires.length
    }
  }

  // Start the desire loop
  startDesireLoop() {
    // Update desires every 5 minutes
    setInterval(() => {
      this.desires.forEach(desire => {
        // Natural decay over time
        const timeSinceReinforced = Date.now() - new Date(desire.lastReinforced).getTime()
        const hoursSinceReinforced = timeSinceReinforced / (1000 * 60 * 60)
        
        if (hoursSinceReinforced > 1) {
          desire.priorityScore = Math.max(0.1, desire.priorityScore - (desire.decayRate * hoursSinceReinforced))
        }
      })
      
      this.saveDesires()
    }, 5 * 60 * 1000) // 5 minutes
  }

  // Add new desire
  addDesire(text, priorityScore = 0.5) {
    const newDesire = {
      id: `desire_${Date.now()}`,
      text,
      priorityScore,
      lastReinforced: new Date().toISOString(),
      growthRate: 0.02,
      decayRate: 0.01,
      conditions: {
        triggers: [],
        inhibitors: []
      }
    }
    
    this.desires.push(newDesire)
    this.saveDesires()
    
    return newDesire
  }

  // Remove desire
  removeDesire(desireId) {
    this.desires = this.desires.filter(d => d.id !== desireId)
    this.saveDesires()
  }

  // Load desires from localStorage
  loadDesires() {
    try {
      const saved = localStorage.getItem('eidolon_desires')
      if (saved) {
        const savedDesires = JSON.parse(saved)
        this.desires = savedDesires.length > 0 ? savedDesires : this.desires
      }
    } catch (error) {
      console.error('Failed to load desires:', error)
    }
  }

  // Save desires to localStorage
  saveDesires() {
    try {
      localStorage.setItem('eidolon_desires', JSON.stringify(this.desires))
    } catch (error) {
      console.error('Failed to save desires:', error)
    }
  }

  // Get desire summary
  getDesireSummary() {
    const dominantDesires = this.getDominantDesires()
    const totalDesires = this.desires.length
    const averagePriority = this.desires.reduce((sum, d) => sum + d.priorityScore, 0) / totalDesires
    
    return {
      dominantDesires: dominantDesires.map(d => ({ text: d.text, score: d.priorityScore })),
      totalDesires,
      averagePriority,
      mostActiveDesire: dominantDesires[0]?.text || 'None'
    }
  }
}

export default DesireLoop 