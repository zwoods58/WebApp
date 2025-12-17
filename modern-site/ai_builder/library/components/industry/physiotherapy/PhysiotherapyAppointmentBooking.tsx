/**
 * PhysiotherapyAppointmentBooking - Appointment booking form for physiotherapy
 * Converted from industry/physiotherapy/appointment-booking.html
 */

import React, { useState } from 'react'

export interface PhysiotherapyAppointmentBookingProps {
  title?: string
  subtitle?: string
  serviceTypes?: string[]
  onSubmit?: (data: {
    name: string
    phone: string
    email: string
    serviceType: string
    preferredDate: string
    preferredTime: string
    conditionInjury?: string
  }) => void | Promise<void>
  primaryColor?: string
}
