'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Search, ShoppingCart, Heart, User, Menu, X, Star, Filter, SortAsc, ChevronDown, Plus, Minus, Check, Truck, Shield, Award, Zap, SlidersHorizontal } from 'lucide-react'

const products = [
  {
    id: 1,
    name: 'Sony WH-1000XM5 Wireless Headphones',
    price: 399.99,
    originalPrice: 499.99,
    rating: 4.8,
    reviews: 2847,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Electronics',
    inStock: true,
    badge: 'Best Seller',
    description: 'Industry-leading noise canceling with Dual Noise Sensor technology',
    features: ['30-hour battery life', 'Quick charge', 'Touch controls', 'Hi-Res Audio'],
    brand: 'Sony',
    shipping: 'Free 2-day shipping'
  },
  {
    id: 2,
    name: 'Apple Watch Series 9 GPS',
    price: 399.99,
    originalPrice: 499.99,
    rating: 4.9,
    reviews: 1892,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Electronics',
    inStock: true,
    badge: 'New',
    description: 'The most advanced Apple Watch with health monitoring and fitness tracking',
    features: ['Always-on display', 'ECG app', 'Fall detection', 'Water resistant'],
    brand: 'Apple',
    shipping: 'Free 2-day shipping'
  },
  {
    id: 3,
    name: 'Logitech MX Master 3S Mouse',
    price: 99.99,
    originalPrice: 119.99,
    rating: 4.6,
    reviews: 2156,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Electronics',
    inStock: true,
    badge: 'Professional',
    description: 'Advanced wireless mouse with precision tracking and ergonomic design',
    features: ['70-day battery', 'Darkfield sensor', 'Multi-device', 'Silent clicks'],
    brand: 'Logitech',
    shipping: 'Free 2-day shipping'
  },
  {
    id: 4,
    name: 'Herman Miller Aeron Chair',
    price: 1299.99,
    originalPrice: 1499.99,
    rating: 4.8,
    reviews: 892,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Furniture',
    inStock: true,
    badge: 'Premium',
    description: 'Iconic ergonomic office chair designed for all-day comfort',
    features: ['PostureFit SL', 'Tilt limiter', 'Forward tilt', '12-year warranty'],
    brand: 'Herman Miller',
    shipping: 'Free 2-day shipping'
  },
  {
    id: 5,
    name: 'Keychron K8 Pro Wireless Keyboard',
    price: 89.99,
    originalPrice: 109.99,
    rating: 4.5,
    reviews: 1567,
    image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Electronics',
    inStock: true,
    badge: 'Gaming',
    description: 'Wireless mechanical keyboard with hot-swappable switches',
    features: ['Bluetooth 5.1', 'RGB backlight', 'Hot-swappable', 'Mac/Windows compatible'],
    brand: 'Keychron',
    shipping: 'Free 2-day shipping'
  },
  {
    id: 6,
    name: 'Dell XPS 13 Laptop',
    price: 1299.99,
    originalPrice: 1499.99,
    rating: 4.5,
    reviews: 743,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Computers',
    inStock: true,
    badge: 'Premium',
    description: 'Ultra-thin laptop with stunning 13.4" InfinityEdge display',
    features: ['Intel i7 processor', '16GB RAM', '512GB SSD', 'Touch display'],
    brand: 'Dell',
    shipping: 'Free 2-day shipping'
  },
  {
    id: 7,
    name: 'Samsung 4K Monitor 32"',
    price: 599.99,
    originalPrice: 699.99,
    rating: 4.6,
    reviews: 432,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Computers',
    inStock: true,
    badge: 'Professional',
    description: '32" 4K UHD monitor with HDR10 and 99% sRGB color coverage',
    features: ['4K resolution', 'HDR10', 'USB-C', 'Adjustable stand'],
    brand: 'Samsung',
    shipping: 'Free 2-day shipping'
  }
]

const categories = ['All', 'Electronics', 'Gaming', 'Accessories', 'Computers', 'Furniture', 'Fashion']

const brands = ['All', 'Sony', 'Apple', 'Logitech', 'Herman Miller', 'Keychron', 'Dell', 'Samsung']

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Customer Rating' },
  { value: 'newest', label: 'Newest' },
  { value: 'popular', label: 'Most Popular' }
]

