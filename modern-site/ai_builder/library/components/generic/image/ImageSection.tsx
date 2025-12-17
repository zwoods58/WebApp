/**
 * ImageSection - Image with text section
 * Converted from generic/image-section.html
 */

import React from 'react'

export interface ImageSectionProps {
  title?: string
  description?: string
  image: string
  imageAlt?: string
  imagePosition?: 'left' | 'right' | 'top' | 'bottom'
  primaryColor?: string
}
