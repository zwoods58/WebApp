import { Mail, Phone, MapPin, Clock, MessageCircle, Calendar } from 'lucide-react'

const contactMethods = [
  {
    icon: Mail,
    title: 'Email Us',
    description: 'Send us an email and we\'ll respond within 24 hours',
    details: 'hello@webappsolutions.com',
    action: 'mailto:hello@webappsolutions.com'
  },
  {
    icon: Phone,
    title: 'Call Us',
    description: 'Speak directly with our team during business hours',
    details: '+1 (555) 123-4567',
    action: 'tel:+15551234567'
  },
  {
    icon: MessageCircle,
    title: 'Live Chat',
    description: 'Chat with us in real-time for immediate assistance',
    details: 'Available 9 AM - 6 PM CT',
    action: '#'
  },
  {
    icon: Calendar,
    title: 'Schedule a Call',
    description: 'Book a free consultation at your convenience',
    details: '30-minute discovery call',
    action: '#'
  }
]

const officeHours = [
  { day: 'Monday - Friday', hours: '9:00 AM - 6:00 PM CT' },
  { day: 'Saturday', hours: '10:00 AM - 4:00 PM CT' },
  { day: 'Sunday', hours: 'Closed' }
]

const faqs = [
  {
    question: 'How long does a typical project take?',
    answer: 'Project timelines vary based on complexity. Simple websites take 2-4 weeks, while complex applications can take 3-6 months. We provide detailed timelines during our consultation.'
  },
  {
    question: 'What is included in your pricing?',
    answer: 'Our pricing includes design, development, testing, and deployment. We provide transparent pricing with no hidden costs.'
  },
  {
    question: 'Can you work with our existing team?',
    answer: 'Absolutely! We can integrate with your existing team, provide training, or work independently. We adapt to your preferred collaboration style.'
  }
]

export default function ContactInfo() {
  return (
    <section className="section-padding bg-secondary-50">
      <div className="container-max">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
            Get in Touch
          </h2>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
            Choose the most convenient way to reach us. We're here to help with your project needs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Methods */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {contactMethods.map((method, index) => (
                <div key={index} className="card hover:shadow-xl transition-shadow duration-300">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <method.icon className="h-6 w-6 text-primary-600" />
                    </div>
                    
                    <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                      {method.title}
                    </h3>
                    
                    <p className="text-secondary-600 text-sm mb-4">
                      {method.description}
                    </p>
                    
                    <p className="text-primary-600 font-medium mb-4">
                      {method.details}
                    </p>
                    
                    <a
                      href={method.action}
                      className="btn-outline text-sm"
                    >
                      {method.title}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Office Hours */}
            <div className="card">
              <div className="flex items-center mb-4">
                <Clock className="h-5 w-5 text-primary-600 mr-2" />
                <h3 className="text-lg font-semibold text-secondary-900">Office Hours</h3>
              </div>
              
              <div className="space-y-3">
                {officeHours.map((schedule, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-secondary-600">{schedule.day}</span>
                    <span className="font-medium text-secondary-900">{schedule.hours}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="card">
              <div className="flex items-center mb-4">
                <MapPin className="h-5 w-5 text-primary-600 mr-2" />
                <h3 className="text-lg font-semibold text-secondary-900">Our Office</h3>
              </div>
              
              <div className="text-secondary-600">
                <p className="mb-2">123 Business Street</p>
                <p className="mb-2">San Francisco, CA 94105</p>
                <p>United States</p>
              </div>
            </div>

            {/* Quick Response */}
            <div className="card bg-primary-50">
              <h3 className="text-lg font-semibold text-secondary-900 mb-3">
                Quick Response Guarantee
              </h3>
              <p className="text-secondary-600 text-sm mb-4">
                We respond to all inquiries within 24 hours, often much sooner.
              </p>
              <div className="flex items-center text-sm text-primary-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Online now
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-secondary-900 text-center mb-8">
            Frequently Asked Questions
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <div key={index} className="card">
                <h4 className="font-semibold text-secondary-900 mb-3">
                  {faq.question}
                </h4>
                <p className="text-secondary-600 text-sm leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
