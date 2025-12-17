/**
 * BlogCard - Blog post card component
 * Converted from generic/blog-card.html
 */

import React from 'react'

export interface BlogCardProps {
  title: string
  excerpt: string
  author?: string
  date?: string
  image?: string
  category?: string
  readTime?: string
  link?: string
  primaryColor?: string
}
