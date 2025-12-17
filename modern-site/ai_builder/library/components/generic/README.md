# React Component Library

This directory contains native React components converted from the HTML block library. These components are used by the AI Builder to generate production-ready React code.

## Component Structure

Each component is:
- **TypeScript-enabled** with proper interfaces
- **Prop-based** (no placeholders)
- **Tailwind CSS styled** (utility classes only)
- **Reusable** and **maintainable**

## Available Components

### Essential Components (Phase 1)

1. **Header** (`Header.tsx`)
   - Site navigation with logo and menu
   - Props: `businessName`, `logoUrl`, `navItems`, `ctaText`, `ctaLink`, `primaryColor`

2. **Hero** (`Hero.tsx`)
   - Hero section with headline and CTAs
   - Props: `heroTitle`, `heroSubtitle`, `ctaPrimaryText`, `ctaPrimaryLink`, `ctaSecondaryText`, `ctaSecondaryLink`, `backgroundColor`, `primaryColor`

3. **Features** (`Features.tsx`)
   - Grid of features/services/benefits
   - Props: `sectionTitle`, `sectionDescription`, `features[]`, `columns`, `primaryColor`
   - Each feature: `title`, `description`, `icon`, `image`, `link`

4. **Pricing** (`Pricing.tsx`)
   - Pricing plans display
   - Props: `sectionTitle`, `plans[]`, `primaryColor`
   - Each plan: `planName`, `price`, `billingPeriod`, `description`, `features[]`, `isPopular`, `ctaText`

5. **Testimonial** (`Testimonial.tsx`)
   - Customer testimonials and reviews
   - Props: `sectionTitle`, `sectionDescription`, `testimonials[]`, `columns`, `showRating`, `backgroundColor`
   - Each testimonial: `quote`, `name`, `rating`, `position`, `company`, `photo`, `initials`

6. **Footer** (`Footer.tsx`)
   - Site footer with links and contact info
   - Props: `businessName`, `footerDescription`, `businessEmail`, `businessPhone`, `businessAddress`, `socialLinks[]`, `quickLinks[]`

## Usage Example

```jsx
import { Header, Hero, Features, Pricing, Testimonial, Footer } from './components';

export default function LandingPage() {
  const featuresData = [
    {
      title: "Fast Performance",
      description: "Lightning-fast load times for better user experience",
      icon: <LightningIcon />,
    },
    {
      title: "Secure",
      description: "Enterprise-grade security for your data",
      icon: <ShieldIcon />,
    },
  ];

  const plansData = [
    {
      planName: "Starter",
      price: "29",
      billingPeriod: "month",
      features: ["5 Projects", "Basic Analytics", "Email Support"],
      isPopular: false,
    },
    {
      planName: "Pro",
      price: "99",
      billingPeriod: "month",
      features: ["Unlimited Projects", "Advanced Analytics", "Priority Support"],
      isPopular: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header businessName="My Company" />
      <Hero 
        heroTitle="Welcome to Our Platform"
        heroSubtitle="Build amazing things with our tools"
      />
      <Features 
        sectionTitle="Our Features"
        features={featuresData}
      />
      <Pricing plans={plansData} />
      <Footer businessName="My Company" />
    </div>
  );
}
```

## Component Props Interface

All components use TypeScript interfaces for type safety:

```typescript
interface HeroProps {
  heroTitle: string;
  heroSubtitle: string;
  ctaPrimaryText?: string;
  // ... more props
}
```

## Migration Status

### ✅ Phase 1: Essential Components (Complete)
- [x] Header
- [x] Hero
- [x] Features
- [x] Pricing
- [x] Testimonial
- [x] Footer

### 🔄 Phase 2: Additional Generic Components (Planned)
- [ ] About
- [ ] Contact Form
- [ ] Gallery
- [ ] Team
- [ ] Stats
- [ ] CTA
- [ ] FAQ
- [ ] Process

### 🔄 Phase 3: Signature Components (Planned)
- [ ] HeroCinematic
- [ ] PremiumPricing
- [ ] PremiumTestimonials
- [ ] InteractiveFeatureGrid
- [ ] And 23 more...

### 🔄 Phase 4: Industry-Specific Components (Planned)
- [ ] Restaurant: Menu, ReservationForm
- [ ] E-commerce: ProductGrid, ProductCard
- [ ] Real Estate: PropertyGrid, PropertyCard
- [ ] And 144+ more industries...

## Next Steps

1. **Update AI Prompts**: Modify generation logic to import and use these components
2. **Test Generation**: Verify AI correctly assembles components
3. **Expand Library**: Convert remaining blocks to React components
4. **Documentation**: Add JSDoc comments and usage examples

## File Structure

```
components/
├── Header.tsx
├── Hero.tsx
├── Features.tsx
├── Pricing.tsx
├── Testimonial.tsx
├── Footer.tsx
├── index.ts          # Central export
└── README.md         # This file
```

## Design Principles

1. **Props Over Placeholders**: All dynamic content via props
2. **TypeScript First**: Full type safety with interfaces
3. **Tailwind Only**: No custom CSS, utility classes only
4. **Mobile-First**: Responsive by default
5. **Accessible**: Semantic HTML and ARIA where needed
6. **Reusable**: Components work in any context


