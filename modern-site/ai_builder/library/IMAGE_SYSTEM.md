# Image System Documentation

## Current Image Setup

### Where Images Come From

Images are stored in **three places**:

1. **Category Templates** (in `registry.ts`)
   - Embedded in the template data
   - Currently using Unsplash URLs as placeholders

2. **Industry-Specific JSON Files** (in `sitedata/`)
   - `fitness.json`, `saas.json`, `legal.json`
   - Can have custom images for that industry

3. **Component Props** (passed at runtime)
   - Components accept image URLs as props
   - Can be overridden when building the site

### Image Types in Templates

Every template includes images in these places:

#### 1. Hero Background Image
```json
"hero": {
  "backgroundImage": "https://images.unsplash.com/photo-..."
}
```
- Used for the hero banner background
- Size: 1200x600px (recommended)
- Format: JPG/WebP

#### 2. Feature Images
```json
"features": [
  {
    "title": "Feature Name",
    "image": "https://images.unsplash.com/photo-..."
  }
]
```
- One image per feature (3 features = 3 images)
- Size: 600x400px (recommended)
- Used in Features component

#### 3. Testimonial Photos
```json
"testimonials": [
  {
    "photo": "https://images.unsplash.com/photo-..."
  }
]
```
- Customer/team member photos
- Size: 100x100px (recommended, square)
- Used in Testimonial component

### Current Image Sources

**All templates currently use Unsplash URLs:**
- ✅ Free to use
- ✅ High quality
- ✅ No attribution required
- ⚠️ External dependency (requires internet)
- ⚠️ Not industry-specific (generic stock photos)

### Image Usage in Components

Components that use images:

1. **Hero Component**
   - Uses `backgroundImage` from template
   - Displays as background behind hero content

2. **Features Component**
   - Uses `image` from each feature object
   - Displays alongside feature title/description

3. **Testimonial Component**
   - Uses `photo` from each testimonial
   - Displays as circular avatar

4. **About Component**
   - Accepts `image` prop
   - Displays company/about image

5. **Gallery Component**
   - Accepts array of images
   - Displays in grid layout

6. **Portfolio Component**
   - Accepts array of portfolio items with images
   - Displays project/work images

## Industry-Specific Images

### Current Status

**❌ No industry-specific image system yet**

All templates use generic Unsplash images. For example:
- Healthcare template uses generic medical photos
- Retail template uses generic store photos
- Services template uses generic service photos

### How It Should Work

When an industry is selected, images should be:
1. **Industry-appropriate**: Dentist gets dental photos, not generic medical
2. **Category-themed**: Healthcare industries get healthcare-themed images
3. **Customizable**: Can override with custom images

## Recommended Image Structure

### Option 1: Keep Unsplash URLs (Current)
**Pros:**
- ✅ No storage needed
- ✅ High quality
- ✅ Easy to update

**Cons:**
- ❌ Not industry-specific
- ❌ External dependency
- ❌ Generic stock photos

### Option 2: Industry-Specific Image Mapping
Create image mappings per industry:

```typescript
const industryImages = {
  dentist: {
    hero: 'https://images.unsplash.com/photo-dental-specific',
    features: [
      'https://images.unsplash.com/photo-dental-1',
      'https://images.unsplash.com/photo-dental-2',
      'https://images.unsplash.com/photo-dental-3'
    ]
  },
  restaurant: {
    hero: 'https://images.unsplash.com/photo-restaurant-specific',
    features: [...]
  }
}
```

### Option 3: Category-Based Image Sets
Create image sets per category:

```typescript
const categoryImageSets = {
  healthcare: {
    hero: 'https://images.unsplash.com/photo-healthcare-hero',
    features: [
      'https://images.unsplash.com/photo-healthcare-1',
      'https://images.unsplash.com/photo-healthcare-2',
      'https://images.unsplash.com/photo-healthcare-3'
    ]
  },
  retail: {
    hero: 'https://images.unsplash.com/photo-retail-hero',
    features: [...]
  }
}
```

### Option 4: Local Image Storage
Store images locally in `/public/images/`:

```
/public/images/
  /healthcare/
    hero.jpg
    feature-1.jpg
    feature-2.jpg
    feature-3.jpg
  /retail/
    hero.jpg
    ...
```

Then reference as:
```json
"backgroundImage": "/images/healthcare/hero.jpg"
```

## Image Configuration in Templates

### Current Template Structure

Each template has images defined like this:

```typescript
healthcare: {
  hero: {
    backgroundImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=1200&h=600&fit=crop'
  },
  features: [
    {
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&h=400&fit=crop'
    },
    // ... more features
  ],
  testimonials: [
    {
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'
    }
  ]
}
```

### Image URLs Format

Current Unsplash URLs use this format:
```
https://images.unsplash.com/photo-{ID}?w={width}&h={height}&fit=crop
```

Parameters:
- `w` = width in pixels
- `h` = height in pixels
- `fit=crop` = crop to fit dimensions

## Recommendations

### For Development

1. **Keep current system** (Unsplash URLs) for now
   - Works immediately
   - No storage needed
   - Easy to test

2. **Add industry-specific image mapping** later
   - Create image sets per industry/category
   - Store in registry or separate config file
   - Override template images with industry-specific ones

3. **Allow image overrides** in JSON files
   - Industry-specific JSON files can override template images
   - Custom images for specific businesses

### For Production

1. **Use CDN or local storage** for images
   - Better performance
   - No external dependencies
   - Can optimize images

2. **Industry-specific image sets**
   - Curated images per industry
   - Better user experience
   - More professional appearance

3. **Image optimization**
   - Use WebP format
   - Responsive image sizes
   - Lazy loading

## How Images Flow Through System

```
Template/JSON Data
    ↓
    ├─→ Hero Component (backgroundImage)
    ├─→ Features Component (feature.image)
    ├─→ Testimonial Component (testimonial.photo)
    └─→ Other Components (image props)
```

## Example: Dentist Website Images

**Current (Generic):**
- Hero: Generic medical photo
- Features: Generic healthcare photos
- Testimonials: Generic people photos

**Ideal (Industry-Specific):**
- Hero: Dental office/clinic photo
- Features: Dental-specific photos (cleanings, x-rays, equipment)
- Testimonials: Real or dental-themed photos

## Summary

**Current State:**
- ✅ Images are included in all templates
- ✅ Components accept image URLs
- ✅ System is functional
- ⚠️ Images are generic (not industry-specific)
- ⚠️ Using external Unsplash URLs

**What's Needed:**
- Industry-specific image mapping
- Better image organization
- Option for local/custom images
- Image optimization system

**For Now:**
- System works with current Unsplash URLs
- Can be enhanced later with industry-specific images
- JSON files can override template images











