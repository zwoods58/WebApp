'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu as MenuIcon } from 'lucide-react'

export function PageHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [headerVisible, setHeaderVisible] = useState(true)
  const [isLightPage, setIsLightPage] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  // Scroll direction detection
  useEffect(() => {
    let lastScrollPosition = window.scrollY
    let ticking = false
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY
          
          // Update header background style
          setIsScrolled(currentScrollY > 100)
          
          // Always show header at the very top (0-50px)
          if (currentScrollY <= 50) {
            setHeaderVisible(true)
          } 
          // Scrolling down - hide header
          else if (currentScrollY > lastScrollPosition) {
            setHeaderVisible(false)
          } 
          // Scrolling up - show header
          else if (currentScrollY < lastScrollPosition) {
            setHeaderVisible(true)
          }
          
          lastScrollPosition = currentScrollY
          ticking = false
        })
        
        ticking = true
      }
    }
    
    // Check if we're on a light background page
    const checkPage = () => {
      const pathname = window.location.pathname
      // Contact, Products, and Partner Program pages have white backgrounds
      const lightPages = ['/contact', '/products', '/partner-program']
      setIsLightPage(lightPages.some(page => pathname.startsWith(page)))
    }
    
    // Check if desktop
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', checkDesktop)
    handleScroll()
    checkPage()
    checkDesktop()
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', checkDesktop)
    }
  }, [])

  const links = [
    { href: '/products', label: 'Products' },
    { href: '/partner-program', label: 'Partner Program' },
    { href: '/contact', label: 'Contact' },
    { href: 'https://app.beezee.co.za', label: 'Launch App', isExternal: true },
  ]

  // Use charcoal grey (#36454F) at the top of homepage for better visibility
  const isHomePage = typeof window !== 'undefined' && window.location.pathname === '/'

  const logoColor = isScrolled 
    ? (isLightPage ? 'text-gray-900 hover:text-gray-700' : (isHomePage ? 'text-white hover:text-gray-200' : 'text-white hover:text-gray-300'))
    : (isHomePage ? 'text-[#36454F] hover:opacity-70' : 'text-gray-900 hover:text-gray-700')
  
  const linkColor = isScrolled 
    ? (isLightPage ? 'text-gray-700 hover:text-gray-900' : (isHomePage ? 'text-white hover:text-gray-200' : 'text-white hover:text-gray-300'))
    : (isHomePage ? 'text-[#36454F] hover:opacity-70' : 'text-gray-900 hover:text-gray-700')
  
  const headerBg = isScrolled 
    ? (isLightPage ? 'bg-white/90 backdrop-blur-md py-3' : (isHomePage ? 'bg-[#B8A9D9]/90 backdrop-blur-md py-3 shadow-lg' : 'bg-black/95 backdrop-blur-sm py-3'))
    : 'bg-transparent py-6'

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-[10000] transition-all duration-500 ease-in-out ${headerBg} ${
          headerVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
        style={{ 
          position: 'fixed',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          padding: '20px 0',
        }}
      >
        {/* Left Section - Logo */}
        <div 
          className="flex-1 text-left px-4 sm:px-6 md:px-10"
        >
          <a 
            href="/"
            className={`text-xl sm:text-2xl font-extrabold transition-colors ${logoColor} flex items-center gap-2 group`}
            style={{ textDecoration: 'none' }}
          >
            <img 
              src="/favicom.png" 
              alt="AtarWebb Logo" 
              className="h-7 w-7 sm:h-8 sm:w-8 object-contain transition-transform group-hover:scale-110"
              style={{ 
                filter: isScrolled 
                  ? (isLightPage ? 'brightness(0)' : (isHomePage ? 'brightness(0) invert(1)' : 'brightness(0) invert(1)'))
                  : (isHomePage ? 'none' : (isLightPage ? 'brightness(0)' : 'brightness(0)'))
              }}
              loading="eager"
            />
            <span className="text-2xl font-extrabold tracking-tight">AtarWebb</span>
          </a>
        </div>

        {/* Center Section - Desktop Navigation (hidden on mobile) */}
        <div 
          className="hidden lg:flex flex-1 justify-center items-center gap-8 xl:gap-12"
        >
          {links.filter(l => !l.isExternal).map(link => (
            <a
              key={link.href}
              href={link.href}
              className={`transition-colors ${linkColor} font-medium`}
              style={{ 
                fontSize: '15px',
                fontWeight: '500',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
              onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right Section - CTA and Menu */}
        <div 
          className="flex-1 text-right px-4 sm:px-6 md:px-10 flex items-center justify-end gap-4"
        >
          <a
            href="https://app.beezee.co.za"
            target="_blank"
            rel="noopener noreferrer"
            className={`hidden lg:inline-block bg-[#3861FB] text-white hover:bg-[#2f52d6] transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 hover:shadow-lg`}
            style={{
              padding: '12px 24px',
              borderRadius: '6px',
              fontWeight: '600',
              fontSize: '16px',
              textDecoration: 'none',
              minWidth: '120px',
              textAlign: 'center',
            }}
          >
            Launch App
          </a>
          {!isDesktop && (
            <button
              aria-label="Open menu"
              className="p-3 transition-colors lg:hidden"
              onClick={() => setMenuOpen(true)}
              style={{
                minWidth: '48px',
                minHeight: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isScrolled 
                  ? (isLightPage ? '#1f2937' : (isHomePage ? '#ffffff' : '#ffffff'))
                  : (isHomePage ? '#36454F' : '#1f2937'),
              }}
            >
              <MenuIcon className="w-6 h-6" />
            </button>
          )}
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-[9998] lg:hidden backdrop-blur-sm"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 w-full sm:w-96 bg-white z-[9999] lg:hidden overflow-y-auto"
            >
              <div className="p-6 min-h-full flex flex-col">
                <button
                  onClick={() => setMenuOpen(false)}
                  className="ml-auto block p-2 text-3xl text-gray-600 hover:text-black transition-colors"
                  aria-label="Close menu"
                >
                  ✕
                </button>
                <nav className="mt-8 flex-1">
                  <ul className="space-y-6">
                    {links.map((link, i) => (
                      <motion.li
                        key={link.href}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0, transition: { delay: i * 0.05 } }}
                      >
                        <a
                          href={link.href}
                          target={link.isExternal ? "_blank" : undefined}
                          rel={link.isExternal ? "noopener noreferrer" : undefined}
                          onClick={() => setMenuOpen(false)}
                          className={`text-2xl sm:text-3xl font-semibold transition-colors block py-2 ${
                            link.isExternal ? 'text-teal-600' : 'text-gray-900 hover:text-teal-600'
                          }`}
                        >
                          {link.label}
                        </a>
                      </motion.li>
                    ))}
                  </ul>
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
