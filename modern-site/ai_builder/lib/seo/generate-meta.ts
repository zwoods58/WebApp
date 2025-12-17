/**
 * SEO Meta Tags Generator
 * Generates SEO meta tags, structured data, and Open Graph tags
 */

export interface SEOData {
  title: string
  description: string
  keywords?: string[]
  author?: string
  image?: string
  url?: string
  type?: 'website' | 'article' | 'product' | 'business'
  businessName?: string
  businessType?: string
  location?: string
}

export interface StructuredData {
  '@context': string
  '@type': string
  [key: string]: any
}

/**
 * Generate HTML meta tags
 */
export function generateMetaTags(seo: SEOData): string {
  const {
    title,
    description,
    keywords,
    author,
    image,
    url,
    type = 'website',
  } = seo

  const tags: string[] = []

  // Basic meta tags
  tags.push(`<title>${escapeHtml(title)}</title>`)
  tags.push(`<meta name="description" content="${escapeHtml(description)}">`)
  
  if (keywords && keywords.length > 0) {
    tags.push(`<meta name="keywords" content="${escapeHtml(keywords.join(', '))}">`)
  }
  
  if (author) {
    tags.push(`<meta name="author" content="${escapeHtml(author)}">`)
  }

  // Open Graph tags
  tags.push(`<meta property="og:title" content="${escapeHtml(title)}">`)
  tags.push(`<meta property="og:description" content="${escapeHtml(description)}">`)
  tags.push(`<meta property="og:type" content="${type}">`)
  
  if (url) {
    tags.push(`<meta property="og:url" content="${escapeHtml(url)}">`)
  }
  
  if (image) {
    tags.push(`<meta property="og:image" content="${escapeHtml(image)}">`)
    tags.push(`<meta property="og:image:width" content="1200">`)
    tags.push(`<meta property="og:image:height" content="630">`)
  }

  // Twitter Card tags
  tags.push(`<meta name="twitter:card" content="summary_large_image">`)
  tags.push(`<meta name="twitter:title" content="${escapeHtml(title)}">`)
  tags.push(`<meta name="twitter:description" content="${escapeHtml(description)}">`)
  
  if (image) {
    tags.push(`<meta name="twitter:image" content="${escapeHtml(image)}">`)
  }

  // Additional SEO tags
  tags.push(`<meta name="viewport" content="width=device-width, initial-scale=1.0">`)
  tags.push(`<meta name="robots" content="index, follow">`)
  tags.push(`<meta charset="UTF-8">`)

  return tags.join('\n    ')
}

/**
 * Generate structured data (JSON-LD)
 */
export function generateStructuredData(seo: SEOData): StructuredData {
  const { businessName, businessType, location, url, image } = seo

  // Default to LocalBusiness schema
  const structuredData: StructuredData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: businessName || seo.title,
    description: seo.description,
  }

  if (url) {
    structuredData.url = url
  }

  if (image) {
    structuredData.image = image
  }

  if (businessType) {
    structuredData['@type'] = getSchemaType(businessType)
  }

  if (location) {
    structuredData.address = {
      '@type': 'PostalAddress',
      addressLocality: location,
    }
  }

  return structuredData
}

/**
 * Get Schema.org type based on business type
 */
function getSchemaType(businessType: string): string {
  const typeMap: Record<string, string> = {
    restaurant: 'Restaurant',
    barber: 'HairSalon',
    fitness: 'ExerciseGym',
    medical: 'MedicalBusiness',
    dentist: 'Dentist',
    lawyer: 'LegalService',
    realestate: 'RealEstateAgent',
    hotel: 'Hotel',
    store: 'Store',
    cafe: 'CafeOrCoffeeShop',
  }

  const normalized = businessType.toLowerCase().replace(/\s+/g, '')
  return typeMap[normalized] || 'LocalBusiness'
}

/**
 * Generate complete SEO head section
 */
export function generateSEOHead(seo: SEOData): string {
  const metaTags = generateMetaTags(seo)
  const structuredData = generateStructuredData(seo)

  return `
    ${metaTags}
    <script type="application/ld+json">
      ${JSON.stringify(structuredData, null, 2)}
    </script>
  `.trim()
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  return text.replace(/[&<>"']/g, (m) => map[m])
}

/**
 * Generate sitemap entry
 */
export function generateSitemapEntry(url: string, lastmod?: string, changefreq = 'monthly', priority = 0.8): string {
  const lastmodDate = lastmod || new Date().toISOString().split('T')[0]
  return `  <url>
    <loc>${escapeHtml(url)}</loc>
    <lastmod>${lastmodDate}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
}

/**
 * Generate sitemap.xml
 */
export function generateSitemap(entries: Array<{ url: string; lastmod?: string; changefreq?: string; priority?: number }>): string {
  const urlEntries = entries.map((entry) =>
    generateSitemapEntry(entry.url, entry.lastmod, entry.changefreq, entry.priority)
  ).join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`
}



