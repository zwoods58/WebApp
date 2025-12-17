'use client'

import { Linkedin, Facebook } from 'lucide-react'

const services = [
  'Website Design',
  'E-commerce',
  'SEO Services',
  'Hosting',
]

const company = [
  'About Us',
  'Portfolio',
  'Pricing',
  'Contact',
  'Blog',
]

export function CTAWithFooter() {
  return (
    <footer 
      className="relative w-full border-t border-white/10 bg-black"
      style={{
        paddingTop: '60px',
        paddingBottom: '40px',
        marginTop: '0',
        zIndex: 10,
        position: 'relative',
        display: 'block',
        visibility: 'visible',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
              {/* Column 1: Brand */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <img 
                    src="/favicom.png" 
                    alt="AtarWebb Logo" 
                    className="w-10 h-10 object-contain"
                    style={{ filter: 'brightness(0) invert(1)' }}
                  />
                  <h3 className="text-2xl font-bold text-white">AtarWebb</h3>
                </div>
                <p className="text-gray-400 mb-6" style={{ fontSize: '14px', lineHeight: '1.6' }}>
                  Affordable websites for growing businesses
                </p>
                <div className="flex gap-4">
                  <a 
                    href="https://www.linkedin.com/company/atarwebb" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a 
                    href="https://www.facebook.com/atarwebb" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a 
                    href="https://www.tiktok.com/@atarwebb" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Column 2: Services */}
              <div>
                <h4 className="font-semibold mb-4 text-white" style={{ fontSize: '16px' }}>Services</h4>
                <ul className="space-y-2">
                  {services.map((service, index) => (
                    <li key={index}>
                      <a 
                        href="#" 
                        className="text-gray-400 hover:text-white hover:underline transition-colors"
                        style={{ fontSize: '14px' }}
                      >
                        {service}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 3: Company */}
              <div>
                <h4 className="font-semibold mb-4 text-white" style={{ fontSize: '16px' }}>Company</h4>
                <ul className="space-y-2">
                  {company.map((item, index) => (
                    <li key={index}>
                      <a 
                        href="#" 
                        className="text-gray-400 hover:text-white hover:underline transition-colors"
                        style={{ fontSize: '14px' }}
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 4: Contact */}
              <div>
                <h4 className="font-semibold mb-4 text-white" style={{ fontSize: '16px' }}>Get In Touch</h4>
                <ul className="space-y-2 text-gray-400" style={{ fontSize: '14px' }}>
                  <li>
                    <a href="mailto:admin@atarwebb.com" className="hover:text-white hover:underline transition-colors">
                      admin@atarwebb.com
                    </a>
                  </li>
                  <li>
                    <a href="https://wa.me/254758557779" target="_blank" rel="noopener noreferrer" className="hover:text-white hover:underline transition-colors">
                      +254 758 557 779 (WhatsApp)
                    </a>
                  </li>
                  <li className="mb-4">Serving SMBs Nationwide</li>
                  <li>
                    <a href="/contact" className="hover:text-white hover:underline transition-colors">
                      Schedule a call →
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Newsletter */}
            <div className="border-t border-white/10 pt-12 mb-12">
              <div className="max-w-md mx-auto text-center">
                <h4 className="font-semibold mb-4 text-white" style={{ fontSize: '18px' }}>
                  Get Website Tips & Updates
                </h4>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2 rounded bg-white/10 text-white border border-white/20 focus:outline-none focus:border-white/40 placeholder-gray-500"
                    style={{ fontSize: '14px' }}
                  />
                  <button
                    className="px-6 py-2 bg-white text-black rounded hover:bg-gray-100 transition-colors font-semibold"
                    style={{ fontSize: '14px' }}
                  >
                    Subscribe
                  </button>
                </div>
                <p className="text-gray-500 mt-2" style={{ fontSize: '12px' }}>
                  No spam, unsubscribe anytime
                </p>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-400" style={{ fontSize: '14px' }}>
              <div>© 2024 AtarWebb. All rights reserved.</div>
              <div className="flex gap-4 mt-4 md:mt-0">
                <a href="#" className="hover:text-white hover:underline transition-colors">Privacy Policy</a>
                <span>•</span>
                <a href="#" className="hover:text-white hover:underline transition-colors">Terms of Service</a>
                <span>•</span>
                <a href="#" className="hover:text-white hover:underline transition-colors">Cookie Policy</a>
              </div>
            </div>
      </div>
    </footer>
  )
}

