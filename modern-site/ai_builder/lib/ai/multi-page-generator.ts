/**
 * Multi-Page Website Generator
 * Generates multiple pages for a website with navigation
 */

export interface PageConfig {
  slug: string
  title: string
  description: string
  blocks: string[]
  order: number
}

export interface MultiPageSite {
  pages: PageConfig[]
  navigation: NavigationItem[]
}

export interface NavigationItem {
  label: string
  href: string
  order: number
}

/**
 * Generate default pages based on industry
 */
export function generateDefaultPages(industry: string, businessName: string): PageConfig[] {
  const basePages: PageConfig[] = [
    {
      slug: 'index',
      title: `Home - ${businessName}`,
      description: `Welcome to ${businessName}`,
      blocks: ['header', 'hero', 'features', 'testimonial', 'footer'],
      order: 1,
    },
  ]

  // Industry-specific pages
  const industryPages: Record<string, PageConfig[]> = {
    restaurant: [
      {
        slug: 'menu',
        title: `Menu - ${businessName}`,
        description: `Our delicious menu`,
        blocks: ['header', 'menu', 'footer'],
        order: 2,
      },
      {
        slug: 'about',
        title: `About Us - ${businessName}`,
        description: `Learn about ${businessName}`,
        blocks: ['header', 'hero', 'text-section', 'image-section', 'footer'],
        order: 3,
      },
      {
        slug: 'contact',
        title: `Contact - ${businessName}`,
        description: `Get in touch with ${businessName}`,
        blocks: ['header', 'contact-form', 'location-map', 'footer'],
        order: 4,
      },
    ],
    ecommerce: [
      {
        slug: 'products',
        title: `Products - ${businessName}`,
        description: `Browse our products`,
        blocks: ['header', 'product-grid', 'footer'],
        order: 2,
      },
      {
        slug: 'about',
        title: `About - ${businessName}`,
        description: `About ${businessName}`,
        blocks: ['header', 'text-section', 'footer'],
        order: 3,
      },
      {
        slug: 'contact',
        title: `Contact - ${businessName}`,
        description: `Contact ${businessName}`,
        blocks: ['header', 'contact-form', 'footer'],
        order: 4,
      },
    ],
    default: [
      {
        slug: 'about',
        title: `About - ${businessName}`,
        description: `About ${businessName}`,
        blocks: ['header', 'hero', 'text-section', 'image-section', 'footer'],
        order: 2,
      },
      {
        slug: 'services',
        title: `Services - ${businessName}`,
        description: `Our services`,
        blocks: ['header', 'features', 'footer'],
        order: 3,
      },
      {
        slug: 'contact',
        title: `Contact - ${businessName}`,
        description: `Contact ${businessName}`,
        blocks: ['header', 'contact-form', 'footer'],
        order: 4,
      },
    ],
  }

  const pages = industryPages[industry] || industryPages.default
  return [...basePages, ...pages]
}

/**
 * Generate navigation from pages
 */
export function generateNavigation(pages: PageConfig[]): NavigationItem[] {
  return pages
    .sort((a, b) => a.order - b.order)
    .map((page) => ({
      label: page.slug === 'index' ? 'Home' : capitalize(page.slug),
      href: page.slug === 'index' ? '/' : `/${page.slug}`,
      order: page.order,
    }))
}

/**
 * Generate navigation HTML
 */
export function generateNavigationHTML(navigation: NavigationItem[]): string {
  const navItems = navigation
    .map(
      (item) =>
        `        <a href="${item.href}" class="text-gray-700 hover:text-teal-600 transition">${item.label}</a>`
    )
    .join('\n')

  return `
    <nav class="container mx-auto px-4 py-4 flex items-center justify-between">
      <div class="flex items-center space-x-2">
        <a href="/" class="text-2xl font-bold text-gray-900">Logo</a>
      </div>
      <div class="hidden md:flex items-center space-x-6">
${navItems}
      </div>
      <button class="md:hidden text-gray-700">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>
    </nav>
  `.trim()
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}