export default function EcommerceDemo() {
  const [cart, setCart] = useState<any[]>([])
  const [wishlist, setWishlist] = useState<number[]>([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedBrand, setSelectedBrand] = useState('All')
  const [sortBy, setSortBy] = useState('featured')
  const [searchQuery, setSearchQuery] = useState('')
  const [priceRange, setPriceRange] = useState([0, 2000])
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showCart, setShowCart] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [addedToCart, setAddedToCart] = useState<number | null>(null)
  const [showCheckout, setShowCheckout] = useState(false)

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory
    const matchesBrand = selectedBrand === 'All' || product.brand === selectedBrand
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         product.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
    return matchesCategory && matchesBrand && matchesSearch && matchesPrice
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'rating':
        return b.rating - a.rating
      case 'newest':
        return b.id - a.id
      case 'popular':
        return b.reviews - a.reviews
      default:
        return 0
    }
  })

  const addToCart = (product: any) => {
    setIsLoading(true)
    setAddedToCart(product.id)
    
    const existingItem = cart.find(item => item.id === product.id)
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
    }

    setTimeout(() => {
      setIsLoading(false)
      setAddedToCart(null)
    }, 1000)
  }

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(productId)
    } else {
      setCart(cart.map(item => 
        item.id === productId 
          ? { ...item, quantity }
          : item
      ))
    }
  }

  const toggleWishlist = (productId: number) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-8">
              <div className="hidden md:block">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  TechStore Pro
                </h1>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-lg mx-8 hidden md:block">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search premium products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all duration-300">
                <Heart className="h-6 w-6" />
              </button>
              <button 
                onClick={() => setShowCart(true)}
                className="relative p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all duration-300"
              >
                <ShoppingCart className="h-6 w-6" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-pulse">
                    {cart.length}
                  </span>
                )}
              </button>
              <button className="p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all duration-300">
                <User className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
              Premium Tech
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Redefined
              </span>
            </h2>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Discover cutting-edge technology and premium accessories designed for professionals and enthusiasts.
            </p>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 mb-12">
              <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200">
                <Truck className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium text-gray-700">Free 2-Day Shipping</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200">
                <Shield className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-medium text-gray-700">2-Year Warranty</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200">
                <Award className="h-5 w-5 text-purple-500" />
                <span className="text-sm font-medium text-gray-700">Premium Quality</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Search and Filters */}
      <section className="py-8 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Bar */}
          <div className="mb-8">
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search products, brands, or descriptions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Filters and Sort */}
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Categories */}
            <div className="flex flex-wrap gap-4">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                      : 'bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Filter and Sort Controls */}
            <div className="flex items-center space-x-4">
              {/* Brand Filter */}
              <div className="relative">
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                >
                  {brands.map((brand) => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Advanced Filters Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-300"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>Filters</span>
              </button>
            </div>
          </div>

          {/* Advanced Filters Panel */}
          {showFilters && (
            <div className="mt-6 bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Price Range</label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">${priceRange[0]}</span>
                      <input
                        type="range"
                        min="0"
                        max="2000"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                        className="flex-1"
                      />
                      <span className="text-sm text-gray-500">${priceRange[1]}</span>
                    </div>
                    <div className="text-center text-sm text-gray-600">
                      ${priceRange[0]} - ${priceRange[1]}
                    </div>
                  </div>
                </div>

                {/* Rating Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Minimum Rating</label>
                  <div className="flex items-center space-x-1">
                    {[4, 3, 2, 1].map((rating) => (
                      <button
                        key={rating}
                        className="flex items-center space-x-1 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">{rating}+</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Availability</label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded text-blue-500" defaultChecked />
                      <span className="text-sm text-gray-600">In Stock</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded text-blue-500" />
                      <span className="text-sm text-gray-600">On Sale</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Results Count */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Showing <span className="font-semibold text-gray-900">{filteredProducts.length}</span> products
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Product Image */}
                <div className="relative h-64 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      product.badge === 'Best Seller' ? 'bg-red-500 text-white' :
                      product.badge === 'New' ? 'bg-green-500 text-white' :
                      product.badge === 'Premium' ? 'bg-purple-500 text-white' :
                      product.badge === 'Professional' ? 'bg-blue-500 text-white' :
                      'bg-yellow-500 text-white'
                    }`}>
                      {product.badge}
                    </span>
                  </div>
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-300 ${
                      wishlist.includes(product.id)
                        ? 'bg-red-500 text-white'
                        : 'bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white'
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${wishlist.includes(product.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <div className="mb-3">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">{product.name}</h3>
                    <p className="text-gray-600 text-sm">{product.brand}</p>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-gray-700">{product.rating}</span>
                      <span className="text-sm text-gray-500">({product.reviews})</span>
                    </div>
                    <span className="text-sm text-gray-500 font-medium">{product.shipping}</span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                      {product.originalPrice && (
                        <span className="text-lg text-gray-500 line-through">${product.originalPrice}</span>
                      )}
                    </div>
                    <div className="flex items-center space-x-1 text-green-600">
                      <Truck className="h-4 w-4" />
                      <span className="text-xs font-medium">Free</span>
                    </div>
                  </div>

                  <button
                    onClick={() => addToCart(product)}
                    disabled={isLoading && addedToCart === product.id}
                    className={`w-full py-3 px-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                      isLoading && addedToCart === product.id
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {isLoading && addedToCart === product.id ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Adding...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <ShoppingCart className="h-4 w-4" />
                        <span>Add to Cart</span>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCart(false)}></div>
          <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-2xl transform transition-transform duration-300">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Shopping Cart</h3>
                <button
                  onClick={() => setShowCart(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={60}
                        height={60}
                        className="rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm">{item.name}</h4>
                        <p className="text-gray-600 text-sm">${item.price}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-gray-200 rounded transition-colors"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="px-2 py-1 bg-white rounded text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-gray-200 rounded transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {cart.length > 0 && (
              <div className="p-6 border-t border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold text-gray-900">Total:</span>
                  <span className="text-2xl font-bold text-gray-900">${cartTotal.toFixed(2)}</span>
                </div>
                <button 
                  onClick={() => setShowCheckout(true)}
                  className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-2xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCheckout(false)}></div>
          <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl transform transition-transform duration-300">
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-gray-900">Checkout</h3>
                  <button
                    onClick={() => setShowCheckout(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>
              
              {/* Checkout Steps */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-8">
                  {/* Step 1: Shipping Information */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Shipping Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="First Name"
                        className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="Last Name"
                        className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="email"
                        placeholder="Email Address"
                        className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="Address"
                        className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 md:col-span-2"
                      />
                      <input
                        type="text"
                        placeholder="City"
                        className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="ZIP Code"
                        className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Step 2: Payment Method */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h4>
                    <div className="space-y-4">
                      <div className="border border-gray-300 rounded-xl p-4 hover:border-blue-500 transition-colors cursor-pointer">
                        <div className="flex items-center space-x-3">
                          <input type="radio" name="payment" className="text-blue-500" defaultChecked />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">Credit Card</p>
                            <p className="text-sm text-gray-500">Visa, Mastercard, American Express</p>
                          </div>
                        </div>
                      </div>
                      <div className="border border-gray-300 rounded-xl p-4 hover:border-blue-500 transition-colors cursor-pointer">
                        <div className="flex items-center space-x-3">
                          <input type="radio" name="payment" className="text-blue-500" />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">PayPal</p>
                            <p className="text-sm text-gray-500">Pay with your PayPal account</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 3: Order Summary */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h4>
                    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                      {cart.map((item) => (
                        <div key={item.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={40}
                              height={40}
                              className="rounded-lg object-cover"
                            />
                            <div>
                              <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                              <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                            </div>
                          </div>
                          <p className="font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      ))}
                      <div className="border-t border-gray-200 pt-3">
                        <div className="flex justify-between items-center text-lg font-bold text-gray-900">
                          <span>Total</span>
                          <span>${cartTotal.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Footer */}
              <div className="p-6 border-t border-gray-200">
                <div className="flex space-x-4">
                  <button
                    onClick={() => setShowCheckout(false)}
                    className="flex-1 py-3 px-6 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Back to Cart
                  </button>
                  <button className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300">
                    Complete Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}