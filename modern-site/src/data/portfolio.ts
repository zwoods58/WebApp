// Portfolio data for storytelling across homepage
export const portfolioItems = [
  {
    id: 1,
    name: "Joe's Coffee Shop",
    industry: 'Restaurant',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=600&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=200&h=150&fit=crop&q=80',
    description: 'Modern coffee shop website with online ordering',
    feature: 'fast-delivery', // Matches "Fast Delivery" benefit
  },
  {
    id: 2,
    name: 'Smith Plumbing',
    industry: 'Services',
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=600&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=200&h=150&fit=crop&q=80',
    description: 'Professional plumbing services website',
    feature: 'transparent-pricing', // Matches "Transparent Pricing" benefit
  },
  {
    id: 3,
    name: 'Bella Boutique',
    industry: 'Retail',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=150&fit=crop&q=80',
    description: 'Elegant boutique e-commerce platform',
    feature: 'personal-attention', // Matches "Personal Attention" benefit
  },
  {
    id: 4,
    name: 'Tech Repair Co',
    industry: 'Technology',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&h=150&fit=crop&q=80',
    description: 'Tech repair service booking website',
    feature: 'modern-technology', // Matches "Modern Technology" benefit
  },
  {
    id: 5,
    name: 'Green Landscaping',
    industry: 'Home Services',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&h=150&fit=crop&q=80',
    description: 'Landscaping portfolio and quote system',
    feature: 'quality-work', // Matches "Quality Work" benefit
  },
  {
    id: 6,
    name: 'Fitness Studio',
    industry: 'Health & Wellness',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=150&fit=crop&q=80',
    description: 'Fitness studio with class schedules',
    feature: 'fast-delivery',
  },
]

// Map features to portfolio items
export const featurePortfolioMap: Record<string, typeof portfolioItems[0]> = {
  'fast-delivery': portfolioItems[0],
  'transparent-pricing': portfolioItems[1],
  'personal-attention': portfolioItems[2],
  'modern-technology': portfolioItems[3],
  'quality-work': portfolioItems[4],
}

// Testimonial to portfolio mapping
export const testimonialPortfolioMap: Record<number, typeof portfolioItems[0]> = {
  0: portfolioItems[0], // Sarah Martinez - Coffee Shop
  1: portfolioItems[3], // David Chen - Tech Repair
  2: portfolioItems[5], // Emily Rodriguez - Fitness Studio
  3: portfolioItems[4], // Michael Thompson - Landscaping
  4: portfolioItems[2], // Lisa Anderson - Boutique
}

