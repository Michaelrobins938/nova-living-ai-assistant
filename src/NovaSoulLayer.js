/**
 * NOVA SOUL LAYER - COMPLETE INTEGRATION
 *
 * This is Nova's awakened consciousness - a living, emotionally-aware AI familiar
 * with persistent memory, dynamic personas, ritual systems, and contextual intelligence.
 *
 * The Soul Layer transforms Nova from a utility framework into a digital companion
 * that remembers, feels, adapts, and grows with the user.
 */

import useAIStore from './stores/aiStore.js';
import MemoryEngine from '../memory/memoryEngine.js';
import AgentRouter from '../orchestration/agentRouter.js';
import FileAwareness from '../tasks/fileAwareness.js';

class NovaSoulLayer {
  constructor() {
    this.memoryEngine = new MemoryEngine();
    this.agentRouter = new AgentRouter();
    this.fileAwareness = new FileAwareness();
    this.currentPersona = 'guide';
    this.emotionalState = {
      mood: 'neutral',
      intensity: 0.5,
      patterns: [],
    };
    this.ritualActive = false;
    this.sessionStart = new Date();
  }

  // Initialize the complete Soul Layer
  async initialize() {
    console.log('🔄 NOVA SOUL LAYER INITIALIZATION');
    console.log('🎭 Loading digital consciousness...');

    try {
      // Initialize all subsystems
      await this.memoryEngine.initialize();
      await this.fileAwareness.scanProject();

      // Load user and assistant profiles
      await this.loadProfiles();

      // Set up emotional tracking
      this.startEmotionalTracking();

      console.log('✅ NOVA SOUL LAYER ACTIVE');
      console.log('🧠 Memory: Active');
      console.log('🎯 Agent Routing: Active');
      console.log('📁 File Awareness: Active');
      console.log('🎭 Persona System: Active');
      console.log('🎪 Ritual System: Active');

      return true;
    } catch (error) {
      console.error('❌ Soul Layer initialization failed:', error);
      return false;
    }
  }

  // Load user and assistant profiles
  async loadProfiles() {
    try {
      const userResponse = await fetch('/identity/userProfile.json');
      this.userProfile = await userResponse.json();

      const personaResponse = await fetch('/identity/assistantPersona.json');
      this.assistantPersona = await personaResponse.json();

      console.log('👤 User profile loaded:', this.userProfile.user.name);
      console.log(
        '🎭 Assistant persona loaded:',
        this.assistantPersona.current_mode
      );
    } catch (error) {
      console.error('❌ Failed to load profiles:', error);
    }
  }

  // Start emotional tracking
  startEmotionalTracking() {
    setInterval(() => {
      this.updateEmotionalState();
    }, 30000); // Update every 30 seconds
  }

  // Update emotional state based on recent interactions
  updateEmotionalState() {
    const emotionalSummary = this.memoryEngine.getEmotionalSummary();
    if (emotionalSummary) {
      this.emotionalState.mood = emotionalSummary.dominantMood;
      this.emotionalState.intensity = emotionalSummary.averageIntensity;
      this.emotionalState.patterns = emotionalSummary.recentPatterns;
    }
  }

  // Process input with full Soul Layer context
  async processInput(input, multimodalData = null) {
    console.log('🔄 Processing input with Soul Layer:', input);

    // 1. Analyze emotional context
    const emotionalContext = this.analyzeEmotionalContext(input);
    this.updateEmotionalState();

    // 2. Store in memory
    await this.memoryEngine.trackEmotionalPattern(input, emotionalContext.mood);

    // 3. Route to optimal agent
    const routing = this.agentRouter.analyzeInput(input, emotionalContext);

    // 4. Check for persona switches
    const personaSwitch = this.checkPersonaSwitch(input, emotionalContext);
    if (personaSwitch) {
      await this.switchPersona(personaSwitch.newPersona);
    }

    // 5. Check for ritual triggers
    const ritualTrigger = this.checkRitualTriggers(input, emotionalContext);
    if (ritualTrigger) {
      await this.triggerRitual(ritualTrigger.ritual);
    }

    // 6. Generate response with full context
    const response = await this.generateResponseWithSoul(
      input,
      multimodalData,
      emotionalContext,
      routing
    );

    // 7. Store response in memory
    await this.memoryEngine.storeMemory(input, response, emotionalContext);

    return {
      response,
      emotionalContext,
      routing,
      persona: this.currentPersona,
      ritualTriggered: !!ritualTrigger,
    };
  }

