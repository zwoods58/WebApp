import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink, Github, ArrowRight } from 'lucide-react'

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
    liveUrl: '#',
    githubUrl: '#',
    demoUrl: 'https://rank-peace-61908873.figma.site/'
  },
  {
    id: 2,
    title: 'SaaS Dashboard',
    description: 'A comprehensive dashboard for managing business operations with real-time analytics and reporting features.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2015&q=80',
    technologies: ['Next.js', 'TypeScript', 'Supabase', 'Chart.js'],
    results: {
      efficiency: '+200%',
      users: '+5K',
      performance: '98.5%'
    },
    liveUrl: '#',
    githubUrl: '#',
    demoUrl: 'https://swim-dish-85536484.figma.site/'
  },
  {
    id: 3,
    title: 'Mobile Banking App',
    description: 'A secure mobile banking application with biometric authentication and real-time transaction monitoring.',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
    technologies: ['React Native', 'Node.js', 'MongoDB', 'AWS'],
    results: {
      security: '100%',
      users: '+25K',
      performance: '99.8%'
    },
    liveUrl: '#',
    githubUrl: '#',
    demoUrl: 'https://karate-cot-85414706.figma.site/'
  },
  {
    id: 4,
    title: 'Project Management Tool',
    description: 'A collaborative project management platform with team communication, task tracking, and deadline management.',
    image: 'https://images.unsplash.com/photo-1611224923853-80b023e02a71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2339&q=80',
    technologies: ['Vue.js', 'Express.js', 'PostgreSQL', 'Socket.io'],
    results: {
      productivity: '+180%',
      teams: '+500',
      performance: '99.2%'
    },
    liveUrl: '#',
    githubUrl: '#'
  },
  {
    id: 5,
    title: 'Real Estate Platform',
    description: 'A comprehensive real estate platform with property listings, virtual tours, and mortgage calculators.',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2273&q=80',
    technologies: ['Angular', 'NestJS', 'MySQL', 'Google Maps API'],
    results: {
      listings: '+5K',
      users: '+15K',
      performance: '97.8%'
    },
    liveUrl: '#',
    githubUrl: '#',
    demoUrl: 'https://image-pound-61448892.figma.site/'
  }
]

export default function Portfolio() {
  return (
    <section className="section-padding bg-secondary-50">
      <div className="container-max">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
            Our Portfolio
          </h2>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
            Explore our successful projects and see how we've helped businesses transform their digital presence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {caseStudies.map((project) => (
            <div key={project.id} className="card group hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="relative overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  width={400}
                  height={250}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
                  <a
                    href={project.liveUrl}
                    className="p-2 bg-white rounded-full hover:bg-primary-600 hover:text-white transition-colors duration-200"
                  >
                    <ExternalLink className="h-5 w-5" />
                  </a>
                  <a
                    href={project.githubUrl}
                    className="p-2 bg-white rounded-full hover:bg-primary-600 hover:text-white transition-colors duration-200"
                  >
                    <Github className="h-5 w-5" />
                  </a>
                </div>
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
                      className="px-3 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-secondary-200">
                  {Object.entries(project.results).map(([key, value], index) => (
                    <div key={index} className="text-center">
                      <div className="text-lg font-bold text-primary-600">{value}</div>
                      <div className="text-xs text-secondary-500 capitalize">{key}</div>
                    </div>
                  ))}
                </div>

                {project.demoUrl && (
                  <div className="pt-4">
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg text-center inline-flex items-center justify-center transition-colors duration-200"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Live Demo
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/portfolio" className="btn-primary inline-flex items-center">
            View All Projects
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
