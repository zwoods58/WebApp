/**
 * Model Router - Two-Tier AI Architecture
 * Routes tasks to appropriate model based on complexity and type
 * 
 * Opus (Architect): High-level structure, large refactors, system design
 * Sonnet (Builder): Fast implementation, UI work, quick iterations
 */

export type TaskType = 
  | 'architecture'      // System design, structure planning
  | 'refactor'          // Large-scale code changes
  | 'structure'         // File/folder organization
  | 'implementation'    // Component creation, UI work
  | 'iteration'         // Quick fixes, styling tweaks
  | 'streaming'         // Live code changes
  | 'unknown'           // Default fallback

export type ModelType = 'opus' | 'sonnet'

export interface ModelConfig {
  modelId: string
  name: string
  role: string
  maxTokens: number
  useCases: string[]
}

export const MODEL_CONFIGS: Record<ModelType, ModelConfig> = {
  opus: {
    modelId: 'anthropic/claude-opus-4.5',
    name: 'Opus (Architect)',
    role: 'Handles high-level logic and large-scale refactors',
    maxTokens: 8192,
    useCases: [
      'System architecture design',
      'Large-scale refactors (15+ files)',
      'Registry and category system design',
      'Template structure planning',
      'Component architecture decisions',
      'Data model design',
      'Image mapping system design',
      'Build-time vs runtime decisions'
    ]
  },
  sonnet: {
    modelId: 'anthropic/claude-sonnet-4.5',
    name: 'Sonnet (Builder)',
    role: 'Fast-twitch engine for UI and implementation',
    maxTokens: 4096,
    useCases: [
      'Component creation and updates',
      'UI styling and Tailwind classes',
      'Quick iterations and fixes',
      'Streaming live code changes',
      'Individual file updates',
      'JSON file creation',
      'Prop interfaces and types',
      'Small-scale changes (1-5 files)'
    ]
  }
}

/**
 * Analyze task to determine which model to use
 */
export function routeTask(
  userPrompt: string,
  fileCount?: number,
  taskType?: TaskType
): ModelType {
  // Explicit task type override
  if (taskType) {
    if (['architecture', 'refactor', 'structure'].includes(taskType)) {
      return 'opus'
    }
    if (['implementation', 'iteration', 'streaming'].includes(taskType)) {
      return 'sonnet'
    }
  }
  
  // Analyze prompt for keywords
  const prompt = userPrompt.toLowerCase()
  
  // Opus keywords (architecture/refactor)
  const opusKeywords = [
    'design', 'architecture', 'structure', 'system', 'refactor', 'reorganize',
    'plan', 'strategy', 'category', 'registry', 'template', 'mapping',
    'all components', 'entire', 'global', 'large scale', 'multiple files',
    '15+', '20+', 'all industries', 'entire system'
  ]
  
  // Sonnet keywords (implementation/iteration)
  const sonnetKeywords = [
    'create component', 'update component', 'fix', 'change color', 'add style',
    'hover effect', 'quick', 'fast', 'stream', 'live', 'tweak', 'adjust',
    'single file', 'one component', 'this button', 'this section'
  ]
  
  // Check for Opus keywords
  const hasOpusKeywords = opusKeywords.some(keyword => prompt.includes(keyword))
  
  // Check for Sonnet keywords
  const hasSonnetKeywords = sonnetKeywords.some(keyword => prompt.includes(keyword))
  
  // File count heuristic
  if (fileCount !== undefined) {
    if (fileCount > 10) {
      return 'opus' // Large refactors
    }
    if (fileCount <= 3) {
      return 'sonnet' // Small changes
    }
  }
  
  // Keyword-based routing
  if (hasOpusKeywords && !hasSonnetKeywords) {
    return 'opus'
  }
  if (hasSonnetKeywords && !hasOpusKeywords) {
    return 'sonnet'
  }
  
  // Default: use Sonnet for speed (can be overridden)
  return 'sonnet'
}

/**
 * Get model configuration for a task
 */
export function getModelConfig(taskType: ModelType): ModelConfig {
  return MODEL_CONFIGS[taskType]
}

/**
 * Build system prompt with model-specific instructions
 */
export function buildModelSpecificPrompt(
  modelType: ModelType,
  basePrompt: string,
  context?: {
    taskType?: TaskType
    fileCount?: number
    isRefactor?: boolean
  }
): string {
  const config = getModelConfig(modelType)
  
  if (modelType === 'opus') {
    return `${basePrompt}

=== ARCHITECT ROLE ===
You are the Architect (Opus). Focus on:
- High-level structure and design patterns
- System architecture and scalability
- Large-scale refactors and reorganizations
- Planning before implementation
- Category systems, registries, and mappings
- Template structures and data models

Think big picture. Design the system, then provide implementation guidance.

${context?.isRefactor ? 'This is a large-scale refactor. Plan the structure first, then implement.' : ''}
${context?.fileCount ? `Affecting ${context.fileCount} files. Ensure consistency across all changes.` : ''}
`
  } else {
    return `${basePrompt}

=== BUILDER ROLE ===
You are the Builder (Sonnet). Focus on:
- Fast, accurate implementation
- UI components and styling
- Quick iterations and fixes
- Streaming live code changes
- Individual file updates
- Prop interfaces and TypeScript types

Be fast and precise. Implement the requested changes directly.

${context?.taskType === 'streaming' ? 'Stream changes live as user watches. Update code incrementally.' : ''}
`
  }
}

/**
 * Determine task type from prompt
 */
export function detectTaskType(userPrompt: string): TaskType {
  const prompt = userPrompt.toLowerCase()
  
  if (prompt.includes('design') || prompt.includes('architecture') || prompt.includes('system')) {
    return 'architecture'
  }
  if (prompt.includes('refactor') || prompt.includes('reorganize') || prompt.includes('restructure')) {
    return 'refactor'
  }
  if (prompt.includes('structure') || prompt.includes('organize') || prompt.includes('folder')) {
    return 'structure'
  }
  if (prompt.includes('create') || prompt.includes('build') || prompt.includes('implement')) {
    return 'implementation'
  }
  if (prompt.includes('fix') || prompt.includes('update') || prompt.includes('change') || prompt.includes('tweak')) {
    return 'iteration'
  }
  if (prompt.includes('stream') || prompt.includes('live')) {
    return 'streaming'
  }
  
  return 'unknown'
}

/**
 * Get recommended model for a specific task
 */
export function getRecommendedModel(
  userPrompt: string,
  options?: {
    fileCount?: number
    taskType?: TaskType
    forceModel?: ModelType
  }
): { model: ModelType; config: ModelConfig; reason: string } {
  // Force override
  if (options?.forceModel) {
    const config = getModelConfig(options.forceModel)
    return {
      model: options.forceModel,
      config,
      reason: 'Explicitly requested'
    }
  }
  
  // Auto-route
  const taskType = options?.taskType || detectTaskType(userPrompt)
  const model = routeTask(userPrompt, options?.fileCount, taskType)
  const config = getModelConfig(model)
  
  let reason = ''
  if (taskType === 'architecture' || taskType === 'refactor' || taskType === 'structure') {
    reason = `Task type "${taskType}" requires architectural planning`
  } else if (options?.fileCount && options.fileCount > 10) {
    reason = `Large-scale change (${options.fileCount} files) requires architectural oversight`
  } else {
    reason = `Task type "${taskType}" is best handled by fast implementation`
  }
  
  return { model, config, reason }
}











