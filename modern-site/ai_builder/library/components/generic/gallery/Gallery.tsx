/**
 * Gallery - Image gallery component
 * Converted from generic/gallery.html
 */

import React from 'react'

export interface GalleryImage {
  src: string
  alt: string
  title?: string
}

export interface GalleryProps {
  title?: string
  images: GalleryImage[]
  columns?: string
  primaryColor?: string
}

export default function Gallery({
  title,
  images,
  columns = 'md:grid-cols-3',
  primaryColor = 'blue-600'
}: GalleryProps) {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto">
        {title && (
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
            {title}
          </h2>
        )}
        <div className={`grid grid-cols-1 ${columns} gap-4`}>
          {images.map((image, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-lg group cursor-pointer"
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
              />
              {image.title && (
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                  <p className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-semibold">
                    {image.title}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}