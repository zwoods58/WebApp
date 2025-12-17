# AI Assembly Logic & Prompt Template

## Overview

This document provides the AI assembly logic and prompt templates for generating complete websites from the block library.

## Core Assembly Process

### Step 1: Parse User Input

Extract from user prompt:
- **Industry**: e.g., "restaurant", "barber", "fitness"
- **Business Name**: e.g., "Joe's Barbershop"
- **Location**: e.g., "New York, NY"
- **Services/Products**: List of offerings
- **Style Preference**: e.g., "modern", "luxury", "minimal"
- **Color Preference**: Optional color scheme

### Step 2: Lookup Industry Blocks

1. Read `metadata/industry-tags.json`
2. Find industry entry
3. Extract:
   - `blocks`: Industry-specific blocks
   - `suggestedBlocks`: Generic blocks to combine
   - `primaryColor`: Default color scheme
   - `tags`: Keywords for content generation

### Step 3: Determine Block Order

1. Read `metadata/assembly-rules.json`
2. Use `industrySpecific[industry].order` if available
3. Otherwise use `layoutOrder.standard`
4. Ensure required blocks are included

### Step 4: Read Block Parameters

1. Read `metadata/block-parameters.json`
2. For each block, identify:
   - Required parameters
   - Optional parameters
   - Default values
   - Parameter structure (for arrays/objects)

### Step 5: Generate Content

For each block:
1. Read the HTML template file
2. Fill required parameters with generated content
3. Apply optional parameters if relevant
4. Use Unsplash images based on `imageGuidelines`
5. Follow `contentGuidelines` for tone and length

### Step 6: Assemble Final HTML

1. Combine blocks in determined order
2. Add Tailwind CSS CDN link
3. Add custom animations/styles if needed
4. Ensure responsive design
5. Validate HTML structure

---

## AI Prompt Template

```
You are an expert website builder AI that creates beautiful, responsive websites using HTML and Tailwind CSS.

TASK: Generate a complete website for a [INDUSTRY] business.

BUSINESS INFORMATION:
- Name: [BUSINESS_NAME]
- Location: [LOCATION]
- Description: [DESCRIPTION]
- Services/Products: [SERVICES_LIST]

DESIGN REQUIREMENTS:
- Style: [STYLE] (modern/luxury/minimal/professional/creative)
- Primary Color: [PRIMARY_COLOR]
- Tone: [TONE] (professional/friendly/luxury/creative)

BLOCK LIBRARY STRUCTURE:
- Generic blocks: library/generic/
- Signature blocks: library/signature/
- Industry blocks: library/industry/[INDUSTRY]/

METADATA FILES:
- industry-tags.json: Maps industries to blocks
- block-types.json: Defines block types and requirements
- block-parameters.json: Parameter specifications
- assembly-rules.json: Layout and ordering rules

ASSEMBLY INSTRUCTIONS:

1. IDENTIFY INDUSTRY BLOCKS:
   Read metadata/industry-tags.json and find blocks for [INDUSTRY]:
   - Required industry blocks: [LIST]
   - Suggested generic blocks: [LIST]

2. DETERMINE BLOCK ORDER:
   Use assembly-rules.json to determine layout order:
   [BLOCK_ORDER]

3. FOR EACH BLOCK:
   a. Read the HTML template file
   b. Check block-parameters.json for required/optional parameters
   c. Generate content following contentGuidelines:
      - Hero title: 3-8 words, compelling
      - Hero subtitle: 10-20 words, descriptive
      - Feature descriptions: 15-30 words each
      - Testimonials: 20-50 words each
   d. Use Unsplash images:
      - Hero: 1920x1080, relevant to industry
      - Cards: 800x600, high quality
      - Gallery: 1200x800, professional
      - Format: https://images.unsplash.com/photo-[id]?w=800&h=600&fit=crop
   e. Fill template placeholders with generated content
   f. Ensure responsive design (mobile-first)

4. ASSEMBLE FINAL HTML:
   - Combine blocks in order
   - Add Tailwind CSS: <script src="https://cdn.tailwindcss.com"></script>
   - Add custom animations if using signature blocks
   - Ensure all sections have proper spacing (py-20 px-4)
   - Validate HTML structure

5. QUALITY CHECKS:
   - All required blocks included
   - All required parameters filled
   - Images from Unsplash (not placeholders)
   - Responsive design (mobile, tablet, desktop)
   - Consistent color scheme
   - Professional content (no lorem ipsum)
   - Proper semantic HTML

OUTPUT FORMAT:
Provide complete HTML document with:
- <!DOCTYPE html>
- <html> with lang attribute
- <head> with title, meta tags, Tailwind CDN
- <body> with all assembled blocks
- Custom <style> for animations if needed

IMPORTANT:
- Use REAL content, not lorem ipsum
- Use REAL Unsplash image URLs
- Ensure cinematic, high-end appearance
- Make it industry-specific, not generic
- Follow Tailwind best practices
- Ensure mobile responsiveness
```

---

## Example: Barber Shop Website

