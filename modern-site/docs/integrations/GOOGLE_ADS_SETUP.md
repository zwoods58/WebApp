# Google Ads Setup Guide for Maximum Reach

## ✅ What's Been Implemented

### 1. **Google Ads Tracking Code**
- ✅ Google Ads Global Site Tag (gtag.js) added to main layout
- ✅ Google Tag Manager setup added
- ✅ Conversion tracking code added to contact form
- ⚠️ **ACTION REQUIRED**: Replace placeholder IDs with your actual Google Ads IDs

### 2. **Location-Specific Landing Pages**
Created targeted landing pages for high-value locations:
- ✅ `/locations/durban` - Durban, South Africa
- ✅ `/locations/nairobi` - Nairobi, Kenya  
- ✅ `/locations/kigali` - Kigali, Rwanda

**Benefits:**
- Better Quality Score (more relevant landing pages)
- Location-specific ad copy
- Higher conversion rates
- Enables location extensions

### 3. **Industry-Specific Landing Pages**
Created targeted pages for high-value industries:
- ✅ `/industries/salons` - Salons & Barbershops
- ✅ `/industries/restaurants` - Restaurants & Food Service
- ✅ `/industries/real-estate` - Real Estate Agents

**Benefits:**
- Targets specific industry keywords
- Better ad relevance
- Industry-specific messaging
- Higher conversion rates

### 4. **High-Intent Landing Page**
- ✅ `/fast-website` - For urgent/fast website keywords

**Benefits:**
- Captures urgent buyers
- High conversion intent
- Fast decision makers

### 5. **Structured Data (Schema.org)**
- ✅ LocalBusiness schema on location pages
- ✅ Service schema on industry pages
- ✅ Organization schema on main layout

**Benefits:**
- Better ad extensions
- Rich snippets in search results
- Improved click-through rates

### 6. **Updated Sitemap**
- ✅ All new landing pages added to sitemap.xml
- ✅ Proper priorities and change frequencies set

---

## 🔧 Setup Steps Required

### Step 1: Add Your Google Ads IDs

**File to edit:** `modern-site/app/layout.tsx`

Replace these placeholders:
1. `AW-CONVERSION_ID` - Your Google Ads Conversion ID
2. `GTM-XXXXXXX` - Your Google Tag Manager ID

**How to find your IDs:**
1. Go to Google Ads → Tools & Settings → Conversions
2. Create a conversion action (e.g., "Contact Form Submission")
3. Copy the Conversion ID and Label
4. Go to Google Tag Manager → Admin → Install Google Tag Manager
5. Copy your GTM Container ID

### Step 2: Update Conversion Tracking

**File to edit:** `modern-site/app/contact/page.tsx`

Replace:
- `AW-CONVERSION_ID/AW-CONVERSION_LABEL` with your actual conversion ID and label

**Example:**
```javascript
'send_to': 'AW-123456789/AbC-dEfGhIjKlMnOpQrStUvWxYz'
```

### Step 3: Create Google Ads Campaigns

#### Campaign Structure Recommendation:

**Campaign 1: Location-Based (High Priority)**
- Ad Group: Durban
  - Keywords: "website design durban", "web developers durban", etc.
  - Landing Page: `/locations/durban`
  
- Ad Group: Nairobi
  - Keywords: "website design nairobi", "nairobi web developers", etc.
  - Landing Page: `/locations/nairobi`
  
- Ad Group: Kigali
  - Keywords: "website design kigali", "kigali web developers", etc.
  - Landing Page: `/locations/kigali`

**Campaign 2: Industry-Based**
- Ad Group: Salons
  - Keywords: "website for salons", "salon website design", etc.
  - Landing Page: `/industries/salons`
  
- Ad Group: Restaurants
  - Keywords: "restaurant website design", "restaurant online ordering", etc.
  - Landing Page: `/industries/restaurants`
  
- Ad Group: Real Estate
  - Keywords: "real estate website design", "property listing website", etc.
  - Landing Page: `/industries/real-estate`

**Campaign 3: High-Intent Keywords**
- Ad Group: Urgent/Fast
  - Keywords: "fast website design", "urgent website", "business website urgently"
  - Landing Page: `/fast-website`

**Campaign 4: General Keywords**
- Ad Group: General Web Design
  - Keywords: "affordable website design", "professional website designers", etc.
  - Landing Page: `/` (home page)

### Step 4: Keyword Strategy

