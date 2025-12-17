/**
 * PhysiotherapyServiceList - Physiotherapy services list
 * Converted from industry/physiotherapy/service-list.html
 */

import React from 'react'
import ServiceCards, { type Service } from '../../generic/services/ServiceCards'

export interface PhysiotherapyServiceListProps {
  title?: string
  subtitle?: string
  services: Service[]
  primaryColor?: string
}
