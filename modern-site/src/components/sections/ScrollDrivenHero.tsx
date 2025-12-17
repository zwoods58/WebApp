'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { User, LogOut, LayoutDashboard, Menu as MenuIcon, X, CheckCircle, Camera, Wifi, Fingerprint, Bell, Palette, Code2, Smartphone, Rocket, Search, Settings, Home, ShoppingBag, Heart, MessageCircle, TrendingUp, Zap, Globe, ChevronDown } from 'lucide-react'
import { gsap } from 'gsap'
import { TextPlugin } from 'gsap/TextPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, TextPlugin)
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

const links = [
  { href: '/products', label: 'Products' },
  { href: '/partner-program', label: 'Partner Program' },
  { href: '/contact', label: 'Contact' },
]

export function ScrollDrivenHero() {
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)
  const [headerVisible, setHeaderVisible] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  
  // Animation refs
  const heroRef = useRef<HTMLDivElement>(null)
  
  // Message refs - positioned around screen
  const message1Ref = useRef<HTMLDivElement>(null) // Top-left
  const message2Ref = useRef<HTMLDivElement>(null) // Top-right
  const message3Ref = useRef<HTMLDivElement>(null) // Bottom-left
  const message4Ref = useRef<HTMLDivElement>(null) // Bottom-right
  const message5Ref = useRef<HTMLDivElement>(null) // Center
  
  // Device refs
  const desktopBrowserRef = useRef<HTMLDivElement>(null)
  const mobileDeviceRef = useRef<HTMLDivElement>(null)
  const finalCTARef = useRef<HTMLDivElement>(null)
  
  // Interaction refs
  const cursorRef = useRef<HTMLDivElement>(null)
  const mobileCursorRef = useRef<HTMLDivElement>(null)
  
  // Scroll indicator
  const scrollIndicatorRef = useRef<HTMLDivElement>(null)
  const topHeaderRef = useRef<HTMLElement>(null)
  const progressDotsRef = useRef<(HTMLDivElement | null)[]>([])
  const backgroundOverlayRef = useRef<HTMLDivElement>(null)

  // Auto-hide header based on scroll direction
  useEffect(() => {
    let lastScrollPosition = window.scrollY
    let ticking = false
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY
          
          // Update header background style
          setIsScrolled(currentScrollY > 50)
          
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

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Auth
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Click outside to close menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUserMenuOpen(false)
    router.push('/')
  }

  // Main scroll animation - 6 frames
  useEffect(() => {
    if (typeof window === 'undefined' || !heroRef.current) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: '+=15000',
          scrub: 0.5,
          pin: true,
          anticipatePin: 1,
          fastScrollEnd: true,
          preventOverlaps: true,
        },
      })

      // Helper function to update progress dots
      const updateProgressDot = (index: number) => {
        progressDotsRef.current?.forEach((dot, i) => {
          if (dot) {
            gsap.to(dot, {
              backgroundColor: i === index ? '#3498DB' : 'rgba(52, 152, 219, 0.2)',
              scale: i === index ? 1.5 : 1,
              boxShadow: i === index ? '0 0 12px rgba(52, 152, 219, 0.6)' : 'none',
              duration: 0.3,
            })
          }
        })
      }

      // FRAME 1: Initial Load (0-2.5s) - Desktop browser centered
      tl.call(() => updateProgressDot(0), undefined, 0)
        // Start with browser small, then expand (Boot up effect)
        .fromTo(desktopBrowserRef.current, 
          { scale: 0.8, opacity: 1, y: 50 }, 
          { scale: 1, opacity: 1, y: -50, duration: 1.2, ease: "power3.out" }, 
          0
        )
        
        .to(topHeaderRef.current, { opacity: 0, duration: 1, ease: "power2.out" }, 0.5)
        .to(scrollIndicatorRef.current, { opacity: 1, duration: 0.6, ease: "power1.out" }, 0.5)
        .to(scrollIndicatorRef.current, { opacity: 0, duration: 0.6, ease: "power1.in" }, 2)

      // FRAME 2: "Your Digital Partner" (3-9s) - Slower, more visible
      tl.call(() => updateProgressDot(1), undefined, 3)
        .to(message1Ref.current, { opacity: 1, duration: 0.3 }, 3) // Show container
        // Start typing text - Slower typing (2.5s for 20 chars = ~8 chars/sec)
        .to(message1Ref.current?.querySelector('.typewriter-text') || message1Ref.current, { text: { value: "Your Digital Partner", delimiter: "" }, duration: 2.5, ease: "none" }, 3.2)
        
        // Pause to read (1.5s)
        // Backspace text - Slower backspace
        .to(message1Ref.current?.querySelector('.typewriter-text') || message1Ref.current, { text: { value: "", delimiter: "" }, duration: 1.8, ease: "none" }, 7.2)
        .to(message1Ref.current, { opacity: 0, duration: 0.3 }, 9)

      // FRAME 2.5: Desktop Interactions (9-12s) - Happens AFTER Message 1
      // Enhanced cursor with smoother trail
      .to(cursorRef.current, { opacity: 1, x: 0, y: 0, duration: 0.8, ease: "circ.inOut" }, 9.2)
      .to(cursorRef.current, { scale: 0.9, duration: 0.15, ease: "power2.in" }, 10.2)
      .to(cursorRef.current, { scale: 1, duration: 0.15, ease: "power2.out" }, 10.35)
      // Desktop scrolls with smoother easing - Show all sections including footer (slower, more visible)
      .to(desktopBrowserRef.current, { scale: 1.05, duration: 1, ease: "power2.out" }, 10.5)
      .to(desktopBrowserRef.current?.querySelector('.desktop-content') || desktopBrowserRef.current, { y: -2300, duration: 5.5, ease: "power2.inOut" }, 10.5)
      .to(cursorRef.current, { opacity: 0, duration: 0.4, ease: "power1.in" }, 12.2)

      // FRAME 3: Desktop fades, Mobile transition begins (18.5-23s)
      tl.call(() => updateProgressDot(2), undefined, 18.5)
        // Desktop moves left with smoother easing (reduced blur for performance)
        .to(desktopBrowserRef.current, { x: -380, scale: 0.85, opacity: 0.4, duration: 1.5, ease: "power3.inOut" }, 18.5)
        // Mobile slides in with anticipation
        .to(mobileDeviceRef.current, { opacity: 1, x: 320, rotation: 3, duration: 1.25, ease: "power2.out" }, 18.6)
        .to(mobileDeviceRef.current, { rotation: 0, x: 300, duration: 0.5, ease: "back.out(1.5)" }, 19.8)
        
        // "Adapting to Your Needs" starts when transition begins
        .to(message2Ref.current, { opacity: 1, duration: 0.3 }, 19.5)
        .to(message2Ref.current?.querySelector('.typewriter-text') || message2Ref.current, { text: { value: "Adapting to Your Needs", delimiter: "" }, duration: 2.5, ease: "none" }, 19.8)
        
        .to(desktopBrowserRef.current, { opacity: 0, duration: 0.8, ease: "power2.in" }, 21)
        .to(mobileDeviceRef.current, { x: 80, scale: 1, duration: 1, ease: "power2.out" }, 21.5)
        
        // Backspace "Adapting to Your Needs"
        .to(message2Ref.current?.querySelector('.typewriter-text') || message2Ref.current, { text: { value: "", delimiter: "" }, duration: 1.8, ease: "none" }, 23.5)
        .to(message2Ref.current, { opacity: 0, duration: 0.3 }, 25.3)

      // FRAME 4: Mobile Center & Scroll Start (25.5-31s)
      tl.call(() => updateProgressDot(3), undefined, 25.5)
        // Mobile slides to CENTER with anticipation
        .to(mobileDeviceRef.current, { x: -10, scale: 1.06, duration: 0.6, ease: "power2.in" }, 25.5)
        .to(mobileDeviceRef.current, { x: 0, scale: 1.05, duration: 0.6, ease: "back.out(1.2)" }, 26.1)
        // Mobile ripple effect
        .to(mobileCursorRef.current, { opacity: 1, duration: 0.4, ease: "power1.out" }, 26.7)
        .to(mobileCursorRef.current, { scale: 0.8, duration: 0.12, ease: "power2.in" }, 27.3)
        .to(mobileCursorRef.current, { scale: 1, duration: 0.12, ease: "power2.out" }, 27.42)
        // Mobile scrolls with smooth easing (starts at 27.6s, duration 4.5s, ends at 32.1s)
        .to(mobileDeviceRef.current?.querySelector('.mobile-content') || mobileDeviceRef.current, { y: -1600, duration: 4.5, ease: "power2.inOut" }, 27.6)
        .to(mobileCursorRef.current, { opacity: 0, duration: 0.4, ease: "power1.in" }, 30.9)
        
        // "Designed with Purpose" appears on LEFT when mobile scroll is halfway (27.6 + 2.25 = 29.85s)
        .to(message3Ref.current, { opacity: 1, duration: 0.3 }, 29.85)
        .to(message3Ref.current?.querySelector('.typewriter-text') || message3Ref.current, { text: { value: "Designed with Purpose", delimiter: "" }, duration: 2.5, ease: "none" }, 30.15)
        
        // Backspace "Designed with Purpose"
        .to(message3Ref.current?.querySelector('.typewriter-text') || message3Ref.current, { text: { value: "", delimiter: "" }, duration: 1.8, ease: "none" }, 33.65)
        .to(message3Ref.current, { opacity: 0, duration: 0.3 }, 35.45)
        
        // Phone starts fading out
        .to(mobileDeviceRef.current, { opacity: 0, scale: 0.92, duration: 1.5, ease: "power2.in" }, 35.5)
        
        // "Crafted with Excellence" appears AFTER phone is completely gone (37s)
        .call(() => updateProgressDot(4), undefined, 37)
        .to(message4Ref.current, { opacity: 1, duration: 0.4 }, 37)
        .to(message4Ref.current?.querySelector('.typewriter-text') || message4Ref.current, { text: { value: "Crafted with Excellence", delimiter: "" }, duration: 2.5, ease: "none" }, 37.3)
        
        // Background smoothly transitions from purple gradient to dark purple/black
        .to(backgroundOverlayRef.current, { 
          opacity: 1,
          duration: 6, 
          ease: "power1.inOut" 
        }, 37.3)
        
        // Text color transitions from charcoal grey to light grey as background darkens
        .to(message4Ref.current?.querySelector('h2') || message4Ref.current, { 
          color: '#E5E7EB',
          duration: 6, 
          ease: "power1.inOut" 
        }, 37.3)
        
        // Backspace "Crafted with Excellence" and fade out
        .to(message4Ref.current?.querySelector('.typewriter-text') || message4Ref.current, { text: { value: "", delimiter: "" }, duration: 1.8, ease: "none" }, 40.8)
        .to(message4Ref.current, { opacity: 0, duration: 0.8, ease: "power2.in" }, 42.6)

      // FRAME 7: "Welcome to AtarWebb" Final (43.5s) - Smooth scroll-triggered reveal
      tl.call(() => updateProgressDot(5), undefined, 43.5)
        .to(finalCTARef.current, { opacity: 1, scale: 1, duration: 2.5, ease: "power3.out" }, 43.5)

    }, heroRef)

    return () => ctx.revert()
  }, [])

  return (
    <>
      {/* CSS Animations for Text Effects & Interactions */}
      <style jsx>{`
        @keyframes gradientShift {
          0%, 100% {
            background-position: 0% center;
          }
          50% {
            background-position: 100% center;
          }
        }
        
        @keyframes glowPulse {
          0%, 100% {
            filter: drop-shadow(0 4px 20px rgba(59, 130, 246, 0.3));
          }
          50% {
            filter: drop-shadow(0 4px 30px rgba(59, 130, 246, 0.5));
          }
        }
        
        @keyframes cursorClickRing {
          0% {
            transform: scale(0.5);
            opacity: 1;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        
        @keyframes buttonGlow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(231, 76, 60, 0.4);
          }
          50% {
            box-shadow: 0 0 40px rgba(231, 76, 60, 0.8);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.15;
          }
          50% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.3;
          }
        }
        
        .gradient-text-animate {
          animation: gradientShift 4s ease infinite;
        }
        
        .cursor-click-ring {
          animation: cursorClickRing 0.6s ease-out;
        }
      `}</style>
      
      {/* Header removed - using global PageHeader instead */}
      <header
        ref={topHeaderRef}
        className="hidden"
        style={{ display: 'none' }}
      >
        <nav className="w-full px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            {/* Left Side: Logo */}
            <div className="flex items-center flex-1">
              <a href="/" className="flex items-center gap-2 group">
                <img 
                  src="/favicom.png" 
                  alt="AtarWebb" 
                  className="h-7 w-7 object-contain transition-transform group-hover:scale-105"
                  style={{ filter: isScrolled ? 'none' : 'brightness(0) saturate(100%)' }} 
                />
                <span className={`font-extrabold text-2xl tracking-tight transition-colors ${isScrolled ? 'text-black' : 'text-[#36454F]'}`}>
                  AtarWebb
                </span>
              </a>
            </div>

            {/* Center: Nav Links */}
            <div className="hidden lg:flex items-center gap-8 justify-center flex-1">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`text-[15px] font-medium transition-colors hover:opacity-70 ${isScrolled ? 'text-black' : 'text-[#36454F]'}`}
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Right Side: Actions */}
            <div className="hidden md:flex items-center gap-4 flex-1 justify-end">
              <button className={`transition-colors hover:opacity-70 ${isScrolled ? 'text-black' : 'text-[#36454F]'}`}>
                <Globe size={20} strokeWidth={1.5} />
              </button>
              
              <div className={`h-4 w-[1px] ${isScrolled ? 'bg-gray-300' : 'bg-[#36454F]/30'}`}></div>

              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className={`flex items-center gap-2 text-[15px] font-medium transition-colors hover:opacity-70 ${isScrolled ? 'text-black' : 'text-[#36454F]'}`}
                  >
                    <User size={20} />
                    <span>Account</span>
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl py-2 border border-gray-100 animate-in fade-in slide-in-from-top-2">
                      <a
                        href="/ai-builder/dashboard"
                        className="flex items-center px-4 py-2.5 text-gray-700 hover:bg-gray-50 text-sm font-medium"
                      >
                        <LayoutDashboard size={16} className="mr-2.5" />
                        Dashboard
                      </a>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2.5 text-red-600 hover:bg-red-50 text-sm font-medium"
                      >
                        <LogOut size={16} className="mr-2.5" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <a
                    href="/ai-builder/login"
                    className={`text-[15px] font-medium transition-colors hover:opacity-70 ${isScrolled ? 'text-black' : 'text-[#36454F]'}`}
                  >
                    Log In
                  </a>
                  <a
                    href="/ai-builder"
                    className="px-6 py-1.5 bg-[#3861FB] text-white rounded-full text-[15px] font-medium transition-all hover:bg-[#2f52d6] hover:shadow-lg shadow-blue-500/20"
                  >
                    Get Started
                  </a>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`md:hidden transition-colors ${isScrolled ? 'text-black' : 'text-[#36454F]'}`}
            >
              {menuOpen ? <X size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-md">
            <div className="px-4 py-6 space-y-4">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block text-white/80 hover:text-white transition-colors py-2"
                >
                  {link.label}
                </a>
              ))}
              {user ? (
                <>
                  <a
                    href="/ai-builder/dashboard"
                    className="block text-white/80 hover:text-white transition-colors py-2"
                  >
                    Dashboard
                  </a>
                  <button
                    onClick={handleLogout}
                    className="block text-white/80 hover:text-white transition-colors py-2 text-left w-full"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <a
                  href="/ai-builder/login"
                  className="block px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors font-medium text-center"
                >
                  Login
                </a>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Hero Assembly - 6 Frames */}
      <div
        ref={heroRef}
        className="relative w-full h-screen overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #FFFFFF 0%, #F5F5F5 15%, #E8E4F3 35%, #DCD0FF 65%, #D0C4F0 85%, #C4B8E0 100%)',
          paddingTop: '80px',
        }}
      >
        {/* Background Overlay - Smooth transition from purple to dark purple to black */}
        <div
          ref={backgroundOverlayRef}
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(45, 27, 78, 0.3) 0%, rgba(45, 27, 78, 0.5) 15%, rgba(31, 22, 53, 0.65) 30%, rgba(21, 17, 33, 0.8) 45%, rgba(13, 13, 13, 0.9) 60%, rgba(5, 5, 5, 0.95) 75%, rgba(0, 0, 0, 1) 100%)',
            opacity: 0,
            zIndex: 5,
          }}
        />
        {/* Messages positioned around screen - Standardized Professional Style */}
        
        {/* Message 1: "Your Digital Partner" - CENTERED BOTTOM */}
        <div
          ref={message1Ref}
          className="absolute bottom-[15%] left-1/2 -translate-x-1/2 opacity-0 pointer-events-none z-40 text-center w-full px-4"
          style={{ transform: 'translate(-50%, 0) translate3d(0, 0, 0)', willChange: 'transform, opacity', backfaceVisibility: 'hidden' }}
        >
          <h2
            className="font-bold leading-tight tracking-tight"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '64px',
              color: '#36454F',
              textShadow: '0 10px 30px rgba(0,0,0,0.2)',
              letterSpacing: '-0.04em'
            }}
          >
            <span className="typewriter-text"></span>
          </h2>
        </div>

        {/* Message 2: "Adapting to Your Needs" - LEFT MIDDLE */}
        <div
          ref={message2Ref}
          className="absolute top-1/2 left-[4%] -translate-y-1/2 opacity-0 pointer-events-none z-40 text-left w-auto px-4"
          style={{ transform: 'translateY(-50%) translate3d(0, 0, 0)', willChange: 'transform, opacity', backfaceVisibility: 'hidden' }}
        >
          <h2
            className="font-bold leading-tight tracking-tight"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '64px',
              color: '#36454F',
              textShadow: '0 10px 30px rgba(0,0,0,0.25)',
              letterSpacing: '-0.04em'
            }}
          >
            <span className="typewriter-text"></span>
          </h2>
        </div>

        {/* Message 3: "Designed with Purpose" - LEFT MIDDLE */}
        <div
          ref={message3Ref}
          className="absolute top-1/2 left-[4%] -translate-y-1/2 opacity-0 pointer-events-none z-40 text-left w-auto px-4"
          style={{ transform: 'translateY(-50%) translate3d(0, 0, 0)', willChange: 'transform, opacity', backfaceVisibility: 'hidden' }}
        >
          <h2
            className="font-bold leading-tight tracking-tight"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '64px',
              color: '#36454F',
              textShadow: '0 10px 30px rgba(0,0,0,0.25)',
              letterSpacing: '-0.04em'
            }}
          >
            <span className="typewriter-text"></span>
          </h2>
        </div>

        {/* Message 4: "Crafted with Excellence" - CENTERED MIDDLE */}
        <div
          ref={message4Ref}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 pointer-events-none text-center w-full px-4"
          style={{ transform: 'translate(-50%, -50%) translate3d(0, 0, 0)', willChange: 'transform, opacity', backfaceVisibility: 'hidden', zIndex: 50 }}
        >
          <h2
            className="font-bold leading-tight tracking-tight relative z-10"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '64px',
              color: '#36454F',
              textShadow: '0 10px 30px rgba(0,0,0,0.5), 0 4px 12px rgba(0,0,0,0.3)',
              letterSpacing: '-0.04em'
            }}
          >
            <span className="typewriter-text"></span>
          </h2>
        </div>

        {/* Message 5: "Welcome to AtarWebb" - Hidden during animation, shows in Frame 6 */}
        <div
          ref={message5Ref}
          className="hidden"
        >
        </div>

        {/* Floating Particles - Micro-interactions */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full animate-pulse"
              style={{
                left: `${10 + i * 12}%`,
                top: `${20 + (i % 3) * 25}%`,
                backgroundColor: i % 2 === 0 ? '#3498DB' : '#E74C3C',
                opacity: 0.15,
                animation: `float ${4 + i * 0.5}s ease-in-out infinite`,
                animationDelay: `${i * 0.3}s`,
              }}
            ></div>
          ))}
        </div>

        {/* Scroll Progress Indicator */}
        <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col space-y-3">
          {[0, 1, 2, 3, 4, 5].map((dotIndex) => (
            <div
              key={dotIndex}
              ref={(el) => {
                if (progressDotsRef.current) {
                  progressDotsRef.current[dotIndex] = el
                }
              }}
              className="w-2 h-2 rounded-full transition-all duration-300 cursor-pointer hover:scale-150"
              style={{
                backgroundColor: 'rgba(52, 152, 219, 0.2)',
              }}
              title={`Frame ${dotIndex + 1}`}
            ></div>
          ))}
        </div>

        {/* Scroll Indicator */}
        <div
          ref={scrollIndicatorRef}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-0 z-30 flex flex-col items-center"
        >
          <p className="text-sm mb-2 tracking-wider" style={{ color: '#2C3E50', opacity: 0.6 }}>scroll to build</p>
          <div className="w-6 h-10 border-2 rounded-full flex items-start justify-center p-1" style={{ borderColor: '#3498DB' }}>
            <div className="w-1.5 h-3 rounded-full animate-bounce" style={{ backgroundColor: '#3498DB' }}></div>
          </div>
        </div>

        {/* Desktop Cursor with Trail */}
        <div
          ref={cursorRef}
          className="absolute opacity-0 pointer-events-none z-50"
          style={{ width: '24px', height: '24px', top: '50%', left: '50%' }}
        >
          {/* Cursor Trail Effect */}
          <div className="absolute inset-0" style={{
            background: 'radial-gradient(circle, rgba(52, 152, 219, 0.4) 0%, transparent 70%)',
            filter: 'blur(8px)',
            transform: 'scale(2)',
          }}></div>
          
          {/* Main Cursor */}
          <svg viewBox="0 0 24 24" fill="white" className="relative z-10" style={{ filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3))' }}>
            <path d="M5 3L19 12L12 13L9 21L5 3Z" />
          </svg>
          
          {/* Click Ring Animation */}
          <div className="absolute inset-0 rounded-full border-2 border-blue-400 opacity-0 cursor-click-ring" style={{ transform: 'scale(0.5)' }}></div>
        </div>

        {/* Mobile Cursor (Finger Tap) with Ripple */}
        <div
          ref={mobileCursorRef}
          className="absolute opacity-0 pointer-events-none z-50"
          style={{ width: '40px', height: '40px', top: '50%', left: '50%' }}
        >
          {/* Ripple Effect */}
          <div className="absolute inset-0 rounded-full border-2 border-white animate-ping" style={{ animationDuration: '1s' }}></div>
          
          {/* Main Touch Point */}
          <div className="w-10 h-10 bg-white/30 rounded-full border-2 border-white relative z-10" style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)' }}></div>
        </div>

        {/* FRAME 1-3: Desktop Browser */}
        <div
          ref={desktopBrowserRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
          style={{ willChange: 'transform, opacity, filter', backfaceVisibility: 'hidden', transform: 'translate(-50%, -50%) translate3d(0, 0, 0)' }}
        >
          <div className="bg-gray-900 rounded-xl w-[1000px] max-w-[90vw] overflow-hidden border border-gray-700" style={{ boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), 0 0 1px rgba(0, 0, 0, 0.1), 0 40px 80px rgba(0, 0, 0, 0.2)' }}>
            {/* Browser Chrome - macOS style */}
            <div className="bg-gray-800 px-4 py-3 flex items-center space-x-3">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-600 cursor-pointer"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-600 cursor-pointer"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-600 cursor-pointer"></div>
              </div>
              <div className="flex-1 mx-4 bg-gray-700 rounded-md h-7 flex items-center px-3 text-gray-300 text-sm">
                <span className="mr-2">🔒</span> atarwebb.com
              </div>
            </div>
            
            {/* Browser Content - Scrollable */}
            <div className="relative h-[550px] overflow-hidden bg-white">
              <div className="desktop-content absolute inset-0" style={{ height: '2750px' }}>
                
                {/* Section 1: Hero Landing - Glass Morphism Premium Design */}
                <div
                  className="relative h-[550px] flex flex-col items-center justify-center px-8"
                  style={{
                    background: 'radial-gradient(ellipse at center, #F8F5FF 0%, #EDE5FF 35%, #E8E0FF 70%, #DCD0FF 100%)',
                    backgroundAttachment: 'fixed',
                  }}
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%233498DB\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
                  
                  {/* Navigation Bar - Glass Effect with Professional UI */}
                  <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-8 py-4 backdrop-blur-md border-b" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderColor: 'rgba(52, 152, 219, 0.1)', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)' }}>
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-xl backdrop-blur-sm flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #3498DB 0%, #2980B9 100%)', boxShadow: '0 4px 12px rgba(52, 152, 219, 0.3)' }}>
                        <span className="font-bold text-white text-sm">A</span>
                      </div>
                      <span className="font-bold text-xl tracking-tight" style={{ color: '#2C3E50' }}>AtarWebb</span>
                    </div>
                    <div className="hidden md:flex items-center space-x-8 text-sm">
                      <a href="#" className="transition font-semibold hover:opacity-100" style={{ color: '#2C3E50', opacity: 0.7 }}>Products</a>
                      <a href="#" className="transition font-semibold hover:opacity-100" style={{ color: '#2C3E50', opacity: 0.7 }}>AI Builder</a>
                      <a href="#" className="transition font-semibold hover:opacity-100" style={{ color: '#2C3E50', opacity: 0.7 }}>Contact</a>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button className="w-9 h-9 rounded-full backdrop-blur-sm flex items-center justify-center hover:scale-105 transition-transform" style={{ backgroundColor: 'rgba(52, 152, 219, 0.1)' }}>
                        <Search size={18} style={{ color: '#3498DB' }} />
                      </button>
                      <button className="w-9 h-9 rounded-full backdrop-blur-sm flex items-center justify-center hover:scale-105 transition-transform relative" style={{ backgroundColor: 'rgba(52, 152, 219, 0.1)' }}>
                        <Bell size={18} style={{ color: '#3498DB' }} />
                        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ backgroundColor: '#E74C3C' }}>3</div>
                      </button>
                      <div className="w-9 h-9 rounded-full" style={{ background: 'linear-gradient(135deg, #3498DB 0%, #2980B9 100%)' }}></div>
                    </div>
                  </div>

                  {/* Hero Content - Glass Card */}
                  <div className="relative z-10 backdrop-blur-xl rounded-3xl p-8 md:p-12 max-w-3xl mx-auto border" style={{ backgroundColor: 'rgba(255, 255, 255, 0.75)', borderColor: 'rgba(52, 152, 219, 0.25)', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1), 0 20px 50px rgba(0, 0, 0, 0.08), 0 30px 70px rgba(0, 0, 0, 0.05)' }}>
                    <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: 'rgba(52, 152, 219, 0.1)', border: '1px solid rgba(52, 152, 219, 0.2)' }}>
                      <TrendingUp size={16} style={{ color: '#3498DB' }} />
                      <span className="text-sm font-semibold" style={{ color: '#3498DB' }}>Industry Leading</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight" style={{ fontFamily: 'Playfair Display, serif', color: '#2C3E50' }}>
                      Welcome to the Future
                    </h1>
                    <p className="text-lg md:text-xl mb-8 leading-relaxed" style={{ color: '#2C3E50', opacity: 0.8 }}>Building amazing experiences for ambitious brands</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button className="group px-8 py-4 text-white rounded-xl font-bold transition-all flex items-center justify-center space-x-2" style={{ backgroundColor: '#E74C3C', boxShadow: '0 4px 12px rgba(231, 76, 60, 0.3), 0 8px 24px rgba(231, 76, 60, 0.2)' }}>
                        <span>Get Started</span>
                        <Rocket size={18} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                      <button className="px-8 py-4 bg-transparent border-2 rounded-xl font-bold transition-all hover:bg-white/50" style={{ borderColor: '#3498DB', color: '#3498DB', boxShadow: '0 4px 12px rgba(52, 152, 219, 0.15)' }}>
                        Learn More
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Section 2: Features/Services */}
                <div className="h-[550px] flex flex-col items-center justify-center px-12 py-16" style={{ background: 'linear-gradient(135deg, #F8F5FF 0%, #F0E8FF 50%, #E8DFF8 100%)' }}>
                  <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center" style={{ fontFamily: 'Playfair Display, serif', color: '#2C3E50' }}>
                    What We Do
                  </h2>
                  <p className="text-center mb-12 max-w-2xl" style={{ color: '#2C3E50', opacity: 0.7 }}>
                    Comprehensive digital solutions tailored to your business needs
                  </p>
                  <div className="grid grid-cols-4 gap-6 max-w-6xl">
                    {[
                      { Icon: Palette, title: 'Web Design', desc: 'Beautiful, modern interfaces that convert' },
                      { Icon: Code2, title: 'Development', desc: 'Fast, scalable, production-ready code' },
                      { Icon: Smartphone, title: 'Mobile Apps', desc: 'Native iOS & Android applications' },
                      { Icon: Rocket, title: 'Deployment', desc: 'Launch to production in minutes' },
                    ].map((item, i) => (
                      <div key={i} className="p-6 rounded-2xl transition-all hover:-translate-y-1 border backdrop-blur-sm" style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', borderColor: 'rgba(52, 152, 219, 0.15)', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05), 0 10px 15px rgba(0, 0, 0, 0.08), 0 20px 25px rgba(0, 0, 0, 0.05)' }}>
                        <div className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center" style={{ backgroundColor: '#3498DB' }}>
                          <item.Icon size={24} className="text-white" />
                        </div>
                        <h3 className="text-lg font-bold mb-2" style={{ color: '#2C3E50' }}>{item.title}</h3>
                        <p className="text-sm leading-relaxed" style={{ color: '#2C3E50', opacity: 0.7 }}>{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 3: Stats Section */}
                <div 
                  className="h-[550px] flex flex-col items-center justify-center px-12 py-16 relative"
                  style={{
                    backgroundColor: '#3498DB',
                  }}
                >
                  <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
                  <div className="relative z-10 text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                      Trusted by Businesses Worldwide
                    </h2>
                    <p className="text-white text-lg" style={{ opacity: 0.9 }}>Real results that drive growth</p>
                  </div>
                  <div className="grid grid-cols-4 gap-8 max-w-5xl relative z-10">
                    {[
                      { Icon: TrendingUp, number: '500+', label: 'Projects Delivered' },
                      { Icon: Heart, number: '98%', label: 'Client Satisfaction' },
                      { Icon: MessageCircle, number: '50+', label: 'Countries Served' },
                      { Icon: Zap, number: '24/7', label: 'Support Available' },
                    ].map((stat, i) => (
                      <div key={i} className="backdrop-blur-xl rounded-2xl p-8 border text-center hover:-translate-y-1 transition-all" style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', borderColor: 'rgba(255, 255, 255, 0.3)', boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1), 0 16px 32px rgba(0, 0, 0, 0.08)' }}>
                        <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
                          <stat.Icon size={24} className="text-white" />
                        </div>
                        <div className="text-5xl font-bold text-white mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                          {stat.number}
                        </div>
                        <div className="text-white font-medium" style={{ opacity: 0.95 }}>{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Section 4: Industry Expertise */}
                <div className="h-[550px] flex flex-col items-center justify-center px-12 py-16" style={{ background: 'linear-gradient(135deg, #E0D8F0 0%, #D8CFF0 50%, #D0C4F0 100%)' }}>
                  <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center" style={{ fontFamily: 'Playfair Display, serif', color: '#2C3E50' }}>
                    Industries We Serve
                  </h2>
                  <p className="text-center mb-12 max-w-2xl" style={{ color: '#2C3E50', opacity: 0.7 }}>
                    Specialized solutions tailored to your industry's unique needs
                  </p>
                  <div className="grid grid-cols-3 gap-8 max-w-6xl">
                    {[
                      { title: 'E-Commerce & Retail', desc: 'From online stores to luxury boutiques, we build high-converting shopping experiences with secure payments and inventory management.' },
                      { title: 'Healthcare & Medical', desc: 'HIPAA-compliant patient portals, appointment booking, and telehealth solutions for clinics, hospitals, and private practices.' },
                      { title: 'Restaurants & Hospitality', desc: 'Online ordering, reservation systems, and menu showcases that bring your culinary vision to life and drive more bookings.' },
                      { title: 'Real Estate & Property', desc: 'Interactive property listings, virtual tours, and lead capture systems that help you close deals faster and grow your portfolio.' },
                      { title: 'Professional Services', desc: 'Elegant websites for lawyers, accountants, consultants, and agencies that establish credibility and attract premium clients.' },
                      { title: 'Fitness & Wellness', desc: 'Class booking, membership management, and trainer profiles for gyms, yoga studios, spas, and wellness centers.' },
                    ].map((item, i) => (
                      <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 transition-all hover:-translate-y-1" style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08), 0 8px 24px rgba(0, 0, 0, 0.06)', border: '1px solid rgba(52, 152, 219, 0.1)' }}>
                        <h3 className="text-xl font-bold mb-3" style={{ color: '#2C3E50' }}>{item.title}</h3>
                        <p className="text-sm leading-relaxed" style={{ color: '#2C3E50', opacity: 0.8 }}>{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 5: Testimonial */}
                <div className="h-[550px] flex flex-col items-center justify-center px-12 py-16" style={{ background: 'linear-gradient(135deg, #D8CFF0 0%, #D0C4F0 50%, #C8B8E8 100%)' }}>
                  <div className="max-w-4xl mx-auto text-center">
                    <div className="text-6xl mb-6" style={{ color: '#3498DB' }}>"</div>
                    <blockquote className="text-3xl font-light mb-8 leading-relaxed" style={{ fontFamily: 'Playfair Display, serif', color: '#2C3E50' }}>
                      AtarWebb transformed our online presence completely. The attention to detail and commitment to excellence is unmatched.
                    </blockquote>
                    <div className="flex items-center justify-center space-x-4">
                      <div className="relative">
                        <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80" alt="Sarah Johnson" className="w-16 h-16 rounded-full object-cover border-4" style={{ borderColor: '#3498DB', boxShadow: '0 4px 12px rgba(52, 152, 219, 0.3)' }} />
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center" style={{ backgroundColor: '#4CAF50' }}>
                          <CheckCircle size={12} className="text-white" />
                        </div>
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-lg flex items-center space-x-2" style={{ color: '#2C3E50' }}>
                          <span>Sarah Johnson</span>
                          <CheckCircle size={16} style={{ color: '#3498DB' }} />
                        </div>
                        <div className="font-medium" style={{ color: '#2C3E50', opacity: 0.6 }}>CEO, TechVentures Inc.</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center space-x-1 mt-6">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className="text-2xl" style={{ color: '#E74C3C' }}>★</span>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Section 6: Footer/CTA */}
                <div className="h-[550px] flex flex-col items-center justify-center px-12 relative overflow-hidden" style={{ backgroundColor: '#F8F9FA', background: 'linear-gradient(135deg, #FFFFFF 0%, #F5F5F5 50%, #E8E4F3 100%)' }}>
                  <div className="absolute inset-0 opacity-3" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%233498DB\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
                  <div className="relative z-10 text-center mb-12">
                    <h2 className="text-5xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif', color: '#2C3E50' }}>
                      Ready to Start Your Project?
                    </h2>
                    <p className="text-xl mb-10 max-w-2xl mx-auto" style={{ color: '#2C3E50', opacity: 0.8 }}>
                      Let's build something amazing together. Every platform, everywhere.
                    </p>
                    <div className="flex items-center justify-center space-x-4">
                      <button className="px-10 py-4 text-white rounded-xl font-bold text-lg transition-all hover:scale-105 shadow-lg" style={{ backgroundColor: '#E74C3C' }}>
                        Get Started
                      </button>
                      <button className="px-10 py-4 bg-transparent border-2 rounded-xl font-bold text-lg transition-all" style={{ borderColor: '#3498DB', color: '#3498DB' }}>
                        View Pricing
                      </button>
                    </div>
                  </div>
                  <div className="relative z-10 grid grid-cols-3 gap-12 max-w-4xl mt-8 pt-8 border-t" style={{ borderColor: 'rgba(52, 152, 219, 0.2)' }}>
                    <div className="text-center">
                      <h4 className="font-bold mb-3" style={{ color: '#2C3E50' }}>Services</h4>
                      <ul className="text-sm space-y-2" style={{ color: '#2C3E50', opacity: 0.7 }}>
                        <li>Web Design</li>
                        <li>Development</li>
                        <li>Mobile Apps</li>
                      </ul>
                    </div>
                    <div className="text-center">
                      <h4 className="font-bold mb-3" style={{ color: '#2C3E50' }}>Company</h4>
                      <ul className="text-sm space-y-2" style={{ color: '#2C3E50', opacity: 0.7 }}>
                        <li>About Us</li>
                        <li>Portfolio</li>
                        <li>Contact</li>
                      </ul>
                    </div>
                    <div className="text-center">
                      <h4 className="font-bold mb-3" style={{ color: '#2C3E50' }}>Connect</h4>
                      <ul className="text-sm space-y-2" style={{ color: '#2C3E50', opacity: 0.7 }}>
                        <li>Twitter</li>
                        <li>LinkedIn</li>
                        <li>Instagram</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FRAME 4-5: Mobile Device - Realistic iPhone */}
        <div
          ref={mobileDeviceRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 z-30"
          style={{ transform: 'translate(-50%, -50%) translateX(600px) translate3d(0, 0, 0)', willChange: 'transform, opacity', backfaceVisibility: 'hidden' }}
        >
          <div className="relative">
            {/* Realistic Device Shadow & Ambient Shadow */}
            <div className="absolute -inset-10 rounded-[4.5rem]" style={{ 
              background: 'radial-gradient(ellipse at center, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, 0.1) 40%, transparent 70%)',
              filter: 'blur(30px)',
              zIndex: -1,
            }}></div>
            
            {/* iPhone Frame with Premium Depth */}
            <div
              className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-[3.75rem] border-[16px]"
              style={{ 
                width: '375px', 
                height: '750px',
                borderColor: '#0a0a0a',
                boxShadow: `
                  0 25px 70px rgba(0, 0, 0, 0.4),
                  0 50px 100px rgba(0, 0, 0, 0.3),
                  0 0 2px rgba(0, 0, 0, 0.6),
                  inset 0 0 0 1px rgba(255, 255, 255, 0.08),
                  inset 0 2px 4px rgba(255, 255, 255, 0.03)
                `,
              }}
            >
              {/* Side Buttons (Power & Volume) */}
              <div className="absolute -right-[18px] top-32 w-1 h-12 rounded-l-full" style={{ backgroundColor: '#0a0a0a' }}></div>
              <div className="absolute -right-[18px] top-48 w-1 h-8 rounded-l-full" style={{ backgroundColor: '#0a0a0a' }}></div>
              <div className="absolute -left-[18px] top-28 w-1 h-6 rounded-r-full" style={{ backgroundColor: '#0a0a0a' }}></div>
              
              {/* Notch - Ultra Realistic */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-8 bg-black rounded-b-[2rem] z-50" style={{ 
                boxShadow: '0 3px 10px rgba(0, 0, 0, 0.5), inset 0 -1px 2px rgba(255, 255, 255, 0.05)',
              }}>
                {/* Camera & Speaker */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#1a1a2e' }}></div>
                  <div className="w-12 h-1.5 rounded-full" style={{ backgroundColor: '#0a0a0f' }}></div>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#1a1a2e' }}></div>
                </div>
              </div>
              
              {/* Screen with Glass Effect */}
              <div className="relative bg-white rounded-[3.25rem] h-full overflow-hidden" style={{ 
                boxShadow: 'inset 0 0 0 1px rgba(0, 0, 0, 0.08), inset 0 3px 6px rgba(0, 0, 0, 0.05)',
              }}>
                {/* Status Bar - FIXED at top (iOS Style) */}
                <div className="absolute top-0 left-0 right-0 h-12 text-white flex items-center justify-between px-8 text-xs pt-3 z-50" style={{ background: 'linear-gradient(135deg, #3498DB 0%, #2980B9 100%)' }}>
                  <span className="font-semibold tracking-tight">9:41</span>
                  <div className="flex items-center space-x-2">
                    {/* Signal Strength */}
                    <svg width="16" height="11" viewBox="0 0 16 11" fill="none">
                      <rect width="3" height="5" rx="0.5" fill="white" opacity="0.6"/>
                      <rect x="4" width="3" height="7" rx="0.5" fill="white" opacity="0.8"/>
                      <rect x="8" width="3" height="9" rx="0.5" fill="white" opacity="0.9"/>
                      <rect x="12" width="3" height="11" rx="0.5" fill="white"/>
                    </svg>
                    {/* WiFi */}
                    <svg width="15" height="11" viewBox="0 0 15 11" fill="white">
                      <path d="M7.5 11C8.32843 11 9 10.3284 9 9.5C9 8.67157 8.32843 8 7.5 8C6.67157 8 6 8.67157 6 9.5C6 10.3284 6.67157 11 7.5 11Z"/>
                      <path d="M11.6569 6.84315C10.5327 5.71895 9 5 7.5 5C6 5 4.46734 5.71895 3.34315 6.84315" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                      <path d="M13.364 4.636C11.6569 2.92893 9.32843 2 7 2C4.67157 2 2.34315 2.92893 0.636039 4.636" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    {/* Battery */}
                    <svg width="24" height="12" viewBox="0 0 24 12" fill="none">
                      <rect x="0.5" y="2" width="20" height="8" rx="2" stroke="white" strokeWidth="1" opacity="0.4"/>
                      <rect x="21.5" y="4" width="2" height="4" rx="1" fill="white" opacity="0.4"/>
                      <rect x="2" y="3.5" width="16" height="5" rx="1" fill="white"/>
                    </svg>
                  </div>
                </div>
                
                {/* Scrollable Content Area - Only middle content scrolls */}
                <div className="absolute top-12 bottom-20 left-0 right-0 overflow-hidden">
                  <div className="mobile-content h-full" style={{ height: '2800px' }}>
                    
                    {/* Mobile Hero - Glass Morphism */}
                    <div
                      className="h-[708px] flex flex-col items-center justify-center px-6 relative"
                      style={{
                        background: 'linear-gradient(135deg, #FFFFFF 0%, #F8F5FF 50%, #E8E0FF 100%)',
                      }}
                    >
                      {/* Background Pattern */}
                      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%233498DB\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
                      
                      {/* Mobile Header - Glass with Professional UI (scrolls with content) */}
                      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-4 backdrop-blur-md border-b z-20" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderColor: 'rgba(52, 152, 219, 0.1)' }}>
                        <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-black/5 transition-colors">
                          <MenuIcon size={20} style={{ color: '#2C3E50' }} />
                        </button>
                        <span className="font-bold text-lg tracking-tight" style={{ color: '#2C3E50' }}>AtarWebb</span>
                        <button className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #3498DB 0%, #2980B9 100%)' }}>
                          <User size={16} className="text-white" />
                        </button>
                      </div>

                      {/* Mobile Hero Content - Glass Card */}
                      <div className="text-center px-4 backdrop-blur-xl rounded-3xl p-6 border max-w-sm" style={{ backgroundColor: 'rgba(255, 255, 255, 0.75)', borderColor: 'rgba(52, 152, 219, 0.25)', boxShadow: '0 8px 16px rgba(0, 0, 0, 0.08), 0 16px 32px rgba(0, 0, 0, 0.12)' }}>
                        <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full mb-4" style={{ backgroundColor: 'rgba(52, 152, 219, 0.1)', border: '1px solid rgba(52, 152, 219, 0.2)' }}>
                          <Zap size={14} style={{ color: '#3498DB' }} />
                          <span className="text-xs font-semibold" style={{ color: '#3498DB' }}>Fast & Reliable</span>
                        </div>
                        <h1 className="text-3xl font-bold mb-3 leading-tight" style={{ fontFamily: 'Playfair Display, serif', color: '#2C3E50' }}>
                          Welcome to<br />the Future
                        </h1>
                        <p className="text-sm mb-6 leading-relaxed" style={{ color: '#2C3E50', opacity: 0.8 }}>Building amazing experiences for mobile</p>
                        <div className="space-y-3">
                          <button className="group px-6 py-3 text-white rounded-xl font-bold text-sm w-full transition-all flex items-center justify-center space-x-2" style={{ backgroundColor: '#E74C3C', boxShadow: '0 4px 12px rgba(231, 76, 60, 0.3)' }}>
                            <span>Get Started</span>
                            <Rocket size={16} className="group-active:translate-x-1 transition-transform" />
                          </button>
                          <button className="px-6 py-3 bg-transparent border-2 rounded-xl font-bold text-sm w-full transition-all active:bg-white/50" style={{ borderColor: '#3498DB', color: '#3498DB' }}>
                            Learn More
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Mobile Features Section */}
                    <div className="h-[600px] flex flex-col items-center px-6" style={{ background: 'linear-gradient(135deg, #F8F5FF 0%, #F0E8FF 50%, #E8DFF8 100%)', paddingTop: '48px', paddingBottom: '48px' }}>
                      <h2 className="text-2xl font-bold text-center" style={{ fontFamily: 'Playfair Display, serif', color: '#2C3E50', marginTop: 0, marginBottom: '24px' }}>
                        What We Do
                      </h2>
                      <p className="text-center text-sm" style={{ color: '#2C3E50', opacity: 0.7, marginBottom: '32px' }}>
                        Complete digital solutions for your business
                      </p>
                      <div className="w-full" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {[
                          { Icon: Palette, title: 'Web Design', desc: 'Beautiful interfaces that convert visitors' },
                          { Icon: Code2, title: 'Development', desc: 'Fast, scalable production code' },
                          { Icon: Smartphone, title: 'Mobile Apps', desc: 'Native iOS & Android apps' },
                          { Icon: Rocket, title: 'Deployment', desc: 'Launch to production fast' },
                        ].map((item, i) => (
                          <div key={i} className="p-5 rounded-2xl border backdrop-blur-sm" style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', borderColor: 'rgba(52, 152, 219, 0.15)', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05), 0 10px 15px rgba(0, 0, 0, 0.08)' }}>
                            <div className="flex items-start space-x-4">
                              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#3498DB' }}>
                                <item.Icon size={20} className="text-white" />
                              </div>
                              <div>
                                <h3 className="text-base font-bold mb-1" style={{ color: '#2C3E50' }}>{item.title}</h3>
                                <p className="text-sm leading-relaxed" style={{ color: '#2C3E50', opacity: 0.7 }}>{item.desc}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Mobile Industry Expertise */}
                    <div className="h-[620px] flex flex-col items-center px-6 overflow-hidden" style={{ background: 'linear-gradient(135deg, #E0D8F0 0%, #D8CFF0 50%, #D0C4F0 100%)', paddingTop: '48px', paddingBottom: '48px' }}>
                      <h2 className="text-2xl font-bold text-center" style={{ fontFamily: 'Playfair Display, serif', color: '#2C3E50', marginTop: 0, marginBottom: '24px' }}>
                        Industries We Serve
                      </h2>
                      <p className="text-center text-sm" style={{ color: '#2C3E50', opacity: 0.7, marginBottom: '32px' }}>
                        Specialized solutions for every industry
                      </p>
                      <div className="w-full" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {[
                          { title: 'E-Commerce & Retail', desc: 'High-converting stores with secure payments and inventory management systems.' },
                          { title: 'Healthcare & Medical', desc: 'HIPAA-compliant patient portals, booking, and telehealth solutions.' },
                          { title: 'Restaurants & Hospitality', desc: 'Online ordering, reservations, and menu showcases that drive bookings.' },
                          { title: 'Real Estate & Property', desc: 'Property listings, virtual tours, and lead capture systems.' },
                        ].map((item, i) => (
                          <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 transition-all active:scale-95" style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08), 0 8px 24px rgba(0, 0, 0, 0.06)', border: '1px solid rgba(52, 152, 219, 0.1)' }}>
                            <h3 className="text-base font-bold mb-2" style={{ color: '#2C3E50' }}>{item.title}</h3>
                            <p className="text-sm leading-relaxed" style={{ color: '#2C3E50', opacity: 0.8 }}>{item.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Mobile Stats Section */}
                    <div 
                      className="h-[580px] flex flex-col items-center justify-center relative"
                      style={{
                        backgroundColor: '#3498DB',
                        paddingLeft: '24px',
                        paddingRight: '24px',
                        paddingTop: '48px',
                        paddingBottom: '48px',
                      }}
                    >
                      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
                      <div className="relative z-10 text-center" style={{ marginBottom: '32px' }}>
                        <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif', marginBottom: '16px' }}>
                          Trusted Worldwide
                        </h2>
                        <p className="text-white text-sm" style={{ opacity: 0.9 }}>Real results that drive growth</p>
                      </div>
                      <div className="w-full max-w-sm relative z-10" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {[
                          { Icon: TrendingUp, number: '500+', label: 'Projects Delivered' },
                          { Icon: Heart, number: '98%', label: 'Client Satisfaction' },
                          { Icon: MessageCircle, number: '50+', label: 'Countries Served' },
                          { Icon: Zap, number: '24/7', label: 'Support Available' },
                        ].map((stat, i) => (
                          <div key={i} className="backdrop-blur-xl rounded-2xl border text-center active:scale-95 transition-all" style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', borderColor: 'rgba(255, 255, 255, 0.3)', boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)', padding: '24px 20px' }}>
                            <div className="w-10 h-10 rounded-lg mx-auto flex items-center justify-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', marginBottom: '12px' }}>
                              <stat.Icon size={20} className="text-white" />
                            </div>
                            <div className="text-4xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif', marginBottom: '8px' }}>
                              {stat.number}
                            </div>
                            <div className="text-white text-sm font-medium" style={{ opacity: 0.95 }}>{stat.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Mobile CTA Section */}
                    <div className="h-[600px] flex flex-col items-center justify-center relative overflow-hidden" style={{ backgroundColor: '#2C3E50', paddingLeft: '24px', paddingRight: '24px', paddingTop: '48px', paddingBottom: '48px' }}>
                      <div className="absolute inset-0 opacity-3" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23FAF0E6\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
                      <div className="relative z-10 text-center" style={{ marginBottom: '48px' }}>
                        <h2 className="text-3xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif', marginBottom: '16px' }}>
                          Start Your Project
                        </h2>
                        <p className="text-base" style={{ color: '#FAF0E6', opacity: 0.9, marginBottom: '32px' }}>
                          Let's build something amazing together
                        </p>
                        <div className="w-full max-w-sm mx-auto" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          <button className="group w-full px-8 py-4 text-white rounded-xl font-bold text-base transition-all flex items-center justify-center space-x-2" style={{ backgroundColor: '#E74C3C', boxShadow: '0 6px 16px rgba(231, 76, 60, 0.4), 0 12px 32px rgba(231, 76, 60, 0.25)' }}>
                            <span>Get Started</span>
                            <Rocket size={20} className="group-active:translate-x-1 group-active:-translate-y-1 transition-transform" />
                          </button>
                          <button className="w-full px-8 py-4 bg-transparent border-2 text-white rounded-xl font-bold text-base transition-all" style={{ borderColor: '#3498DB' }}>
                            View Pricing
                          </button>
                        </div>
                      </div>
                      <div className="relative z-10 w-full max-w-sm space-y-6 mt-8 pt-8 border-t" style={{ borderColor: 'rgba(52, 152, 219, 0.2)' }}>
                        <div className="text-center">
                          <h4 className="font-bold mb-3 text-sm text-white">Quick Links</h4>
                          <div className="flex flex-wrap justify-center gap-3 text-sm" style={{ color: '#FAF0E6', opacity: 0.7 }}>
                            <span>Services</span>
                            <span>•</span>
                            <span>Portfolio</span>
                            <span>•</span>
                            <span>About</span>
                            <span>•</span>
                            <span>Contact</span>
                          </div>
                        </div>
                        <div className="text-center">
                          <h4 className="font-bold mb-3 text-sm text-white">Connect</h4>
                          <div className="flex justify-center gap-3 text-sm" style={{ color: '#FAF0E6', opacity: 0.7 }}>
                            <span>Twitter</span>
                            <span>•</span>
                            <span>LinkedIn</span>
                            <span>•</span>
                            <span>Instagram</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Bottom Navigation - FIXED (Native App Style, doesn't scroll) */}
                <div className="absolute bottom-0 left-0 right-0 h-20 backdrop-blur-xl border-t z-50 pb-2" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderColor: 'rgba(52, 152, 219, 0.15)', boxShadow: '0 -4px 16px rgba(0, 0, 0, 0.08)' }}>
                  <div className="flex items-center justify-around h-full px-4 pt-2">
                    {[
                      { Icon: Home, label: 'Home', active: true },
                      { Icon: Search, label: 'Search', active: false },
                      { Icon: Heart, label: 'Saved', active: false },
                      { Icon: User, label: 'Profile', active: false },
                    ].map((item, i) => (
                      <button key={i} className="flex flex-col items-center justify-center space-y-1 transition-all" style={{ opacity: item.active ? 1 : 0.5 }}>
                        <item.Icon size={22} style={{ color: item.active ? '#3498DB' : '#2C3E50' }} />
                        <span className="text-xs font-semibold" style={{ color: item.active ? '#3498DB' : '#2C3E50' }}>{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FRAME 6: Final CTA - Minimal & Clean */}
        <div
          ref={finalCTARef}
          className="absolute inset-0 flex flex-col items-center justify-center opacity-0"
          style={{ 
            transform: 'scale(0.95) translate3d(0, 0, 0)',
            background: 'linear-gradient(180deg, #2D1B4E 0%, #1F1635 25%, #151121 50%, #0D0D0D 75%, #050505 100%)',
            willChange: 'transform, opacity',
            backfaceVisibility: 'hidden',
            zIndex: 60
          }}
        >
          <div className="text-center px-4 max-w-4xl">
            {/* Main Headline */}
            <h1 
              className="text-7xl md:text-8xl lg:text-9xl font-bold mb-8 leading-none"
              style={{
                fontFamily: 'Playfair Display, serif',
                letterSpacing: '-0.03em',
                color: '#FFFFFF',
                textShadow: '0 4px 12px rgba(0, 0, 0, 0.5), 0 8px 24px rgba(0, 0, 0, 0.3)'
              }}
            >
              Welcome to<br />AtarWebb
            </h1>
            
            {/* Tagline */}
            <p 
              className="text-xl md:text-2xl mb-12 tracking-wider"
              style={{ 
                color: 'rgba(255, 255, 255, 0.7)',
                letterSpacing: '0.05em',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
              }}
            >
              Your vision. Every platform. Everywhere.
            </p>
            
            {/* CTA Button */}
            <a
              href="/products"
              className="group inline-flex items-center space-x-3 px-14 py-6 rounded-2xl font-bold text-2xl text-white transition-all hover:scale-105 hover:shadow-2xl"
              style={{ 
                backgroundColor: '#8B5CF6', 
                boxShadow: '0 8px 24px rgba(139, 92, 246, 0.5), 0 16px 48px rgba(139, 92, 246, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <span>Start Your Project</span>
              <Rocket size={28} className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-300" />
            </a>
            
            {/* Subtle Particle Effect Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: -1 }}>
              <div className="absolute top-10 left-10 w-1 h-1 rounded-full animate-pulse" style={{ backgroundColor: '#8B5CF6', opacity: 0.4, animation: 'pulse 3s ease-in-out infinite' }}></div>
              <div className="absolute top-1/4 right-20 w-1 h-1 rounded-full animate-pulse" style={{ backgroundColor: '#A78BFA', opacity: 0.4, animation: 'pulse 4s ease-in-out infinite', animationDelay: '1s' }}></div>
              <div className="absolute bottom-1/3 left-1/4 w-1 h-1 rounded-full animate-pulse" style={{ backgroundColor: '#8B5CF6', opacity: 0.4, animation: 'pulse 5s ease-in-out infinite', animationDelay: '2s' }}></div>
              <div className="absolute bottom-20 right-1/3 w-1 h-1 rounded-full animate-pulse" style={{ backgroundColor: '#A78BFA', opacity: 0.4, animation: 'pulse 3.5s ease-in-out infinite', animationDelay: '0.5s' }}></div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
