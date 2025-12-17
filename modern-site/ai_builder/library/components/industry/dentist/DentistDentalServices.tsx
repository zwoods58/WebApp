/**
 * DentistDentalServices - Dental services display
 * Converted from industry/dentist/dental-services.html
 */

import React from 'react'
import ServiceCards, { type Service } from '../../generic/services/ServiceCards'

export interface DentistDentalServicesProps {
  title?: string
  subtitle?: string
  services: Service[]
  primaryColor?: string
}
