/**
 * About - About section component
 * Converted from generic/about.html
 */

import React from 'react'

export interface AboutProps {
  title?: string
  subtitle?: string
  description?: string
  image?: string
  imageAlt?: string
  features?: Array<{ title: string; description: string }>
  primaryColor?: string
  layout?: 'left' | 'right' | 'center'
}

export default function About({
  title = 'About Us',
  subtitle,
  description,
  image,
  imageAlt = 'About us',
  features = [],
  primaryColor = 'blue-600',
  layout = 'left'
}: AboutProps) {
  const layoutClasses = {
    left: 'md:flex-row',
    right: 'md:flex-row-reverse',
    center: 'flex-col text-center'
  }

  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto">
        <div className={`flex flex-col ${layoutClasses[layout]} gap-12 items-center max-w-6xl mx-auto`}>
          {image && (
            <div className="flex-1 w-full md:w-1/2">
              <img
                src={image}
                alt={imageAlt}
                className="w-full h-auto rounded-2xl shadow-lg object-cover"
              />
            </div>
          )}
          
          <div className={`flex-1 w-full ${image ? 'md:w-1/2' : 'max-w-3xl'} ${layout === 'center' ? 'mx-auto' : ''}`}>
            <h2 className={`text-4xl md:text-5xl font-bold text-gray-900 mb-4 ${layout === 'center' ? 'text-center' : ''}`}>
              {title}
            </h2>
            {subtitle && (
              <p className={`text-xl text-${primaryColor} mb-6 ${layout === 'center' ? 'text-center' : ''}`}>
                {subtitle}
              </p>
            )}
            {description && (
              <p className={`text-lg text-gray-600 mb-8 ${layout === 'center' ? 'text-center' : ''}`}>
                {description}
              </p>
            )}
            
            {features.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <div className={`w-8 h-8 bg-${primaryColor} rounded-lg flex items-center justify-center mr-4 flex-shrink-0`}>
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

