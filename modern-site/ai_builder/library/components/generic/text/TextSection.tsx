/**
 * TextSection - Simple text content section
 * Converted from generic/text-section.html
 */

import React from 'react'

export interface TextSectionProps {
  title?: string
  content: string
  align?: 'left' | 'center' | 'right'
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
}
