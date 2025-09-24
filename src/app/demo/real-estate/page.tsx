'use client'

import { useState } from 'react'
import { 
  Search, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Heart, 
  Share2, 
  Filter,
  Star,
  DollarSign,
  Calendar,
  Users,
  Home,
  TrendingUp
} from 'lucide-react'

export default function RealEstateDemo() {
  const [activeTab, setActiveTab] = useState('listings')
  const [favorites, setFavorites] = useState(new Set())

  const properties = [
    {
      id: 1,
      title: 'Modern Downtown Condo',
      price: 450000,
      address: '123 Main St, Downtown',
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1200,
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      type: 'Condo',
      yearBuilt: 2020,
      rating: 4.8,
      reviews: 24,
      features: ['Parking', 'Gym', 'Pool', 'Balcony']
    },
    {
      id: 2,
      title: 'Family Suburban Home',
      price: 675000,
      address: '456 Oak Avenue, Suburbs',
      bedrooms: 4,
      bathrooms: 3,
      sqft: 2400,
      image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      type: 'House',
      yearBuilt: 2018,
      rating: 4.9,
      reviews: 31,
      features: ['Garage', 'Garden', 'Fireplace', 'Hardwood Floors']
    },
    {
      id: 3,
      title: 'Luxury Penthouse',
      price: 1200000,
      address: '789 Sky Tower, City Center',
      bedrooms: 3,
      bathrooms: 3,
      sqft: 2800,
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      type: 'Penthouse',
      yearBuilt: 2022,
      rating: 5.0,
      reviews: 18,
      features: ['City View', 'Concierge', 'Rooftop', 'Smart Home']
    },
    {
      id: 4,
      title: 'Cozy Starter Home',
      price: 325000,
      address: '321 Elm Street, Quiet Neighborhood',
      bedrooms: 3,
      bathrooms: 2,
      sqft: 1600,
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      type: 'House',
      yearBuilt: 2015,
      rating: 4.6,
      reviews: 42,
      features: ['Updated Kitchen', 'New Roof', 'Fenced Yard', 'Storage']
    }
  ]

  const marketStats = [
    { label: 'Average Price', value: '$587,500', change: '+5.2%', trend: 'up' },
    { label: 'Properties Listed', value: '1,247', change: '+12%', trend: 'up' },
    { label: 'Days on Market', value: '28', change: '-8%', trend: 'down' },
    { label: 'Price per Sq Ft', value: '$245', change: '+3.1%', trend: 'up' }
  ]

  const toggleFavorite = (propertyId: number) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(propertyId)) {
        newFavorites.delete(propertyId)
      } else {
        newFavorites.add(propertyId)
      }
      return newFavorites
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Home className="h-8 w-8 text-blue-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">PropertyHub</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <button 
                onClick={() => setActiveTab('listings')}
                className={`${activeTab === 'listings' ? 'text-gray-900' : 'text-gray-500'} hover:text-blue-600 font-medium transition-colors`}
              >
                Buy
              </button>
              <button 
                onClick={() => setActiveTab('rentals')}
                className={`${activeTab === 'rentals' ? 'text-gray-900' : 'text-gray-500'} hover:text-blue-600 transition-colors`}
              >
                Rent
              </button>
              <button 
                onClick={() => setActiveTab('sell')}
                className={`${activeTab === 'sell' ? 'text-gray-900' : 'text-gray-500'} hover:text-blue-600 transition-colors`}
              >
                Sell
              </button>
              <button 
                onClick={() => setActiveTab('agents')}
                className={`${activeTab === 'agents' ? 'text-gray-900' : 'text-gray-500'} hover:text-blue-600 transition-colors`}
              >
                Agents
              </button>
            </nav>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => alert('Favorites feature coming soon!')}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <Heart className="h-6 w-6" />
              </button>
              <button 
                onClick={() => alert('Sign in feature coming soon!')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Enter city, neighborhood, or ZIP code"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Property Type</option>
                <option>House</option>
                <option>Condo</option>
                <option>Townhouse</option>
                <option>Land</option>
              </select>
              <select className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Price Range</option>
                <option>Under $300K</option>
                <option>$300K - $500K</option>
                <option>$500K - $750K</option>
                <option>$750K+</option>
              </select>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center">
                <Search className="h-5 w-5 mr-2" />
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'listings', label: 'Property Listings', icon: Home },
              { id: 'map', label: 'Map View', icon: MapPin },
              { id: 'saved', label: 'Saved Properties', icon: Heart },
              { id: 'calculator', label: 'Mortgage Calculator', icon: DollarSign }
            ].map((tab) => {
              const IconComponent = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <IconComponent className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Market Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {marketStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                  <div className="flex items-center">
                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                    <span className={`ml-2 text-sm ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Property Listings */}
        {activeTab === 'listings' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Available Properties</h2>
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600">Filter & Sort</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <div key={property.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-full h-48 object-cover"
                    />
                    <button
                      onClick={() => toggleFavorite(property.id)}
                      className={`absolute top-3 right-3 p-2 rounded-full ${
                        favorites.has(property.id)
                          ? 'bg-red-500 text-white'
                          : 'bg-white text-gray-400 hover:text-red-500'
                      }`}
                    >
                      <Heart className="h-5 w-5" />
                    </button>
                    <div className="absolute top-3 left-3">
                      <span className="bg-blue-600 text-white px-2 py-1 rounded text-sm font-medium">
                        {property.type}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{property.title}</h3>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">{formatPrice(property.price)}</p>
                        <p className="text-sm text-gray-500">${Math.round(property.price / property.sqft)}/sqft</p>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-600 mb-4">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{property.address}</span>
                    </div>
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="flex items-center text-gray-600">
                        <Bed className="h-4 w-4 mr-1" />
                        <span className="text-sm">{property.bedrooms} beds</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Bath className="h-4 w-4 mr-1" />
                        <span className="text-sm">{property.bathrooms} baths</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Square className="h-4 w-4 mr-1" />
                        <span className="text-sm">{property.sqft.toLocaleString()} sqft</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        <span className="text-sm font-medium text-gray-900">{property.rating}</span>
                        <span className="text-sm text-gray-500 ml-1">({property.reviews} reviews)</span>
                      </div>
                      <span className="text-sm text-gray-500">Built {property.yearBuilt}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {property.features.slice(0, 2).map((feature, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          {feature}
                        </span>
                      ))}
                      {property.features.length > 2 && (
                        <span className="text-gray-500 text-xs">+{property.features.length - 2} more</span>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 text-sm font-medium">
                        View Details
                      </button>
                      <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        <Share2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Map View */}
        {activeTab === 'map' && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Interactive Map View</h3>
            <p className="text-gray-600 mb-6">
              Explore properties on an interactive map with neighborhood insights, school districts, and local amenities.
            </p>
            <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
              <span className="text-gray-500">Map integration would be displayed here</span>
            </div>
          </div>
        )}

        {/* Saved Properties */}
        {activeTab === 'saved' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Saved Properties</h2>
            {favorites.size === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No saved properties yet</h3>
                <p className="text-gray-600">Start exploring properties and save your favorites to see them here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.filter(property => favorites.has(property.id)).map((property) => (
                  <div key={property.id} className="bg-white rounded-lg shadow overflow-hidden">
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{property.title}</h3>
                      <p className="text-2xl font-bold text-gray-900 mb-2">{formatPrice(property.price)}</p>
                      <p className="text-sm text-gray-600 mb-4">{property.address}</p>
                      <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Mortgage Calculator */}
        {activeTab === 'calculator' && (
          <div className="bg-white rounded-lg shadow p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Mortgage Calculator</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Home Price</label>
                  <input
                    type="number"
                    placeholder="500,000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Down Payment</label>
                  <input
                    type="number"
                    placeholder="100,000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Interest Rate (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="6.5"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Loan Term (years)</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>15</option>
                    <option>20</option>
                    <option>30</option>
                  </select>
                </div>
                <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 font-medium">
                  Calculate Payment
                </button>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Estimated Monthly Payment</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Principal & Interest</span>
                    <span className="font-semibold">$2,528</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Property Tax</span>
                    <span className="font-semibold">$417</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Home Insurance</span>
                    <span className="font-semibold">$125</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">PMI</span>
                    <span className="font-semibold">$0</span>
                  </div>
                  <hr className="my-4" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Monthly Payment</span>
                    <span>$3,070</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
