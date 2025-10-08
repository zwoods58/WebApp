'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Code } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      if (currentScrollY < 5) {
        // Always show at the very top (within 5px)
        setIsVisible(true)
      } else if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // Scrolling down and past 50px - hide header
        setIsVisible(false)
      } else if (currentScrollY < lastScrollY && currentScrollY < 20) {
        // Scrolling up and very close to top - show header
        setIsVisible(true)
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMenuOpen && !(event.target as Element).closest('.mobile-menu-container')) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isMenuOpen])

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ]

  useEffect(() => {
    // Initialize currency converter
  }, [])

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 w-full h-16 md:h-20 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 backdrop-blur-md border-b border-slate-700/50 transition-all duration-300 ease-in-out ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          
           {/* Logo */}
           <div className="flex items-center">
             <div className="w-44 h-44 flex items-center justify-center">
               <img 
                 src="/Logo.png" 
                 alt="AtarWebb Logo" 
                 className="w-44 h-44 object-contain"
               />
             </div>
           </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8" role="navigation" aria-label="Main navigation">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="relative text-gray-300 hover:text-blue-400 font-medium text-sm md:text-base transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 rounded-md px-2 py-1 group"
                aria-label={`Navigate to ${item.name}`}
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

                 {/* Desktop CTA Button */}
                 <div className="hidden lg:flex items-center space-x-4">
                   <Link
                     href="/services"
                     className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                     aria-label="Get started with our services"
                   >
                     Get Started
                   </Link>
                 </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-slate-800/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div 
          className={`lg:hidden mobile-menu-container transition-all duration-300 ease-in-out ${
            isMenuOpen 
              ? 'max-h-96 opacity-100 visible' 
              : 'max-h-0 opacity-0 invisible'
          } overflow-hidden`}
        >
          <nav 
            className="bg-slate-800/95 backdrop-blur-md border-t border-slate-700/50 py-4 space-y-2"
            role="navigation"
            aria-label="Mobile navigation"
          >
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-4 py-3 text-gray-300 hover:text-blue-400 hover:bg-slate-700/50 font-medium transition-all duration-200 rounded-lg mx-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800"
                onClick={() => setIsMenuOpen(false)}
                aria-label={`Navigate to ${item.name}`}
              >
                {item.name}
              </Link>
            ))}
            
            <div className="px-4 pt-2">
              <Link
                href="/services"
                className="block w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold px-6 py-3 rounded-lg text-center transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Get started with our services"
              >
                Get Started
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