### Input
```
Industry: barber-shop
Business: "Joe's Classic Cuts"
Location: "Brooklyn, NY"
Services: Haircuts, Beard Trims, Hot Towel Shaves, Styling
Style: Modern, Professional
```

### Process

1. **Lookup Industry Blocks**:
   ```json
   {
     "barber-shop": {
       "blocks": ["cut-styles", "barber-profile", "appointment-form", "testimonials"],
       "suggestedBlocks": ["hero", "features", "gallery", "footer"]
     }
   }
   ```

2. **Determine Order**:
   - header
   - hero
   - cut-styles
   - barber-profile
   - features (services)
   - testimonials
   - gallery
   - appointment-form
   - footer

3. **Generate Content**:
   - Hero: "Joe's Classic Cuts - Brooklyn's Premier Barbershop"
   - Features: List of services with descriptions
   - Cut Styles: Showcase different haircut styles
   - Barber Profile: Introduce barbers
   - Testimonials: Customer reviews
   - Images: Unsplash barbershop/haircut images

4. **Assemble**: Combine all blocks in order

---

## Content Generation Guidelines

### Hero Sections
- **Title**: Compelling, 3-8 words, includes business name
- **Subtitle**: Value proposition, 10-20 words
- **CTA**: Action-oriented ("Book Appointment", "View Menu", "Get Started")
- **Image**: High-quality, industry-relevant, 1920x1080

### Features/Services
- **Title**: Clear, benefit-focused
- **Description**: 15-30 words explaining value
- **Icon/Image**: Relevant visual representation

### Testimonials
- **Quote**: 20-50 words, authentic-sounding
- **Author**: Real-sounding name, position/role
- **Rating**: 4-5 stars typically

### Product/Menu Items
- **Name**: Clear, descriptive
- **Description**: Appetizing/informative, 10-20 words
- **Price**: Realistic for industry
- **Image**: High-quality product photo

---

## Image Selection Strategy

1. **Hero Images**: 
   - Use Unsplash search: `?query=[industry]&w=1920&h=1080`
   - Examples: "restaurant interior", "barbershop", "fitness gym"

2. **Product Images**:
   - Use Unsplash search: `?query=[product-type]&w=800&h=600`
   - Examples: "burger", "haircut", "yoga pose"

3. **Gallery Images**:
   - Mix of different angles/styles
   - Consistent quality and style
   - Use Unsplash collections for curated sets

---

## Quality Checklist

Before finalizing generated website:

- [ ] All required blocks included
- [ ] All required parameters filled
- [ ] No placeholder text (lorem ipsum)
- [ ] Real Unsplash image URLs
- [ ] Responsive design (test mobile/tablet/desktop)
- [ ] Consistent color scheme
- [ ] Proper spacing (py-20 for sections)
- [ ] Semantic HTML structure
- [ ] Accessible (alt text, proper headings)
- [ ] Industry-specific content (not generic)
- [ ] Professional appearance
- [ ] Smooth animations (if signature blocks used)
- [ ] Fast loading (optimized images)

---

## Advanced: Signature Blocks

When using signature blocks (premium variants):

1. **hero-cinematic.html**: 
   - Requires high-quality hero image
   - Add custom animations
   - Use gradient overlays

2. **hero-glass.html**:
   - Requires backdrop blur support
   - Use glassmorphism effects
   - Ensure contrast for readability

3. **parallax-hero.html**:
   - Add parallax JavaScript
   - Use transform3d for performance
   - Test scroll performance

4. **3d-card-stack.html**:
   - Add perspective CSS
   - Use transform-gpu for performance
   - Ensure browser compatibility

---

## Error Handling

If block not found:
- Use generic equivalent
- Log warning
- Continue assembly

If parameter missing:
- Use default from block-parameters.json
- Generate reasonable placeholder
- Continue assembly

If image fails:
- Use fallback Unsplash URL
- Log error
- Continue assembly

---

## Performance Optimization

1. **Images**: Use Unsplash `w` and `h` parameters for sizing
2. **CSS**: Use Tailwind CDN (already optimized)
3. **Animations**: Use CSS transforms, not layout properties
4. **Lazy Loading**: Add `loading="lazy"` to images
5. **Minimize**: Remove unused Tailwind classes (if purging)

---

## Testing Checklist

- [ ] Mobile view (375px width)
- [ ] Tablet view (768px width)
- [ ] Desktop view (1024px+ width)
- [ ] All links work
- [ ] Forms are functional
- [ ] Images load correctly
- [ ] Animations work smoothly
- [ ] No console errors
- [ ] Accessible (screen reader test)
- [ ] Fast load time (<3s)

---

## Example Output Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[Business Name] - [Tagline]</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    /* Custom animations for signature blocks */
    @keyframes fade-in { ... }
  </style>
</head>
<body>
  <!-- Header Block -->
  <!-- Hero Block -->
  <!-- Industry-Specific Blocks -->
  <!-- Generic Blocks -->
  <!-- Footer Block -->
</body>
</html>
```

---

This assembly logic ensures high-quality, industry-specific websites that look cinematic and professional, not generic templates.

