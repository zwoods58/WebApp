/**
 * ServiceCards - Service cards grid component
 * Converted from generic/service-cards.html
 */

import React from 'react'

export interface Service {
  title: string
  description: string
  icon?: React.ReactNode
  image?: string
  link?: string
}

export interface ServiceCardsProps {
  title?: string
  services: Service[]
  primaryColor?: string
  columns?: string
}

export default function ServiceCards({
  title = 'Our Services',
  services,
  primaryColor = 'blue-600',
  columns = 'md:grid-cols-3'
}: ServiceCardsProps) {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto">
        {title && (
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
            {title}
          </h2>
        )}
        <div className={`grid grid-cols-1 ${columns} gap-8`}>
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition"
            >
              {service.image ? (
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              ) : (
                service.icon && (
                  <div className="mb-4">{service.icon}</div>
                )
              )}
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {service.title}
              </h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              {service.link && (
                <a
                  href={service.link}
                  className={`text-${primaryColor} font-semibold hover:underline`}
                >
                  Learn More →
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}