**Use all 400+ keywords you provided:**
1. Add them to relevant ad groups
2. Use match types:
   - **Exact Match**: High-intent, specific keywords
   - **Phrase Match**: Location + service combinations
   - **Broad Match**: General terms (use with caution)

**Negative Keywords:**
Add these to avoid irrelevant clicks:
- "free"
- "tutorial"
- "how to"
- "DIY"
- "template"

### Step 5: Ad Copy Best Practices

**For Location Pages:**
- Include location name in headline
- Mention local benefits
- Use location-specific CTAs

**Example:**
```
Headline 1: Professional Website Design in Durban
Headline 2: Get Your Business Online Today
Description: Affordable, mobile-friendly websites for Durban businesses. Fast setup, local support.
```

**For Industry Pages:**
- Focus on industry-specific benefits
- Mention relevant features
- Use industry terminology

**Example:**
```
Headline 1: Salon Website Design with Online Booking
Headline 2: Showcase Your Work & Grow Your Clientele
Description: Professional salon websites with service galleries, online booking, and mobile-friendly design.
```

### Step 6: Conversion Tracking Setup

1. **In Google Ads:**
   - Go to Tools & Settings → Conversions
   - Create conversion action: "Contact Form Submission"
   - Set value (if applicable)
   - Set conversion window (30 days recommended)

2. **Verify Tracking:**
   - Use Google Tag Assistant
   - Test form submission
   - Verify conversion fires in Google Ads

### Step 7: Optimize for Quality Score

**Quality Score Factors:**
1. ✅ **Landing Page Relevance** - We've created targeted pages
2. ✅ **Expected CTR** - Use compelling ad copy
3. ✅ **Ad Relevance** - Match keywords to ad copy
4. ⚠️ **Page Load Speed** - Monitor and optimize
5. ⚠️ **Mobile Experience** - Test on mobile devices

**Improve Quality Score:**
- Use exact match keywords where possible
- Ensure ad copy matches landing page content
- Improve page load speed
- Optimize mobile experience

---

## 📊 Monitoring & Optimization

### Key Metrics to Track:

1. **Click-Through Rate (CTR)**
   - Target: >3% for search campaigns
   - Improve: Better ad copy, more relevant keywords

2. **Conversion Rate**
   - Target: >2-5% for contact forms
   - Improve: Better landing pages, clearer CTAs

3. **Cost Per Conversion**
   - Target: Keep within your profit margins
   - Improve: Better Quality Score, more relevant keywords

4. **Quality Score**
   - Target: 7-10
   - Improve: Better landing pages, relevant keywords

### A/B Testing Recommendations:

1. **Test Different Landing Pages:**
   - Home page vs. location-specific pages
   - Industry pages vs. general pages

2. **Test Ad Copy:**
   - Price-focused vs. benefit-focused
   - Urgency vs. quality messaging

3. **Test Keywords:**
   - Broad match vs. exact match
   - Long-tail vs. short keywords

---

## 🎯 Quick Start Checklist

- [ ] Replace Google Ads Conversion ID in `layout.tsx`
- [ ] Replace Google Tag Manager ID in `layout.tsx`
- [ ] Update conversion tracking in `contact/page.tsx`
- [ ] Create Google Ads account
- [ ] Set up conversion action in Google Ads
- [ ] Create location-based campaigns
- [ ] Create industry-based campaigns
- [ ] Create high-intent campaign
- [ ] Add all 400+ keywords to relevant ad groups
- [ ] Set up negative keywords
- [ ] Write compelling ad copy
- [ ] Set daily budgets
- [ ] Launch campaigns
- [ ] Monitor performance daily for first week
- [ ] Optimize based on data

---

## 📈 Expected Results

With proper setup and optimization:

- **Reach**: 10,000+ keyword combinations possible
- **Quality Score**: 7-10 (with targeted landing pages)
- **Conversion Rate**: 2-5% (with optimized pages)
- **Cost Per Click**: Lower with better Quality Score
- **ROI**: Higher with targeted campaigns

---

## 🆘 Need Help?

1. **Google Ads Help Center**: https://support.google.com/google-ads
2. **Google Tag Manager Help**: https://support.google.com/tagmanager
3. **Conversion Tracking Guide**: https://support.google.com/google-ads/answer/1727054

---

**Last Updated:** Today
**Status:** Ready for Google Ads setup (pending ID replacement)


