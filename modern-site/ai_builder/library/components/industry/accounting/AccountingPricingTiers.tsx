/**
 * AccountingPricingTiers - Accounting service pricing tiers
 * Converted from industry/accounting/pricing-tiers.html
 */

import React from 'react'
import Pricing, { type PricingPlan } from '../../generic/pricing/Pricing'

export interface AccountingPricingTiersProps {
  title?: string
  subtitle?: string
  tiers: PricingPlan[]
  primaryColor?: string
}
