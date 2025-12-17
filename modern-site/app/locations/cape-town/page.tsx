import { Metadata } from 'next'
import { PageHeader } from '../../../src/components/sections/PageHeader'
import { CTAWithFooter } from '../../../src/components/sections/CTAWithFooter'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Website Design Cape Town | Affordable Web Development Services',
  description: 'Professional website design services in Cape Town. Affordable websites for small businesses, ecommerce stores, and local companies. Fast setup, mobile-friendly designs. Get your quote today!',
  keywords: [
    'website design cape town', 'web developers cape town', 'cape town web development', 'affordable website design cape town', 'cheap web design cape town', 'best website designers cape town', 'cape town website quote', 'website for small business cape town', 'ecommerce website cape town', 'online store cape town', 'restaurant website cape town', 'real estate website cape town', 'salon website cape town', 'barbershop website cape town', 'plumber website cape town', 'electrician website cape town', 'fast website design cape town', 'urgent website cape town', 'wordpress developers cape town', 'shopify setup cape town'
  ],
  openGraph: {
    title: 'Website Design Cape Town | Professional Web Development',
    description: 'Affordable website design services in Cape Town. Get your business online with professional, mobile-friendly websites.',
    url: 'https://atarwebb.com/locations/cape-town',
    type: 'website',
  },
}

export default function CapeTownPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'AtarWebb - Website Design Cape Town',
    description: 'Professional website design and development services in Cape Town, South Africa',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Cape Town',
      addressRegion: 'Western Cape',
      addressCountry: 'ZA',
    },
    areaServed: {
      '@type': 'City',
      name: 'Cape Town',
    },
    serviceType: 'Web Design and Development',
    telephone: '+254-758-557-779',
    url: 'https://atarwebb.com/locations/cape-town',
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
              Professional Website Design in Cape Town
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              Get an affordable, professional website for your Cape Town business. We specialize in creating mobile-friendly websites that help local businesses grow online.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div>
                <h2 className="text-2xl font-bold mb-4">Why Choose Us for Your Cape Town Website?</h2>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-teal-600 mr-2">✓</span>
                    <span>Affordable pricing for small businesses</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-teal-600 mr-2">✓</span>
                    <span>Fast website setup and deployment</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-teal-600 mr-2">✓</span>
                    <span>Mobile-friendly, responsive designs</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-teal-600 mr-2">✓</span>
                    <span>SEO optimized for local search</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-teal-600 mr-2">✓</span>
                    <span>Ecommerce and online store solutions</span>
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Services We Offer in Cape Town</h2>
                <ul className="space-y-3 text-gray-700">
                  <li>• Small Business Websites</li>
                  <li>• Ecommerce & Online Stores</li>
                  <li>• Restaurant & Food Service Websites</li>
                  <li>• Real Estate Agent Websites</li>
                  <li>• Salon & Barbershop Websites</li>
                  <li>• Service Business Websites (Plumbers, Electricians)</li>
                  <li>• WordPress Development</li>
                  <li>• Shopify Store Setup</li>
                </ul>
              </div>
            </div>

            <div className="bg-teal-50 border-l-4 border-teal-600 p-6 mb-8">
              <h3 className="text-xl font-bold mb-2">Get Your Free Quote Today</h3>
              <p className="mb-4">
                Ready to get your Cape Town business online? Contact us for a free consultation and custom quote.
              </p>
              <Link
                href="/contact"
                className="inline-block bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
              >
                Get Free Quote →
              </Link>
            </div>

            <div className="prose max-w-none">
              <h2 className="text-2xl font-bold mb-4">Website Design Services in Cape Town</h2>
              <p className="text-gray-700 mb-4">
                AtarWebb provides professional website design services to businesses throughout Cape Town and the greater Western Cape area. Whether you&apos;re a small business just getting started online, or an established company looking to redesign your website, we have affordable solutions that fit your budget.
              </p>
              <p className="text-gray-700 mb-4">
                Our websites are built to be mobile-friendly, fast-loading, and optimized for search engines. We understand the local Cape Town market and can help your business stand out online with a professional website that converts visitors into customers.
              </p>
            </div>
          </div>
        </div>
        <CTAWithFooter />
      </div>
    </>
  )
}


