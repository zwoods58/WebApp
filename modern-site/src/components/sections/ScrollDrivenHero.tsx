'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, Palette, Code2, Smartphone, Rocket, Search, Bell, TrendingUp, Zap, Home, Heart, User } from 'lucide-react'
import { gsap } from 'gsap'
import { TextPlugin } from 'gsap/TextPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, TextPlugin)
}

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
  
  // Animation refs
  const heroRef = useRef<HTMLDivElement>(null)
  
  // Message refs
  const message1Ref = useRef<HTMLDivElement>(null)
  const message2Ref = useRef<HTMLDivElement>(null)
  const message3Ref = useRef<HTMLDivElement>(null)
  const message4Ref = useRef<HTMLDivElement>(null)
  
  // Device refs
  const desktopBrowserRef = useRef<HTMLDivElement>(null)
  const mobileDeviceRef = useRef<HTMLDivElement>(null)
  const finalCTARef = useRef<HTMLDivElement>(null)
  
  // Interaction refs
  const cursorRef = useRef<HTMLDivElement>(null)
  const mobileCursorRef = useRef<HTMLDivElement>(null)
  
  // Scroll indicator
  const scrollIndicatorRef = useRef<HTMLDivElement>(null)
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
          setIsScrolled(currentScrollY > 50)
          
          if (currentScrollY <= 50) {
            setHeaderVisible(true)
          } else if (currentScrollY > lastScrollPosition) {
            setHeaderVisible(false)
          } else if (currentScrollY < lastScrollPosition) {
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

  // Main scroll animation
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

      // FRAME 1: Initial Load
      tl.call(() => updateProgressDot(0), undefined, 0)
        .fromTo(desktopBrowserRef.current, 
          { scale: 0.8, opacity: 1, y: 50 }, 
          { scale: 1, opacity: 1, y: -50, duration: 1.2, ease: "power3.out" }, 
          0
        )
        .to(scrollIndicatorRef.current, { opacity: 1, duration: 0.6, ease: "power1.out" }, 0.5)
        .to(scrollIndicatorRef.current, { opacity: 0, duration: 0.6, ease: "power1.in" }, 2)

      // FRAME 2: "Your Digital Partner"
      tl.call(() => updateProgressDot(1), undefined, 3)
        .to(message1Ref.current, { opacity: 1, duration: 0.3 }, 3)
        .to(message1Ref.current?.querySelector('.typewriter-text') || message1Ref.current, { text: { value: "Your Digital Partner", delimiter: "" }, duration: 2.5, ease: "none" }, 3.2)
        .to(message1Ref.current?.querySelector('.typewriter-text') || message1Ref.current, { text: { value: "", delimiter: "" }, duration: 1.8, ease: "none" }, 7.2)
        .to(message1Ref.current, { opacity: 0, duration: 0.3 }, 9)

      // FRAME 2.5: Desktop Interactions
      tl.to(cursorRef.current, { opacity: 1, x: 0, y: 0, duration: 0.8, ease: "circ.inOut" }, 9.2)
      .to(cursorRef.current, { scale: 0.9, duration: 0.15, ease: "power2.in" }, 10.2)
      .to(cursorRef.current, { scale: 1, duration: 0.15, ease: "power2.out" }, 10.35)
      .to(desktopBrowserRef.current, { scale: 1.05, duration: 1, ease: "power2.out" }, 10.5)
      .to(desktopBrowserRef.current?.querySelector('.desktop-content') || desktopBrowserRef.current, { y: -2300, duration: 5.5, ease: "power2.inOut" }, 10.5)
      .to(cursorRef.current, { opacity: 0, duration: 0.4, ease: "power1.in" }, 12.2)

      // FRAME 3: Desktop fades, Mobile transition
      tl.call(() => updateProgressDot(2), undefined, 18.5)
        .to(desktopBrowserRef.current, { x: -380, scale: 0.85, opacity: 0.4, duration: 1.5, ease: "power3.inOut" }, 18.5)
        .to(mobileDeviceRef.current, { opacity: 1, x: 320, rotation: 3, duration: 1.25, ease: "power2.out" }, 18.6)
        .to(mobileDeviceRef.current, { rotation: 0, x: 300, duration: 0.5, ease: "back.out(1.5)" }, 19.8)
        .to(message2Ref.current, { opacity: 1, duration: 0.3 }, 19.5)
        .to(message2Ref.current?.querySelector('.typewriter-text') || message2Ref.current, { text: { value: "Adapting to Your Needs", delimiter: "" }, duration: 2.5, ease: "none" }, 19.8)
        .to(desktopBrowserRef.current, { opacity: 0, duration: 0.8, ease: "power2.in" }, 21)
        .to(mobileDeviceRef.current, { x: 80, scale: 1, duration: 1, ease: "power2.out" }, 21.5)
        .to(message2Ref.current?.querySelector('.typewriter-text') || message2Ref.current, { text: { value: "", delimiter: "" }, duration: 1.8, ease: "none" }, 23.5)
        .to(message2Ref.current, { opacity: 0, duration: 0.3 }, 25.3)

      // FRAME 4: Mobile Center & Scroll
      tl.call(() => updateProgressDot(3), undefined, 25.5)
        .to(mobileDeviceRef.current, { x: -10, scale: 1.06, duration: 0.6, ease: "power2.in" }, 25.5)
        .to(mobileDeviceRef.current, { x: 0, scale: 1.05, duration: 0.6, ease: "back.out(1.2)" }, 26.1)
        .to(mobileCursorRef.current, { opacity: 1, duration: 0.4, ease: "power1.out" }, 26.7)
        .to(mobileCursorRef.current, { scale: 0.8, duration: 0.12, ease: "power2.in" }, 27.3)
        .to(mobileCursorRef.current, { scale: 1, duration: 0.12, ease: "power2.out" }, 27.42)
        .to(mobileDeviceRef.current?.querySelector('.mobile-content') || mobileDeviceRef.current, { y: -1600, duration: 4.5, ease: "power2.inOut" }, 27.6)
        .to(mobileCursorRef.current, { opacity: 0, duration: 0.4, ease: "power1.in" }, 30.9)
        .to(message3Ref.current, { opacity: 1, duration: 0.3 }, 29.85)
        .to(message3Ref.current?.querySelector('.typewriter-text') || message3Ref.current, { text: { value: "Designed with Purpose", delimiter: "" }, duration: 2.5, ease: "none" }, 30.15)
        .to(message3Ref.current?.querySelector('.typewriter-text') || message3Ref.current, { text: { value: "", delimiter: "" }, duration: 1.8, ease: "none" }, 33.65)
        .to(message3Ref.current, { opacity: 0, duration: 0.3 }, 35.45)
        .to(mobileDeviceRef.current, { opacity: 0, scale: 0.92, duration: 1.5, ease: "power2.in" }, 35.5)
        
      // FRAME 5: Final transition
      tl.call(() => updateProgressDot(4), undefined, 37)
        .to(message4Ref.current, { opacity: 1, duration: 0.4 }, 37)
        .to(message4Ref.current?.querySelector('.typewriter-text') || message4Ref.current, { text: { value: "Crafted with Excellence", delimiter: "" }, duration: 2.5, ease: "none" }, 37.3)
        .to(backgroundOverlayRef.current, { opacity: 1, duration: 6, ease: "power1.inOut" }, 37.3)
        .to(message4Ref.current?.querySelector('h2') || message4Ref.current, { color: '#E5E7EB', duration: 6, ease: "power1.inOut" }, 37.3)
        .to(message4Ref.current?.querySelector('.typewriter-text') || message4Ref.current, { text: { value: "", delimiter: "" }, duration: 1.8, ease: "none" }, 40.8)
        .to(message4Ref.current, { opacity: 0, duration: 0.8, ease: "power2.in" }, 42.6)

      // FRAME 6: Final CTA
      tl.call(() => updateProgressDot(5), undefined, 43.5)
        .to(finalCTARef.current, { opacity: 1, scale: 1, duration: 2.5, ease: "power3.out" }, 43.5)

    }, heroRef)

    return () => ctx.revert()
  }, [])

  return (
    <>
      <style jsx>{`
        @keyframes cursorClickRing {
          0% { transform: scale(0.5); opacity: 1; }
          100% { transform: scale(2); opacity: 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.15; }
          50% { transform: translateY(-20px) translateX(10px); opacity: 0.3; }
        }
        .cursor-click-ring { animation: cursorClickRing 0.6s ease-out; }
      `}</style>
      
      <div
        ref={heroRef}
        className="relative w-full h-screen overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #FFFFFF 0%, #F5F5F5 15%, #E8E4F3 35%, #DCD0FF 65%, #D0C4F0 85%, #C4B8E0 100%)',
          paddingTop: '80px',
        }}
      >
        <div
          ref={backgroundOverlayRef}
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(45, 27, 78, 0.3) 0%, rgba(45, 27, 78, 0.5) 15%, rgba(31, 22, 53, 0.65) 30%, rgba(21, 17, 33, 0.8) 45%, rgba(13, 13, 13, 0.9) 60%, rgba(5, 5, 5, 0.95) 75%, rgba(0, 0, 0, 1) 100%)',
            opacity: 0,
            zIndex: 5,
          }}
        />

        {/* Messages */}
        <div ref={message1Ref} className="absolute bottom-[15%] left-1/2 -translate-x-1/2 opacity-0 pointer-events-none z-40 text-center w-full px-4">
          <h2 className="font-bold leading-tight tracking-tight text-[64px] text-[#36454F]"><span className="typewriter-text"></span></h2>
        </div>
        <div ref={message2Ref} className="absolute top-1/2 left-[4%] -translate-y-1/2 opacity-0 pointer-events-none z-40 text-left w-auto px-4">
          <h2 className="font-bold leading-tight tracking-tight text-[64px] text-[#36454F]"><span className="typewriter-text"></span></h2>
        </div>
        <div ref={message3Ref} className="absolute top-1/2 left-[4%] -translate-y-1/2 opacity-0 pointer-events-none z-40 text-left w-auto px-4">
          <h2 className="font-bold leading-tight tracking-tight text-[64px] text-[#36454F]"><span className="typewriter-text"></span></h2>
        </div>
        <div ref={message4Ref} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 pointer-events-none text-center w-full px-4 z-[50]">
          <h2 className="font-bold leading-tight tracking-tight text-[64px] text-[#36454F]"><span className="typewriter-text"></span></h2>
        </div>

        {/* Progress Dots */}
        <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col space-y-3">
          {[0, 1, 2, 3, 4, 5].map((dotIndex) => (
            <div
              key={dotIndex}
              ref={(el) => { if (progressDotsRef.current) progressDotsRef.current[dotIndex] = el }}
              className="w-2 h-2 rounded-full bg-blue-500/20"
            ></div>
          ))}
        </div>

        {/* Scroll Indicator */}
        <div ref={scrollIndicatorRef} className="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-0 z-30 flex flex-col items-center">
          <p className="text-sm mb-2 tracking-wider text-[#2C3E50]/60">scroll to explore</p>
          <div className="w-6 h-10 border-2 border-blue-500 rounded-full flex items-start justify-center p-1">
            <div className="w-1.5 h-3 bg-blue-500 rounded-full animate-bounce"></div>
          </div>
        </div>

        {/* Desktop Browser */}
        <div ref={desktopBrowserRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="bg-gray-900 rounded-xl w-[1000px] max-w-[90vw] overflow-hidden border border-gray-700 shadow-2xl">
            <div className="bg-gray-800 px-4 py-3 flex items-center space-x-3">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="flex-1 mx-4 bg-gray-700 rounded-md h-7 flex items-center px-3 text-gray-300 text-sm">🔒 atarwebb.com</div>
            </div>
            <div className="relative h-[550px] overflow-hidden bg-white">
              <div className="desktop-content absolute inset-0 h-[2750px]">
                {/* Simulated Content */}
                <div className="h-[550px] bg-[#F8F5FF] flex items-center justify-center">
                  <h1 className="text-4xl font-bold text-[#2C3E50]">Professional Web Design</h1>
                      </div>
                <div className="h-[550px] bg-[#F0E8FF] flex items-center justify-center">
                  <h1 className="text-4xl font-bold text-[#2C3E50]">Responsive & Fast</h1>
                    </div>
                <div className="h-[550px] bg-[#3498DB] flex items-center justify-center">
                  <h1 className="text-4xl font-bold text-white">Drive Results</h1>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Device */}
        <div ref={mobileDeviceRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 z-30">
          <div className="relative bg-[#0a0a0a] rounded-[3.75rem] border-[16px] border-black w-[375px] h-[750px] shadow-2xl">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-8 bg-black rounded-b-[2rem] z-50"></div>
            <div className="relative bg-white rounded-[3.25rem] h-full overflow-hidden">
              <div className="mobile-content h-[2800px]">
                <div className="h-[708px] bg-[#F8F5FF] flex items-center justify-center">
                  <h1 className="text-2xl font-bold text-[#2C3E50]">Mobile Ready</h1>
                </div>
                <div className="h-[600px] bg-[#F0E8FF] flex items-center justify-center">
                  <h1 className="text-2xl font-bold text-[#2C3E50]">User Focused</h1>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
        {/* Final CTA */}
        <div
          ref={finalCTARef}
          className="absolute inset-0 flex flex-col items-center justify-center opacity-0 z-[60]"
          style={{ background: 'linear-gradient(180deg, #2D1B4E 0%, #1F1635 25%, #151121 50%, #0D0D0D 75%, #050505 100%)' }}
        >
          <div className="text-center px-4 max-w-4xl">
            <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold mb-8 text-white">Welcome to<br />AtarWebb</h1>
            <p className="text-xl md:text-2xl mb-12 text-white/70">Your vision. Every platform. Everywhere.</p>
            <a
              href="/products"
              className="inline-flex items-center space-x-3 px-14 py-6 rounded-2xl font-bold text-2xl text-white bg-blue-600 hover:scale-105 transition-all shadow-xl"
            >
              <span>Start Your Project</span>
              <Rocket size={28} />
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
