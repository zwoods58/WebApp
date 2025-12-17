/**
 * TestimonialV1 - Basic testimonials component
 * Converted from generic/testimonial.html
 */

import React from 'react'

export interface Testimonial {
  quote: string
  name: string
  position?: string
  company?: string
  rating?: number
  photo?: string
}

export interface TestimonialV1Props {
  title?: string
  testimonials: Testimonial[]
  primaryColor?: string
  columns?: string
}

export default function TestimonialV1({
  title = 'What Our Clients Say',
  testimonials,
  primaryColor = 'blue-600',
  columns = 'md:grid-cols-3'
}: TestimonialV1Props) {
  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="container mx-auto">
        {title && (
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
            {title}
          </h2>
        )}
        <div className={`grid grid-cols-1 ${columns} gap-8 max-w-6xl mx-auto`}>
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-lg"
            >
              {testimonial.rating && (
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i < testimonial.rating! ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              )}
              <p className="text-gray-700 mb-4 italic">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center">
                {testimonial.photo ? (
                  <img
                    src={testimonial.photo}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                ) : (
                  <div className={`w-12 h-12 bg-${primaryColor} rounded-full flex items-center justify-center text-white font-semibold mr-4`}>
                    {testimonial.name.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  {(testimonial.position || testimonial.company) && (
                    <p className="text-sm text-gray-600">
                      {testimonial.position}
                      {testimonial.position && testimonial.company && ', '}
                      {testimonial.company}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}