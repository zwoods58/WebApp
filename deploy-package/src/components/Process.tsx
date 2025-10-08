import { Search, PenTool, Code, Rocket, CheckCircle } from 'lucide-react'

const processSteps = [
  {
    icon: Search,
    title: 'Discovery & Planning',
    description: 'We start by understanding your business goals, target audience, and technical requirements.',
    details: [
      'Requirements gathering',
      'Technical analysis',
      'Project timeline planning',
      'Resource allocation'
    ]
  },
  {
    icon: PenTool,
    title: 'Design & Prototyping',
    description: 'Our design team creates wireframes, mockups, and interactive prototypes.',
    details: [
      'User experience design',
      'Visual design creation',
      'Interactive prototyping',
      'Design system development'
    ]
  },
  {
    icon: Code,
    title: 'Development & Testing',
    description: 'We build your application using modern technologies and best practices.',
    details: [
      'Frontend development',
      'Backend development',
      'Database implementation',
      'Quality assurance testing'
    ]
  },
  {
    icon: Rocket,
    title: 'Deployment & Launch',
    description: 'We deploy your application and ensure everything runs smoothly.',
    details: [
      'Production deployment',
      'Performance optimization',
      'Security configuration',
      'Launch support'
    ]
  }
]

export default function Process() {
  return (
    <section className="section-padding bg-white">
      <div className="container-max">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
            Our Development Process
          </h2>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
            We follow a proven methodology to ensure your project is delivered on time, on budget, and exceeds expectations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {processSteps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connection Line */}
              {index < processSteps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-primary-200 to-primary-100 z-0"></div>
              )}

              <div className="relative z-10">
                <div className="card text-center hover:shadow-xl transition-shadow duration-300">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <step.icon className="h-8 w-8 text-primary-600" />
                  </div>

                  <h3 className="text-xl font-semibold text-secondary-900 mb-4">
                    {step.title}
                  </h3>

                  <p className="text-secondary-600 mb-6 leading-relaxed">
                    {step.description}
                  </p>

                  <ul className="space-y-2 text-left">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-center text-sm text-secondary-600">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-primary-50 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-secondary-900 mb-4">
              Ready to Start Your Project?
            </h3>
            <p className="text-secondary-600 mb-6">
              Let's discuss your requirements and create a custom development plan tailored to your needs.
            </p>
            <a href="/contact" className="btn-primary">
              Start Your Project
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