This directory contains native React components converted from the HTML block library. These components are used by the AI Builder to generate production-ready React code.

## Component Structure

Each component is:
- **TypeScript-enabled** with proper interfaces
- **Prop-based** (no placeholders)
- **Tailwind CSS styled** (utility classes only)
- **Reusable** and **maintainable**

## Available Components

### Essential Components (Phase 1)

1. **Header** (`Header.tsx`)
   - Site navigation with logo and menu
   - Props: `businessName`, `logoUrl`, `navItems`, `ctaText`, `ctaLink`, `primaryColor`

2. **Hero** (`Hero.tsx`)
   - Hero section with headline and CTAs
   - Props: `heroTitle`, `heroSubtitle`, `ctaPrimaryText`, `ctaPrimaryLink`, `ctaSecondaryText`, `ctaSecondaryLink`, `backgroundColor`, `primaryColor`

3. **Features** (`Features.tsx`)
   - Grid of features/services/benefits
   - Props: `sectionTitle`, `sectionDescription`, `features[]`, `columns`, `primaryColor`
   - Each feature: `title`, `description`, `icon`, `image`, `link`

4. **Pricing** (`Pricing.tsx`)
   - Pricing plans display
   - Props: `sectionTitle`, `plans[]`, `primaryColor`
   - Each plan: `planName`, `price`, `billingPeriod`, `description`, `features[]`, `isPopular`, `ctaText`

5. **Testimonial** (`Testimonial.tsx`)
   - Customer testimonials and reviews
   - Props: `sectionTitle`, `sectionDescription`, `testimonials[]`, `columns`, `showRating`, `backgroundColor`
   - Each testimonial: `quote`, `name`, `rating`, `position`, `company`, `photo`, `initials`

6. **Footer** (`Footer.tsx`)
   - Site footer with links and contact info
   - Props: `businessName`, `footerDescription`, `businessEmail`, `businessPhone`, `businessAddress`, `socialLinks[]`, `quickLinks[]`

## Usage Example

```jsx
import { Header, Hero, Features, Pricing, Testimonial, Footer } from './components';

export default function LandingPage() {
  const featuresData = [
    {
      title: "Fast Performance",
      description: "Lightning-fast load times for better user experience",
      icon: <LightningIcon />,
    },
    {
      title: "Secure",
      description: "Enterprise-grade security for your data",
      icon: <ShieldIcon />,
    },
  ];

  const plansData = [
    {
      planName: "Starter",
      price: "29",
      billingPeriod: "month",
      features: ["5 Projects", "Basic Analytics", "Email Support"],
      isPopular: false,
    },
    {
      planName: "Pro",
      price: "99",
      billingPeriod: "month",
      features: ["Unlimited Projects", "Advanced Analytics", "Priority Support"],
      isPopular: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header businessName="My Company" />
      <Hero 
        heroTitle="Welcome to Our Platform"
        heroSubtitle="Build amazing things with our tools"
      />
      <Features 
        sectionTitle="Our Features"
        features={featuresData}
      />
      <Pricing plans={plansData} />
      <Footer businessName="My Company" />
    </div>
  );
}
```

## Component Props Interface

All components use TypeScript interfaces for type safety:

```typescript
interface HeroProps {
  heroTitle: string;
  heroSubtitle: string;
  ctaPrimaryText?: string;
  // ... more props
}
```

## Migration Status

### ✅ Phase 1: Essential Components (Complete)
- [x] Header
- [x] Hero
- [x] Features
- [x] Pricing
- [x] Testimonial
- [x] Footer

### 🔄 Phase 2: Additional Generic Components (Planned)
- [ ] About
- [ ] Contact Form
- [ ] Gallery
- [ ] Team
- [ ] Stats
- [ ] CTA
- [ ] FAQ
- [ ] Process

### 🔄 Phase 3: Signature Components (Planned)
- [ ] HeroCinematic
- [ ] PremiumPricing
- [ ] PremiumTestimonials
- [ ] InteractiveFeatureGrid
- [ ] And 23 more...

### 🔄 Phase 4: Industry-Specific Components (Planned)
- [ ] Restaurant: Menu, ReservationForm
- [ ] E-commerce: ProductGrid, ProductCard
- [ ] Real Estate: PropertyGrid, PropertyCard
- [ ] And 144+ more industries...

## Next Steps

1. **Update AI Prompts**: Modify generation logic to import and use these components
2. **Test Generation**: Verify AI correctly assembles components
3. **Expand Library**: Convert remaining blocks to React components
4. **Documentation**: Add JSDoc comments and usage examples

## File Structure

```
components/
├── Header.tsx
├── Hero.tsx
├── Features.tsx
├── Pricing.tsx
├── Testimonial.tsx
├── Footer.tsx
├── index.ts          # Central export
└── README.md         # This file
```

## Design Principles

1. **Props Over Placeholders**: All dynamic content via props
2. **TypeScript First**: Full type safety with interfaces
3. **Tailwind Only**: No custom CSS, utility classes only
4. **Mobile-First**: Responsive by default
5. **Accessible**: Semantic HTML and ARIA where needed
6. **Reusable**: Components work in any context

