/**
 * UniversityCourseCatalog - University course catalog component
 * Converted from industry/university-college/course-catalog.html
 */

import React from 'react'

export interface UniversityCourse {
  id: string
  code: string
  name: string
  description: string
  credits: number
  instructor?: string
  schedule?: string
  prerequisites?: string[]
  link?: string
}
