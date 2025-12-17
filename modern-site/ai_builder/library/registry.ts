/**
 * Master Industry Registry
 * Central matching logic for industries to components and data
 * This is the "brain" that connects user selection to component assembly
 * 
 * Hybrid System:
 * - Category-based templates (embedded) for 80% of industries
 * - Industry-specific JSON files (optional) for complex/custom data
 * - Auto-discovery of components from folder structure
 * - Smart fallback chain: industry → category → default
 */

// Import component index (generated at build-time)
import { getIndustryComponents as getComponentsFromIndex } from './components/component-index'

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface SiteDataTemplate {
  theme: {
    primaryColor: string
    secondaryColor: string
    accentColor?: string
    fontFamily?: string
  }
  nav: {
    logo: string
    businessName: string
    links: Array<{ label: string; href: string }>
    ctaText?: string
    ctaLink?: string
  }
  hero: {
    title: string
    subtitle: string
    ctaPrimary?: string
    ctaPrimaryLink?: string
    ctaSecondary?: string
    ctaSecondaryLink?: string
    backgroundImage?: string
  }
  features: Array<{
    title: string
    description: string
    icon?: string
    image?: string
  }>
  plans?: Array<{
    name: string
    price: string
    billingPeriod: string
    isFeatured?: boolean
    features: string[]
    ctaText: string
  }>
  testimonials?: Array<{
    quote: string
    name: string
    rating?: number
    position?: string
    company?: string
    photo?: string
  }>
  footer: {
    businessName: string
    description: string
    businessEmail?: string
    businessPhone?: string
    businessAddress?: string
    socialLinks?: Record<string, string>
    quickLinks?: Array<{ label: string; href: string }>
  }
}

export interface IndustryConfig {
  // Data source
  dataPath?: string | null // Path to industry-specific JSON file (null = use category template)
  category: string // Category for template lookup
  
  // Components (auto-discovered from /industry/{name}/ folder)
  useAllGenericBlocks?: boolean // true = allow all 31 generic categories
  allowedGenericBlocks?: string[] // Restrict generic components if needed
  
  // Theme (can override category template)
  themeDefaults: {
    primary: string
    secondary: string
    accent?: string
  }
  
  // Layout
  recommendedLayout: string[]
  
  // Metadata
  priority?: number // For sorting/display
}

// ============================================
// CATEGORY TEMPLATES (Embedded SiteData)
// ============================================

