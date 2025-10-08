import { Code, ShoppingCart, Database, Smartphone, Cloud, Shield } from 'lucide-react'

const services = [
  {
    icon: Code,
    title: 'Custom Web Applications',
    description: 'Build scalable web applications tailored to your business requirements using modern technologies like React, Next.js, and Node.js.',
    features: ['React & Next.js Development', 'API Integration', 'Custom UI/UX Design', 'Performance Optimization']
  },
  {
    icon: ShoppingCart,
    title: 'E-commerce Solutions',
    description: 'Complete e-commerce platforms with payment processing, inventory management, and customer analytics.',
    features: ['Payment Gateway Integration', 'Inventory Management', 'Order Processing', 'Customer Analytics']
  },
  {
    icon: Database,
    title: 'Database Design & Management',
    description: 'Robust database architecture and management solutions using PostgreSQL, MongoDB, and cloud databases.',
    features: ['Database Architecture', 'Data Migration', 'Performance Tuning', 'Backup & Recovery']
  },
  {
    icon: Smartphone,
    title: 'Mobile-First Design',
    description: 'Responsive web applications that work perfectly across all devices and screen sizes.',
    features: ['Responsive Design', 'Mobile Optimization', 'Touch-Friendly Interface', 'Cross-Browser Compatibility']
  },
  {
    icon: Cloud,
    title: 'Cloud Deployment',
    description: 'Deploy and manage your applications on cloud platforms with automatic scaling and monitoring.',
    features: ['AWS/Azure/GCP Deployment', 'Auto Scaling', 'Load Balancing', 'Monitoring & Logging']
  },
  {
    icon: Shield,
    title: 'Security & Maintenance',
    description: 'Comprehensive security measures and ongoing maintenance to keep your applications secure and up-to-date.',
    features: ['Security Audits', 'SSL Certificates', 'Regular Updates', '24/7 Monitoring']
  }
]

export default function Services() {
  return (
    <section className="section-padding bg-white">
      <div className="container-max">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
            Our Services
          </h2>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
            We provide comprehensive web development services to help your business grow and succeed in the digital world.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="card hover:shadow-xl transition-shadow duration-300 group">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-600 transition-colors duration-300">
                  <service.icon className="h-6 w-6 text-primary-600 group-hover:text-white transition-colors duration-300" />
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-secondary-600 mb-4">
                    {service.description}
                  </p>
                </div>

                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-secondary-600">
                      <div className="w-1.5 h-1.5 bg-primary-600 rounded-full mr-3 flex-shrink-0"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a href="/contact" className="btn-primary">
            Get a Free Consultation
          </a>
        </div>
      </div>
    </section>
  )
}
