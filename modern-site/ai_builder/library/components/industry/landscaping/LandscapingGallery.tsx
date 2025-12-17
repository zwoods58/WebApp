/**
 * LandscapingGallery - Landscaping project gallery
 * Converted from industry/landscaping/landscaping-gallery.html
 */

import React from 'react'
import Gallery, { type GalleryImage } from '../../generic/gallery/Gallery'

export interface LandscapingGalleryProps {
  title?: string
  subtitle?: string
  projects: GalleryImage[]
  primaryColor?: string
}
