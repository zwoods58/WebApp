/**
 * Industry-Specific Image Mappings
 * Curated image sets for each industry using Unsplash URLs
 * These images are more specific to each industry than the generic category templates
 */

export interface IndustryImageSet {
  hero: {
    backgroundImage: string
  }
  features: string[] // Array of 3 feature images
  testimonials?: string[] // Array of testimonial photos (optional)
}

/**
 * Industry-specific image mappings
 * Maps industry names to curated image sets
 */
export const industryImageMappings: Record<string, IndustryImageSet> = {
  // Healthcare Industries
  fitness: {
    hero: {
      backgroundImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=600&fit=crop'
    },
    features: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop', // Gym equipment
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&h=400&fit=crop', // Personal training
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop'  // Fitness class
    ],
    testimonials: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop'
    ]
  },
  
  gym: {
    hero: {
      backgroundImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=600&fit=crop'
    },
    features: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop'
    ]
  },
  
  dentist: {
    hero: {
      backgroundImage: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=1200&h=600&fit=crop'
    },
    features: [
      'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=600&h=400&fit=crop', // Dental office
      'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&h=400&fit=crop', // Dental equipment
      'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=600&h=400&fit=crop'  // Dental care
    ],
    testimonials: [
      'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop',
      'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop'
    ]
  },
  
  chiropractor: {
    hero: {
      backgroundImage: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&h=600&fit=crop'
    },
    features: [
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1576091160550-2173dba999e8?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&h=400&fit=crop'
    ]
  },
  
  'medical-clinic': {
    hero: {
      backgroundImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&h=600&fit=crop'
    },
    features: [
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1576091160550-2173dba999e8?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&h=400&fit=crop'
    ]
  },
  
  // Retail Industries
  restaurant: {
    hero: {
      backgroundImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=600&fit=crop'
    },
    features: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop', // Restaurant interior
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop', // Food presentation
      'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=600&h=400&fit=crop'  // Dining experience
    ],
    testimonials: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&h=100&fit=crop'
    ]
  },
  
  bakery: {
    hero: {
      backgroundImage: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=1200&h=600&fit=crop'
    },
    features: [
      'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&h=400&fit=crop', // Bakery display
      'https://images.unsplash.com/photo-1486427944299-d1955d23da34?w=600&h=400&fit=crop', // Fresh bread
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=400&fit=crop'  // Pastries
    ]
  },
  
  'coffee-shop': {
    hero: {
      backgroundImage: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&h=600&fit=crop'
    },
    features: [
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1511920170033-83939d0b1a41?w=600&h=400&fit=crop'
    ]
  },
  
  // Services Industries
  plumber: {
    hero: {
      backgroundImage: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=1200&h=600&fit=crop'
    },
    features: [
      'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&h=400&fit=crop', // Plumbing work
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=400&fit=crop', // Professional service
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop'  // Quality work
    ]
  },
  
  electrician: {
    hero: {
      backgroundImage: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200&h=600&fit=crop'
    },
    features: [
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop'
    ]
  },
  
  'cleaning-service': {
    hero: {
      backgroundImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&h=600&fit=crop'
    },
    features: [
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop'
    ]
  },
  
  // Professional Industries
  legal: {
    hero: {
      backgroundImage: 'https://images.unsplash.com/photo-1450101499163-8841044c0b6e?w=1200&h=600&fit=crop'
    },
    features: [
      'https://images.unsplash.com/photo-1450101499163-8841044c0b6e?w=600&h=400&fit=crop', // Legal office
      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&h=400&fit=crop', // Courtroom
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop'  // Professional
    ],
    testimonials: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&h=100&fit=crop'
    ]
  },
  
  'legal-firm': {
    hero: {
      backgroundImage: 'https://images.unsplash.com/photo-1450101499163-8841044c0b6e?w=1200&h=600&fit=crop'
    },
    features: [
      'https://images.unsplash.com/photo-1450101499163-8841044c0b6e?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop'
    ]
  },
  
  accounting: {
    hero: {
      backgroundImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=600&fit=crop'
    },
    features: [
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop'
    ]
  },
  
  // Technology Industries
  saas: {
    hero: {
      backgroundImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=600&fit=crop'
    },
    features: [
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop', // Technology
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop', // Data/analytics
      'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&h=400&fit=crop'  // Support
    ],
    testimonials: [
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
    ]
  },
  
  'technology-saas': {
    hero: {
      backgroundImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=600&fit=crop'
    },
    features: [
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&h=400&fit=crop'
    ]
  },
  
  // Education Industries
  'university-college': {
    hero: {
      backgroundImage: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&h=600&fit=crop'
    },
    features: [
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=400&fit=crop'
    ]
  },
  
  tutoring: {
    hero: {
      backgroundImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&h=600&fit=crop'
    },
    features: [
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=400&fit=crop'
    ]
  },
  
  // Creative Industries
  photographer: {
    hero: {
      backgroundImage: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1200&h=600&fit=crop'
    },
    features: [
      'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&h=400&fit=crop', // Photography
      'https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=600&h=400&fit=crop', // Creative work
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop'  // Portfolio
    ],
    testimonials: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop'
    ]
  },
  
  // Hospitality Industries
  hotel: {
    hero: {
      backgroundImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=600&fit=crop'
    },
    features: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop', // Hotel room
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop', // Amenities
      'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=600&h=400&fit=crop'  // Service
    ]
  },
  
  // Real Estate
  'real-estate': {
    hero: {
      backgroundImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=600&fit=crop'
    },
    features: [
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop', // Property
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&h=400&fit=crop', // Home
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop'  // Real estate
    ]
  }
}

