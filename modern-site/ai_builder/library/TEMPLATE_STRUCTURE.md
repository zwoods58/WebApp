# Category Template Structure

## What Every Template Includes

Every category template **always includes** these 4 core sections:

### ✅ 1. Header (Navigation)
- Logo
- Business name
- Navigation links
- CTA button

### ✅ 2. Hero Banner
- Main headline/title
- Subtitle/description
- Primary CTA button
- Secondary CTA button (optional)
- Background image

### ✅ 3. Features Section
- Array of 3 feature items
- Each with: title, description, icon, image

### ✅ 4. Footer
- Business name
- Description
- Contact info (email, phone, address)
- Social links
- Quick links

## Optional Sections

Some templates also include (but not all):

### ⚠️ 5. Pricing Plans (Optional)
- Array of pricing tiers
- Each with: name, price, billing period, features, CTA

### ⚠️ 6. Testimonials (Optional)
- Array of customer testimonials
- Each with: quote, name, rating, photo

## Current Template Status

| Category | Header | Hero | Features | Plans | Testimonials | Footer |
|----------|--------|------|----------|-------|--------------|--------|
| Healthcare | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Retail | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| Services | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| Professional | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| Education | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| Creative | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| Hospitality | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| Technology | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| General | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |

## Industry-Specific Components

**Important**: The templates provide the **data/content**, but the actual **components** come from two sources:

1. **Generic Components** (always available):
   - `Header` component
   - `Hero` component
   - `Features` component
   - `Pricing` component (if plans data exists)
   - `Testimonial` component (if testimonials data exists)
   - `Footer` component

2. **Industry-Specific Components** (auto-discovered):
   - Found in `/components/industry/{industry-name}/` folder
   - Examples:
     - `DentistAppointmentForm.tsx`
     - `FitnessMembershipPlans.tsx`
     - `RestaurantMenu.tsx`
     - `PlumberServiceList.tsx`

## How It Works Together

When you build a website for an industry:

```
Template Data (from category)
    ↓
    ├─→ Header component (uses nav data)
    ├─→ Hero component (uses hero data)
    ├─→ Features component (uses features data)
    ├─→ Pricing component (uses plans data, if available)
    ├─→ Testimonial component (uses testimonials data, if available)
    ├─→ Footer component (uses footer data)
    └─→ Industry-specific components (auto-discovered)
```

## Example: Dentist Website

1. **Template**: Healthcare category
   - Provides: nav, hero, features, plans, testimonials, footer data

2. **Generic Components Used**:
   - `<Header />` - uses nav data
   - `<Hero />` - uses hero data
   - `<Features />` - uses features data
   - `<Pricing />` - uses plans data
   - `<Testimonial />` - uses testimonials data
   - `<Footer />` - uses footer data

3. **Industry Components Available**:
   - `<DentistAppointmentForm />`
   - `<DentistServices />`
   - (auto-discovered from `/components/industry/dentist/`)

## Summary

**Every template includes:**
- ✅ Header (nav data)
- ✅ Hero Banner (hero data)
- ✅ Features (features array)
- ✅ Footer (footer data)

**Some templates include:**
- ⚠️ Pricing Plans (plans array) - currently only Healthcare
- ⚠️ Testimonials (testimonials array) - currently only Healthcare

**Plus industry-specific components:**
- 🎯 Auto-discovered from industry folders
- 🎯 Can be used alongside generic components











