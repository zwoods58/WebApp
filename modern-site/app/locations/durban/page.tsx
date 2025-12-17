import { Metadata } from 'next'
import { PageHeader } from '../../../src/components/sections/PageHeader'
import { CTAWithFooter } from '../../../src/components/sections/CTAWithFooter'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Website Design Durban | Affordable Web Development Services',
  description: 'Professional website design services in Durban. Affordable websites for small businesses, ecommerce stores, and local companies. Fast setup, mobile-friendly designs. Get your quote today!',
  keywords: [
    'website design durban', 'web developers durban', 'durban web development', 'affordable website design durban', 'cheap web design durban', 'best website designers durban', 'durban website quote', 'website for small business durban', 'ecommerce website durban', 'online store durban', 'restaurant website durban', 'real estate website durban', 'salon website durban', 'barbershop website durban', 'plumber website durban', 'electrician website durban', 'fast website design durban', 'urgent website durban', 'wordpress developers durban', 'shopify setup durban'
  ],
  openGraph: {
    title: 'Website Design Durban | Professional Web Development',
    description: 'Affordable website design services in Durban. Get your business online with professional, mobile-friendly websites.',
    url: 'https://atarwebb.com/locations/durban',
    type: 'website',
  },
}

export default function DurbanPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'AtarWebb - Website Design Durban',
    description: 'Professional website design and development services in Durban, South Africa',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Durban',
      addressRegion: 'KwaZulu-Natal',
      addressCountry: 'ZA',
    },
    areaServed: {
      '@type': 'City',
      name: 'Durban',
    },
    serviceType: 'Web Design and Development',
    telephone: '+254-758-557-779',
    url: 'https://atarwebb.com/locations/durban',
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
              Professional Website Design in Durban
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              Get an affordable, professional website for your Durban business. We specialize in creating mobile-friendly websites that help local businesses grow online.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div>
                <h2 className="text-2xl font-bold mb-4">Why Choose Us for Your Durban Website?</h2>
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
                <h2 className="text-2xl font-bold mb-4">Services We Offer in Durban</h2>
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
                Ready to get your Durban business online? Contact us for a free consultation and custom quote.
              </p>
              <Link
                href="/contact"
                className="inline-block bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
              >
                Get Free Quote →
              </Link>
            </div>

            <div className="prose max-w-none">
              <h2 className="text-2xl font-bold mb-4">Website Design Services in Durban</h2>
              <p className="text-gray-700 mb-4">
                AtarWebb provides professional website design services to businesses throughout Durban and the greater KwaZulu-Natal area. Whether you&apos;re a small business just getting started online, or an established company looking to redesign your website, we have affordable solutions that fit your budget.
              </p>
              <p className="text-gray-700 mb-4">
                Our websites are built to be mobile-friendly, fast-loading, and optimized for search engines. We understand the local Durban market and can help your business stand out online with a professional website that converts visitors into customers.
              </p>
            </div>
          </div>
        </div>
        <CTAWithFooter />
      </div>
    </>
  )
}