/**
 * Category-based image fallbacks
 * Used when industry-specific images aren't available
 */
export const categoryImageFallbacks: Record<string, IndustryImageSet> = {
  healthcare: {
    hero: {
      backgroundImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=1200&h=600&fit=crop'
    },
    features: [
      'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1576091160550-2173dba999e8?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&h=400&fit=crop'
    ],
    testimonials: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop'
    ]
  },
  
  retail: {
    hero: {
      backgroundImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop'
    },
    features: [
      'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&h=400&fit=crop'
    ]
  },
  
  services: {
    hero: {
      backgroundImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&h=600&fit=crop'
    },
    features: [
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop'
    ]
  },
  
  professional: {
    hero: {
      backgroundImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=600&fit=crop'
    },
    features: [
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop'
    ]
  },
  
  education: {
    hero: {
      backgroundImage: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&h=600&fit=crop'
    },
    features: [
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=400&fit=crop'
    ]
  },
  
  creative: {
    hero: {
      backgroundImage: 'https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=1200&h=600&fit=crop'
    },
    features: [
      'https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop'
    ]
  },
  
  hospitality: {
    hero: {
      backgroundImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&h=600&fit=crop'
    },
    features: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=600&h=400&fit=crop'
    ]
  },
  
  technology: {
    hero: {
      backgroundImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=600&fit=crop'
    },
    features: [
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&h=400&fit=crop'
    ]
  },
  
  general: {
    hero: {
      backgroundImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=600&fit=crop'
    },
    features: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop'
    ]
  }
}

/**
 * Get industry-specific images
 * Returns industry images if available, otherwise category fallback
 */
export function getIndustryImages(industry: string | null, category: string): IndustryImageSet {
  if (!industry) {
    return categoryImageFallbacks.general
  }
  
  const normalized = industry.toLowerCase().replace(/[^a-z0-9-]/g, '-')
  
  // Check for industry-specific images
  if (industryImageMappings[normalized]) {
    return industryImageMappings[normalized]
  }
  
  // Fall back to category images
  return categoryImageFallbacks[category] || categoryImageFallbacks.general
}

/**
 * Merge images into siteData template
 * Replaces template images with industry-specific ones
 * Only replaces if image doesn't already exist (allows JSON overrides)
 */
export function mergeImagesIntoSiteData(
  siteData: any,
  industry: string | null,
  category: string,
  allowOverrides: boolean = false
): any {
  const images = getIndustryImages(industry, category)
  
  // Merge hero background image
  // Only replace if not already set (JSON files can override)
  if (images.hero.backgroundImage && siteData.hero) {
    if (allowOverrides || !siteData.hero.backgroundImage) {
      siteData.hero.backgroundImage = images.hero.backgroundImage
    }
  }
  
  // Merge feature images
  // Only replace if feature doesn't have image (JSON files can override)
  if (images.features && siteData.features && Array.isArray(siteData.features)) {
    siteData.features = siteData.features.map((feature: any, index: number) => ({
      ...feature,
      // Use existing image if present, otherwise use industry-specific image
      image: feature.image || images.features[index] || undefined
    }))
  }
  
  // Merge testimonial photos
  // Only replace if testimonial doesn't have photo (JSON files can override)
  if (images.testimonials && siteData.testimonials && Array.isArray(siteData.testimonials)) {
    siteData.testimonials = siteData.testimonials.map((testimonial: any, index: number) => ({
      ...testimonial,
      // Use existing photo if present, otherwise use industry-specific photo
      photo: testimonial.photo || images.testimonials?.[index] || undefined
    }))
  }
  
  return siteData
}

