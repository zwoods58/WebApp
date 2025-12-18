'use client'

import { useState } from 'react'
import { PageHeader } from '../../src/components/sections/PageHeader'
import PricingComponent from '../../src/components/ui/adaptive-pricing-section'
import { BackgroundPaths } from '../../src/components/ui/background-paths'
import { CTAWithFooter } from '../../src/components/sections/CTAWithFooter'

interface AfricanCountry {
  code: string
  name: string
  currency: string
  symbol: string
  exchangeRate: number // Rate to convert from USD
}

const africanCountries: AfricanCountry[] = [
  { code: 'dz', name: 'Algeria', currency: 'DZD', symbol: 'د.ج', exchangeRate: 135 },
  { code: 'ao', name: 'Angola', currency: 'AOA', symbol: 'Kz', exchangeRate: 850 },
  { code: 'bj', name: 'Benin', currency: 'XOF', symbol: 'CFA', exchangeRate: 600 },
  { code: 'bw', name: 'Botswana', currency: 'BWP', symbol: 'P', exchangeRate: 13.5 },
  { code: 'bf', name: 'Burkina Faso', currency: 'XOF', symbol: 'CFA', exchangeRate: 600 },
  { code: 'bi', name: 'Burundi', currency: 'BIF', symbol: 'FBu', exchangeRate: 2850 },
  { code: 'cm', name: 'Cameroon', currency: 'XAF', symbol: 'FCFA', exchangeRate: 600 },
  { code: 'cv', name: 'Cape Verde', currency: 'CVE', symbol: 'Esc', exchangeRate: 101 },
  { code: 'td', name: 'Chad', currency: 'XAF', symbol: 'FCFA', exchangeRate: 600 },
  { code: 'km', name: 'Comoros', currency: 'KMF', symbol: 'CF', exchangeRate: 450 },
  { code: 'ci', name: 'Cote d\'Ivoire', currency: 'XOF', symbol: 'CFA', exchangeRate: 600 },
  { code: 'cd', name: 'Democratic Republic of the Congo', currency: 'CDF', symbol: 'FC', exchangeRate: 2800 },
  { code: 'dj', name: 'Djibouti', currency: 'DJF', symbol: 'Fdj', exchangeRate: 178 },
  { code: 'eg', name: 'Egypt', currency: 'EGP', symbol: 'E£', exchangeRate: 48 },
  { code: 'er', name: 'Eritrea', currency: 'ERN', symbol: 'Nfk', exchangeRate: 15 },
  { code: 'et', name: 'Ethiopia', currency: 'ETB', symbol: 'Br', exchangeRate: 55 },
  { code: 'ga', name: 'Gabon Republic', currency: 'XAF', symbol: 'FCFA', exchangeRate: 600 },
  { code: 'gm', name: 'Gambia', currency: 'GMD', symbol: 'D', exchangeRate: 68 },
  { code: 'gn', name: 'Guinea', currency: 'GNF', symbol: 'FG', exchangeRate: 8600 },
  { code: 'gw', name: 'Guinea-Bissau', currency: 'XOF', symbol: 'CFA', exchangeRate: 600 },
  { code: 'ke', name: 'Kenya', currency: 'KES', symbol: 'KSh', exchangeRate: 130 },
  { code: 'ls', name: 'Lesotho', currency: 'LSL', symbol: 'L', exchangeRate: 18.5 },
  { code: 'mg', name: 'Madagascar', currency: 'MGA', symbol: 'Ar', exchangeRate: 4500 },
  { code: 'mw', name: 'Malawi', currency: 'MWK', symbol: 'MK', exchangeRate: 1700 },
  { code: 'ml', name: 'Mali', currency: 'XOF', symbol: 'CFA', exchangeRate: 600 },
  { code: 'mr', name: 'Mauritania', currency: 'MRU', symbol: 'UM', exchangeRate: 36 },
  { code: 'mu', name: 'Mauritius', currency: 'MUR', symbol: '₨', exchangeRate: 45 },
  { code: 'ma', name: 'Morocco', currency: 'MAD', symbol: 'DH', exchangeRate: 10 },
  { code: 'mz', name: 'Mozambique', currency: 'MZN', symbol: 'MT', exchangeRate: 64 },
  { code: 'na', name: 'Namibia', currency: 'NAD', symbol: 'N$', exchangeRate: 18.5 },
  { code: 'ne', name: 'Niger', currency: 'XOF', symbol: 'CFA', exchangeRate: 600 },
  { code: 'ng', name: 'Nigeria', currency: 'NGN', symbol: '₦', exchangeRate: 1500 },
  { code: 'cg', name: 'Republic of the Congo', currency: 'XAF', symbol: 'FCFA', exchangeRate: 600 },
  { code: 'rw', name: 'Rwanda', currency: 'RWF', symbol: 'RF', exchangeRate: 1300 },
  { code: 'sh', name: 'Saint Helena', currency: 'SHP', symbol: '£', exchangeRate: 0.8 },
  { code: 'st', name: 'Sao Tome and Principe', currency: 'STN', symbol: 'Db', exchangeRate: 22.5 },
  { code: 'sn', name: 'Senegal', currency: 'XOF', symbol: 'CFA', exchangeRate: 600 },
  { code: 'sc', name: 'Seychelles', currency: 'SCR', symbol: '₨', exchangeRate: 13.5 },
  { code: 'sl', name: 'Sierra Leone', currency: 'SLL', symbol: 'Le', exchangeRate: 22000 },
  { code: 'so', name: 'Somalia', currency: 'SOS', symbol: 'Sh', exchangeRate: 570 },
  { code: 'za', name: 'South Africa', currency: 'ZAR', symbol: 'R', exchangeRate: 18.5 },
  { code: 'sz', name: 'Swaziland', currency: 'SZL', symbol: 'L', exchangeRate: 18.5 },
  { code: 'tz', name: 'Tanzania', currency: 'TZS', symbol: 'TSh', exchangeRate: 2300 },
  { code: 'tg', name: 'Togo', currency: 'XOF', symbol: 'CFA', exchangeRate: 600 },
  { code: 'tn', name: 'Tunisia', currency: 'TND', symbol: 'د.ت', exchangeRate: 3.1 },
  { code: 'ug', name: 'Uganda', currency: 'UGX', symbol: 'USh', exchangeRate: 3700 },
  { code: 'zm', name: 'Zambia', currency: 'ZMW', symbol: 'ZK', exchangeRate: 25 },
  { code: 'zw', name: 'Zimbabwe', currency: 'USD', symbol: '$', exchangeRate: 1 },
  { code: 'us', name: 'United States', currency: 'USD', symbol: '$', exchangeRate: 1 },
]

