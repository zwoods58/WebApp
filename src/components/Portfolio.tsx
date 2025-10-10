'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, CheckCircle, Star, Users, Clock, Shield, ExternalLink } from 'lucide-react'

const caseStudies = [
  {
    id: 1,
    title: 'E-commerce Platform',
    description: 'A full-featured e-commerce platform with advanced inventory management, payment processing, and customer analytics.',
    titleKey: 'E-commerce Platform',
    descriptionKey: 'A full-featured e-commerce platform with advanced inventory management, payment processing, and customer analytics.',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
    results: {
      revenue: '+150%',
      users: '+10K',
      performance: '99.9%'
    },
    liveUrl: '/admin',
    githubUrl: 'https://github.com/atarweb',
    slug: 'ecommerce-platform',
    demoUrl: 'https://rank-peace-61908873.figma.site/',
    // Enhanced details for popup
    detailedDescription: 'This e-commerce platform was our first major internal project, born from our team\'s curiosity about how online shopping actually works. We started with just a simple product catalog, but as we learned more about web development, we kept adding features - user accounts, shopping carts, payment processing. Each new challenge taught us something new, and we realized we were building something that could actually be useful. This project became the foundation for everything we learned about full-stack development.',
    features: [
      'Advanced inventory management with real-time stock tracking',
      'Secure payment processing with multiple gateway support',
      'Customer analytics dashboard with purchase insights',
      'Mobile-responsive design for all devices',
      'Admin panel for order and inventory management',
      'Email marketing integration and automated notifications'
    ],
    learningChallenges: [
      'Understanding complex payment processing workflows',
      'Learning how to handle high-traffic scenarios',
      'Mastering mobile-first responsive design principles',
      'Implementing security best practices for e-commerce'
    ],
    technicalSolutions: [
      'Built scalable microservices architecture',
      'Implemented Redis caching for performance',
      'Created responsive design with mobile-first approach',
      'Integrated multiple payment gateways with fraud protection'
    ],
    timeline: '12 weeks',
    team: '4 developers',
    projectType: 'Internal Learning Project',
    slideshow: [
      {
        id: 1,
        title: 'Homepage Dashboard',
        description: 'Modern e-commerce homepage with featured products and quick access to categories',
        image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        device: 'desktop',
        features: ['Product carousel', 'Category navigation', 'Search functionality', 'User account access']
      },
      {
        id: 2,
        title: 'Product Catalog',
        description: 'Comprehensive product listing with filtering, sorting, and detailed product views',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        device: 'desktop',
        features: ['Advanced filtering', 'Product comparison', 'Wishlist functionality', 'Quick view modal']
      },
      {
        id: 3,
        title: 'Shopping Cart',
        description: 'Streamlined checkout process with secure payment processing and order management',
        image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        device: 'desktop',
        features: ['Guest checkout', 'Multiple payment options', 'Order summary', 'Shipping calculator']
      },
      {
        id: 4,
        title: 'Admin Dashboard',
        description: 'Comprehensive admin panel for managing products, orders, and customer data',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        device: 'desktop',
        features: ['Order management', 'Inventory tracking', 'Customer analytics', 'Sales reports']
      }
    ]
  },
  {
    id: 2,
    title: 'SaaS Dashboard',
    description: 'A comprehensive SaaS analytics dashboard with real-time data visualization, user management, and business intelligence.',
    titleKey: 'SaaS Dashboard',
    descriptionKey: 'A comprehensive SaaS analytics dashboard with real-time data visualization, user management, and business intelligence.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2015&q=80',
    technologies: ['React', 'D3.js', 'Node.js', 'MongoDB'],
    results: {
      efficiency: '+200%',
      users: '+5K',
      performance: '98.5%'
    },
    liveUrl: '/admin',
    githubUrl: 'https://github.com/atarweb',
    slug: 'saas-dashboard',
    demoUrl: 'https://swim-dish-85536484.figma.site/',
    // Enhanced details for popup
    detailedDescription: 'After building the e-commerce platform, we became fascinated with data visualization and analytics. We wanted to understand how businesses track their performance and make data-driven decisions. This dashboard project started as a simple chart library experiment but evolved into a comprehensive analytics platform. It taught us everything about real-time data processing, complex visualizations, and how to make data accessible to non-technical users.',
    features: [
      'Real-time data visualization with 20+ chart types',
      'Interactive dashboards with drag-and-drop customization',
      'Advanced filtering and data segmentation',
      'Automated report generation and scheduling',
      'User role management and permissions',
      'API integration with 50+ popular services'
    ],
    learningChallenges: [
      'Mastering complex data visualization libraries',
      'Understanding real-time data processing workflows',
      'Learning how to make complex data user-friendly',
      'Implementing responsive design for data-heavy interfaces'
    ],
    technicalSolutions: [
      'Built with React and D3.js for advanced visualizations',
      'Implemented WebSocket connections for real-time updates',
      'Created intuitive drag-and-drop dashboard builder',
      'Developed comprehensive API integration system'
    ],
    timeline: '10 weeks',
    team: '4 developers',
    projectType: 'Internal Learning Project',
    slideshow: [
      {
        id: 1,
        title: 'Dashboard Overview',
        description: 'Comprehensive dashboard with real-time analytics and business intelligence',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        device: 'desktop',
        features: ['Real-time metrics', 'Interactive charts', 'Custom widgets', 'Data filtering']
      },
      {
        id: 2,
        title: 'Analytics Charts',
        description: 'Advanced data visualization with multiple chart types and interactive features',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        device: 'desktop',
        features: ['Line charts', 'Bar graphs', 'Pie charts', 'Heat maps']
      },
      {
        id: 3,
        title: 'User Management',
        description: 'Comprehensive user management system with role-based access control',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        device: 'desktop',
        features: ['User roles', 'Permissions', 'Activity logs', 'Team management']
      }
    ]
  },
  {
    id: 3,
    title: 'Project Management Tool',
    description: 'A collaborative project management platform with team communication, task tracking, and deadline management.',
    titleKey: 'Project Management Tool',
    descriptionKey: 'A collaborative project management platform with team communication, task tracking, and deadline management.',
    image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    technologies: ['Vue.js', 'Express.js', 'PostgreSQL', 'Socket.io'],
    results: {
      productivity: '+180%',
      teams: '+500',
      performance: '99.2%'
    },
    liveUrl: '/admin',
    githubUrl: 'https://github.com/atarweb',
    demoUrl: 'https://karate-cot-85414706.figma.site/',
    // Enhanced details for popup
    detailedDescription: 'This project management tool was developed to streamline team collaboration and task organization. We focused on creating an intuitive interface that allows teams to track progress, manage deadlines, and communicate effectively. The challenge was integrating real-time updates and ensuring data consistency across multiple users, which led us to explore WebSocket technologies and robust backend solutions.',
    features: [
      'Task creation and assignment with due dates',
      'Real-time team communication and file sharing',
      'Gantt charts and Kanban boards for project visualization',
      'User roles and permissions management',
      'Automated notifications for task updates and deadlines',
      'Integration with calendar and email services'
    ],
    learningChallenges: [
      'Implementing real-time data synchronization',
      'Designing flexible task management workflows',
      'Ensuring data integrity in a collaborative environment',
      'Optimizing performance for complex project views'
    ],
    technicalSolutions: [
      'Utilized Vue.js for a dynamic front-end',
      'Integrated Socket.io for real-time communication',
      'Developed a RESTful API with Express.js',
      'Used PostgreSQL for structured data storage'
    ],
    timeline: '14 weeks',
    team: '4 developers',
    projectType: 'Internal Learning Project',
    slideshow: [
      {
        id: 1,
        title: 'Project Dashboard',
        description: 'Centralized view of all projects, tasks, and team activities',
        image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        device: 'desktop',
        features: ['Project summaries', 'Task lists', 'Activity feed', 'Quick access to features']
      },
      {
        id: 2,
        title: 'Task Management',
        description: 'Detailed task views with subtasks, comments, and file attachments',
        image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        device: 'desktop',
        features: ['Subtasks', 'Comments', 'File attachments', 'Due dates']
      },
      {
        id: 3,
        title: 'Team Collaboration',
        description: 'Real-time chat and discussion forums for team communication',
        image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        device: 'desktop',
        features: ['Group chat', 'Direct messages', 'Discussion threads', 'Notifications']
      }
    ]
  },
  {
    id: 4,
    title: 'Real Estate Platform',
    description: 'A comprehensive real estate platform with property listings, virtual tours, and mortgage calculators.',
    titleKey: 'Real Estate Platform',
    descriptionKey: 'A comprehensive real estate platform with property listings, virtual tours, and mortgage calculators.',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2273&q=80',
    technologies: ['Angular', 'NestJS', 'MySQL', 'Google Maps API'],
    results: {
      listings: '+5K',
      users: '+15K',
      performance: '97.8%'
    },
    liveUrl: '/admin',
    githubUrl: 'https://github.com/atarweb',
    demoUrl: 'https://image-pound-61448892.figma.site/',
    // Enhanced details for popup
    detailedDescription: 'Our real estate platform was designed to simplify property search and management. We integrated advanced mapping features and robust search filters to provide users with a seamless experience. A key learning was optimizing image loading and virtual tour performance to ensure a smooth user experience, even with high-resolution media.',
    features: [
      'Advanced property search and filtering options',
      'Interactive maps with property listings',
      'Virtual tour integration for immersive viewing',
      'Mortgage calculator and financial tools',
      'Agent and client dashboards for management',
      'Email alerts for new listings and price changes'
    ],
    learningChallenges: [
      'Integrating complex mapping APIs and optimizing performance',
      'Handling large volumes of property data and images',
      'Ensuring data security for sensitive user information',
      'Developing a scalable architecture for future growth'
    ],
    technicalSolutions: [
      'Built with Angular for a dynamic front-end',
      'Developed a robust backend with NestJS',
      'Utilized MySQL for relational data storage',
      'Integrated Google Maps API for interactive property maps'
    ],
    timeline: '18 weeks',
    team: '5 developers',
    projectType: 'Internal Learning Project',
    slideshow: [
      {
        id: 1,
        title: 'Property Search',
        description: 'Intuitive search interface with advanced filters and map integration',
        image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        device: 'desktop',
        features: ['Map view', 'List view', 'Filter options', 'Saved searches']
      },
      {
        id: 2,
        title: 'Property Details',
        description: 'Comprehensive property details with high-resolution images and virtual tours',
        image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        device: 'desktop',
        features: ['Image gallery', 'Virtual tour', 'Property description', 'Agent contact']
      },
      {
        id: 3,
        title: 'Agent Dashboard',
        description: 'Dashboard for agents to manage listings, leads, and appointments',
        image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        device: 'desktop',
        features: ['Listing management', 'Lead tracking', 'Appointment scheduling', 'Performance reports']
      }
    ]
  },
  {
    id: 5,
    title: 'Restaurant Management System',
    description: 'A comprehensive restaurant management platform with online ordering, table reservations, and kitchen operations.',
    titleKey: 'Restaurant Management System',
    descriptionKey: 'A comprehensive restaurant management platform with online ordering, table reservations, and kitchen operations.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
    technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    results: {
      orders: '+10K',
      customers: '+5K',
      efficiency: '+150%'
    },
    liveUrl: '/admin',
    githubUrl: 'https://github.com/atarweb',
    demoUrl: 'https://rabbit-shown-24552124.figma.site/',
    // Enhanced details for popup
    detailedDescription: 'This restaurant management system was designed to streamline operations for modern restaurants. We focused on creating an intuitive interface for both staff and customers, with features like online ordering, table management, and kitchen operations. The challenge was integrating real-time updates across different parts of the restaurant while maintaining order accuracy and customer satisfaction.',
    features: [
      'Online ordering system with real-time menu updates',
      'Table reservation and management system',
      'Kitchen display system for order tracking',
      'Customer loyalty program and rewards',
      'Inventory management and supplier integration',
      'Analytics dashboard for sales and performance tracking'
    ],
    learningChallenges: [
      'Implementing real-time order updates across multiple devices',
      'Designing intuitive interfaces for different user types',
      'Managing complex inventory and menu relationships',
      'Ensuring data accuracy in high-volume environments'
    ],
    technicalSolutions: [
      'Built with React for dynamic user interfaces',
      'Implemented WebSocket connections for real-time updates',
      'Used MongoDB for flexible menu and order data storage',
      'Integrated Stripe for secure payment processing'
    ],
    timeline: '16 weeks',
    team: '5 developers',
    projectType: 'Internal Learning Project',
    slideshow: [
      {
        id: 1,
        title: 'Customer Ordering',
        description: 'User-friendly online ordering interface with menu browsing and customization',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        device: 'desktop',
        features: ['Menu browsing', 'Item customization', 'Cart management', 'Checkout process']
      },
      {
        id: 2,
        title: 'Kitchen Operations',
        description: 'Kitchen display system for order management and preparation tracking',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        device: 'desktop',
        features: ['Order queue', 'Preparation timers', 'Status updates', 'Kitchen analytics']
      },
      {
        id: 3,
        title: 'Table Management',
        description: 'Reservation and table management system for front-of-house operations',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        device: 'desktop',
        features: ['Table layout', 'Reservation system', 'Waitlist management', 'Staff assignments']
      }
    ]
  }
]

