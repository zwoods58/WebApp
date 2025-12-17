/**
 * Search - Search input component
 * Converted from generic/search.html
 */

import React, { useState } from 'react'

export interface SearchProps {
  placeholder?: string
  onSearch?: (query: string) => void | Promise<void>
  primaryColor?: string
  showButton?: boolean
}
