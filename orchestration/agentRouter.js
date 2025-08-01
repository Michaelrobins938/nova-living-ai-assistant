class AgentRouter {
  constructor() {
    this.agents = {
      claude: {
        name: 'Claude',
        model: 'anthropic/claude-3-opus',
        strengths: ['analysis', 'comprehension', 'reasoning', 'summarization'],
        keywords: ['analyze', 'summarize', 'explain', 'understand', 'comprehend', 'break down'],
        emotional_awareness: 'high',
        response_style: 'thoughtful'
      },
      gpt4: {
        name: 'GPT-4',
        model: 'gpt-4o',
        strengths: ['polish', 'explanation', 'emotional', 'creative', 'writing'],
        keywords: ['polish', 'explain', 'emotional', 'creative', 'write', 'compose', 'express'],
        emotional_awareness: 'medium',
        response_style: 'polished'
      },
      mistral: {
        name: 'Mistral',
        model: 'mistralai/mistral-7b-instruct',
        strengths: ['logic', 'math', 'code', 'technical', 'efficiency'],
        keywords: ['logic', 'math', 'code', 'calculate', 'solve', 'technical', 'efficient'],
        emotional_awareness: 'low',
        response_style: 'direct'
      },
      gemini: {
        name: 'Gemini',
        model: 'google/gemini-pro',
        strengths: ['multimodal', 'vision', 'integration', 'synthesis'],
        keywords: ['image', 'visual', 'multimodal', 'integrate', 'synthesize', 'combine'],
        emotional_awareness: 'medium',
        response_style: 'integrated'
      }
    }
    
    this.currentAgent = 'gpt4'
    this.routingHistory = []
  }

  // Analyze input and determine optimal agent
  analyzeInput(input, emotionalContext = {}) {
    const lowerInput = input.toLowerCase()
    const scores = {}
    
    // Score each agent based on keyword matches
    Object.entries(this.agents).forEach(([agentName, agent]) => {
      let score = 0
      
      // Keyword matching
      agent.keywords.forEach(keyword => {
        if (lowerInput.includes(keyword)) {
          score += 2
        }
      })
      
      // Emotional context consideration
      if (emotionalContext.intensity > 0.7) {
        if (agent.emotional_awareness === 'high') score += 3
        else if (agent.emotional_awareness === 'medium') score += 1
      }
      
      // Task type detection
      if (this.detectTaskType(lowerInput) === 'technical') {
        if (agent.strengths.includes('technical')) score += 2
      }
      
      if (this.detectTaskType(lowerInput) === 'creative') {
        if (agent.strengths.includes('creative')) score += 2
      }
      
      scores[agentName] = score
    })
    
    // Find the best agent
    const bestAgent = Object.entries(scores)
      .sort(([,a], [,b]) => b - a)[0][0]
    
    this.currentAgent = bestAgent
    this.logRouting(input, bestAgent, scores)
    
    return {
      agent: bestAgent,
      model: this.agents[bestAgent].model,
      reasoning: this.generateRoutingReasoning(input, bestAgent, scores)
    }
  }

  // Detect task type from input
  detectTaskType(input) {
    const technicalKeywords = ['code', 'debug', 'error', 'technical', 'algorithm', 'optimize']
    const creativeKeywords = ['write', 'create', 'design', 'imagine', 'story', 'art']
    const analyticalKeywords = ['analyze', 'compare', 'evaluate', 'research', 'study']
    
    if (technicalKeywords.some(keyword => input.includes(keyword))) return 'technical'
    if (creativeKeywords.some(keyword => input.includes(keyword))) return 'creative'
    if (analyticalKeywords.some(keyword => input.includes(keyword))) return 'analytical'
    
    return 'general'
  }

  // Generate reasoning for agent selection
  generateRoutingReasoning(input, selectedAgent, scores) {
    const agent = this.agents[selectedAgent]
    const taskType = this.detectTaskType(input.toLowerCase())
    
    return {
      selectedAgent: selectedAgent,
      reasoning: `Selected ${agent.name} for ${taskType} task. Strengths: ${agent.strengths.join(', ')}. Score: ${scores[selectedAgent]}`,
      alternatives: Object.entries(scores)
        .filter(([name]) => name !== selectedAgent)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 2)
        .map(([name, score]) => ({ name, score }))
    }
  }

  // Log routing decisions
  logRouting(input, selectedAgent, scores) {
    this.routingHistory.push({
      timestamp: new Date().toISOString(),
      input: input.substring(0, 100),
      selectedAgent,
      scores,
      reasoning: this.generateRoutingReasoning(input, selectedAgent, scores)
    })
    
    // Keep only last 50 routing decisions
    if (this.routingHistory.length > 50) {
      this.routingHistory = this.routingHistory.slice(-50)
    }
  }

  // Get routing statistics
  getRoutingStats() {
    const stats = {}
    Object.keys(this.agents).forEach(agentName => {
      stats[agentName] = this.routingHistory.filter(log => log.selectedAgent === agentName).length
    })
    return stats
  }

  // Force agent selection (for user override)
  forceAgent(agentName) {
    if (this.agents[agentName]) {
      this.currentAgent = agentName
      return {
        agent: agentName,
        model: this.agents[agentName].model,
        reasoning: `Forced selection of ${this.agents[agentName].name}`
      }
    }
    throw new Error(`Unknown agent: ${agentName}`)
  }

  // Get current agent info
  getCurrentAgent() {
    return {
      name: this.agents[this.currentAgent].name,
      model: this.agents[this.currentAgent].model,
      strengths: this.agents[this.currentAgent].strengths,
      response_style: this.agents[this.currentAgent].response_style
    }
  }

  // Get all available agents
  getAvailableAgents() {
    return Object.entries(this.agents).map(([key, agent]) => ({
      id: key,
      name: agent.name,
      model: agent.model,
      strengths: agent.strengths,
      keywords: agent.keywords
    }))
  }
}

export default AgentRouter 