// Base prices in USD
const africaBasePrices = {
  tier1: { min: 50, max: 250 },
  tier2: { min: 300, max: 500 },
  tier3: { min: 600, max: 900 },
  hosting: 80,
}

const americaBasePrices = {
  tier1: { min: 200, max: 300 },
  tier2: { min: 400, max: 700 },
  tier3: { min: 800, max: 2000 },
  hosting: 120,
}

export default function Products() {
  const [selectedRegion, setSelectedRegion] = useState<'america' | 'africa'>('america')
  const [selectedCountry, setSelectedCountry] = useState<string>('')

  // Get current currency info
  const getCurrencyInfo = () => {
    if (selectedRegion === 'america') {
      return { symbol: '$', exchangeRate: 1 }
    }
    if (selectedCountry) {
      const country = africanCountries.find((c) => c.code === selectedCountry)
      return country ? { symbol: country.symbol, exchangeRate: country.exchangeRate } : { symbol: '$', exchangeRate: 1 }
    }
    return { symbol: '$', exchangeRate: 1 }
  }

  const currencyInfo = getCurrencyInfo()

  // Convert price range to local currency
  const convertPriceRange = (minUSD: number, maxUSD: number, exchangeRate: number): { min: number, max: number } => {
    return {
      min: Math.round(minUSD * exchangeRate),
      max: Math.round(maxUSD * exchangeRate)
    }
  }

  // Get plans for pricing component
  const getPlans = () => {
    try {
      const basePrices = selectedRegion === 'america' ? americaBasePrices : africaBasePrices
      const { symbol, exchangeRate } = currencyInfo

      const tier1Range = convertPriceRange(basePrices.tier1.min, basePrices.tier1.max, exchangeRate)
      const tier2Range = convertPriceRange(basePrices.tier2.min, basePrices.tier2.max, exchangeRate)
      const tier3Range = convertPriceRange(basePrices.tier3.min, basePrices.tier3.max, exchangeRate)

      // Format price range with currency symbol
      const formatPriceRange = (range: { min: number, max: number }) => {
        if (!range || isNaN(range.min) || isNaN(range.max)) return `${symbol}0`
        const minFormatted = range.min.toLocaleString('en-US', { 
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        })
        const maxFormatted = range.max.toLocaleString('en-US', { 
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        })
        
        // Handle currency symbol positioning
        // Arabic currencies (RTL) and some others might need different formatting
        const isArabicCurrency = symbol.includes('د') || symbol.includes('ت')
        
        // For longer currency symbols (like FCFA), ensure proper spacing
        const hasLongSymbol = symbol.length > 3
        
        if (isArabicCurrency) {
          // For Arabic currencies, symbol typically comes after
          return `${minFormatted}–${maxFormatted}+ ${symbol}`
        } else if (hasLongSymbol) {
          // For longer symbols, add a space after the symbol for better readability
          return `${symbol} ${minFormatted}–${maxFormatted}+`
        } else {
          // For most currencies, symbol comes before with optional space
          return `${symbol}${minFormatted}–${maxFormatted}+`
        }
      }

    return [
      {
        name: 'Tier 1',
        subtitle: 'STARTER',
        price: formatPriceRange(tier1Range),
        description: 'Perfect for small businesses just getting started online',
        features: [
          { text: '1–3 page responsive website', included: true },
          { text: 'WhatsApp chat button integration', included: true },
          { text: 'Google Business listing setup', included: true },
          { text: 'Basic SEO (titles, keywords, sitemap)', included: true },
          { text: 'Free minor edits within 7 days after launch', included: true },
          { text: '1-month support', included: true },
          { text: 'Free hosting', included: true },
          { text: 'Domain & email purchased after final payment', included: true },
          { 
            text: 'Payment Plan: 30% deposit • 70% after completion',
            included: true,
            hasInfo: true,
            tooltip: 'Full payment required before domain/email setup'
          },
        ],
        buttonText: 'Get Started',
        buttonHref: '/contact',
      },
      {
        name: 'Tier 2',
        subtitle: 'PROFESSIONAL',
        price: formatPriceRange(tier2Range),
        description: 'Ideal for growing businesses needing more features',
        highlighted: true,
        badge: {
          text: 'MOST POPULAR'
        },
        features: [
          { text: '4–6 page custom website', included: true },
          { text: 'Automation (booking, quotes, or order forms)', included: true },
          { text: 'Contact form + email notifications', included: true },
          { text: 'Gallery or product/service display', included: true },
          { text: 'Payment button (Paystack, Flutterwave, or manual setup)', included: true },
          { text: 'SEO optimization + analytics', included: true },
          { text: '1-month support', included: true },
          { text: 'Free hosting', included: true },
          { text: 'Domain/email/API setup after full payment', included: true },
          { 
            text: 'Payment Plan: 40% deposit after design approval • 60% after completion',
            included: true,
            hasInfo: true,
            tooltip: 'Deposit required after design approval, remainder after completion'
          },
        ],
        buttonText: 'Get Started',
        buttonHref: '/contact',
      },
      {
        name: 'Tier 3',
        subtitle: 'ENTERPRISE',
        price: formatPriceRange(tier3Range),
        description: 'Complete solution for established businesses',
        features: [
          { text: '7–10 page premium responsive site', included: true },
          { text: 'Full e-commerce (catalog, cart, checkout, payments)', included: true },
          { text: 'Advanced CRM (automated replies, lead capture, API integration)', included: true },
          { text: 'SEO optimization + Google Analytics', included: true },
          { text: 'Custom domain + business email setup', included: true },
          { text: 'Polished visual animations', included: true },
          { text: '1-month post-launch support', included: true },
          { text: `Optional care plan (${symbol}${selectedRegion === 'america' ? '25–40' : '10–25'}/month)`, included: true },
          { 
            text: `Monthly hosting: ${symbol}${Math.round((basePrices.hosting * exchangeRate) / 12).toLocaleString('en-US')}/month`,
            included: true,
            hasInfo: true,
            tooltip: 'Hosting fee billed monthly from project start'
          },
          { 
            text: 'Payment Plan: 30% deposit • 40% mid-project • 30% after completion',
            included: true,
            hasInfo: true,
            tooltip: 'Three payment installments throughout the project'
          },
        ],
        buttonText: 'Get Started',
        buttonHref: '/contact',
      },
    ]
    } catch (error) {
      console.error('Error generating plans:', error)
      return []
    }
  }

  const plans = getPlans()

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-black relative overflow-hidden" style={{ fontFamily: 'Encode Sans, sans-serif' }}>
      {/* Background Paths */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-30" style={{ color: '#000000' }}>
        <BackgroundPaths title="" />
      </div>
      
      <PageHeader />
      <div className="pt-24 relative z-10">
        <div className="max-w-7xl mx-auto px-8 py-20">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 text-center" style={{ fontFamily: 'Encode Sans, sans-serif' }}>
            Elevate Your Business
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed mb-12 text-center max-w-3xl mx-auto" style={{ fontFamily: 'Encode Sans, sans-serif' }}>
            Discover our range of website packages designed for small businesses. Choose the perfect plan for your needs.
          </p>

          {/* Region Selector - Enhanced */}
          <div className="flex flex-col items-center mb-16 space-y-6">
            <div className="inline-flex bg-gray-200 rounded-xl p-1.5 border-2 border-gray-300 shadow-sm">
              <button
                onClick={() => {
                  setSelectedRegion('america')
                  setSelectedCountry('')
                }}
                className={`px-8 py-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
                  selectedRegion === 'america'
                    ? 'bg-black text-white shadow-md'
                    : 'text-gray-700 hover:text-black'
                }`}
              >
                North America
              </button>
              <button
                onClick={() => {
                  setSelectedRegion('africa')
                  setSelectedCountry('')
                }}
                className={`px-8 py-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
                  selectedRegion === 'africa'
                    ? 'bg-black text-white shadow-md'
                    : 'text-gray-700 hover:text-black'
                }`}
              >
                Africa
              </button>
            </div>

            {/* Country Selector for Africa - Enhanced */}
            {selectedRegion === 'africa' && (
              <div className="w-full max-w-lg">
                <label htmlFor="country-select" className="block text-base font-semibold text-black mb-3 text-center">
                  Select Your Country
                </label>
                <select
                  id="country-select"
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full px-5 py-3.5 border-2 border-gray-300 bg-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm hover:border-gray-400 text-black font-medium"
                >
                  <option value="">All African Countries (USD)</option>
                  {africanCountries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name} ({country.currency})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Pricing Section */}
          {plans && plans.length > 0 && (
            <div className="mb-12">
              <PricingComponent
                title="Website Packages"
                subtitle={selectedRegion === 'america'
                  ? 'All prices in USD. Contact us for custom pricing and payment plans.'
                  : selectedCountry
                  ? `Prices displayed in ${africanCountries.find((c) => c.code === selectedCountry)?.currency || 'local currency'}. Exchange rates are approximate.`
                  : 'All prices in USD. Select your country to see prices in your local currency.'}
                tiers={plans}
                className="py-0"
              />
            </div>
          )}

          {/* Note */}
          <div className="text-center">
            <p className="text-gray-700 text-sm">
              {selectedRegion === 'america'
                ? 'Contact us for custom pricing and payment plans.'
                : selectedCountry
                ? 'Exchange rates are approximate. Contact us for exact pricing.'
                : 'Contact us for custom pricing and payment plans.'}
            </p>
          </div>
        </div>
      </div>
      <CTAWithFooter />
    </div>
  )
}

