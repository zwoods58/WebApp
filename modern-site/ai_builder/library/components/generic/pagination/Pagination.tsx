/**
 * Pagination - Pagination component
 * Converted from generic/pagination.html
 */

import React from 'react'

export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  primaryColor?: string
  showFirstLast?: boolean
}
