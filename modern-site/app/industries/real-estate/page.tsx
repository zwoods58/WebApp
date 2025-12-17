import { Metadata } from 'next'
import { PageHeader } from '../../../src/components/sections/PageHeader'
import { CTAWithFooter } from '../../../src/components/sections/CTAWithFooter'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Real Estate Website Design | Property Listing Websites',
  description: 'Professional website design for real estate agents and property companies. Property listings, search functionality, and lead generation. Get your real estate website today!',
  keywords: [
    'real estate website design', 'website developers for real estate agents johannesburg', 'real estate website south africa', 'real estate website kenya', 'real estate website nairobi', 'property listing website', 'website for property listings south africa', 'real estate listing website kenya', 'property listing website kigali', 'real estate developer website', 'real estate website rwanda'
  ],
  openGraph: {
    title: 'Real Estate Website Design | Property Listings',
    description: 'Get a professional website for your real estate business with property listings, search functionality, and lead generation.',
    url: 'https://atarwebb.com/industries/real-estate',
    type: 'website',
  },
}

export default function RealEstatePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Real Estate Website Design',
    provider: {
      '@type': 'Organization',
      name: 'AtarWebb',
    },
    areaServed: {
      '@type': 'Place',
      name: 'South Africa, Kenya, Rwanda',
    },
    description: 'Professional website design services specifically for real estate agents and property companies',
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
              Professional Website Design for Real Estate
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              Get a professional website that showcases your property listings, helps potential buyers search and filter properties, and generates quality leads for your real estate business.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div>
                <h2 className="text-2xl font-bold mb-4">Perfect for Real Estate Agents</h2>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-teal-600 mr-2">✓</span>
                    <span>Property listing galleries with photos</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-teal-600 mr-2">✓</span>
                    <span>Advanced search and filter functionality</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-teal-600 mr-2">✓</span>
                    <span>Lead capture forms for inquiries</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-teal-600 mr-2">✓</span>
                    <span>Mobile-friendly for property browsing</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-teal-600 mr-2">✓</span>
                    <span>Virtual tour integration</span>
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">What&apos;s Included</h2>
                <ul className="space-y-3 text-gray-700">
                  <li>• Professional, trustworthy design</li>
                  <li>• Property listing system</li>
                  <li>• Advanced search and filters</li>
                  <li>• Lead generation forms</li>
                  <li>• Mobile-responsive layout</li>
                  <li>• Agent profile pages</li>
                  <li>• Contact and inquiry system</li>
                  <li>• SEO optimization</li>
                </ul>
              </div>
            </div>

            <div className="bg-teal-50 border-l-4 border-teal-600 p-6 mb-8">
              <h3 className="text-xl font-bold mb-2">Get Your Real Estate Website Today</h3>
              <p className="mb-4">
                Ready to get your real estate business online? Contact us for a free consultation and custom quote.
              </p>
              <Link
                href="/contact"
                className="inline-block bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
              >
                Get Free Quote →
              </Link>
            </div>

            <div className="prose max-w-none">
              <h2 className="text-2xl font-bold mb-4">Why Real Estate Agents Need Professional Websites</h2>
              <p className="text-gray-700 mb-4">
                A professional website is essential for real estate agents and property companies. Your website is where potential buyers and sellers discover your listings, learn about your services, and contact you. A well-designed real estate website can significantly increase your leads and property inquiries.
              </p>
              <p className="text-gray-700 mb-4">
                Our real estate websites are designed specifically for the property industry, with features like property listings, advanced search functionality, lead capture forms, and mobile-friendly designs that make it easy for potential clients to find and inquire about properties.
              </p>
            </div>
          </div>
        </div>
        <CTAWithFooter />
      </div>
    </>
  )
}

