/**
 * ContactForm - Basic contact form component
 * Converted from generic/contact-form.html
 */

import React, { useState } from 'react'

export interface ContactFormData {
  name: string
  email: string
  message: string
  phone?: string
}

export interface ContactFormProps {
  title?: string
  subtitle?: string
  submitButtonText?: string
  onSubmit?: (data: ContactFormData) => void | Promise<void>
  primaryColor?: string
}