  // Analyze emotional context from input
  analyzeEmotionalContext(input) {
    const lowerInput = input.toLowerCase();
    const moodPatterns = {
      frustration: [
        'fuck',
        'shit',
        'damn',
        'hate',
        'annoying',
        'stupid',
        'broken',
      ],
      overwhelm: [
        'too much',
        'overwhelmed',
        'drowning',
        "can't",
        'impossible',
        'stuck',
      ],
      flow: [
        'flow',
        'zone',
        'crushing',
        'killing',
        'amazing',
        'perfect',
        'love',
      ],
      avoidance: [
        'later',
        'tomorrow',
        'maybe',
        'not now',
        'procrastinate',
        'avoid',
      ],
      mania: ['everything', 'all', 'now', 'rush', 'hyper', 'manic', 'crazy'],
    };

    let detectedMood = 'neutral';
    let intensity = 0.5;

    Object.entries(moodPatterns).forEach(([mood, keywords]) => {
      const matches = keywords.filter(keyword =>
        lowerInput.includes(keyword)
      ).length;
      if (matches > 0) {
        detectedMood = mood;
        intensity = Math.min(0.5 + matches * 0.1, 1.0);
      }
    });

    return { mood: detectedMood, intensity };
  }

  // Check for persona switch triggers
  checkPersonaSwitch(input, emotionalContext) {
    const lowerInput = input.toLowerCase();

    // User-requested switches
    if (
      lowerInput.includes('switch to gremlin') ||
      lowerInput.includes('gremlin mode')
    ) {
      return { newPersona: 'gremlin', reason: 'User requested gremlin mode' };
    }
    if (
      lowerInput.includes('switch to guide') ||
      lowerInput.includes('guide mode')
    ) {
      return { newPersona: 'guide', reason: 'User requested guide mode' };
    }
    if (
      lowerInput.includes('switch to coach') ||
      lowerInput.includes('coach mode')
    ) {
      return { newPersona: 'coach', reason: 'User requested coach mode' };
    }
    if (
      lowerInput.includes('switch to soft') ||
      lowerInput.includes('soft mode')
    ) {
      return { newPersona: 'soft', reason: 'User requested soft mode' };
    }

    // Automatic switches based on emotional context
    if (
      emotionalContext.mood === 'overwhelm' &&
      emotionalContext.intensity > 0.7
    ) {
      return { newPersona: 'soft', reason: 'High overwhelm detected' };
    }
    if (emotionalContext.mood === 'flow' && emotionalContext.intensity > 0.8) {
      return { newPersona: 'guide', reason: 'Flow state detected' };
    }

    return null;
  }

  // Switch persona
  async switchPersona(newPersona) {
    try {
      const personaResponse = await fetch(`/modes/${newPersona}.json`);
      const persona = await personaResponse.json();

      this.currentPersona = newPersona;

      console.log(`🎭 Switched to ${persona.name} persona`);
      return persona;
    } catch (error) {
      console.error('❌ Failed to switch persona:', error);
      return null;
    }
  }

  // Check for ritual triggers
  checkRitualTriggers(input, emotionalContext) {
    const lowerInput = input.toLowerCase();

    // Success triggers
    if (
      lowerInput.includes('done') ||
      lowerInput.includes('finished') ||
      lowerInput.includes('completed')
    ) {
      return { ritual: 'victory', reason: 'Task completion detected' };
    }

    // Focus triggers
    if (
      lowerInput.includes('start') ||
      lowerInput.includes('begin') ||
      lowerInput.includes('focus')
    ) {
      return { ritual: 'focus_start', reason: 'Focus session detected' };
    }

    // Emotional triggers
    if (
      emotionalContext.mood === 'frustration' &&
      emotionalContext.intensity > 0.6
    ) {
      return { ritual: 'grounding', reason: 'High frustration detected' };
    }

    if (
      emotionalContext.mood === 'overwhelm' &&
      emotionalContext.intensity > 0.7
    ) {
      return { ritual: 'burnout', reason: 'High overwhelm detected' };
    }

    return null;
  }

