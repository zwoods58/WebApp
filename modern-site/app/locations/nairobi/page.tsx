import { Metadata } from 'next'
import { PageHeader } from '../../../src/components/sections/PageHeader'
import { CTAWithFooter } from '../../../src/components/sections/CTAWithFooter'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Website Design Nairobi | Affordable Web Development Kenya',
  description: 'Professional website design services in Nairobi, Kenya. Affordable websites for small businesses, ecommerce stores with M-Pesa integration. Fast setup, mobile-friendly designs.',
  keywords: [
    'website design nairobi', 'web developers nairobi', 'nairobi web developers', 'affordable website design nairobi', 'cheap web design nairobi', 'best website designers nairobi', 'nairobi website quote', 'website for small business nairobi', 'ecommerce website nairobi', 'online store nairobi', 'website with mpesa payments', 'mpesa friendly website design', 'restaurant website nairobi', 'real estate website nairobi', 'salon website nairobi', 'fast website design nairobi', 'urgent website nairobi', 'wordpress developers nairobi', 'shopify setup nairobi'
  ],
  openGraph: {
    title: 'Website Design Nairobi | Professional Web Development Kenya',
    description: 'Affordable website design services in Nairobi. Get your business online with M-Pesa payment integration and mobile-friendly websites.',
    url: 'https://atarwebb.com/locations/nairobi',
    type: 'website',
  },
}

export default function NairobiPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'AtarWebb - Website Design Nairobi',
    description: 'Professional website design and development services in Nairobi, Kenya',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Nairobi',
      addressRegion: 'Nairobi County',
      addressCountry: 'KE',
    },
    areaServed: {
      '@type': 'City',
      name: 'Nairobi',
    },
    serviceType: 'Web Design and Development',
    telephone: '+254-758-557-779',
    url: 'https://atarwebb.com/locations/nairobi',
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
              Professional Website Design in Nairobi, Kenya
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              Get an affordable, professional website for your Nairobi business. We specialize in creating mobile-friendly websites with M-Pesa payment integration for Kenyan businesses.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div>
                <h2 className="text-2xl font-bold mb-4">Why Choose Us for Your Nairobi Website?</h2>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-teal-600 mr-2">✓</span>
                    <span>M-Pesa payment integration available</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-teal-600 mr-2">✓</span>
                    <span>Affordable pricing in Kenyan Shillings</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-teal-600 mr-2">✓</span>
                    <span>Fast website setup and deployment</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-teal-600 mr-2">✓</span>
                    <span>Mobile-first design for Kenyan market</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-teal-600 mr-2">✓</span>
                    <span>Local support and understanding</span>
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Services We Offer in Nairobi</h2>
                <ul className="space-y-3 text-gray-700">
                  <li>• Small Business Websites</li>
                  <li>• Ecommerce with M-Pesa Integration</li>
                  <li>• Restaurant & Food Service Websites</li>
                  <li>• Real Estate Agent Websites</li>
                  <li>• Salon & Barbershop Websites</li>
                  <li>• Hotel & Guesthouse Websites</li>
                  <li>• School & Church Websites</li>
                  <li>• NGO & Nonprofit Websites</li>
                </ul>
              </div>
            </div>

            <div className="bg-teal-50 border-l-4 border-teal-600 p-6 mb-8">
              <h3 className="text-xl font-bold mb-2">Get Your Free Quote Today</h3>
              <p className="mb-4">
                Ready to get your Nairobi business online? Contact us for a free consultation and custom quote.
              </p>
              <Link
                href="/contact"
                className="inline-block bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
              >
                Get Free Quote →
              </Link>
            </div>

            <div className="prose max-w-none">
              <h2 className="text-2xl font-bold mb-4">Website Design Services in Nairobi</h2>
              <p className="text-gray-700 mb-4">
                AtarWebb provides professional website design services to businesses throughout Nairobi and across Kenya. We understand the unique needs of Kenyan businesses, including M-Pesa payment integration, mobile-first design, and affordable pricing in Kenyan Shillings.
              </p>
              <p className="text-gray-700 mb-4">
                Our websites are built to be mobile-friendly, fast-loading, and optimized for search engines. We help Nairobi businesses establish a strong online presence with professional websites that convert visitors into customers.
              </p>
            </div>
          </div>
        </div>
        <CTAWithFooter />
      </div>
    </>
  )
}


