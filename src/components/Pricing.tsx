import { Check, Star } from 'lucide-react'

const pricingPlans = [
  {
    name: 'Starter',
    price: '$5,000',
    description: 'Perfect for small businesses and startups',
    features: [
      'Custom web application',
      'Responsive design',
      'Basic SEO optimization',
      '3 months support',
      'Source code included',
      'Basic analytics'
    ],
    popular: false
  },
  {
    name: 'Professional',
    price: '$15,000',
    description: 'Ideal for growing businesses',
    features: [
      'Everything in Starter',
      'Advanced features',
      'Database design',
      'API development',
      '12 months support',
      'Advanced analytics',
      'Performance optimization',
      'Security audit'
    ],
    popular: true
  },
  {
    name: 'Enterprise',
    price: '$35,000',
    description: 'For large-scale applications',
    features: [
      'Everything in Professional',
      'Custom integrations',
      'Scalable architecture',
      'Advanced security',
      '12 months support',
      'Dedicated project manager',
      'Training sessions',
      'Priority support'
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
