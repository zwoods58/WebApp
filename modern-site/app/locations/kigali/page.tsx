import { Metadata } from 'next'
import { PageHeader } from '../../../src/components/sections/PageHeader'
import { CTAWithFooter } from '../../../src/components/sections/CTAWithFooter'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Website Design Kigali | Affordable Web Development Rwanda',
  description: 'Professional website design services in Kigali, Rwanda. Affordable websites for small businesses, ecommerce stores, and local companies. Fast setup, mobile-friendly designs.',
  keywords: [
    'website design kigali', 'web developers kigali', 'kigali web developers', 'affordable website design kigali', 'cheap web design kigali', 'best website designers kigali', 'kigali website quote', 'website for small business kigali', 'ecommerce website kigali', 'online store kigali', 'restaurant website kigali', 'real estate website kigali', 'hotel website kigali', 'fast website design kigali', 'urgent website kigali', 'wordpress developers kigali', 'shopify setup kigali', 'low cost website kigali'
  ],
  openGraph: {
    title: 'Website Design Kigali | Professional Web Development Rwanda',
    description: 'Affordable website design services in Kigali. Get your business online with professional, mobile-friendly websites.',
    url: 'https://atarwebb.com/locations/kigali',
    type: 'website',
  },
}

export default function KigaliPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'AtarWebb - Website Design Kigali',
    description: 'Professional website design and development services in Kigali, Rwanda',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Kigali',
      addressRegion: 'Kigali',
      addressCountry: 'RW',
    },
    areaServed: {
      '@type': 'City',
      name: 'Kigali',
    },
    serviceType: 'Web Design and Development',
    telephone: '+254-758-557-779',
    url: 'https://atarwebb.com/locations/kigali',
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
              Professional Website Design in Kigali, Rwanda
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              Get an affordable, professional website for your Kigali business. We specialize in creating mobile-friendly websites that help Rwandan businesses grow online.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div>
                <h2 className="text-2xl font-bold mb-4">Why Choose Us for Your Kigali Website?</h2>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-teal-600 mr-2">✓</span>
                    <span>Affordable pricing for Rwandan businesses</span>
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
                <h2 className="text-2xl font-bold mb-4">Services We Offer in Kigali</h2>
                <ul className="space-y-3 text-gray-700">
                  <li>• Small Business Websites</li>
                  <li>• Ecommerce & Online Stores</li>
                  <li>• Hotel & Tourism Websites</li>
                  <li>• Real Estate Websites</li>
                  <li>• Restaurant Websites</li>
                  <li>• School & Church Websites</li>
                  <li>• NGO & Nonprofit Websites</li>
                  <li>• WordPress Development</li>
                </ul>
              </div>
            </div>

            <div className="bg-teal-50 border-l-4 border-teal-600 p-6 mb-8">
              <h3 className="text-xl font-bold mb-2">Get Your Free Quote Today</h3>
              <p className="mb-4">
                Ready to get your Kigali business online? Contact us for a free consultation and custom quote.
              </p>
              <Link
                href="/contact"
                className="inline-block bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
              >
                Get Free Quote →
              </Link>
            </div>

            <div className="prose max-w-none">
              <h2 className="text-2xl font-bold mb-4">Website Design Services in Kigali</h2>
              <p className="text-gray-700 mb-4">
                AtarWebb provides professional website design services to businesses throughout Kigali and across Rwanda. We understand the unique needs of Rwandan businesses and offer affordable solutions that help local companies establish a strong online presence.
              </p>
              <p className="text-gray-700 mb-4">
                Our websites are built to be mobile-friendly, fast-loading, and optimized for search engines. We help Kigali businesses grow their online presence with professional websites that convert visitors into customers.
              </p>
            </div>
          </div>
        </div>
        <CTAWithFooter />
      </div>
    </>
  )
}