export default function Portfolio() {

  return (
    <section className="section-padding">
      <div className="container-max">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl font-bold text-white mb-4 font-tech" data-translate="Our Portfolio">
            Our Portfolio
          </h2>
          {/* Force deployment */}
          <p className="text-xl text-gray-400 max-w-3xl mx-auto" data-translate="Explore our collection of innovative projects that showcase our expertise in modern web development and digital solutions.">
            Explore our collection of innovative projects that showcase our expertise in modern web development and digital solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {caseStudies.map((project, index) => (
            <div 
              key={project.id} 
              className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6 group hover:shadow-xl transition-all duration-300 overflow-hidden animate-fade-in-scale"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="relative overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  width={400}
                  height={250}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  unoptimized
                />
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-white mb-2 font-tech" data-translate={project.title}>
                    {project.title}
                  </h3>
                  <p className="text-white text-sm leading-relaxed" data-translate={project.description}>
                    {project.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-xs font-medium tech-stack"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-center mb-4">
                  <div className="flex space-x-4 text-sm text-white">
                    {Object.entries(project.results).map(([key, value], index) => (
                      <div key={index} className="text-center">
                        <div className="font-semibold text-primary-600">{value}</div>
                        <div className="text-xs capitalize">{key}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="px-6 pb-6">
                <Link 
                  href={project.demoUrl || '#'}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg text-center inline-flex items-center justify-center transition-colors duration-200"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Live Demo
                </Link>
              </div>
            </div>
          ))}
        </div>


      </div>
    </section>
  )
}