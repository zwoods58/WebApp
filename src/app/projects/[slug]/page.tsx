'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { ArrowLeft, ExternalLink, Github, Code, Calendar, Users, Target, CheckCircle, Activity, TrendingUp, Shield } from 'lucide-react'
import Link from 'next/link'

// Project data - in a real app, this would come from a CMS or database
const projects = {
  'ecommerce-platform': {
    id: 1,
    title: 'E-commerce Platform',
    description: 'A comprehensive e-commerce solution with advanced inventory management, payment processing, and customer analytics.',
    shortDescription: 'Complete e-commerce solution with advanced features',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Stripe', 'Supabase', 'Redis', 'AWS S3', 'Vercel'],
    results: {
      efficiency: '+200%',
      users: '+5K',
      performance: '98.5%'
    },
    liveUrl: '/demo/ecommerce',
    githubUrl: 'https://github.com/atarweb',
    category: 'E-commerce',
    industry: 'Fashion & Retail',
    projectType: 'E-commerce Platform',
    budget: '$45,000',
    teamSize: '5 developers',
    duration: '16 weeks',
    launchDate: '2024-01-15',
    hobbyDescription: "This e-commerce platform was our first major internal project, born from our team's curiosity about how online shopping actually works. We started with just a simple product catalog, but as we learned more about web development, we kept adding features - user accounts, shopping carts, payment processing. Each new challenge taught us something new, and we realized we were building something that could actually be useful. This project became the foundation for everything we learned about full-stack development.",
    projectGoals: "Our goal was to create a comprehensive e-commerce platform that could handle real-world scenarios while showcasing modern web development techniques. We wanted to build something that demonstrated our capabilities in full-stack development, payment processing, and user experience design.",
    technicalApproach: "We developed a modern, scalable e-commerce platform using Next.js and TypeScript, integrated with Stripe for secure payments and Supabase for real-time data management. The platform includes advanced inventory management, AI-powered product recommendations, and a mobile-first responsive design.",
    keyFeatures: [
      "Advanced product catalog with 10,000+ SKUs",
      "Real-time inventory management with low-stock alerts",
      "AI-powered product recommendations",
      "Multi-currency and multi-language support",
      "Advanced search with filters and sorting",
      "Guest checkout and account creation",
      "Order tracking and shipping notifications",
      "Admin dashboard with analytics",
      "Mobile-responsive design",
      "SEO optimization and meta management"
    ],
    technicalSpecs: {
      frontend: "Next.js 14, TypeScript, Tailwind CSS, React Query",
      backend: "Node.js, Express, Prisma ORM",
      database: "PostgreSQL with Redis caching",
      payment: "Stripe with webhook handling",
      storage: "AWS S3 for product images",
      hosting: "Vercel with CDN",
      monitoring: "Sentry error tracking, Google Analytics",
      security: "JWT authentication, HTTPS, PCI compliance"
    },
    developmentProcess: [
      {
        phase: "Discovery & Planning",
        duration: "2 weeks",
        description: "Requirements gathering, user research, technical architecture planning"
      },
      {
        phase: "Design & Prototyping",
        duration: "3 weeks",
        description: "UI/UX design, user flow mapping, interactive prototypes"
      },
      {
        phase: "Development Sprint 1",
        duration: "4 weeks",
        description: "Core platform development, user authentication, product catalog"
      },
      {
        phase: "Development Sprint 2",
        duration: "4 weeks",
        description: "Payment integration, cart functionality, order management"
      },
      {
        phase: "Development Sprint 3",
        duration: "3 weeks",
        description: "Admin dashboard, analytics, testing, optimization"
      }
    ],
    metrics: {
      performance: {
        "Page Load Speed": "1.2s average",
        "Mobile Performance": "95/100 Lighthouse score",
        "Uptime": "99.9%",
        "Core Web Vitals": "All green"
      },
      business: {
        "Conversion Rate": "+200% increase",
        "Cart Abandonment": "-35% reduction",
        "Mobile Sales": "+40% increase",
        "Customer Satisfaction": "4.8/5 stars"
      },
      technical: {
        "API Response Time": "<200ms average",
        "Database Queries": "Optimized with Redis caching",
        "Image Optimization": "WebP format with lazy loading",
        "Security Score": "A+ rating"
      }
    }
  },
  'saas-dashboard': {
    id: 2,
    title: 'SaaS Dashboard',
    description: 'A comprehensive SaaS analytics dashboard with real-time data visualization, user management, and business intelligence.',
    shortDescription: 'Advanced analytics dashboard for SaaS businesses',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2015&q=80',
    technologies: ['React', 'D3.js', 'Node.js', 'MongoDB', 'Redis', 'Docker'],
    results: {
      insights: '+300%',
      users: '+2K',
      performance: '99.1%'
    },
    liveUrl: '/demo/saas-dashboard',
    githubUrl: 'https://github.com/atarweb',
    category: 'SaaS',
    industry: 'Technology',
    projectType: 'Analytics Dashboard',
    budget: '$35,000',
    teamSize: '4 developers',
    duration: '12 weeks',
    launchDate: '2024-02-20',
    hobbyDescription: "After building the e-commerce platform, we became fascinated with data visualization and analytics. We wanted to understand how businesses track their performance and make data-driven decisions. This dashboard project started as a simple chart library experiment but evolved into a comprehensive analytics platform. It taught us everything about real-time data processing, complex visualizations, and how to make data accessible to non-technical users.",
    projectGoals: "Our goal was to create a powerful analytics dashboard that could handle complex data visualization while remaining intuitive for business users. We wanted to demonstrate our capabilities in data processing, real-time updates, and creating engaging user interfaces for complex information.",
    technicalApproach: "We built a modern analytics platform using React with D3.js for advanced data visualization, Node.js for real-time data processing, and MongoDB for flexible data storage. The platform includes real-time updates, interactive charts, and comprehensive business intelligence features.",
    keyFeatures: [
      "Real-time data visualization with 20+ chart types",
      "Interactive dashboards with drag-and-drop customization",
      "Advanced filtering and data segmentation",
      "Automated report generation and scheduling",
      "User role management and permissions",
      "API integration with 50+ popular services",
      "Mobile-responsive design for all devices",
      "Export capabilities (PDF, Excel, CSV)",
      "Custom alert system with notifications",
      "White-label customization options"
    ],
    technicalSpecs: {
      frontend: "React 18, TypeScript, D3.js, Tailwind CSS",
      backend: "Node.js, Express, Socket.io",
      database: "MongoDB with Redis caching",
      visualization: "D3.js, Chart.js, Recharts",
      realtime: "WebSocket connections for live updates",
      hosting: "AWS with auto-scaling",
      monitoring: "Custom analytics, error tracking",
      security: "OAuth 2.0, JWT tokens, data encryption"
    },
    developmentProcess: [
      {
        phase: "Research & Planning",
        duration: "2 weeks",
        description: "Data visualization research, user experience planning, technical architecture"
      },
      {
        phase: "Core Development",
        duration: "4 weeks",
        description: "Dashboard framework, basic charts, data integration"
      },
      {
        phase: "Advanced Features",
        duration: "4 weeks",
        description: "Real-time updates, advanced visualizations, user management"
      },
      {
        phase: "Testing & Optimization",
        duration: "2 weeks",
        description: "Performance optimization, user testing, bug fixes"
      }
    ],
    metrics: {
      performance: {
        "Dashboard Load Time": "0.8s average",
        "Real-time Updates": "100ms latency",
        "Chart Rendering": "60fps smooth animations",
        "Data Processing": "10,000+ records/second"
      },
      business: {
        "User Engagement": "+300% increase",
        "Report Generation": "95% faster",
        "Data Accuracy": "99.9% precision",
        "User Satisfaction": "4.9/5 stars"
      },
      technical: {
        "API Response Time": "<100ms average",
        "Memory Usage": "Optimized for large datasets",
        "Browser Compatibility": "99% support",
        "Security Score": "A+ rating"
      }
    }
  },
  'mobile-banking': {
    id: 3,
    title: 'Mobile Banking App',
    description: 'A secure mobile banking application with biometric authentication, real-time transactions, and comprehensive financial management.',
    shortDescription: 'Secure mobile banking with advanced features',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2126&q=80',
    technologies: ['React Native', 'Node.js', 'PostgreSQL', 'Redis', 'AWS', 'Biometric Auth'],
    results: {
      security: '100%',
      users: '+25K',
      performance: '99.8%'
    },
    liveUrl: '/demo/mobile-banking',
    githubUrl: 'https://github.com/atarweb',
    category: 'FinTech',
    industry: 'Banking & Finance',
    projectType: 'Mobile Application',
    budget: '$60,000',
    teamSize: '6 developers',
    duration: '20 weeks',
    launchDate: '2024-03-10',
    hobbyDescription: "The mobile banking app was our most ambitious project yet. After mastering web development with the previous projects, we wanted to tackle mobile development and learn about financial technology. This project taught us about security, compliance, and the unique challenges of handling sensitive financial data. We learned about biometric authentication, encryption, and how to build trust in a digital financial product.",
    projectGoals: "Our goal was to create a secure, user-friendly mobile banking application that could handle real financial transactions while maintaining the highest security standards. We wanted to demonstrate our capabilities in mobile development, security implementation, and creating intuitive user experiences for complex financial operations.",
    technicalApproach: "We developed a cross-platform mobile banking app using React Native, with a secure Node.js backend and PostgreSQL database. The app includes biometric authentication, end-to-end encryption, real-time transaction processing, and comprehensive security measures to protect user financial data.",
    keyFeatures: [
      "Biometric authentication (fingerprint, face ID)",
      "Real-time transaction processing and notifications",
      "Multi-account management (checking, savings, credit)",
      "Bill payment and money transfer capabilities",
      "Investment tracking and portfolio management",
      "Budgeting tools and spending analytics",
      "Secure messaging with bank support",
      "Card management and transaction controls",
      "Offline mode for basic account viewing",
      "Advanced security features and fraud detection"
    ],
    technicalSpecs: {
      mobile: "React Native, TypeScript, Expo",
      backend: "Node.js, Express, JWT authentication",
      database: "PostgreSQL with encryption at rest",
      security: "End-to-end encryption, biometric auth",
      realtime: "WebSocket for live updates",
      hosting: "AWS with multi-region deployment",
      monitoring: "Custom security monitoring, audit logs",
      compliance: "PCI DSS, GDPR, banking regulations"
    },
    developmentProcess: [
      {
        phase: "Security Research",
        duration: "3 weeks",
        description: "Financial security research, compliance requirements, encryption standards"
      },
      {
        phase: "Core Development",
        duration: "6 weeks",
        description: "Authentication system, basic banking features, security implementation"
      },
      {
        phase: "Advanced Features",
        duration: "6 weeks",
        description: "Real-time transactions, investment features, advanced security"
      },
      {
        phase: "Testing & Compliance",
        duration: "5 weeks",
        description: "Security testing, compliance verification, user acceptance testing"
      }
    ],
    metrics: {
      performance: {
        "App Launch Time": "1.5s average",
        "Transaction Processing": "Real-time (<1s)",
        "Biometric Auth": "0.3s average",
        "Offline Sync": "Seamless background updates"
      },
      business: {
        "User Adoption": "+25,000 active users",
        "Transaction Volume": "$50M+ processed",
        "Security Incidents": "Zero breaches",
        "User Satisfaction": "4.9/5 stars"
      },
      technical: {
        "API Response Time": "<200ms average",
        "Data Encryption": "AES-256 encryption",
        "Uptime": "99.9% availability",
        "Security Score": "A+ rating"
      }
    }
  }
}

