/**
 * Enhanced Package Manager Component
 * P1 Feature 9: Enhanced Package Management
 * 
 * Package search UI, install/uninstall UI, import resolution
 */

'use client'

import React, { useState, useEffect } from 'react'
import { Search, Package, X, Check, Loader2, ExternalLink } from 'lucide-react'

interface PackageInfo {
  name: string
  version: string
  description: string
  downloads: number
  repository?: string
  homepage?: string
}

interface InstalledPackage {
  name: string
  version: string
  type: 'dependency' | 'devDependency'
}

interface PackageManagerProps {
  projectId: string
  onPackageChange?: (packages: InstalledPackage[]) => void
}

export default function PackageManager({ projectId, onPackageChange }: PackageManagerProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<PackageInfo[]>([])
  const [installedPackages, setInstalledPackages] = useState<InstalledPackage[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isInstalling, setIsInstalling] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<PackageInfo | null>(null)

  // Search packages
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    const searchTimeout = setTimeout(async () => {
      setIsSearching(true)
      try {
        // In production, call npm registry API
        const response = await fetch(`https://registry.npmjs.org/-/v1/search?text=${encodeURIComponent(searchQuery)}&size=10`)
        const data = await response.json()
        
        const packages: PackageInfo[] = data.objects?.map((pkg: any) => ({
          name: pkg.package.name,
          version: pkg.package.version,
          description: pkg.package.description || '',
          downloads: 0, // Would get from npm stats API
          repository: pkg.package.links?.repository,
          homepage: pkg.package.links?.homepage
        })) || []

        setSearchResults(packages)
      } catch (error) {
        console.error('Package search error:', error)
      } finally {
        setIsSearching(false)
      }
    }, 500)

    return () => clearTimeout(searchTimeout)
  }, [searchQuery])

  // Load installed packages
  useEffect(() => {
    loadInstalledPackages()
  }, [projectId])

  const loadInstalledPackages = async () => {
    try {
      const response = await fetch(`/api/ai-builder/projects/${projectId}/packages`)
      if (response.ok) {
        const data = await response.json()
        setInstalledPackages(data.packages || [])
      }
    } catch (error) {
      console.error('Failed to load packages:', error)
    }
  }

  const handleInstall = async (pkg: PackageInfo, asDev: boolean = false) => {
    setIsInstalling(true)
    try {
      const response = await fetch('/api/ai-builder/packages/install', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`
        },
        body: JSON.stringify({
          projectId,
          packageName: pkg.name,
          version: pkg.version,
          dev: asDev
        })
      })

      if (response.ok) {
        await loadInstalledPackages()
        onPackageChange?.(installedPackages)
        setSearchQuery('')
        setSearchResults([])
      }
    } catch (error) {
      console.error('Install error:', error)
    } finally {
      setIsInstalling(false)
    }
  }

  const handleUninstall = async (packageName: string) => {
    try {
      const response = await fetch('/api/ai-builder/packages/uninstall', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`
        },
        body: JSON.stringify({
          projectId,
          packageName
        })
      })

      if (response.ok) {
        await loadInstalledPackages()
        onPackageChange?.(installedPackages)
      }
    } catch (error) {
      console.error('Uninstall error:', error)
    }
  }

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-700">
        <h2 className="text-white font-semibold mb-3">Package Manager</h2>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search npm packages..."
            className="w-full bg-gray-800 text-white px-10 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {isSearching && (
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin text-gray-400" />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Search Results */}
        {searchQuery && searchResults.length > 0 && (
          <div className="p-4 border-b border-gray-700">
            <h3 className="text-gray-400 text-sm font-semibold mb-2">Search Results</h3>
            <div className="space-y-2">
              {searchResults.map((pkg) => (
                <div
                  key={pkg.name}
                  className="bg-gray-800 p-3 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-blue-400" />
                        <span className="text-white font-semibold">{pkg.name}</span>
                        <span className="text-gray-400 text-sm">v{pkg.version}</span>
                      </div>
                      <p className="text-gray-400 text-sm mt-1">{pkg.description}</p>
                      {pkg.repository && (
                        <a
                          href={pkg.repository}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 text-xs hover:underline inline-flex items-center gap-1 mt-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Repository
                        </a>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleInstall(pkg, false)}
                        disabled={isInstalling}
                        className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
                      >
                        Install
                      </button>
                      <button
                        onClick={() => handleInstall(pkg, true)}
                        disabled={isInstalling}
                        className="px-3 py-1.5 bg-gray-700 text-gray-300 text-sm rounded hover:bg-gray-600 disabled:opacity-50"
                      >
                        Dev
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Installed Packages */}
        <div className="p-4">
          <h3 className="text-gray-400 text-sm font-semibold mb-3">
            Installed Packages ({installedPackages.length})
          </h3>
          {installedPackages.length === 0 ? (
            <div className="text-gray-500 text-sm text-center py-8">
              No packages installed. Search and install packages above.
            </div>
          ) : (
            <div className="space-y-2">
              {installedPackages.map((pkg) => (
                <div
                  key={pkg.name}
                  className="bg-gray-800 p-3 rounded-lg flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Package className="w-4 h-4 text-green-400" />
                    <div>
                      <span className="text-white font-semibold">{pkg.name}</span>
                      <span className="text-gray-400 text-sm ml-2">v{pkg.version}</span>
                      <span className={`text-xs ml-2 px-2 py-0.5 rounded ${
                        pkg.type === 'devDependency' ? 'bg-yellow-900/30 text-yellow-400' : 'bg-blue-900/30 text-blue-400'
                      }`}>
                        {pkg.type === 'devDependency' ? 'dev' : 'prod'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleUninstall(pkg.name)}
                    className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded transition-colors"
                    title="Uninstall"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}





