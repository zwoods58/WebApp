import { Zap, Shield, Users, Clock, Award, Globe } from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    titleKey: 'Lightning Fast',
    description: 'Optimized for speed with cutting-edge technologies and best practices.',
    descriptionKey: 'Optimized for speed with cutting-edge technologies and best practices.',
    stat: '99.9% Uptime'
  },
  {
    icon: Shield,
    title: 'Secure & Reliable',
    titleKey: 'Secure & Reliable',
    description: 'Enterprise-grade security with regular audits and monitoring.',
    descriptionKey: 'Enterprise-grade security with regular audits and monitoring.',
    stat: '100% Secure'
  },
  {
    icon: Users,
    title: 'User-Centric Design',
    titleKey: 'User-Centric Design',
    description: 'Intuitive interfaces designed with your users in mind.',
    descriptionKey: 'Intuitive interfaces designed with your users in mind.',
    stat: '95% User Satisfaction'
  },
  {
    icon: Clock,
    title: 'Fast Delivery',
    titleKey: 'Fast Delivery',
    description: 'Quick turnaround times to get your business online faster.',
    descriptionKey: 'Quick turnaround times to get your business online faster.',
    stat: '7 Days'
  },
  {
    icon: Award,
    title: 'Award-Winning',
    titleKey: 'Award-Winning',
    description: 'Recognized for excellence in web development and design.',
    descriptionKey: 'Recognized for excellence in web development and design.',
    stat: '5+ Awards'
  },
  {
    icon: Globe,
    title: 'Global Reach',
    titleKey: 'Global Reach',
    description: 'Scalable solutions that work anywhere in the world.',
    descriptionKey: 'Scalable solutions that work anywhere in the world.',
    stat: '50+ Countries'
  }
]

export default function Features() {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="container-max relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-6">
            <Award className="h-4 w-4 mr-2" />
            <span data-translate="Why Choose Us">Why Choose Us</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6" data-translate="Built for Excellence">
            Built for Excellence
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto" data-translate="We combine cutting-edge technology with proven methodologies to deliver exceptional results.">
            We combine cutting-edge technology with proven methodologies to deliver exceptional results.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="group text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <feature.icon className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {feature.stat}
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors" data-translate={feature.titleKey}>
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed" data-translate={feature.descriptionKey}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-gray-900 to-blue-900 rounded-3xl p-12 text-white">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Experience the Difference?
            </h3>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Join hundreds of satisfied clients who trust us with their digital transformation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/contact" className="bg-gray-800 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-700 transition-colors inline-flex items-center justify-center">
                Start Your Project
              </a>
              <a href="/portfolio" className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white hover:text-gray-900 transition-colors inline-flex items-center justify-center">
                View Case Studies
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
