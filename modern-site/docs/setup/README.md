# AI Builder Library

This is the master library for the AI Builder - a professional-grade component assembly engine.

## Folder Structure

```
/ai_builder/library
  ├── /components      # Native React components (.tsx) - 484+ components
  │   ├── /generic     # Generic UI components (Hero, Header, Footer, etc.)
  │   └── /industry    # Industry-specific components (Fitness, SaaS, Legal, etc.)
  ├── /sitedata        # Industry JSON templates (fitness.json, saas.json, legal.json)
  ├── /metadata        # React SEO components (MetaHeader, Analytics, JsonLd)
  ├── /config          # Configuration files (assembly rules, block types, etc.)
  ├── /signature       # Premium signature components (AnimatedCTA, AuthorBadge)
  └── registry.ts      # Master industry registry (matching logic)
```

## How It Works

### 1. Registry-Based Selection
When a user selects an industry (e.g., "Fitness"), the registry:
- Maps to the correct `sitedata` file (e.g., `fitness.json`)
- Provides allowed components (e.g., `['Header', 'Hero', 'Features']`)
- Sets theme defaults (e.g., `primary: 'red-600'`)
- Defines recommended layout order

### 2. Context Injection
Instead of sending the AI 10,000+ characters of data, we:
- Inject registry keys (industry, allowed blocks, theme)
- Provide siteData structure (not full text)
- Give component import paths
- Keep prompts under 2,000 characters

### 3. Component Assembly
The AI generates concise code (~20-50 lines):
```jsx
import { Header, Hero, Features } from './components';

export default function LandingPage() {
  return (
    <div>
      <Header navItems={siteData.nav.links} />
      <Hero content={siteData.hero} />
      <Features features={siteData.features} />
    </div>
  );
}
```

## Success Metrics

| Feature | Problem Solved | Result |
|---------|---------------|--------|
| Token Limit | LLM cut-offs mid-sentence | Clean, concise files (~20-50 lines) |
| Parsing Errors | Unexpected token '<' | Babel successfully transpiles valid JSX |
| Production Ready | Static "Black Screen" rendering | Dynamic React components |
| Scalability | Manual industry hardcoding | Registry allows adding new types in seconds |

## Adding New Industries

1. Create `sitedata/{industry}.json` with the data structure
2. Add entry to `registry.ts`:
```typescript
newIndustry: {
  dataPath: 'newIndustry.json',
  allowedBlocks: ['Header', 'Hero', ...],
  themeDefaults: { primary: 'blue-600', ... },
  recommendedLayout: ['Header', 'Hero', ...]
}
```

That's it! The system automatically uses the new industry.
