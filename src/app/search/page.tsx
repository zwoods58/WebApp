'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Search, Globe, DollarSign, ArrowRight } from 'lucide-react'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [language, setLanguage] = useState('en')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const query = searchParams.get('q')
    const lang = searchParams.get('lang') || 'en'
    
    if (query) {
      setSearchQuery(query)
      setLanguage(lang)
      performSearch(query, lang)
    }
  }, [searchParams])

  const performSearch = async (query: string, lang: string) => {
    setIsLoading(true)
    
    // Simulate search results based on query
    const results = [
      {
        title: 'Web Development Services',
        description: 'Professional web development with modern technologies',
        url: '/services',
        type: 'service'
      },
      {
        title: 'Portfolio',
        description: 'View our recent projects and case studies',
        url: '/portfolio',
        type: 'portfolio'
      },
      {
        title: 'Contact Us',
        description: 'Get in touch for a free consultation',
        url: '/contact',
        type: 'contact'
      },
      {
        title: 'About Us',
        description: 'Learn more about our team and expertise',
        url: '/about',
        type: 'about'
      }
    ].filter(result => 
      result.title.toLowerCase().includes(query.toLowerCase()) ||
      result.description.toLowerCase().includes(query.toLowerCase())
    )

    setSearchResults(results)
    setIsLoading(false)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}&lang=${language}`)
    }
  }

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang)
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}&lang=${newLang}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50">
        <div className="container-max py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10">
                <img src="/Logo.png" alt="AtarWebb Logo" className="w-full h-full object-contain" />
              </div>
              <h1 className="text-2xl font-bold text-white">AtarWebb Search</h1>
            </div>
            
            {/* Language Selector */}
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer border border-blue-500"
            >
              <option value="en">🇺🇸 English (USD)</option>
              <option value="sw">🇰🇪 Swahili (KES)</option>
              <option value="fr">🇫🇷 French (EUR)</option>
              <option value="es">🇪🇸 Spanish (EUR)</option>
              <option value="de">🇩🇪 German (EUR)</option>
              <option value="it">🇮🇹 Italian (EUR)</option>
              <option value="pt">🇵🇹 Portuguese (EUR)</option>
              <option value="ar">🇸🇦 Arabic (USD)</option>
              <option value="hi">🇮🇳 Hindi (INR)</option>
              <option value="zh">🇨🇳 Chinese (USD)</option>
              <option value="ja">🇯🇵 Japanese (JPY)</option>
              <option value="ko">🇰🇷 Korean (KRW)</option>
              <option value="ru">🇷🇺 Russian (RUB)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Search Form */}
      <div className="container-max py-8">
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search AtarWebb services, portfolio, or contact information..."
              className="w-full pl-12 pr-4 py-4 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Search
            </button>
          </div>
        </form>

        {/* Search Results */}
        {isLoading ? (
          <div className="max-w-2xl mx-auto mt-8">
            <div className="text-center text-white">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2">Searching...</p>
            </div>
          </div>
        ) : searchResults.length > 0 ? (
          <div className="max-w-2xl mx-auto mt-8 space-y-4">
            <h2 className="text-xl font-semibold text-white mb-4">
              Search Results for "{searchQuery}"
            </h2>
            {searchResults.map((result, index) => (
              <div
                key={index}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 hover:bg-slate-700/50 transition-colors cursor-pointer"
                onClick={() => router.push(result.url)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">{result.title}</h3>
                    <p className="text-gray-400 mb-3">{result.description}</p>
                    <div className="flex items-center text-sm text-blue-400">
                      <span className="capitalize">{result.type}</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Globe className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : searchQuery ? (
          <div className="max-w-2xl mx-auto mt-8 text-center">
            <div className="text-gray-400 mb-4">
              <Search className="w-12 h-12 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">No results found</h2>
              <p>Try searching for "services", "portfolio", "contact", or "about"</p>
            </div>
          </div>
        ) : null}

        {/* Quick Actions */}
        <div className="max-w-2xl mx-auto mt-12">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => router.push('/services')}
              className="bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 rounded-lg p-4 text-left transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Globe className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Our Services</h4>
                  <p className="text-sm text-gray-400">View our web development packages</p>
                </div>
              </div>
            </button>
            
            <button
              onClick={() => router.push('/contact')}
              className="bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 rounded-lg p-4 text-left transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Get Quote</h4>
                  <p className="text-sm text-gray-400">Contact us for pricing</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
