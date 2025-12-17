import { Metadata } from 'next'
import { PageHeader } from '../../src/components/sections/PageHeader'
import { CTAWithFooter } from '../../src/components/sections/CTAWithFooter'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Fast Website Design | Urgent Website Setup - Get Online in 48 Hours',
  description: 'Need a website urgently? We offer fast website design and setup services. Get your business online in 48 hours with our rapid deployment service. Professional, mobile-friendly websites.',
  keywords: [
    'fast website design', 'urgent website design', 'business website urgently', 'fast website setup', 'urgent website south africa', 'fast website design durban', 'urgent website design south africa', 'fast website design kenya', 'urgent website kenya', 'fast website design kigali', 'urgent website rwanda', 'fast website for startups africa', 'get website quickly', 'website in 48 hours', 'rapid website deployment'
  ],
  openGraph: {
    title: 'Fast Website Design | Get Online in 48 Hours',
    description: 'Need a website urgently? Get your business online fast with our rapid website deployment service.',
    url: 'https://atarwebb.com/fast-website',
    type: 'website',
  },
}

export default function FastWebsitePage() {
  return (
    <div className="min-h-screen bg-white text-black">
      <PageHeader />
      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-red-50 border-l-4 border-red-600 p-6 mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-red-900">
              Need a Website Urgently? We Can Help!
            </h1>
            <p className="text-xl text-red-800 mb-4">
              Get your business online in 48 hours with our fast website design service.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div>
              <h2 className="text-2xl font-bold mb-4">Fast Website Service</h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-teal-600 mr-2">✓</span>
                  <span>Website ready in 48 hours</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-2">✓</span>
                  <span>Professional, mobile-friendly design</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-2">✓</span>
                  <span>All essential pages included</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-2">✓</span>
                  <span>Contact forms and WhatsApp integration</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-2">✓</span>
                  <span>SEO optimized</span>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Perfect For</h2>
              <ul className="space-y-3 text-gray-700">
                <li>• Businesses with urgent deadlines</li>
                <li>• Events and promotions</li>
                <li>• New business launches</li>
                <li>• Quick online presence needs</li>
                <li>• Temporary campaign websites</li>
                <li>• Startups needing fast deployment</li>
              </ul>
            </div>
          </div>

          <div className="bg-teal-50 border-l-4 border-teal-600 p-6 mb-8">
            <h3 className="text-xl font-bold mb-2">Get Your Website Fast - Contact Us Now!</h3>
            <p className="mb-4">
              Need a website urgently? Contact us immediately and we&apos;ll get your business online in 48 hours.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
            >
              Get Fast Quote →
            </Link>
          </div>

          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold mb-4">Fast Website Design Service</h2>
              <p className="text-gray-700 mb-4">
                Sometimes you need a website fast - whether it&apos;s for a new business launch, an upcoming event, or an urgent marketing campaign. Our fast website design service gets your business online in 48 hours without compromising on quality.
              </p>
              <p className="text-gray-700 mb-4">
                We understand that time is critical, so we&apos;ve streamlined our process to deliver professional, mobile-friendly websites quickly. All our fast websites include essential pages, contact forms, mobile optimization, and SEO basics to get you online and visible immediately.
              </p>
          </div>
        </div>
      </div>
      <CTAWithFooter />
    </div>
  )
}

