/**
 * Video - Video embed component
 * Converted from generic/video.html
 */

import React from 'react'

export interface VideoProps {
  title?: string
  subtitle?: string
  videoUrl?: string
  youtubeId?: string
  vimeoId?: string
  thumbnail?: string
  autoplay?: boolean
  controls?: boolean
  loop?: boolean
}
