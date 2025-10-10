import Link from 'next/link'
import { Mail } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-secondary-900 text-white">
      <div className="container-max section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <p className="text-secondary-300 text-sm leading-relaxed" data-translate="Professional web development services that transform your business ideas into powerful digital solutions.">
              Professional web development services that transform your business ideas into powerful digital solutions.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold" data-translate="Quick Links">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/services" className="text-secondary-300 hover:text-white transition-colors duration-200" data-translate="Services">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="text-secondary-300 hover:text-white transition-colors duration-200" data-translate="Portfolio">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-secondary-300 hover:text-white transition-colors duration-200" data-translate="About Us">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-secondary-300 hover:text-white transition-colors duration-200" data-translate="Contact">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold" data-translate="Services">Services</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-secondary-300" data-translate="Custom Web Apps">Custom Web Apps</span>
              </li>
              <li>
                <span className="text-secondary-300" data-translate="E-commerce Solutions">E-commerce Solutions</span>
              </li>
              <li>
                <span className="text-secondary-300" data-translate="API Development">API Development</span>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold" data-translate="Contact Info">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary-400" />
                <span className="text-secondary-300">admin@atarwebb.com</span>
              </div>
              <div className="text-secondary-300 text-sm" data-translate="Available 7am-5pm CT Monday-Friday">
                Available 7am-5pm CT<br />
                Monday-Friday
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-secondary-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left">
              <p className="text-secondary-400 text-sm" data-translate="© AtarWebb. All rights reserved.">
                © {currentYear} AtarWebb. All rights reserved.
              </p>
              <p className="text-secondary-500 text-xs mt-1" data-translate="Powered By Pinexa">
                Powered By Pinexa
              </p>
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-secondary-400 hover:text-white text-sm transition-colors duration-200" data-translate="Privacy Policy">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-secondary-400 hover:text-white text-sm transition-colors duration-200" data-translate="Terms of Service">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
