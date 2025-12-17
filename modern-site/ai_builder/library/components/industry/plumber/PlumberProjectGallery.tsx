/**
 * PlumberProjectGallery - Plumber project gallery
 * Converted from industry/plumber/project-gallery.html
 */

import React from 'react'
import Gallery, { type GalleryImage } from '../../generic/gallery/Gallery'

export interface PlumberProjectGalleryProps {
  title?: string
  subtitle?: string
  projects: GalleryImage[]
  primaryColor?: string
}