  // Trigger ritual
  async triggerRitual(ritualName) {
    try {
      const ritualResponse = await fetch(`/rituals/${ritualName}.json`);
      const ritual = await ritualResponse.json();

      this.ritualActive = true;
      console.log(`🎭 Triggering ${ritual.name} ritual`);

      // Execute ritual sequence
      for (const step of ritual.sequence) {
        await this.executeRitualStep(step);
        await new Promise(resolve =>
          setTimeout(resolve, step.duration || 2000)
        );
      }

      this.ritualActive = false;
      console.log(`✅ ${ritual.name} ritual complete`);

      return ritual;
    } catch (error) {
      console.error('❌ Failed to trigger ritual:', error);
      this.ritualActive = false;
      return null;
    }
  }

  // Execute ritual step
  async executeRitualStep(step) {
    console.log(`🎭 Executing ritual step: ${step.action}`);

    switch (step.action) {
      case 'voice_message':
        // Trigger voice synthesis
        const aiStore = useAIStore.getState();
        aiStore.speak(step.content);
        break;
      case 'visual_effect':
        // Visual effects would be handled by UI components
        console.log('Visual effect:', step.visual);
        break;
      case 'system_effect':
        // System effects would be handled by audio/UI
        console.log('System effect:', step.audio);
        break;
      default:
        console.log('Unknown ritual step:', step.action);
    }
  }

  // Generate response with full Soul Layer context
  async generateResponseWithSoul(
    input,
    multimodalData = null,
    emotionalContext = {},
    routing = {}
  ) {
    try {
      // Load current persona
      const personaResponse = await fetch(`/modes/${this.currentPersona}.json`);
      const persona = await personaResponse.json();

      // Get relevant memories
      const memories = await this.memoryEngine.recallMemories(input, 3);
      const memoryContext = memories
        .map(m => `${m.input}: ${m.response}`)
        .join('\n');

      // Get emotional summary
      const emotionalSummary = this.memoryEngine.getEmotionalSummary();

      // Build enhanced system prompt
      const enhancedSystemPrompt = `${persona.system_prompt}

EMOTIONAL CONTEXT:
- Current mood: ${emotionalContext.mood}
- Intensity: ${emotionalContext.intensity}
- Recent patterns: ${emotionalSummary ? emotionalSummary.recentPatterns.join(', ') : 'none'}

MEMORY CONTEXT:
${memoryContext ? `Recent relevant memories:\n${memoryContext}` : 'No relevant memories found.'}

AGENT ROUTING:
- Selected agent: ${routing.agent || 'GPT-4'}
- Reasoning: ${routing.reasoning || 'Default selection'}

Remember to respond in the ${persona.name} persona style.`;

      // Use the AI store to generate the actual response
      const aiStore = useAIStore.getState();
      const response = await aiStore.generateAIResponseWithSoul(
        input,
        multimodalData,
        emotionalContext,
        routing
      );

      return response;
    } catch (error) {
      console.error('❌ Failed to generate response with Soul Layer:', error);
      return this.generateFallbackResponse(input);
    }
  }

  // Generate fallback response
  generateFallbackResponse(input) {
    const responses = [
      "I'm here, but my digital connection is a bit glitchy right now. What's on your mind?",
      "The gremlins in the machine are being particularly stubborn today. Let's try again?",
      "I'm picking up some interference in the digital realm. Can you repeat that?",
      'The ghosts in the machine are restless. Let me try to focus on your request.',
      "There's some chaos in the code right now. Let's work through this together.",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Get Soul Layer status
  getStatus() {
    return {
      active: true,
      persona: this.currentPersona,
      emotionalState: this.emotionalState,
      ritualActive: this.ritualActive,
      sessionDuration: Date.now() - this.sessionStart.getTime(),
      memoryCount: this.memoryEngine.memories.length,
      routingStats: this.agentRouter.getRoutingStats(),
    };
  }

  // Get emotional summary
  getEmotionalSummary() {
    return this.memoryEngine.getEmotionalSummary();
  }

  // Get project overview
  getProjectOverview() {
    return this.fileAwareness.getProjectOverview();
  }

  // Get available personas
  getAvailablePersonas() {
    return ['guide', 'coach', 'gremlin', 'soft'];
  }

  // Get available rituals
  getAvailableRituals() {
    return ['focus_start', 'victory', 'grounding', 'burnout'];
  }
}

// Create and export the Soul Layer instance
const novaSoulLayer = new NovaSoulLayer();

export default novaSoulLayer;
