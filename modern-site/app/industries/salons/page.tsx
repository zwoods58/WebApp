import { Metadata } from 'next'
import { PageHeader } from '../../../src/components/sections/PageHeader'
import { CTAWithFooter } from '../../../src/components/sections/CTAWithFooter'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Website Design for Salons & Barbershops | Beauty Salon Websites',
  description: 'Professional website design for beauty salons and barbershops. Online booking, service galleries, mobile-friendly designs. Get your salon online today!',
  keywords: [
    'website for beauty salons south africa', 'website for salons', 'salon website design', 'barbershop website design', 'website design for barbershops south africa', 'beauty salon website', 'hair salon website', 'salon booking website', 'online booking for salons', 'salon website kenya', 'salon website durban', 'salon website nairobi', 'salon website kigali', 'barbershop website south africa', 'hair salon website design'
  ],
  openGraph: {
    title: 'Website Design for Salons & Barbershops',
    description: 'Get a professional website for your salon or barbershop with online booking, service galleries, and mobile-friendly design.',
    url: 'https://atarwebb.com/industries/salons',
    type: 'website',
  },
}

export default function SalonsPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Website Design for Salons and Barbershops',
    provider: {
      '@type': 'Organization',
      name: 'AtarWebb',
    },
    areaServed: {
      '@type': 'Place',
      name: 'South Africa, Kenya, Rwanda',
    },
    description: 'Professional website design services specifically for beauty salons and barbershops',
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-white text-black">
        <PageHeader />
        <div className="pt-24 pb-16">
          <div className="max-w-4xl mx-auto px-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Professional Website Design for Salons & Barbershops
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              Get a beautiful, professional website that showcases your salon or barbershop services. Include online booking, service galleries, and mobile-friendly design to attract more customers.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div>
                <h2 className="text-2xl font-bold mb-4">Perfect for Salons & Barbershops</h2>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-teal-600 mr-2">✓</span>
                    <span>Service galleries to showcase your work</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-teal-600 mr-2">✓</span>
                    <span>Online booking system integration</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-teal-600 mr-2">✓</span>
                    <span>Mobile-friendly design for on-the-go booking</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-teal-600 mr-2">✓</span>
                    <span>Price lists and service menus</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-teal-600 mr-2">✓</span>
                    <span>WhatsApp integration for easy contact</span>
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">What&apos;s Included</h2>
                <ul className="space-y-3 text-gray-700">
                  <li>• Professional, modern design</li>
                  <li>• Service gallery with before/after photos</li>
                  <li>• Online booking system</li>
                  <li>• Mobile-responsive layout</li>
                  <li>• Social media integration</li>
                  <li>• Contact forms and WhatsApp button</li>
                  <li>• SEO optimization</li>
                  <li>• Fast loading times</li>
                </ul>
              </div>
            </div>

            <div className="bg-teal-50 border-l-4 border-teal-600 p-6 mb-8">
              <h3 className="text-xl font-bold mb-2">Get Your Salon Website Today</h3>
              <p className="mb-4">
                Ready to get your salon or barbershop online? Contact us for a free consultation and custom quote.
              </p>
              <Link
                href="/contact"
                className="inline-block bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
              >
                Get Free Quote →
              </Link>
            </div>

            <div className="prose max-w-none">
              <h2 className="text-2xl font-bold mb-4">Why Salons Need Professional Websites</h2>
              <p className="text-gray-700 mb-4">
                In today&apos;s digital age, having a professional website is essential for salons and barbershops. Your website is often the first impression potential customers have of your business. A well-designed website can showcase your work, make it easy for customers to book appointments, and help you stand out from competitors.
              </p>
              <p className="text-gray-700 mb-4">
                Our salon websites are designed specifically for the beauty and grooming industry, with features like service galleries, online booking, and mobile-friendly designs that make it easy for customers to find and book your services.
              </p>
            </div>
          </div>
        </div>
        <CTAWithFooter />
      </div>
    </>
  )
}

