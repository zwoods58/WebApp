'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Menu as MenuIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function Hero() {
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  
  const words = ['AFFORDABILITY.', 'QUALITY.', 'FAST.']

  const links = [
    { href: '/products', label: 'Products' },
    { href: '/partner-program', label: 'Partner Program' },
    { href: '/contact', label: 'Contact' },
    { href: 'https://app.beezee.co.za', label: 'Launch App', isExternal: true },
  ]

  // Handle scroll for header - trigger at 100px
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }
    window.addEventListener('scroll', handleScroll)
    handleScroll() // Check initial state
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Check if desktop
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }
    checkDesktop()
    window.addEventListener('resize', checkDesktop)
    return () => window.removeEventListener('resize', checkDesktop)
  }, [])

  // Load video on all devices
  useEffect(() => {
    const loadVideo = () => {
      if (videoRef.current) {
        // Small delay to prioritize critical content
        setTimeout(() => {
          videoRef.current!.src = '/1104.mp4'
          videoRef.current!.load()
          // Attempt to play, handle autoplay restrictions
          const playPromise = videoRef.current!.play()
          if (playPromise !== undefined) {
            playPromise.catch(() => {
              // Autoplay blocked - video will show poster
              console.log('Video autoplay blocked, showing poster')
            })
          }
        }, 300)
      }
    }

    loadVideo()
  }, [])

  // Loop video when it ends
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleEnded = () => {
      video.currentTime = 0
      video.play().catch(() => {})
    }

    video.addEventListener('ended', handleEnded)
    return () => video.removeEventListener('ended', handleEnded)
  }, [])

  // Cycle through words with fade animation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % words.length)
    }, 3000) // 3 seconds per word (2s visible + 1s transition)

    return () => clearInterval(interval)
  }, [words.length])

  return (
    <>
      {/* Fixed Header with Transparent/Solid Background */}
      <header 
        className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-300 ${
          isScrolled 
            ? 'bg-black/95 border-b border-gray-800' 
            : 'bg-transparent border-transparent'
        }`}
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100vw',
          padding: '20px 0',
          zIndex: 9999,
          margin: 0,
        }}
      >
        {/* Left Section - Logo */}
        <div 
          className="flex-1 text-left px-4 sm:px-6 md:px-10"
        >
          <a 
            href="/"
            className={`text-xl sm:text-2xl transition-colors ${
              isScrolled ? 'text-white' : 'text-white'
            } flex items-center gap-2`}
            style={{ fontWeight: '400', textDecoration: 'none', letterSpacing: '0.5px' }}
          >
            <img 
              src="/favicom.png" 
              alt="AtarWebb Logo" 
              className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
              style={{ filter: 'brightness(0) invert(1)' }}
              loading="eager"
            />
            <span className="hidden sm:inline">AtarWebb</span>
          </a>
        </div>

        {/* Center Section - Desktop Navigation (hidden on mobile) */}
        <div 
          className="hidden lg:flex flex-1 justify-center items-center gap-6 xl:gap-10"
        >
          {links.map(link => (
            <a
              key={link.href}
              href={link.href}
              target={link.isExternal ? "_blank" : undefined}
              rel={link.isExternal ? "noopener noreferrer" : undefined}
              className={`transition-colors ${
                link.isExternal 
                  ? 'bg-teal-600 px-4 py-2 rounded-lg text-white hover:bg-teal-700' 
                  : isScrolled 
                    ? 'text-white hover:text-gray-300' 
                    : 'text-white hover:text-gray-200'
              }`}
              style={{ 
                fontSize: '16px',
                fontWeight: link.isExternal ? '600' : '400',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => {
                if (!link.isExternal) e.currentTarget.style.textDecoration = 'underline';
              }}
              onMouseLeave={(e) => {
                if (!link.isExternal) e.currentTarget.style.textDecoration = 'none';
              }}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right Section - Mobile Menu Button */}
        <div 
          className="flex-1 text-right px-4 sm:px-6 md:px-10 flex items-center justify-end gap-4"
        >
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
                color: 'white',
              }}
            >
              <MenuIcon className="w-6 h-6" />
            </button>
          )}
        </div>
      </header>

    <section className="relative" style={{ width: '100vw', maxWidth: '100vw', height: '100vh', minHeight: '100vh', position: 'relative', overflow: 'hidden', margin: 0, padding: 0 }}>
      {/* Background Video */}
      <div className="absolute inset-0 bg-black" style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
        <video
          ref={videoRef}
          className="absolute"
          muted
          playsInline
          loop
          preload="metadata"
          poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'%3E%3Crect width='1' height='1' fill='%23000'/%3E%3C/svg%3E"
          style={{
            objectFit: 'cover',
            objectPosition: 'center center',
            width: '100%',
            height: '100%',
            minWidth: '100%',
            minHeight: '100%',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) scale(1.2)',
            pointerEvents: 'none',
          }}
        />
        {/* Dimming overlay at top for header visibility */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.5) 10%, rgba(0, 0, 0, 0.3) 20%, rgba(0, 0, 0, 0.1) 35%, transparent 50%)',
            zIndex: 1,
            top: 0,
            left: 0,
            right: 0,
            height: '50%',
          }}
        />
        {/* Subtle Portfolio Background */}
        <div 
          className="absolute inset-0 opacity-[0.08] pointer-events-none"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1400&h=900&fit=crop&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            mixBlendMode: 'overlay',
            zIndex: 0,
          }}
        />
      </div>

      {/* Content */}
      <div 
        className="absolute inset-0 z-10 w-full flex flex-col items-center justify-center px-4"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: '-10vh',
          paddingTop: '80px',
          paddingBottom: '40px',
        }}
      >
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="text-white uppercase tracking-tight text-center max-w-4xl mb-8"
          style={{
            fontWeight: 800,
            fontSize: 'clamp(2.5rem, 10vw, 5rem)',
            textShadow: '3px 3px 12px rgba(0,0,0,0.9)',
            lineHeight: '1.1',
            marginBottom: '2rem',
          }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={currentWordIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              className="inline-block"
            >
              {words[currentWordIndex]}
            </motion.span>
          </AnimatePresence>
        </motion.h1>
        
        {/* Get Started Button */}
        <motion.a
          href="/contact"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="bg-teal-600 text-white hover:bg-teal-700 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 hover:shadow-lg"
          style={{
            padding: '14px 32px',
            minHeight: '48px',
            borderRadius: '6px',
            fontWeight: '700',
            fontSize: '16px',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '1.5rem',
          }}
        >
          Get Started
        </motion.a>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-[9998] lg:hidden"
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

      {/* Black gradient fade at bottom of hero */}
      <div
        aria-hidden
        className="absolute bottom-0 left-0 w-full pointer-events-none"
        style={{
          height: '400px',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.1) 15%, rgba(0,0,0,0.3) 30%, rgba(0,0,0,0.5) 45%, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0.85) 75%, rgba(0,0,0,0.95) 85%, rgba(0,0,0,1) 100%)',
          zIndex: 4,
        }}
      />
    </section>
    </>
  )
}
