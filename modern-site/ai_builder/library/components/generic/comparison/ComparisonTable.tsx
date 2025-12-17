/**
 * ComparisonTable - Feature comparison table component
 * Converted from generic/comparison-table.html
 */

import React from 'react'

export interface ComparisonFeature {
  name: string
  values: (string | boolean | React.ReactNode)[]
}
