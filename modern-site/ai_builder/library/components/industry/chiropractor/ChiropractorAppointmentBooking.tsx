/**
 * ChiropractorAppointmentBooking - Appointment booking form for chiropractic services
 * Converted from industry/chiropractor/appointment-booking.html
 */

import React, { useState } from 'react'

export interface ChiropractorAppointmentBookingProps {
  title?: string
  subtitle?: string
  onSubmit?: (data: {
    firstName: string
    lastName: string
    email: string
    phone: string
    preferredDate: string
    preferredTime: string
    reasonForVisit?: string
  }) => void | Promise<void>
  primaryColor?: string
}
