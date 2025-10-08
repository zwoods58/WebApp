import { ExternalLink, Github, ArrowLeft, ArrowRight } from 'lucide-react'

const caseStudies = [
  {
    id: 1,
    title: 'E-commerce Platform Transformation',
    client: 'TechStart Inc.',
    industry: 'Technology',
    duration: '6 months',
    team: '4 developers',
    challenge: 'Legacy e-commerce platform with poor performance and outdated technology stack.',
    solution: 'Complete rebuild using React, Node.js, and PostgreSQL with modern architecture.',
    results: [
      '150% increase in conversion rate',
      '80% faster page load times',
      '99.9% uptime achieved',
      '10,000+ active users'
    ],
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe', 'AWS'],
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    testimonial: {
      text: 'WebApp Solutions transformed our business completely. The new platform is fast, reliable, and our customers love it.',
      author: 'Sarah Williams',
      role: 'CEO, TechStart Inc.'
    }
  }
]

export default function CaseStudy() {
  const study = caseStudies[0] // For now, showing the first case study

  return (
    <section className="section-padding bg-white">
      <div className="container-max">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Detailed Case Study
            </h2>
            <p className="text-xl text-secondary-600">
              Deep dive into one of our successful projects
            </p>
          </div>

          {/* Case Study Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Project Image */}
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src={study.image}
                  alt={study.title}
                  className="w-full h-64 md:h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">{study.title}</h3>
                  <p className="text-lg opacity-90">{study.client}</p>
                </div>
              </div>

              {/* Project Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">{study.duration}</div>
                  <div className="text-sm text-secondary-600">Duration</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">{study.team}</div>
                  <div className="text-sm text-secondary-600">Team Size</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">{study.industry}</div>
                  <div className="text-sm text-secondary-600">Industry</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">100%</div>
                  <div className="text-sm text-secondary-600">Success Rate</div>
                </div>
              </div>

              {/* Challenge & Solution */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xl font-semibold text-secondary-900 mb-4">The Challenge</h4>
                  <p className="text-secondary-600 leading-relaxed">{study.challenge}</p>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-secondary-900 mb-4">Our Solution</h4>
                  <p className="text-secondary-600 leading-relaxed">{study.solution}</p>
                </div>
              </div>

              {/* Results */}
              <div>
                <h4 className="text-xl font-semibold text-secondary-900 mb-6">Key Results</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {study.results.map((result, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-primary-600 rounded-full flex-shrink-0"></div>
                      <span className="text-secondary-700">{result}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technologies */}
              <div>
                <h4 className="text-xl font-semibold text-secondary-900 mb-4">Technologies Used</h4>
                <div className="flex flex-wrap gap-3">
                  {study.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Testimonial */}
              <div className="bg-secondary-50 rounded-xl p-8">
                <blockquote className="text-lg text-secondary-700 italic mb-4">
                  "{study.testimonial.text}"
                </blockquote>
                <div className="flex items-center">
                  <div>
                    <div className="font-semibold text-secondary-900">{study.testimonial.author}</div>
                    <div className="text-sm text-secondary-600">{study.testimonial.role}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Project Info Card */}
              <div className="card">
                <h4 className="text-lg font-semibold text-secondary-900 mb-4">Project Information</h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-secondary-600">Client:</span>
                    <div className="font-medium">{study.client}</div>
                  </div>
                  <div>
                    <span className="text-sm text-secondary-600">Industry:</span>
                    <div className="font-medium">{study.industry}</div>
                  </div>
                  <div>
                    <span className="text-sm text-secondary-600">Duration:</span>
                    <div className="font-medium">{study.duration}</div>
                  </div>
                  <div>
                    <span className="text-sm text-secondary-600">Team:</span>
                    <div className="font-medium">{study.team}</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="card">
                <h4 className="text-lg font-semibold text-secondary-900 mb-4">Interested?</h4>
                <p className="text-secondary-600 text-sm mb-6">
                  Let's discuss how we can help with your project.
                </p>
                <div className="space-y-3">
                  <a href="/contact" className="btn-primary w-full text-center">
                    Start Your Project
                  </a>
                  <a href="/portfolio" className="btn-outline w-full text-center">
                    View More Projects
                  </a>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex space-x-3">
                <button className="flex-1 btn-secondary flex items-center justify-center">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </button>
                <button className="flex-1 btn-secondary flex items-center justify-center">
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
