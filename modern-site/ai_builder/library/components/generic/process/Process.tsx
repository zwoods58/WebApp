/**
 * Process - Process/steps component
 * Converted from generic/process.html
 */

import React from 'react'

export interface ProcessStep {
  number: string | number
  title: string
  description: string
  icon?: React.ReactNode
}
