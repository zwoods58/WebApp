'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink, ArrowRight, CheckCircle, Star, Users, Clock, Shield, Smartphone } from 'lucide-react'

const caseStudies = [
  {
    id: 1,
    title: 'E-commerce Platform',
    description: 'A full-featured e-commerce platform with advanced inventory management, payment processing, and customer analytics.',
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
    demoUrl: '/demo/ecommerce',
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
      },
      {
        id: 5,
        title: 'Mobile App',
        description: 'Mobile-optimized shopping experience with touch-friendly interface',
        image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        device: 'mobile',
        features: ['Touch navigation', 'Mobile payments', 'Push notifications', 'Offline browsing']
      }
    ]
  },
  {
    id: 2,
    title: 'SaaS Dashboard',
    description: 'A comprehensive SaaS analytics dashboard with real-time data visualization, user management, and business intelligence.',
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
    demoUrl: '/demo/saas-dashboard',
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
      },
      {
        id: 4,
        title: 'Mobile Dashboard',
        description: 'Mobile-optimized dashboard for on-the-go analytics and monitoring',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        device: 'mobile',
        features: ['Touch-friendly charts', 'Swipe navigation', 'Push notifications', 'Offline mode']
      }
    ]
  },
  {
    id: 3,
    title: 'Project Management Tool',
    description: 'A collaborative project management platform with team communication, task tracking, and deadline management.',
    image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    technologies: ['Vue.js', 'Express.js', 'PostgreSQL', 'Socket.io'],
    results: {
      productivity: '+180%',
      teams: '+500',
      performance: '99.2%'
    },
    liveUrl: '/admin',
    githubUrl: 'https://github.com/atarweb',
    demoUrl: '/demo/project-management',
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
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2273&q=80',
    technologies: ['Angular', 'NestJS', 'MySQL', 'Google Maps API'],
    results: {
      listings: '+5K',
      users: '+15K',
      performance: '97.8%'
    },
    liveUrl: '/admin',
    githubUrl: 'https://github.com/atarweb',
    demoUrl: '/demo/real-estate',
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
    title: 'Healthcare Management System',
    description: 'A HIPAA-compliant healthcare management system with patient records, appointment scheduling, and billing.',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    technologies: ['React', 'Django', 'PostgreSQL', 'Redis'],
    results: {
      compliance: '100%',
      patients: '+50K',
      performance: '99.5%'
    },
    liveUrl: '/admin',
    githubUrl: 'https://github.com/atarweb',
    demoUrl: '/demo/healthcare',
    // Enhanced details for popup
    detailedDescription: 'Developing a HIPAA-compliant healthcare management system was a significant undertaking. Our focus was on data security, privacy, and creating a user-friendly interface for medical professionals. We learned extensively about regulatory requirements and implemented robust encryption and access control measures to protect sensitive patient information. This project honed our skills in building secure and reliable systems for critical applications.',
    features: [
      'Secure patient record management with access control',
      'Appointment scheduling and calendar integration',
      'Medical billing and insurance claim processing',
      'Telemedicine integration for virtual consultations',
      'Prescription management and e-prescribing',
      'Reporting and analytics for clinic performance'
    ],
    learningChallenges: [
      'Understanding and implementing HIPAA compliance requirements',
      'Ensuring data privacy and security for sensitive health information',
      'Integrating with various medical devices and systems',
      'Designing a user-friendly interface for complex medical workflows'
    ],
    technicalSolutions: [
      'Built with React for a dynamic front-end',
      'Developed a secure backend with Django REST Framework',
      'Utilized PostgreSQL for robust data storage',
      'Implemented advanced encryption and access control protocols'
    ],
    timeline: '20 weeks',
    team: '6 developers',
    projectType: 'Internal Learning Project',
    slideshow: [
      {
        id: 1,
        title: 'Patient Dashboard',
        description: 'Comprehensive patient overview with medical history, appointments, and billing',
        image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        device: 'desktop',
        features: ['Patient demographics', 'Medical history', 'Appointment schedule', 'Billing summary']
      },
      {
        id: 2,
        title: 'Appointment Scheduling',
        description: 'Intuitive calendar for scheduling and managing patient appointments',
        image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        device: 'desktop',
        features: ['Calendar view', 'Appointment booking', 'Reminders', 'Telemedicine links']
      },
      {
        id: 3,
        title: 'Medical Billing',
        description: 'Streamlined billing and insurance claim processing',
        image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        device: 'desktop',
        features: ['Invoice generation', 'Insurance claims', 'Payment tracking', 'Reporting']
      }
    ]
  },
  {
    id: 6,
    title: 'Big Easy Chicken Co.',
    description: 'A vibrant New Orleans-style restaurant website with online ordering, menu management, and authentic southern charm.',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    technologies: ['Next.js', 'React', 'Tailwind CSS', 'TypeScript'],
    results: {
      orders: '+2.5K',
      customers: '+1.2K',
      satisfaction: '98.7%'
    },
    liveUrl: '/admin',
    githubUrl: 'https://github.com/atarweb',
    demoUrl: '/demo/restaurant',
    // Enhanced details for popup
    detailedDescription: 'Big Easy Chicken Co. was a passion project to explore dynamic and visually rich web design for the food industry. We aimed to capture the vibrant spirit of New Orleans with a unique aesthetic and seamless online ordering. This project taught us about integrating complex ordering systems, managing real-time menu updates, and creating an engaging user experience that reflects a strong brand identity.',
    features: [
      'Online ordering system with customizable menu items',
      'Secure payment gateway integration',
      'User accounts for order history and preferences',
      'Restaurant hours and real-time status updates',
      'Delivery and pickup options with estimated times',
      'Promotional banners and special offers management'
    ],
    learningChallenges: [
      'Designing a highly interactive and visually engaging UI',
      'Implementing a robust and flexible online ordering system',
      'Integrating third-party payment and delivery services',
      'Optimizing performance for image-heavy pages'
    ],
    technicalSolutions: [
      'Built with Next.js for server-side rendering and performance',
      'Utilized React for dynamic UI components',
      'Styled with Tailwind CSS for rapid and consistent design',
      'Implemented TypeScript for enhanced code quality and maintainability'
    ],
    timeline: '8 weeks',
    team: '3 developers',
    projectType: 'Internal Learning Project',
    slideshow: [
      {
        id: 1,
        title: 'Homepage',
        description: 'Vibrant and engaging homepage with clear calls to action and featured dishes',
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        device: 'desktop',
        features: ['Hero section', 'Featured menu items', 'Online ordering CTA', 'Customer testimonials']
      },
      {
        id: 2,
        title: 'Menu Page',
        description: 'Interactive menu with categories, descriptions, and pricing',
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        device: 'desktop',
        features: ['Categorized menu', 'Item details', 'Customization options', 'Add to cart']
      },
      {
        id: 3,
        title: 'Checkout Process',
        description: 'Streamlined and secure checkout flow with delivery/pickup options',
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        device: 'desktop',
        features: ['Order summary', 'Delivery/pickup selection', 'Payment options', 'Order confirmation']
      }
    ]
  }
]

export default function Portfolio() {

  return (
    <section className="section-padding bg-secondary-50">
      <div className="container-max">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-secondary-900 mb-4">
            Our Portfolio
          </h2>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
            Explore our collection of innovative projects that showcase our expertise in modern web development and digital solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {caseStudies.map((project) => (
            <div 
              key={project.id} 
              className="card group hover:shadow-xl transition-all duration-300 overflow-hidden"
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

              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                    {project.title}
                  </h3>
                  <p className="text-secondary-600 text-sm leading-relaxed">
                    {project.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-xs font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-4">
                  <div className="flex space-x-4 text-sm text-secondary-600">
                    {Object.entries(project.results).map(([key, value], index) => (
                      <div key={index} className="text-center">
                        <div className="font-semibold text-primary-600">{value}</div>
                        <div className="text-xs capitalize">{key}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  {project.demoUrl && (
                    <Link 
                      href={project.demoUrl}
                      className="btn-primary w-full text-center inline-flex items-center justify-center"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Live Demo
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>


      </div>
    </section>
  )
}