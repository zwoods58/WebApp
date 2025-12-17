# Industry-Specific Image System Guide

## Overview

The image system provides **industry-specific images** that automatically replace generic category template images. This ensures each industry gets appropriate, relevant images.

## How It Works

### Three-Tier Image System

1. **Industry-Specific Images** (Highest Priority)
   - Curated image sets for specific industries
   - Stored in `imageMappings.ts`
   - Examples: `dentist`, `restaurant`, `plumber`

2. **Category Fallback Images** (Medium Priority)
   - Used when industry-specific images aren't available
   - Stored in `categoryImageFallbacks`
   - Examples: `healthcare`, `retail`, `services`

3. **Template Images** (Lowest Priority)
   - Generic images in category templates
   - Used as final fallback

### Image Override Priority

When loading siteData, images are applied in this order:

1. **JSON File Images** (Highest - Custom Override)
   - If industry has custom JSON file with images, those are used
   - Example: `fitness.json` has custom images → uses those

2. **Industry-Specific Images** (High)
   - If industry is in `industryImageMappings`, uses those
   - Example: `dentist` → uses dental-specific images

3. **Category Fallback Images** (Medium)
   - If industry not in mappings, uses category images
   - Example: `chiropractor` → uses healthcare category images

4. **Template Images** (Lowest - Final Fallback)
   - Uses images from category template
   - Always available as fallback

## Current Image Mappings

### Industries with Specific Images

**Healthcare:**
- `fitness`, `gym`, `dentist`, `chiropractor`, `medical-clinic`

**Retail:**
- `restaurant`, `bakery`, `coffee-shop`

**Services:**
- `plumber`, `electrician`, `cleaning-service`

**Professional:**
- `legal`, `legal-firm`, `accounting`

**Technology:**
- `saas`, `technology-saas`

**Education:**
- `university-college`, `tutoring`

**Creative:**
- `photographer`

**Hospitality:**
- `hotel`

**Real Estate:**
- `real-estate`

### Industries Using Category Fallbacks

All other industries automatically use their category's image set:
- Healthcare industries → Healthcare category images
- Retail industries → Retail category images
- Services industries → Services category images
- etc.

## Using Custom Images in JSON Files

### Override Template Images

You can override images in industry-specific JSON files:

```json
{
  "hero": {
    "backgroundImage": "https://your-custom-image.com/hero.jpg"
  },
  "features": [
    {
      "title": "Feature 1",
      "image": "https://your-custom-image.com/feature1.jpg"
    }
  ],
  "testimonials": [
    {
      "photo": "https://your-custom-image.com/customer1.jpg"
    }
  ]
}
```

**Priority:** JSON file images take precedence over all other sources.

### Example: Custom Fitness Images

```json
// fitness.json
{
  "hero": {
    "backgroundImage": "https://your-gym.com/images/hero.jpg"
  },
  "features": [
    {
      "title": "24/7 Access",
      "image": "https://your-gym.com/images/access.jpg"
    }
  ]
}
```

When `fitness.json` is loaded, these custom images will be used instead of the mapped images.

## Adding New Industry Images

### Option 1: Add to imageMappings.ts

```typescript
export const industryImageMappings: Record<string, IndustryImageSet> = {
  'new-industry': {
    hero: {
      backgroundImage: 'https://images.unsplash.com/photo-...?w=1200&h=600&fit=crop'
    },
    features: [
      'https://images.unsplash.com/photo-...?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-...?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-...?w=600&h=400&fit=crop'
    ],
    testimonials: [
      'https://images.unsplash.com/photo-...?w=100&h=100&fit=crop',
      'https://images.unsplash.com/photo-...?w=100&h=100&fit=crop'
    ]
  }
}
```

### Option 2: Create Industry JSON File

Create `new-industry.json` with custom images:

```json
{
  "hero": {
    "backgroundImage": "https://custom-image.com/hero.jpg"
  }
}
```

## Image Sizes & Formats

### Recommended Sizes

- **Hero Background**: 1200x600px (16:9 aspect ratio)
- **Feature Images**: 600x400px (3:2 aspect ratio)
- **Testimonial Photos**: 100x100px (square, 1:1)

### Formats

- **JPG**: Best for photos
- **WebP**: Best for performance (modern browsers)
- **PNG**: Best for graphics/logos

### Unsplash URL Format

Current system uses Unsplash URLs with parameters:

```
https://images.unsplash.com/photo-{ID}?w={width}&h={height}&fit=crop
```

Parameters:
- `w` = width in pixels
- `h` = height in pixels
- `fit=crop` = crop to fit dimensions

## Usage Examples

### Example 1: Dentist Website

```typescript
import { loadSiteData } from '@/ai_builder/library/sitedata/loadSiteData'

const siteData = loadSiteData('dentist')
// Returns:
// - Healthcare category template data
// - Dentist-specific images (from imageMappings)
// - Hero: Dental office image
// - Features: Dental equipment images
```

### Example 2: Restaurant with Custom Images

```typescript
// restaurant.json has custom images
const siteData = loadSiteData('restaurant')
// Returns:
// - Retail category template data
// - Custom images from restaurant.json (takes precedence)
// - Industry-specific images only used if JSON doesn't have images
```

### Example 3: New Industry (Auto-Fallback)

```typescript
const siteData = loadSiteData('new-industry')
// Returns:
// - Category template data (based on industry category)
// - Category fallback images (healthcare, retail, etc.)
// - No industry-specific images (not in mappings yet)
```

## Image System Flow

```
User selects industry
    ↓
Load siteData
    ↓
Check for custom JSON file
    ├─→ Has JSON with images? → Use JSON images ✅
    └─→ No JSON? → Continue
        ↓
Check industryImageMappings
    ├─→ Has industry images? → Use industry images ✅
    └─→ No industry images? → Continue
        ↓
Check categoryImageFallbacks
    ├─→ Has category images? → Use category images ✅
    └─→ No category images? → Continue
        ↓
Use template images (always available) ✅
```

## Benefits

1. **Industry-Appropriate**: Each industry gets relevant images
2. **Automatic**: Works without configuration for most industries
3. **Customizable**: JSON files can override any images
4. **Scalable**: Easy to add new industry images
5. **Fallback Chain**: Always has images, even for new industries

## Summary

✅ **Industry-specific images** are automatically applied
✅ **JSON files can override** images with custom ones
✅ **Category fallbacks** ensure all industries have images
✅ **Template images** provide final fallback
✅ **System is extensible** - easy to add new images

The image system ensures every industry gets appropriate, professional images automatically!