export default function ProjectPage() {
  const params = useParams()
  const [project, setProject] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (params?.slug) {
      const projectData = projects[params.slug as keyof typeof projects]
      setProject(projectData)
      setIsLoading(false)
    }
  }, [params?.slug])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Project Not Found</h1>
          <p className="text-gray-600 mb-8">The project you're looking for doesn't exist.</p>
          <Link href="/portfolio" className="btn-primary">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Portfolio
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 text-gray-800">
      <div className="relative">
        {/* Back to Portfolio Button */}
        <Link
          href="/portfolio"
          className="absolute top-6 left-6 z-10 flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors font-medium"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Portfolio</span>
        </Link>

        {/* Hero Section */}
        <div className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
                {project.category}
              </div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">{project.title}</h1>
              <p className="text-xl text-gray-600 mb-8">{project.description}</p>
              
              {/* Project Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
                {Object.entries(project.results).map(([key, value]) => (
                  <div key={key} className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="text-3xl font-bold text-blue-600 mb-2">{String(value)}</div>
                    <div className="text-sm text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Hobby Project Description */}
        {project.hobbyDescription && (
          <div className="max-w-4xl mx-auto mb-16">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <Code className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-4">About This Internal Project</h3>
                  <p className="text-lg leading-relaxed text-blue-100">
                    {project.hobbyDescription}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Project Overview & Goals */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Project Goals</h3>
              <p className="text-gray-600 leading-relaxed mb-6">{project.projectGoals}</p>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">Technical Approach</h3>
              <p className="text-gray-600 leading-relaxed">{project.technicalApproach}</p>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Project Details</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="text-sm text-gray-500">Duration</div>
                      <div className="font-medium">{project.duration}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-purple-600" />
                    <div>
                      <div className="text-sm text-gray-500">Team Size</div>
                      <div className="font-medium">{project.teamSize}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Target className="h-5 w-5 text-orange-600" />
                    <div>
                      <div className="text-sm text-gray-500">Industry</div>
                      <div className="font-medium">{project.industry}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Code className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="text-sm text-gray-500">Project Type</div>
                      <div className="font-medium">{project.projectType}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Features */}
        {project.keyFeatures && (
          <div className="max-w-4xl mx-auto mb-16">
            <h3 className="text-3xl font-bold text-gray-900 text-center mb-8">Key Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.keyFeatures.map((feature: string, index: number) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-white rounded-xl shadow-sm">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Technical Specifications */}
        {project.technicalSpecs && (
          <div className="max-w-4xl mx-auto mb-16">
            <h3 className="text-3xl font-bold text-gray-900 text-center mb-8">Technical Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(project.technicalSpecs).map(([category, specs]) => (
                <div key={category} className="bg-white rounded-2xl p-6 shadow-sm">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 capitalize">{category}</h4>
                  <p className="text-gray-600">{String(specs)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Development Process */}
        {project.developmentProcess && (
          <div className="max-w-4xl mx-auto mb-16">
            <h3 className="text-3xl font-bold text-gray-900 text-center mb-8">Development Process</h3>
            <div className="space-y-6">
              {project.developmentProcess.map((phase: any, index: number) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1 bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">{phase.phase}</h4>
                      <span className="text-sm text-blue-600 font-medium">{phase.duration}</span>
                    </div>
                    <p className="text-gray-600">{phase.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Project Results & Impact */}
        {project.metrics && (
          <div className="max-w-4xl mx-auto mb-16">
            <h3 className="text-3xl font-bold text-gray-900 text-center mb-8">Project Results & Impact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(project.metrics).map(([category, metrics]) => (
                <div key={category} className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
                  <div className="flex items-center mb-4">
                    {category === 'performance' && <Activity className="h-6 w-6 text-green-600 mr-3" />}
                    {category === 'business' && <TrendingUp className="h-6 w-6 text-blue-600 mr-3" />}
                    {category === 'security' && <Shield className="h-6 w-6 text-red-600 mr-3" />}
                    {category === 'technical' && <Code className="h-6 w-6 text-purple-600 mr-3" />}
                    <h4 className="text-lg font-semibold text-gray-900 capitalize">{category}</h4>
                  </div>
                  <div className="space-y-3">
                    {Object.entries(metrics as Record<string, string>).map(([metric, value]) => (
                      <div key={metric} className="bg-white rounded-lg p-3 shadow-sm">
                        <div className="text-sm text-gray-600 mb-1">{metric}</div>
                        <div className="font-bold text-gray-900 text-lg">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Technologies Used */}
        <div className="max-w-4xl mx-auto mb-16">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-8">Technologies Used</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {project.technologies.map((tech: string, index: number) => (
              <span key={index} className="px-6 py-3 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full text-sm font-medium border border-blue-200">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
