import { Heart, Target, Users, Lightbulb, Shield, Clock } from 'lucide-react'

const values = [
  {
    icon: Heart,
    title: 'Passion',
    description: 'We love what we do and it shows in every project we deliver.',
    details: [
      'Dedicated to excellence',
      'Continuous learning',
      'Innovation mindset',
      'Quality obsession'
    ]
  },
  {
    icon: Target,
    title: 'Results',
    description: 'We focus on delivering measurable business value and success.',
    details: [
      'Data-driven decisions',
      'Performance metrics',
      'ROI optimization',
      'Success measurement'
    ]
  },
  {
    icon: Users,
    title: 'Collaboration',
    description: 'We work closely with our clients as partners, not vendors.',
    details: [
      'Transparent communication',
      'Regular updates',
      'Client involvement',
      'Team approach'
    ]
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'We stay ahead of the curve with cutting-edge technologies.',
    details: [
      'Latest technologies',
      'Best practices',
      'Creative solutions',
      'Future-proofing'
    ]
  },
  {
    icon: Shield,
    title: 'Integrity',
    description: 'We maintain the highest ethical standards in all our work.',
    details: [
      'Honest communication',
      'Fair pricing',
      'Reliable delivery',
      'Trust building'
    ]
  },
  {
    icon: Clock,
    title: 'Reliability',
    description: 'We deliver on time, every time, with consistent quality.',
    details: [
      'On-time delivery',
      'Consistent quality',
      'Dependable delivery',
      'Long-term partnership'
    ]
  }
]

export default function Values() {
  return (
    <section className="section-padding bg-white">
      <div className="container-max">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
            Our Values
          </h2>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
            These core values guide everything we do and shape how we work with our clients.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <div key={index} className="card group hover:shadow-xl transition-all duration-300">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-600 transition-colors duration-300">
                  <value.icon className="h-8 w-8 text-primary-600 group-hover:text-white transition-colors duration-300" />
                </div>
                
                <h3 className="text-xl font-semibold text-secondary-900 mb-4">
                  {value.title}
                </h3>
                
                <p className="text-secondary-600 mb-6 leading-relaxed">
                  {value.description}
                </p>

                <ul className="space-y-2 text-left">
                  {value.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-center text-sm text-secondary-600">
                      <div className="w-1.5 h-1.5 bg-primary-600 rounded-full mr-3 flex-shrink-0"></div>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-secondary-900 mb-4">
              Ready to Work with a Values-Driven Team?
            </h3>
            <p className="text-secondary-600 mb-6">
              Let's discuss how our values can help drive your project's success.
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
