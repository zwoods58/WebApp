/**
 * AccountingServicesOverview - Accounting services overview
 * Converted from industry/accounting/services-overview.html
 */

import React from 'react'
import ServiceCards, { type Service } from '../../generic/services/ServiceCards'

export interface AccountingServicesOverviewProps {
  title?: string
  subtitle?: string
  services: Service[]
  primaryColor?: string
}