const categoryTemplates: Record<string, SiteDataTemplate> = {
  healthcare: {
    theme: {
      primaryColor: 'blue-500',
      secondaryColor: 'white',
      accentColor: 'blue-400',
      fontFamily: 'Inter, sans-serif'
    },
    nav: {
      logo: '🏥',
      businessName: 'HealthCare Provider',
      links: [
        { label: 'Home', href: '#home' },
        { label: 'Services', href: '#services' },
        { label: 'About', href: '#about' },
        { label: 'Contact', href: '#contact' }
      ],
      ctaText: 'Book Appointment',
      ctaLink: '#contact'
    },
    hero: {
      title: 'Transform Your Health, Elevate Your Life',
      subtitle: 'Expert care and personalized treatment plans to help you achieve optimal wellness.',
      ctaPrimary: 'Book Appointment',
      ctaPrimaryLink: '#contact',
      ctaSecondary: 'Learn More',
      ctaSecondaryLink: '#services',
      backgroundImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=1200&h=600&fit=crop'
    },
    features: [
      {
        title: 'Expert Care',
        description: 'Board-certified professionals dedicated to your health and wellness.',
        icon: '👨‍⚕️',
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&h=400&fit=crop'
      },
      {
        title: 'Personalized Treatment',
        description: 'Customized care plans tailored to your unique needs and goals.',
        icon: '📋',
        image: 'https://images.unsplash.com/photo-1576091160550-2173dba999e8?w=600&h=400&fit=crop'
      },
      {
        title: 'Modern Facilities',
        description: 'State-of-the-art equipment and comfortable, welcoming environment.',
        icon: '🏥',
        image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&h=400&fit=crop'
      }
    ],
    plans: [
      {
        name: 'Basic',
        price: '$99',
        billingPeriod: 'per visit',
        isFeatured: false,
        features: ['Initial Consultation', 'Basic Treatment', 'Follow-up Care'],
        ctaText: 'Get Started'
      },
      {
        name: 'Premium',
        price: '$199',
        billingPeriod: 'per month',
        isFeatured: true,
        features: ['All Basic Features', 'Priority Scheduling', 'Extended Care'],
        ctaText: 'Most Popular'
      }
    ],
    testimonials: [
      {
        quote: 'Outstanding care and attention to detail. The team truly cares about your health.',
        name: 'Sarah Johnson',
        rating: 5,
        position: 'Patient',
        photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'
      }
    ],
    footer: {
      businessName: 'HealthCare Provider',
      description: 'Your trusted partner in health and wellness.',
      businessEmail: 'info@healthcare.com',
      businessPhone: '+1 (555) 123-4567',
      businessAddress: '123 Health Street, Wellness City, WC 12345',
      socialLinks: {
        facebook: 'https://facebook.com/healthcare',
        instagram: 'https://instagram.com/healthcare'
      },
      quickLinks: [
        { label: 'About', href: '#about' },
        { label: 'Services', href: '#services' },
        { label: 'Contact', href: '#contact' }
      ]
    }
  },
  
  retail: {
    theme: {
      primaryColor: 'orange-600',
      secondaryColor: 'slate-900',
      accentColor: 'orange-500',
      fontFamily: 'Inter, sans-serif'
    },
    nav: {
      logo: '🛍️',
      businessName: 'Retail Store',
      links: [
        { label: 'Home', href: '#home' },
        { label: 'Products', href: '#products' },
        { label: 'About', href: '#about' },
        { label: 'Contact', href: '#contact' }
      ],
      ctaText: 'Shop Now',
      ctaLink: '#products'
    },
    hero: {
      title: 'Discover Quality Products You\'ll Love',
      subtitle: 'Curated selection of premium items delivered with exceptional service.',
      ctaPrimary: 'Shop Now',
      ctaPrimaryLink: '#products',
      ctaSecondary: 'Browse Collection',
      ctaSecondaryLink: '#products',
      backgroundImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop'
    },
    features: [
      {
        title: 'Quality Products',
        description: 'Carefully selected items that meet our high standards for quality.',
        icon: '✨',
        image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=400&fit=crop'
      },
      {
        title: 'Fast Shipping',
        description: 'Quick and reliable delivery to get your products to you fast.',
        icon: '🚚',
        image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=600&h=400&fit=crop'
      },
      {
        title: 'Customer Service',
        description: 'Dedicated support team ready to help with any questions.',
        icon: '💬',
        image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&h=400&fit=crop'
      }
    ],
    footer: {
      businessName: 'Retail Store',
      description: 'Your trusted source for quality products.',
      businessEmail: 'info@retail.com',
      businessPhone: '+1 (555) 123-4567',
      quickLinks: [
        { label: 'About', href: '#about' },
        { label: 'Products', href: '#products' },
        { label: 'Contact', href: '#contact' }
      ]
    }
  },
  
  services: {
    theme: {
      primaryColor: 'teal-600',
      secondaryColor: 'slate-800',
      accentColor: 'teal-500',
      fontFamily: 'Inter, sans-serif'
    },
    nav: {
      logo: '🔧',
      businessName: 'Service Provider',
      links: [
        { label: 'Home', href: '#home' },
        { label: 'Services', href: '#services' },
        { label: 'About', href: '#about' },
        { label: 'Contact', href: '#contact' }
      ],
      ctaText: 'Get Quote',
      ctaLink: '#contact'
    },
    hero: {
      title: 'Professional Services You Can Trust',
      subtitle: 'Expert solutions delivered with reliability and excellence.',
      ctaPrimary: 'Get Quote',
      ctaPrimaryLink: '#contact',
      ctaSecondary: 'Our Services',
      ctaSecondaryLink: '#services',
      backgroundImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&h=600&fit=crop'
    },
    features: [
      {
        title: 'Expert Team',
        description: 'Experienced professionals committed to quality workmanship.',
        icon: '👷',
        image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=400&fit=crop'
      },
      {
        title: 'Reliable Service',
        description: 'Dependable service you can count on, every time.',
        icon: '⏰',
        image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&h=400&fit=crop'
      },
      {
        title: 'Quality Guarantee',
        description: 'We stand behind our work with a satisfaction guarantee.',
        icon: '✅',
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop'
      }
    ],
    footer: {
      businessName: 'Service Provider',
      description: 'Your trusted partner for professional services.',
      businessEmail: 'info@services.com',
      businessPhone: '+1 (555) 123-4567',
      quickLinks: [
        { label: 'About', href: '#about' },
        { label: 'Services', href: '#services' },
        { label: 'Contact', href: '#contact' }
      ]
    }
  },
  
  professional: {
    theme: {
      primaryColor: 'slate-800',
      secondaryColor: 'gray-100',
      accentColor: 'slate-700',
      fontFamily: 'Inter, sans-serif'
    },
    nav: {
      logo: '💼',
      businessName: 'Professional Services',
      links: [
        { label: 'Home', href: '#home' },
        { label: 'Services', href: '#services' },
        { label: 'About', href: '#about' },
        { label: 'Contact', href: '#contact' }
      ],
      ctaText: 'Schedule Consultation',
      ctaLink: '#contact'
    },
    hero: {
      title: 'Expert Professional Services',
      subtitle: 'Trusted advisors delivering strategic solutions for your success.',
      ctaPrimary: 'Schedule Consultation',
      ctaPrimaryLink: '#contact',
      ctaSecondary: 'Our Services',
      ctaSecondaryLink: '#services',
      backgroundImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=600&fit=crop'
    },
    features: [
      {
        title: 'Expertise',
        description: 'Deep industry knowledge and proven track record.',
        icon: '🎓',
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop'
      },
      {
        title: 'Strategic Approach',
        description: 'Data-driven solutions tailored to your unique needs.',
        icon: '📊',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop'
      },
      {
        title: 'Results Focused',
        description: 'Committed to delivering measurable outcomes.',
        icon: '🎯',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop'
      }
    ],
    footer: {
      businessName: 'Professional Services',
      description: 'Your trusted partner for professional excellence.',
      businessEmail: 'info@professional.com',
      businessPhone: '+1 (555) 123-4567',
      quickLinks: [
        { label: 'About', href: '#about' },
        { label: 'Services', href: '#services' },
        { label: 'Contact', href: '#contact' }
      ]
    }
  },
  
  education: {
    theme: {
      primaryColor: 'indigo-600',
      secondaryColor: 'white',
      accentColor: 'indigo-500',
      fontFamily: 'Inter, sans-serif'
    },
    nav: {
      logo: '📚',
      businessName: 'Education Center',
      links: [
        { label: 'Home', href: '#home' },
        { label: 'Programs', href: '#programs' },
        { label: 'About', href: '#about' },
        { label: 'Contact', href: '#contact' }
      ],
      ctaText: 'Enroll Now',
      ctaLink: '#programs'
    },
    hero: {
      title: 'Empower Your Future Through Education',
      subtitle: 'Comprehensive programs designed to help you achieve your learning goals.',
      ctaPrimary: 'Enroll Now',
      ctaPrimaryLink: '#programs',
      ctaSecondary: 'Learn More',
      ctaSecondaryLink: '#about',
      backgroundImage: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&h=600&fit=crop'
    },
    features: [
      {
        title: 'Expert Instructors',
        description: 'Learn from experienced educators passionate about teaching.',
        icon: '👨‍🏫',
        image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop'
      },
      {
        title: 'Flexible Learning',
        description: 'Programs designed to fit your schedule and learning style.',
        icon: '📅',
        image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=400&fit=crop'
      },
      {
        title: 'Proven Results',
        description: 'Track record of student success and achievement.',
        icon: '🏆',
        image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=400&fit=crop'
      }
    ],
    footer: {
      businessName: 'Education Center',
      description: 'Empowering learners to reach their full potential.',
      businessEmail: 'info@education.com',
      businessPhone: '+1 (555) 123-4567',
      quickLinks: [
        { label: 'About', href: '#about' },
        { label: 'Programs', href: '#programs' },
        { label: 'Contact', href: '#contact' }
      ]
    }
  },
  
  creative: {
    theme: {
      primaryColor: 'purple-600',
      secondaryColor: 'slate-900',
      accentColor: 'purple-500',
      fontFamily: 'Inter, sans-serif'
    },
    nav: {
      logo: '🎨',
      businessName: 'Creative Studio',
      links: [
        { label: 'Home', href: '#home' },
        { label: 'Portfolio', href: '#portfolio' },
        { label: 'Services', href: '#services' },
        { label: 'Contact', href: '#contact' }
      ],
      ctaText: 'View Portfolio',
      ctaLink: '#portfolio'
    },
    hero: {
      title: 'Bringing Your Vision to Life',
      subtitle: 'Creative solutions that tell your story and captivate your audience.',
      ctaPrimary: 'View Portfolio',
      ctaPrimaryLink: '#portfolio',
      ctaSecondary: 'Our Services',
      ctaSecondaryLink: '#services',
      backgroundImage: 'https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=1200&h=600&fit=crop'
    },
    features: [
      {
        title: 'Creative Excellence',
        description: 'Award-winning work that stands out from the crowd.',
        icon: '✨',
        image: 'https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=600&h=400&fit=crop'
      },
      {
        title: 'Collaborative Process',
        description: 'Working closely with you to bring your vision to reality.',
        icon: '🤝',
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop'
      },
      {
        title: 'Timely Delivery',
        description: 'Projects completed on time and within budget.',
        icon: '⏱️',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop'
      }
    ],
    footer: {
      businessName: 'Creative Studio',
      description: 'Where creativity meets excellence.',
      businessEmail: 'info@creative.com',
      businessPhone: '+1 (555) 123-4567',
      quickLinks: [
        { label: 'About', href: '#about' },
        { label: 'Portfolio', href: '#portfolio' },
        { label: 'Contact', href: '#contact' }
      ]
    }
  },
  
  hospitality: {
    theme: {
      primaryColor: 'amber-600',
      secondaryColor: 'slate-900',
      accentColor: 'amber-500',
      fontFamily: 'Inter, sans-serif'
    },
    nav: {
      logo: '🏨',
      businessName: 'Hospitality Venue',
      links: [
        { label: 'Home', href: '#home' },
        { label: 'Menu', href: '#menu' },
        { label: 'Reservations', href: '#reservations' },
        { label: 'Contact', href: '#contact' }
      ],
      ctaText: 'Book Now',
      ctaLink: '#reservations'
    },
    hero: {
      title: 'Experience Exceptional Hospitality',
      subtitle: 'Creating memorable experiences with exceptional service and attention to detail.',
      ctaPrimary: 'Book Now',
      ctaPrimaryLink: '#reservations',
      ctaSecondary: 'View Menu',
      ctaSecondaryLink: '#menu',
      backgroundImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&h=600&fit=crop'
    },
    features: [
      {
        title: 'Exceptional Service',
        description: 'Dedicated staff committed to making your experience unforgettable.',
        icon: '🌟',
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop'
      },
      {
        title: 'Quality Experience',
        description: 'Carefully crafted experiences that exceed expectations.',
        icon: '✨',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop'
      },
      {
        title: 'Memorable Moments',
        description: 'Creating lasting memories with every visit.',
        icon: '💫',
        image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=600&h=400&fit=crop'
      }
    ],
    footer: {
      businessName: 'Hospitality Venue',
      description: 'Where exceptional service meets unforgettable experiences.',
      businessEmail: 'info@hospitality.com',
      businessPhone: '+1 (555) 123-4567',
      quickLinks: [
        { label: 'About', href: '#about' },
        { label: 'Menu', href: '#menu' },
        { label: 'Contact', href: '#contact' }
      ]
    }
  },
  
  technology: {
    theme: {
      primaryColor: 'blue-600',
      secondaryColor: 'slate-900',
      accentColor: 'blue-500',
      fontFamily: 'Inter, sans-serif'
    },
    nav: {
      logo: '💻',
      businessName: 'Tech Company',
      links: [
        { label: 'Home', href: '#home' },
        { label: 'Products', href: '#products' },
        { label: 'About', href: '#about' },
        { label: 'Contact', href: '#contact' }
      ],
      ctaText: 'Get Started',
      ctaLink: '#products'
    },
    hero: {
      title: 'Innovative Technology Solutions',
      subtitle: 'Cutting-edge technology designed to transform your business.',
      ctaPrimary: 'Get Started',
      ctaPrimaryLink: '#products',
      ctaSecondary: 'Learn More',
      ctaSecondaryLink: '#about',
      backgroundImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=600&fit=crop'
    },
    features: [
      {
        title: 'Innovation',
        description: 'Leading-edge technology that drives business growth.',
        icon: '🚀',
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop'
      },
      {
        title: 'Reliability',
        description: 'Enterprise-grade solutions you can depend on.',
        icon: '🔒',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop'
      },
      {
        title: 'Support',
        description: 'Dedicated team ready to help you succeed.',
        icon: '💬',
        image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&h=400&fit=crop'
      }
    ],
    footer: {
      businessName: 'Tech Company',
      description: 'Empowering businesses with innovative technology.',
      businessEmail: 'info@tech.com',
      businessPhone: '+1 (555) 123-4567',
      quickLinks: [
        { label: 'About', href: '#about' },
        { label: 'Products', href: '#products' },
        { label: 'Contact', href: '#contact' }
      ]
    }
  },
  
  general: {
    theme: {
      primaryColor: 'slate-600',
      secondaryColor: 'white',
      accentColor: 'slate-500',
      fontFamily: 'Inter, sans-serif'
    },
    nav: {
      logo: '🏢',
      businessName: 'Business Name',
      links: [
        { label: 'Home', href: '#home' },
        { label: 'Services', href: '#services' },
        { label: 'About', href: '#about' },
        { label: 'Contact', href: '#contact' }
      ],
      ctaText: 'Get Started',
      ctaLink: '#contact'
    },
    hero: {
      title: 'Welcome to Our Business',
      subtitle: 'Delivering exceptional value and service to our customers.',
      ctaPrimary: 'Get Started',
      ctaPrimaryLink: '#contact',
      ctaSecondary: 'Learn More',
      ctaSecondaryLink: '#about',
      backgroundImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=600&fit=crop'
    },
    features: [
      {
        title: 'Quality Service',
        description: 'Committed to delivering excellence in everything we do.',
        icon: '⭐',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop'
      },
      {
        title: 'Customer Focus',
        description: 'Your satisfaction is our top priority.',
        icon: '👥',
        image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&h=400&fit=crop'
      },
      {
        title: 'Reliable Results',
        description: 'Consistent delivery of outstanding outcomes.',
        icon: '✅',
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop'
      }
    ],
    footer: {
      businessName: 'Business Name',
      description: 'Your trusted partner for quality service.',
      businessEmail: 'info@business.com',
      businessPhone: '+1 (555) 123-4567',
      quickLinks: [
        { label: 'About', href: '#about' },
        { label: 'Services', href: '#services' },
        { label: 'Contact', href: '#contact' }
      ]
    }
  }
}

