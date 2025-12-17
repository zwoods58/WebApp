# Two-Model Workflow Guide

## Overview

This system uses two Claude models in a complementary architecture:

- **Opus (Architect)**: High-level structure, large refactors, system design
- **Sonnet (Builder)**: Fast implementation, UI work, quick iterations

## When to Use Each Model

### Use Opus (Architect) For:

#### 🏗️ Architecture & Design
- "Design a system for industry-specific images"
- "Create a category-based template system"
- "Plan the component discovery architecture"
- "Design the registry structure"

#### 🔄 Large-Scale Refactors
- "Refactor all 155 industries to use new structure"
- "Update all components to use new prop interface"
- "Reorganize the entire component library"
- "Change the global theme across 20+ files"

#### 📐 Structure & Organization
- "Reorganize components into generic/industry folders"
- "Create the sitedata folder structure"
- "Design the image mapping system"
- "Plan the build-time component discovery"

#### 🗂️ System-Level Changes
- "Update the registry to support new features"
- "Create category templates for all 9 categories"
- "Design the fallback chain system"
- "Plan the JSON override system"

### Use Sonnet (Builder) For:

#### ⚡ Fast Implementation
- "Create a new component X"
- "Update the Hero component styling"
- "Add hover effects to buttons"
- "Fix the layout in Pricing component"

#### 🎨 UI & Styling
- "Change button colors to blue-600"
- "Add rounded corners to cards"
- "Update spacing in Features section"
- "Make the header sticky"

#### 🔧 Quick Iterations
- "Fix the TypeScript error in Header.tsx"
- "Update the prop interface for Hero"
- "Add missing import statement"
- "Change text from 'Get Started' to 'Sign Up'"

#### 📝 Component Creation
- "Create DentistAppointmentForm component"
- "Build RestaurantMenu component"
- "Add FitnessMembershipPlans component"
- "Create PricingV2 component variant"

#### 📄 File Updates
- "Update fitness.json with new content"
- "Add testimonials to saas.json"
- "Create legal.json file"
- "Update component index exports"

## Workflow Examples

### Example 1: Building Image System

**Step 1: Opus (Architecture)**
```
Prompt: "Design a system for industry-specific images with fallbacks"
→ Opus creates imageMappings.ts structure
→ Designs priority system
→ Plans integration points
```

**Step 2: Sonnet (Implementation)**
```
Prompt: "Add image mappings for dentist, restaurant, and plumber industries"
→ Sonnet adds specific images to imageMappings.ts
→ Updates loadSiteData to use images
→ Tests and iterates quickly
```

### Example 2: Component Library Reorganization

**Step 1: Opus (Architecture)**
```
Prompt: "Reorganize components folder into generic/ and industry/ subfolders"
→ Opus plans the folder structure
→ Designs the migration strategy
→ Creates the new organization plan
```

**Step 2: Sonnet (Implementation)**
```
Prompt: "Move Header.tsx to generic/header/Header.tsx"
→ Sonnet moves files
→ Updates imports
→ Fixes broken references
```

### Example 3: Large Refactor

**Step 1: Opus (Architecture)**
```
Prompt: "Refactor all 155 industries to use category-based templates"
→ Opus designs the new structure
→ Plans the migration
→ Creates the category mapping system
```

**Step 2: Sonnet (Implementation)**
```
Prompt: "Update registry.ts to use new category system"
→ Sonnet implements the changes
→ Updates helper functions
→ Fixes TypeScript errors
```

## Model Selection Rules

### Automatic Routing

The system automatically routes tasks based on:

1. **Keywords in prompt**
   - Opus: "design", "architecture", "refactor", "system", "all components"
   - Sonnet: "create", "update", "fix", "change", "add"

2. **File count**
   - Opus: 10+ files
   - Sonnet: 1-5 files

3. **Task type**
   - Opus: architecture, refactor, structure
   - Sonnet: implementation, iteration, streaming

### Manual Override

You can force a specific model:

```typescript
const { model, config } = getRecommendedModel(prompt, {
  forceModel: 'opus' // or 'sonnet'
})
```

## Best Practices

### ✅ Do Use Opus For:
- Planning before implementation
- System-wide changes
- Architectural decisions
- Large refactors (15+ files)
- Design patterns and structures

### ✅ Do Use Sonnet For:
- Quick fixes and updates
- Component creation
- UI styling changes
- Single file updates
- Fast iterations

### ❌ Don't Use Opus For:
- Simple color changes
- Single component updates
- Quick bug fixes
- Styling tweaks

### ❌ Don't Use Sonnet For:
- System architecture design
- Large-scale refactors
- Planning complex systems
- Multi-file reorganizations

## Cost & Performance

### Opus (Architect)
- **Cost**: Higher (use for important architectural decisions)
- **Speed**: Slower (thorough planning)
- **Best for**: One-time architecture work

### Sonnet (Builder)
- **Cost**: Lower (use for frequent iterations)
- **Speed**: Faster (quick implementation)
- **Best for**: Daily development work

## Integration

The model router is integrated into:

1. **agentic-generator.ts** - Main code generation
2. **Component creation** - Auto-routes based on task
3. **Refactor operations** - Uses Opus for large changes
4. **Quick fixes** - Uses Sonnet for fast updates

## Summary

**Opus = Think Big, Plan Structure**
**Sonnet = Build Fast, Implement Details**

Use Opus to design the system, Sonnet to build it!











