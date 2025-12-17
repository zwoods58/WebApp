import { Metadata } from 'next'
import { PageHeader } from '../../../src/components/sections/PageHeader'
import { CTAWithFooter } from '../../../src/components/sections/CTAWithFooter'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Restaurant Website Design | Online Menu & Ordering System',
  description: 'Professional website design for restaurants. Online menus, food ordering, table reservations, and mobile-friendly designs. Get your restaurant online today!',
  keywords: [
    'website for restaurants', 'restaurant website design', 'restaurant online ordering website', 'restaurant website south africa', 'restaurant website durban', 'restaurant website nairobi', 'restaurant website kenya', 'restaurant menu website', 'food delivery website design', 'restaurant website kigali', 'online menu website', 'restaurant booking website'
  ],
  openGraph: {
    title: 'Restaurant Website Design | Online Menu & Ordering',
    description: 'Get a professional website for your restaurant with online menus, food ordering, and table reservations.',
    url: 'https://atarwebb.com/industries/restaurants',
    type: 'website',
  },
}

export default function RestaurantsPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Restaurant Website Design',
    provider: {
      '@type': 'Organization',
      name: 'AtarWebb',
    },
    areaServed: {
      '@type': 'Place',
      name: 'South Africa, Kenya, Rwanda',
    },
    description: 'Professional website design services specifically for restaurants and food service businesses',
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
              Professional Website Design for Restaurants
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              Get a beautiful, professional website that showcases your restaurant&apos;s menu, enables online ordering, and helps customers find and book tables. Perfect for restaurants, cafes, and food delivery businesses.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div>
                <h2 className="text-2xl font-bold mb-4">Perfect for Restaurants</h2>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-teal-600 mr-2">✓</span>
                    <span>Online menu with beautiful food photos</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-teal-600 mr-2">✓</span>
                    <span>Online food ordering system</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-teal-600 mr-2">✓</span>
                    <span>Table reservation system</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-teal-600 mr-2">✓</span>
                    <span>Mobile-friendly for on-the-go ordering</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-teal-600 mr-2">✓</span>
                    <span>Integration with delivery platforms</span>
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">What&apos;s Included</h2>
                <ul className="space-y-3 text-gray-700">
                  <li>• Professional, appetizing design</li>
                  <li>• Online menu with photos</li>
                  <li>• Food ordering system</li>
                  <li>• Table booking/reservation system</li>
                  <li>• Mobile-responsive layout</li>
                  <li>• Social media integration</li>
                  <li>• Location and hours display</li>
                  <li>• SEO optimization</li>
                </ul>
              </div>
            </div>

            <div className="bg-teal-50 border-l-4 border-teal-600 p-6 mb-8">
              <h3 className="text-xl font-bold mb-2">Get Your Restaurant Website Today</h3>
              <p className="mb-4">
                Ready to get your restaurant online? Contact us for a free consultation and custom quote.
              </p>
              <Link
                href="/contact"
                className="inline-block bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
              >
                Get Free Quote →
              </Link>
            </div>

            <div className="prose max-w-none">
              <h2 className="text-2xl font-bold mb-4">Why Restaurants Need Professional Websites</h2>
              <p className="text-gray-700 mb-4">
                A professional website is essential for restaurants in today&apos;s digital world. Your website is where customers discover your menu, place orders, make reservations, and learn about your restaurant. A well-designed restaurant website can significantly increase your online orders and bookings.
              </p>
              <p className="text-gray-700 mb-4">
                Our restaurant websites are designed specifically for the food service industry, with features like online menus, food ordering systems, table reservations, and mobile-friendly designs that make it easy for customers to order and book.
              </p>
            </div>
          </div>
        </div>
        <CTAWithFooter />
      </div>
    </>
  )
}

