'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu as MenuIcon, User, LogOut, LayoutDashboard } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import { getFastUser, getFastAccountWithPrefetch, isFastAdmin, clearFastAccountCache } from '../../lib/fast-auth'

export function PageHeader() {
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)
  const [headerVisible, setHeaderVisible] = useState(true)
  const [isLightPage, setIsLightPage] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isPro, setIsPro] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

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
      // Contact, Products, Partner Program, and AI Builder pages have white backgrounds
      const lightPages = ['/contact', '/products', '/partner-program', '/ai-builder']
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

  // Check auth state (OPTIMIZED - uses fast-auth)
  useEffect(() => {
    const checkAuth = async () => {
      // INSTANT - get user from session (no DB query)
      const sessionUser = await getFastUser()
      if (sessionUser) {
        setUser(sessionUser)
        
        // FAST - get account with prefetch (cached, <5ms)
        const account = await getFastAccountWithPrefetch()
        if (account) {
          setUserProfile(account)

          // FAST - check if admin (cached, <5ms)
          const adminStatus = await isFastAdmin()
          setIsAdmin(adminStatus)
          setIsPro(account.account_tier === 'pro_subscription' && account.subscription_status === 'active')
        }
      } else {
        setUser(null)
        setUserProfile(null)
        setIsAdmin(false)
        setIsPro(false)
      }
    }

    checkAuth()

    // Listen for auth changes (OPTIMIZED - uses fast-auth)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user)
        
        // FAST - get account (cached)
        const account = await getFastAccountWithPrefetch()
        if (account) {
          setUserProfile(account)
          const adminStatus = await isFastAdmin()
          setIsAdmin(adminStatus)
          setIsPro(account.account_tier === 'pro_subscription' && account.subscription_status === 'active')
        }
      } else {
        setUser(null)
        setUserProfile(null)
        setIsAdmin(false)
        setIsPro(false)
        clearFastAccountCache() // Clear cache on logout
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setUserProfile(null)
    setUserMenuOpen(false)
    clearFastAccountCache() // Clear cache on logout
    router.push('/ai-builder')
  }

  // Click outside to close user menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const links = [
    { href: '/products', label: 'Products' },
    { href: '/partner-program', label: 'Partner Program' },
    { href: '/contact', label: 'Contact' },
  ]

  // Use charcoal grey (#36454F) at the top of homepage for better visibility
  const isHomePage = typeof window !== 'undefined' && window.location.pathname === '/'

  const logoColor = isScrolled 
    ? (isLightPage ? 'text-gray-900 hover:text-gray-700' : (isHomePage ? 'text-white hover:text-gray-200' : 'text-white hover:text-gray-300'))
    : (isHomePage ? 'text-[#36454F] hover:opacity-70' : 'text-gray-900 hover:text-gray-700')
  
  const linkColor = isScrolled 
    ? (isLightPage ? 'text-gray-700 hover:text-gray-900' : (isHomePage ? 'text-white hover:text-gray-200' : 'text-white hover:text-gray-300'))
    : (isHomePage ? 'text-[#36454F] hover:opacity-70' : 'text-gray-900 hover:text-gray-700')
  
  const buttonBg = 'bg-[#3861FB] text-white hover:bg-[#2f52d6]'
  
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
          {links.map(link => (
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
          {user ? (
            <div className="hidden lg:flex items-center gap-4">
              {/* User Profile Dropdown */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    isScrolled 
                      ? (isLightPage ? 'bg-gray-100 hover:bg-gray-200' : (isHomePage ? 'bg-white/20 hover:bg-white/30' : 'bg-white/10 hover:bg-white/20')) 
                      : 'hover:bg-gray-100/50'
                  }`}
                >
                  <User className={`w-5 h-5 ${
                    isScrolled 
                      ? (isLightPage ? 'text-gray-600' : (isHomePage ? 'text-white' : 'text-white')) 
                      : (isHomePage ? 'text-[#36454F]' : 'text-gray-600')
                  }`} />
                  <span className={`text-sm font-medium ${
                    isScrolled 
                      ? (isLightPage ? 'text-gray-900' : (isHomePage ? 'text-white' : 'text-white')) 
                      : (isHomePage ? 'text-[#36454F]' : 'text-gray-900')
                  }`}>
                  {userProfile?.full_name || user.email?.split('@')[0] || 'User'}
                </span>
                </button>
                
                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl py-2 border border-gray-100 animate-in fade-in slide-in-from-top-2 z-50">
              <a
                href={isAdmin ? "/admin/dashboard" : isPro ? "/ai-builder/pro-dashboard" : "/ai-builder/dashboard"}
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center px-4 py-2.5 text-gray-700 hover:bg-gray-50 text-sm font-medium transition-colors"
                    >
                      <LayoutDashboard size={16} className="mr-2.5" />
                {isAdmin ? 'Admin Dashboard' : 'Dashboard'}
              </a>
              <button
                onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2.5 text-red-600 hover:bg-red-50 text-sm font-medium transition-colors text-left"
                    >
                      <LogOut size={16} className="mr-2.5" />
                Logout
              </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <a
              href="/ai-builder/login"
              className={`hidden lg:inline-block ${buttonBg} transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 hover:shadow-lg`}
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
              Login
            </a>
          )}
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
                          onClick={() => setMenuOpen(false)}
                          className="text-2xl sm:text-3xl font-semibold text-gray-900 hover:text-teal-600 transition-colors block py-2"
                        >
                          {link.label}
                        </a>
                      </motion.li>
                    ))}
                  </ul>
                  <div className="mt-12 space-y-3">
                    {user ? (
                      <>
                        <div className="px-4 py-3 bg-gray-100 rounded-lg flex items-center gap-2">
                          <User className="w-5 h-5 text-gray-600" />
                          <span className="text-gray-900 font-medium">
                            {userProfile?.full_name || user.email?.split('@')[0] || 'User'}
                          </span>
                        </div>
                        <a 
                          href={isAdmin ? "/admin/dashboard" : isPro ? "/ai-builder/pro-dashboard" : "/ai-builder/dashboard"} 
                          onClick={() => setMenuOpen(false)}
                          className="w-full block text-center py-4 bg-teal-600 text-white font-bold text-lg rounded-lg hover:bg-teal-700 transition-colors"
                        >
                          {isAdmin ? 'Admin Dashboard' : isPro ? 'Pro Dashboard' : 'Dashboard'}
                        </a>
                        <button
                          onClick={() => {
                            handleLogout()
                            setMenuOpen(false)
                          }}
                          className="w-full py-4 bg-gray-200 text-gray-900 font-bold text-lg rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
                        >
                          <LogOut className="w-5 h-5" />
                          Logout
                        </button>
                      </>
                    ) : (
                      <a 
                        href="/ai-builder/login" 
                        onClick={() => setMenuOpen(false)}
                        className="w-full block text-center py-4 bg-teal-600 text-white font-bold text-lg rounded-lg hover:bg-teal-700 transition-colors"
                      >
                        Login
                      </a>
                    )}
                  </div>
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

