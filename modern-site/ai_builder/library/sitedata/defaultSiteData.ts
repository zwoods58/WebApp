/**
 * Default SiteData
 * Uses the registry's getSiteDataTemplate() and loadSiteData() to provide default data
 * This ensures consistency across all industries and provides fallback data
 * Includes industry-specific images when available
 */

import { getSiteDataTemplate, type SiteDataTemplate } from '../registry'
import { loadSiteData } from './loadSiteData'

/**
 * Get default siteData for an industry
 * If industry is not provided, returns general category template
 * Automatically includes industry-specific images
 */
export function getDefaultSiteData(industry: string | null = null): SiteDataTemplate {
  // Use loadSiteData to get images merged in
  // Falls back to getSiteDataTemplate if loadSiteData fails (client-side)
  try {
    if (typeof window === 'undefined') {
      // Server-side: can load JSON and merge images
      return loadSiteData(industry)
    }
  } catch (error) {
    // Fallback to template only
  }
  
  // Client-side or fallback: use template (images will be from template)
  return getSiteDataTemplate(industry)
}

/**
 * Default siteData (general category template)
 * Used as fallback when no industry is specified
 */
export const defaultSiteData: SiteDataTemplate = getSiteDataTemplate(null)

/**
 * Export type for convenience
 */
export type { SiteDataTemplate }

