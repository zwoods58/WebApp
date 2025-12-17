/**
 * CleaningCustomerReviews - Cleaning service customer reviews
 * Converted from industry/cleaning-service/customer-reviews.html
 */

import React from 'react'
import TestimonialV1, { type Testimonial as TestimonialItem } from '../../generic/testimonials/TestimonialV1'

export interface CleaningCustomerReviewsProps {
  title?: string
  subtitle?: string
  reviews: TestimonialItem[]
  primaryColor?: string
}
