'use client'

import React, { useState, useEffect, useRef } from 'react'
import type { HTMLAttributes } from 'react'

// A simple utility for conditional class names
const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ')
}

// Define the type for a single gallery item
interface GalleryItem {
  common: string
  binomial: string
  photo: {
    url: string
    text: string
    pos?: string
    by: string
  }
}

// Define the props for the CircularGallery component
interface CircularGalleryProps extends HTMLAttributes<HTMLDivElement> {
  items: GalleryItem[]
  /** Controls how far the items are from the center. */
  radius?: number
  /** Controls the speed of auto-rotation. */
  autoRotateSpeed?: number
}

const CircularGallery = React.forwardRef<HTMLDivElement, CircularGalleryProps>(
  ({ items, className, radius = 600, autoRotateSpeed = 0.02, ...props }, ref) => {
    const [rotation, setRotation] = useState(0)
    const [isMobile, setIsMobile] = useState(false)
    const [imagesLoaded, setImagesLoaded] = useState<Record<number, boolean>>({})
    const animationFrameRef = useRef<number | null>(null)

    // Detect mobile device
    useEffect(() => {
      const checkMobile = () => setIsMobile(window.innerWidth < 768)
      checkMobile()
      window.addEventListener('resize', checkMobile)
      return () => window.removeEventListener('resize', checkMobile)
    }, [])

    // Auto-rotation with slower speed on mobile
    useEffect(() => {
      const speed = isMobile ? autoRotateSpeed * 0.5 : autoRotateSpeed
      const autoRotate = () => {
        setRotation(prev => prev + speed)
        animationFrameRef.current = requestAnimationFrame(autoRotate)
      }

      animationFrameRef.current = requestAnimationFrame(autoRotate)

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current)
        }
      }
    }, [autoRotateSpeed, isMobile])

    const anglePerItem = 360 / items.length

    return (
      <div
        ref={ref}
        role="region"
        aria-label="Circular 3D Gallery"
        className={cn('relative w-full h-full flex items-center justify-center', className)}
        style={{ perspective: '2000px' }}
        {...props}
      >
        <div
          className="relative w-full h-full"
          style={{
            transform: `rotateY(${rotation}deg)`,
            transformStyle: 'preserve-3d',
          }}
        >
          {items.map((item, i) => {
            const itemAngle = i * anglePerItem
            const totalRotation = rotation % 360
            const relativeAngle = (itemAngle + totalRotation + 360) % 360
            const normalizedAngle = Math.abs(relativeAngle > 180 ? 360 - relativeAngle : relativeAngle)
            
            // Dynamic opacity based on angle - front cards fully opaque, back cards maintain minimum
            // Front cards (0-30°): fully opaque (1.0)
            // Transition zone (30-90°): fade from 1.0 to 0.6
            // Back cards (90-180°): maintain 0.6 minimum
            let opacity
            if (normalizedAngle < 30) {
              // Front cards - fully opaque
              opacity = 1.0
            } else if (normalizedAngle < 90) {
              // Transition zone - smooth fade from 1.0 to 0.6
              const transitionProgress = (normalizedAngle - 30) / 60
              opacity = 1.0 - (transitionProgress * 0.4) // Fades from 1.0 to 0.6
            } else {
              // Back cards - maintain minimum opacity
              opacity = 0.6
            }
            
            // Scale based on angle - front card slightly larger, side cards slightly smaller
            const scale = normalizedAngle < 30 ? 1.05 : normalizedAngle < 90 ? 1.0 : 0.95

            // Responsive card size - smaller on mobile but still visible
            const cardWidth = isMobile ? 200 : 420
            const cardHeight = isMobile ? 123 : 260
            const adjustedRadius = isMobile ? radius * 0.35 : radius

            return (
              <div
                key={item.photo.url}
                role="group"
                aria-label={item.common}
                className="absolute"
                style={{
                  width: `${cardWidth}px`,
                  height: `${cardHeight}px`,
                  transform: `rotateY(${itemAngle}deg) translateZ(${adjustedRadius}px) scale(${scale})`,
                  left: '50%',
                  top: '50%',
                  marginLeft: `-${cardWidth / 2}px`,
                  marginTop: `-${cardHeight / 2}px`,
                  opacity: opacity,
                  transition: 'none',
                }}
              >
                <div 
                  className="relative w-full h-full group"
                  style={{
                    borderRadius: isMobile ? '8px' : '12px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
                    backgroundColor: 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'visible',
                    border: 'none',
                    outline: 'none',
                  }}
                >
                  {imagesLoaded[i] !== false && (
                    <img
                      src={item.photo.url}
                      alt={item.photo.text}
                      loading="lazy"
                      decoding="async"
                      onLoad={() => setImagesLoaded(prev => ({ ...prev, [i]: true }))}
                      onError={() => setImagesLoaded(prev => ({ ...prev, [i]: false }))}
                      style={{ 
                        objectFit: 'contain',
                        objectPosition: 'center center',
                        display: 'block',
                        maxWidth: '100%',
                        maxHeight: '100%',
                        width: 'auto',
                        height: 'auto',
                      }}
                    />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
)

CircularGallery.displayName = 'CircularGallery'

export { CircularGallery }
export type { CircularGalleryProps, GalleryItem }


