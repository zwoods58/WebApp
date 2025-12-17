/**
 * ElectricianProjectGallery - Electrician project gallery
 * Converted from industry/electrician/project-gallery.html
 */

import React from 'react'
import Gallery, { type GalleryImage } from '../../generic/gallery/Gallery'

export interface ElectricianProjectGalleryProps {
  title?: string
  subtitle?: string
  projects: GalleryImage[]
  primaryColor?: string
}
