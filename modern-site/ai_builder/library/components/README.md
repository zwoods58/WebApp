# Components Library

This directory contains all React components for the AI Builder, organized into two main categories:

## Structure

```
/components
  ├── /generic      # Reusable UI components (36 components)
  │   ├── /header
  │   ├── /hero
  │   ├── /features
  │   ├── /pricing
  │   ├── /testimonials
  │   ├── /footer
  │   └── ... (30+ more categories)
  ├── /industry     # Industry-specific components (484 components)
  │   ├── /fitness
  │   ├── /saas
  │   ├── /legal
  │   ├── /restaurant
  │   └── ... (100+ industry folders)
  └── index.ts      # Main export file
```

## Generic Components

Reusable UI components that can be used across any industry:

- **Core Components**: Header, Hero, Features, Pricing, Testimonial, Footer
- **Forms**: ContactForm
- **Content**: About, FAQ, Team, Stats, Gallery
- **Interactive**: Accordion, Tabs, Process
- **Navigation**: Breadcrumbs, Pagination, Search
- **Media**: Video, Image, Map
- **Layout**: CTA, Newsletter, Trust Badges, Service Cards
- **Errors**: NotFound, ComingSoon
- **And more...**

## Industry Components

Specialized components tailored for specific industries:

- **Fitness**: Membership plans, class schedules, trainer profiles
- **SaaS**: Pricing tables, integration logos, dashboard widgets
- **Legal**: Case results, consultation forms, FAQ sections
- **Restaurant**: Menu displays, booking widgets
- **Real Estate**: Property cards, search filters
- **And 100+ more industries...**

## Usage

Import components from the main index file:

```typescript
// Generic components
import { Header, Hero, Features, Pricing, Footer } from '@/ai_builder/library/components'

// Industry-specific components
import { FitnessHero, FitnessMembershipPlans } from '@/ai_builder/library/components'
```

## Component Organization

Each component folder contains:
- The main component file (`.tsx`)
- Type definitions (exported types)
- Variants (e.g., `HeroV1.tsx`, `PricingV1.tsx`)

## Adding New Components

1. **Generic Components**: Add to `/generic/{category}/`
2. **Industry Components**: Add to `/industry/{industry-name}/`
3. **Update Exports**: Add exports to `index.ts`

## Best Practices

- Use TypeScript for all components
- Export prop types for better DX
- Keep components focused and reusable
- Use Tailwind CSS for styling
- Accept data via props (don't hardcode)