// ============================================
// INDUSTRY CATEGORIES MAPPING
// ============================================

const industryCategories: Record<string, string[]> = {
  healthcare: [
    'fitness', 'gym', 'dentist', 'chiropractor', 'physiotherapy', 'medical', 'medical-clinic',
    'mental-health-therapy', 'nutritionist', 'optometry', 'pharmacy', 'dermatology',
    'cosmetic-surgery', 'hearing-aid-audiology', 'acupuncture', 'wellness-center',
    'spa-massage', 'yoga-studio', 'martial-arts-boxing', 'sports-club', 'spa'
  ],
  
  retail: [
    'bakery', 'restaurant', 'coffee-shop', 'jewelry-store', 'clothing-store', 'furniture-store',
    'toy-store', 'bookstore', 'pet-store', 'stationery-office-supplies', 'beauty-products',
    'luxury-goods', 'gadgets-electronics', 'home-appliances', 'sporting-goods',
    'music-instruments', 'automotive-accessories', 'vape-shop', 'ice-cream-dessert-shop',
    'wine-spirits', 'bar-lounge', 'wine-bar', 'brewery', 'food', 'food-beverage-delivery',
    'food-delivery', 'food-truck', 'catering-service'
  ],
  
  services: [
    'plumber', 'electrician', 'hvac', 'landscaping', 'cleaning-service', 'handyman',
    'home-renovation', 'pool-installation-maintenance', 'security-services',
    'security-alarm-installation', 'pest-control', 'roofing', 'appliance-repair',
    'car-wash-detailing', 'moving-storage', 'courier-delivery-services', 'shipping-freight',
    'logistics', 'construction', 'real-estate', 'architecture-firm', 'interior-design',
    'graphic-design-branding', 'it-services', 'tech-startup', 'smart-home-automation',
    'solar-energy', 'solar', 'drone-services'
  ],
  
  professional: [
    'legal', 'legal-firm', 'accounting', 'finance', 'insurance', 'business-consulting',
    'consulting', 'marketing', 'marketing-agency', 'recruiting', 'corporate-training'
  ],
  
  education: [
    'school-academy', 'university', 'university-college', 'tutoring', 'language-school',
    'online-course', 'vocational-training', 'kindergarten', 'daycare', 'education'
  ],
  
  creative: [
    'photographer', 'videographer', 'film-video-production', 'animation-motion-graphics',
    'graphic-design-branding', 'interior-design', 'architecture-firm', 'musician',
    'music-school', 'theater-performing-arts', 'dance-studio', 'podcast', 'influencer',
    'portfolio', 'photography-videography-gear'
  ],
  
  hospitality: [
    'hotel', 'resort', 'restaurant', 'bar-lounge', 'wine-bar', 'brewery', 'nightclub',
    'catering-service', 'event-venues', 'event-planning', 'wedding-services', 'cruise-yacht-services',
    'safari-tours', 'tour-operator', 'travel-agency', 'airbnb-host'
  ],
  
  technology: [
    'saas', 'technology-saas', 'it-services', 'tech-startup', 'telecom', 'gaming-esports',
    'smart-home-automation', '3d-printing-makerspace'
  ],
  
  general: [
    'ngo', 'charity', 'volunteer-organization', 'advocacy-groups', 'church', 'community-center',
    'cultural-heritage-organization', 'environmental-sustainability', 'social-services',
    'manufacturing', 'mining', 'ecommerce', 'subscription-boxes', 'beauty', 'beauty-salon',
    'barber-shop', 'nail-salon', 'tattoo-parlor', 'driving-school', 'golf-club', 'casino',
    'car-dealership', 'auto-repair', 'motorcycle-shop', 'coworking-space', 'printing-publishing',
    'art-craft-supplies'
  ]
}

