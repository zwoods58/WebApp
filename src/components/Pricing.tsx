import { Check, Star } from 'lucide-react'

const pricingPlans = [
  {
    name: 'Web Development',
    price: '$600',
    description: 'Custom websites and web applications',
    features: [
      'Custom website design & development',
      'Mobile-responsive layout',
      'Contact forms & basic functionality',
      'SEO optimization',
      'Fast loading performance',
      'Basic content management',
      'SSL certificate setup',
      'Domain & hosting setup',
      'Basic analytics integration',
      '12 months free support'
    ],
    popular: false
  },
  {
    name: 'Custom Solutions',
    price: 'Contact Us',
    description: 'Tailored solutions for complex needs',
    features: [
      'Custom web applications',
      'Advanced integrations',
      'Database design',
      'API development',
      'Advanced security features',
      'Custom training',
      'Priority support',
      'Dedicated project manager',
      'White-label solutions',
      '24/7 support available'
    ],
    popular: false
  }
]

export default function Pricing() {
  return (
    <section className="section-padding bg-secondary-50">
      <div className="container-max">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
            Pricing Plans
          </h2>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
            Choose the perfect plan for your project. All plans include our commitment to quality and your success.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={`card relative ${
                plan.popular
                  ? 'ring-2 ring-primary-600 shadow-xl scale-105'
                  : 'hover:shadow-xl'
              } transition-all duration-300`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary-600 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center">
                    <Star className="h-4 w-4 mr-1" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-secondary-900 mb-2">
                  {plan.name}
                </h3>
                <div className="text-4xl font-bold text-primary-600 mb-2">
                  {plan.price}
                </div>
                <p className="text-secondary-600">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <Check className="h-5 w-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-secondary-700">{feature}</span>
                  </li>
                ))}
              </ul>

            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-secondary-600 mb-4">
            Need a custom solution? We're happy to discuss your specific requirements.
          </p>
          <a href="/contact" className="btn-outline">
            Contact Us for Custom Quote
          </a>
        </div>
      </div>
    </section>
  )
}
