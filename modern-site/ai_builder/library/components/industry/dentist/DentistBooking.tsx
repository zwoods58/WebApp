/**
 * DentistBooking - Appointment booking form for dental services
 * Converted from industry/dentist/booking.html
 */

import React, { useState } from 'react'

export interface DentistBookingProps {
  title?: string
  subtitle?: string
  serviceTypes?: string[]
  onSubmit?: (data: {
    name: string
    phone: string
    email: string
    serviceNeeded: string
    preferredDate: string
    preferredTime: string
  }) => void | Promise<void>
  primaryColor?: string
}