// ============================================
// INDUSTRY REGISTRY (Minimal Config)
// ============================================

export const industryRegistry: Record<string, IndustryConfig> = {
  // Fully configured industries (have custom JSON files)
  fitness: {
    dataPath: 'fitness.json', // Custom data file
    category: 'healthcare',
    themeDefaults: {
      primary: 'red-600',
      secondary: 'black',
      accent: 'red-500'
    },
    recommendedLayout: ['Header', 'Hero', 'Features', 'Pricing', 'Testimonial', 'Footer']
  },
  
  gym: {
    dataPath: 'fitness.json', // Reuse fitness data
    category: 'healthcare',
    themeDefaults: {
      primary: 'red-600',
      secondary: 'black'
    },
    recommendedLayout: ['Header', 'Hero', 'Features', 'Pricing', 'Testimonial', 'Footer']
  },
  
  saas: {
    dataPath: 'saas.json', // Custom data file
    category: 'technology',
    themeDefaults: {
      primary: 'blue-600',
      secondary: 'slate-900',
      accent: 'blue-500'
    },
    recommendedLayout: ['Header', 'Hero', 'Features', 'Pricing', 'Testimonial', 'Footer']
  },
  
  'technology-saas': {
    dataPath: 'saas.json', // Reuse saas data
    category: 'technology',
    themeDefaults: {
      primary: 'blue-600',
      secondary: 'slate-900'
    },
    recommendedLayout: ['Header', 'Hero', 'Features', 'Pricing', 'Testimonial', 'Footer']
  },
  
  legal: {
    dataPath: 'legal.json', // Custom data file
    category: 'professional',
    themeDefaults: {
      primary: 'slate-800',
      secondary: 'gray-100',
      accent: 'slate-700'
    },
    recommendedLayout: ['Header', 'Hero', 'Features', 'Pricing', 'Testimonial', 'Footer']
  },
  
  'legal-firm': {
    dataPath: 'legal.json', // Reuse legal data
    category: 'professional',
    themeDefaults: {
      primary: 'slate-800',
      secondary: 'gray-100',
      accent: 'slate-700'
    },
    recommendedLayout: ['Header', 'Hero', 'Features', 'Pricing', 'Testimonial', 'Footer']
  }
  
  // All other industries are auto-discovered from industryCategories mapping
  // They use category templates and auto-discover components from folder structure
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Normalize industry name for lookup
 */
function normalizeIndustry(industry: string): string {
  return industry.toLowerCase().replace(/[^a-z0-9-]/g, '-')
}

/**
 * Get category for an industry
 */
function getIndustryCategory(industry: string): string {
  const normalized = normalizeIndustry(industry)
  
  // Check explicit registry entry first
  if (industryRegistry[normalized]?.category) {
    return industryRegistry[normalized].category
  }
  
  // Check industryCategories mapping
  for (const [category, industries] of Object.entries(industryCategories)) {
    if (industries.includes(normalized)) {
      return category
    }
  }
  
  // Fallback to general
  return 'general'
}

/**
 * Get industry config with fallback to default
 */
export function getIndustryConfig(industry: string | null): IndustryConfig {
  if (!industry) {
    return {
      category: 'general',
      themeDefaults: {
        primary: 'slate-600',
        secondary: 'white'
      },
      recommendedLayout: ['Header', 'Hero', 'Features', 'Pricing', 'Testimonial', 'Footer']
    }
  }
  
  const normalized = normalizeIndustry(industry)
  
  // Check explicit registry entry
  if (industryRegistry[normalized]) {
    return industryRegistry[normalized]
  }
  
  // Auto-discover from category
  const category = getIndustryCategory(normalized)
  const categoryTemplate = categoryTemplates[category] || categoryTemplates.general
  
  return {
    category,
    dataPath: null, // Use category template
    useAllGenericBlocks: true, // Allow all generic components
    themeDefaults: {
      primary: categoryTemplate.theme.primaryColor,
      secondary: categoryTemplate.theme.secondaryColor,
      accent: categoryTemplate.theme.accentColor
    },
    recommendedLayout: ['Header', 'Hero', 'Features', 'Pricing', 'Testimonial', 'Footer']
  }
}

/**
 * Get allowed blocks for an industry (backward compatible)
 */
export function getAllowedBlocks(industry: string | null): string[] {
  const config = getIndustryConfig(industry)
  
  // If useAllGenericBlocks is true, return all generic components
  if (config.useAllGenericBlocks) {
    return [
      'Header', 'Hero', 'Features', 'Pricing', 'Testimonial', 'Footer',
      'About', 'FAQ', 'Team', 'Stats', 'Gallery', 'Accordion', 'Tabs',
      'Process', 'ClientLogos', 'Newsletter', 'TrustBadges', 'ServiceCards',
      'Breadcrumbs', 'ComparisonTable', 'BlogCard', 'Map', 'Video',
      'TextSection', 'ImageSection', 'PortfolioGrid', 'Pagination', 'Search',
      'NotFound', 'ComingSoon', 'ContactForm', 'CTA'
    ]
  }
  
  // Return restricted list if specified
  return config.allowedGenericBlocks || ['Header', 'Hero', 'Features', 'Pricing', 'Testimonial', 'Footer']
}

/**
 * Get theme defaults for an industry
 */
export function getThemeDefaults(industry: string | null) {
  return getIndustryConfig(industry).themeDefaults
}

/**
 * Get siteData file path for an industry (backward compatible)
 */
export function getSiteDataPath(industry: string | null): string | null {
  const config = getIndustryConfig(industry)
  return config.dataPath || null
}

/**
 * Get siteData template for an industry
 * Returns category template or industry-specific data
 * Note: For images, use loadSiteData() which merges industry-specific images
 */
export function getSiteDataTemplate(industry: string | null): SiteDataTemplate {
  if (!industry) {
    return categoryTemplates.general
  }
  
  const config = getIndustryConfig(industry)
  const category = config.category || 'general'
  
  // If industry has custom dataPath, it should be loaded from JSON file
  // For now, return category template (JSON loading handled elsewhere)
  // Images will be merged by loadSiteData() function
  return categoryTemplates[category] || categoryTemplates.general
}

/**
 * Get category template
 */
export function getCategoryTemplate(category: string): SiteDataTemplate {
  return categoryTemplates[category] || categoryTemplates.general
}

/**
 * Get all industries in a category
 */
export function getIndustriesByCategory(category: string): string[] {
  return industryCategories[category] || []
}

/**
 * Get all available categories
 */
export function getAvailableCategories(): string[] {
  return Object.keys(categoryTemplates)
}

// ============================================
// AUTO-DISCOVERY FUNCTIONS
// ============================================

/**
 * All generic component names (for reference)
 */
export const ALL_GENERIC_COMPONENTS = [
  'Header', 'Hero', 'Features', 'Pricing', 'Testimonial', 'Footer',
  'About', 'FAQ', 'Team', 'Stats', 'Gallery', 'Accordion', 'Tabs',
  'Process', 'ClientLogos', 'Newsletter', 'TrustBadges', 'ServiceCards',
  'Breadcrumbs', 'ComparisonTable', 'BlogCard', 'Map', 'Video',
  'TextSection', 'ImageSection', 'PortfolioGrid', 'Pagination', 'Search',
  'NotFound', 'ComingSoon', 'ContactForm', 'CTA'
] as const

/**
 * Get industry-specific component names from generated index
 * Uses build-time generated component-index.ts for fast lookups
 */
export function getIndustryComponents(industry: string | null): string[] {
  if (!industry) return []
  
  const normalized = normalizeIndustry(industry)
  
  try {
    return getComponentsFromIndex(normalized)
  } catch (error) {
    // Fallback if index not generated yet
    console.warn('Component index not found, run: npm run generate:component-index')
    return []
  }
}

/**
 * Get all available components for an industry
 * Combines generic + industry-specific components
 */
export function getAllAvailableComponents(industry: string | null): {
  generic: string[]
  industry: string[]
} {
  const config = getIndustryConfig(industry)
  
  const generic = config.useAllGenericBlocks 
    ? [...ALL_GENERIC_COMPONENTS]
    : (config.allowedGenericBlocks || ['Header', 'Hero', 'Features', 'Pricing', 'Testimonial', 'Footer'])
  
  const industryComponents = getIndustryComponents(industry)
  
  return {
    generic,
    industry: industryComponents
  }
}

/**
 * Check if an industry has custom components
 */
export function hasIndustryComponents(industry: string | null): boolean {
  const components = getIndustryComponents(industry)
  return components.length > 0
}

/**
 * Get all industries that belong to a category
 */
export function getCategoryIndustries(category: string): string[] {
  return industryCategories[category] || []
}

/**
 * Get industry display name (formatted)
 */
export function getIndustryDisplayName(industry: string | null): string {
  if (!industry) return 'General Business'
  
  const normalized = normalizeIndustry(industry)
  
  // Convert kebab-case to Title Case
  return normalized
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Get category display name (formatted)
 */
export function getCategoryDisplayName(category: string): string {
  return category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
