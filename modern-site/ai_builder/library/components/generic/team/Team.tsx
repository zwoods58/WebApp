/**
 * Team - Team members section component
 * Converted from generic/team.html
 */

import React from 'react'

export interface TeamMember {
  name: string
  position: string
  bio?: string
  photo?: string
  socialLinks?: {
    linkedin?: string
    twitter?: string
    email?: string
  }
}
