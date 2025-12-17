/**
 * SiteData Loader
 * Loads industry-specific JSON files or falls back to category templates
 * Merges industry-specific images into the data
 */

import { getSiteDataPath, getSiteDataTemplate, getIndustryConfig, type SiteDataTemplate } from '../registry'
import { mergeImagesIntoSiteData } from '../imageMappings'

// Server-only imports - only import fs/path when running server-side
let fs: typeof import('fs') | null = null
let path: typeof import('path') | null = null

if (typeof window === 'undefined') {
  // Only import Node.js modules on server-side
  fs = require('fs')
  path = require('path')
}

// Cache for loaded JSON files
const jsonDataCache: Record<string, SiteDataTemplate | null> = {}

/**
 * Load JSON file synchronously (server-side only)
 */
function loadJsonFile(filename: string): SiteDataTemplate | null {
  if (jsonDataCache[filename] !== undefined) {
    return jsonDataCache[filename]
  }
  
  // Only works server-side
  if (typeof window !== 'undefined' || !fs || !path) {
    jsonDataCache[filename] = null
    return null
  }
  
  try {
    const filePath = path.join(process.cwd(), 'ai_builder', 'library', 'sitedata', filename)
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8')
      const data = JSON.parse(content) as SiteDataTemplate
      jsonDataCache[filename] = data
      return data
    }
  } catch (error) {
    console.warn(`Failed to load ${filename}:`, error)
  }
  
  jsonDataCache[filename] = null
  return null
}

/**
 * Load siteData for an industry
 * Returns industry-specific JSON if available, otherwise uses category template
 * Automatically merges industry-specific images
 * 
 * Note: JSON loading only works server-side. For client-side, use getSiteDataTemplate()
 */
export function loadSiteData(industry: string | null): SiteDataTemplate {
  const config = getIndustryConfig(industry)
  const category = config.category || 'general'
  const dataPath = getSiteDataPath(industry)
  
  let siteData: SiteDataTemplate
  
  // If industry has a custom JSON file, try to load it (server-side only)
  if (dataPath && typeof window === 'undefined') {
    const jsonData = loadJsonFile(dataPath)
    if (jsonData) {
      siteData = jsonData
    } else {
      // Fallback to template if JSON load fails
      siteData = getSiteDataTemplate(industry)
    }
  } else {
    // Use category template (works everywhere)
    siteData = getSiteDataTemplate(industry)
  }
  
  // Merge industry-specific images into the siteData
  // This ensures images are industry-appropriate even if using category template
  // allowOverrides=false means JSON file images take precedence
  const hasCustomJson = dataPath && typeof window === 'undefined' && loadJsonFile(dataPath) !== null
  const siteDataWithImages = mergeImagesIntoSiteData(
    JSON.parse(JSON.stringify(siteData)), // Deep clone
    industry,
    category,
    !hasCustomJson // Allow overrides only if no custom JSON (JSON images take precedence)
  )
  
  return siteDataWithImages as SiteDataTemplate
}

/**
 * Check if an industry has a custom JSON file
 */
export function hasCustomSiteData(industry: string | null): boolean {
  const dataPath = getSiteDataPath(industry)
  if (!dataPath || typeof window !== 'undefined' || !fs || !path) {
    return false // Can't check on client-side
  }
  
  const filePath = path.join(process.cwd(), 'ai_builder', 'library', 'sitedata', dataPath)
  return fs.existsSync(filePath)
}

/**
 * Get all available JSON data files (server-side only)
 */
export function getAvailableDataFiles(): string[] {
  if (typeof window !== 'undefined' || !fs || !path) {
    return [] // Can't access filesystem on client-side
  }
  
  try {
    const sitedataDir = path.join(process.cwd(), 'ai_builder', 'library', 'sitedata')
    if (fs.existsSync(sitedataDir)) {
      return fs.readdirSync(sitedataDir)
        .filter(file => file.endsWith('.json') && file !== 'default.json')
    }
  } catch (error) {
    console.warn('Failed to read sitedata directory:', error)
  }
  
  return []
}

