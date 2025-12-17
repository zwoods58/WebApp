# Two-Model AI Architecture

## Overview

This system uses **two Claude models** in a complementary architecture:

- **Opus (Architect)**: `anthropic/claude-opus-4.5` - High-level structure, large refactors
- **Sonnet (Builder)**: `anthropic/claude-sonnet-4.5` - Fast implementation, UI work

## Quick Start

```typescript
import { getRecommendedModel } from '@/ai_builder/lib/ai/model-router'

// Automatic routing
const { model, config, reason } = getRecommendedModel(
  "Refactor all components to use new structure"
)
// → Uses Opus for large refactors

const { model, config } = getRecommendedModel(
  "Create a new Hero component"
)
// → Uses Sonnet for quick implementation
```

## Model Router

The `model-router.ts` automatically selects the right model based on:

1. **Task Type**: Architecture → Opus, Implementation → Sonnet
2. **File Count**: 10+ files → Opus, 1-5 files → Sonnet
3. **Keywords**: "design", "refactor" → Opus, "create", "fix" → Sonnet

## Integration

The model router is integrated into:

- ✅ `agentic-generator.ts` - Main code generation
- ✅ Automatic model selection based on task complexity
- ✅ Lint fixes use Sonnet for speed

## Files

- `model-router.ts` - Core routing logic
- `model-workflow.md` - Detailed workflow guide
- `MODEL_WORKFLOW_SETUP.md` - Setup documentation

## Usage Examples

See `model-workflow.md` for detailed examples and best practices.











