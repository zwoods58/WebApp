/**
 * Newsletter - Newsletter signup component
 * Converted from generic/newsletter.html
 */

import React, { useState } from 'react'

export interface NewsletterProps {
  title?: string
  subtitle?: string
  placeholder?: string
  buttonText?: string
  onSubmit?: (email: string) => void | Promise<void>
  primaryColor?: string
}
