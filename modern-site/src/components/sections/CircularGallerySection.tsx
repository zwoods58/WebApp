'use client'

import React, { useState, useEffect } from 'react'
import { CircularGallery } from '../ui/circular-gallery'
import type { GalleryItem } from '../ui/circular-gallery'

const portfolioData: GalleryItem[] = [
  {
    common: 'Online Retail',
    binomial: 'E-commerce Website',
    photo: {
      url: '/gallery (1).png',
      text: 'Retail website mockup',
      pos: '50% 50%',
      by: '',
    },
  },
  {
    common: 'Local Bakery',
    binomial: 'Small Business Site',
    photo: {
      url: '/gallery (2).png',
      text: 'Bakery website mockup',
      pos: '50% 50%',
      by: '',
    },
  },
  {
    common: 'Professional Services',
    binomial: 'Corporate Website',
    photo: {
      url: '/gallery (3).png',
      text: 'Services website mockup',
      pos: '50% 50%',
      by: '',
    },
  },
  {
    common: 'Fitness Studio',
    binomial: 'Booking & Scheduling',
    photo: {
      url: '/gallery (4).png',
      text: 'Fitness website mockup',
      pos: '50% 50%',
      by: '',
    },
  },
  {
    common: 'Restaurant',
    binomial: 'Online Ordering',
    photo: {
      url: '/gallery (5).png',
      text: 'Restaurant website mockup',
      pos: '50% 50%',
      by: '',
    },
  },
  {
    common: 'Law Firm',
    binomial: 'Professional Portal',
    photo: {
      url: '/gallery (6).png',
      text: 'Law firm website mockup',
      pos: '50% 50%',
      by: '',
    },
  },
]

export function CircularGallerySection() {
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)

  useEffect(() => {
    const checkSize = () => {
      setIsMobile(window.innerWidth < 768)
      setIsTablet(window.innerWidth > 768 && window.innerWidth <= 1024)
    }
    checkSize()
    window.addEventListener('resize', checkSize)
    return () => window.removeEventListener('resize', checkSize)
  }, [])

  // Calculate positioning - lowered with padding
  // Black gradient is 300px high, center is at 150px from bottom
  // Gallery container height is ~400px (350px mobile), so center is at ~200px (175px mobile)
  // Lowered by reducing the bottom position and adding padding
  const galleryHeight = isMobile ? 350 : 400
  const blackLineCenter = 150 // Middle of 300px black gradient
  const galleryCenter = galleryHeight / 2
  const bottomPosition = blackLineCenter - galleryCenter - 40 // Lowered by 40px
  
  const padding = isMobile ? '0 15px' : isTablet ? '0 20px' : '0 40px'

  return (
    <div 
      className="absolute left-0 right-0 pointer-events-none"
      style={{
        bottom: `${bottomPosition}px`,
        padding: padding,
        zIndex: 35,
      }}
    >
      {/* Black background bar with fading edges */}
      <div
        className="absolute left-0 right-0 pointer-events-none"
        style={{
          height: `${galleryHeight}px`,
          background: 'linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,0.05) 2%, rgba(0,0,0,0.1) 4%, rgba(0,0,0,0.2) 6%, rgba(0,0,0,0.3) 8%, rgba(0,0,0,0.4) 10%, rgba(0,0,0,0.5) 12%, rgba(0,0,0,0.6) 14%, rgba(0,0,0,0.7) 16%, rgba(0,0,0,0.8) 18%, rgba(0,0,0,0.9) 20%, rgba(0,0,0,0.95) 22%, rgba(0,0,0,1) 25%, rgba(0,0,0,1) 75%, rgba(0,0,0,0.95) 78%, rgba(0,0,0,0.9) 80%, rgba(0,0,0,0.8) 82%, rgba(0,0,0,0.7) 84%, rgba(0,0,0,0.6) 86%, rgba(0,0,0,0.5) 88%, rgba(0,0,0,0.4) 90%, rgba(0,0,0,0.3) 92%, rgba(0,0,0,0.2) 94%, rgba(0,0,0,0.1) 96%, rgba(0,0,0,0.05) 98%, rgba(0,0,0,0) 100%)',
          zIndex: 1,
        }}
      />
      <div 
        className="w-full flex items-center justify-center"
        style={{
          height: `${galleryHeight}px`,
          overflow: 'visible',
          minHeight: `${galleryHeight}px`,
          position: 'relative',
          zIndex: 2,
        }}
      >
        <div 
          className="w-full h-full max-w-[1400px] mx-auto"
          style={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div 
            className="w-full h-full flex items-center justify-center pointer-events-auto"
            style={{
              padding: isMobile ? '10px 0 20px' : '20px 0 40px',
            }}
          >
            <CircularGallery 
              items={portfolioData} 
              radius={600}
              autoRotateSpeed={0.04} 
            />
          </div>
        </div>
      </div>
    </div>
  )
}


