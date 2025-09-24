'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Star, Clock, MapPin, Phone, Mail, Menu, X, Plus, Minus, ShoppingCart, Heart, Search, Filter, Zap, Award, Users, DollarSign, ChefHat, Utensils, Coffee, Wine, Music, PartyPopper, Crown, Flame, Volume2, Mic, Headphones, User, LogIn, LogOut, CreditCard, Truck, Store, CheckCircle, AlertCircle, Calendar, Navigation } from 'lucide-react'

const menuCategories = [
  { id: 'appetizers', name: 'APPETIZERS', icon: Utensils, color: 'from-yellow-400 to-orange-500' },
  { id: 'chicken', name: 'CHICKEN SPECIALTIES', icon: ChefHat, color: 'from-red-500 to-pink-600' },
  { id: 'sides', name: 'SIDES & FIXINS', icon: Coffee, color: 'from-green-500 to-emerald-600' },
  { id: 'desserts', name: 'SWEET TREATS', icon: Crown, color: 'from-purple-500 to-pink-600' },
  { id: 'drinks', name: 'BEVERAGES', icon: Wine, color: 'from-blue-500 to-cyan-600' }
]

const menuItems = [
  // Appetizers
  {
    id: 1,
    name: 'CAJUN WINGS',
    description: 'Spicy New Orleans-style wings with our secret Cajun rub, served with blue cheese dip',
    price: 12.99,
    category: 'appetizers',
    image: 'https://images.unsplash.com/photo-1567620832904-9fe5cf23db13?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    spicy: true,
    popular: true,
    rating: 4.8,
    reviews: 127
  },
  {
    id: 2,
    name: 'GUMBO BITES',
    description: 'Deep-fried gumbo balls with shrimp, sausage, and okra in a crispy coating',
    price: 9.99,
    category: 'appetizers',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    spicy: false,
    popular: false,
    rating: 4.6,
    reviews: 89
  },
  {
    id: 3,
    name: 'BOUDIN BALLS',
    description: 'Traditional Louisiana boudin sausage rolled and fried to golden perfection',
    price: 8.99,
    category: 'appetizers',
    image: 'https://images.unsplash.com/photo-1565299507177-b0ac667f28a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    spicy: true,
    popular: true,
    rating: 4.7,
    reviews: 156
  },
  // Chicken Specialties
  {
    id: 4,
    name: 'NOLA FRIED CHICKEN',
    description: 'Our signature buttermilk-brined chicken, double-fried and seasoned with Louisiana spices',
    price: 16.99,
    category: 'chicken',
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    spicy: false,
    popular: true,
    rating: 4.9,
    reviews: 234,
    sizes: ['2 PIECE', '4 PIECE', '8 PIECE', '12 PIECE']
  },
  {
    id: 5,
    name: 'SPICY CAJUN CHICKEN',
    description: 'Extra spicy chicken with our house Cajun seasoning and ghost pepper sauce',
    price: 18.99,
    category: 'chicken',
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    spicy: true,
    popular: true,
    rating: 4.8,
    reviews: 198,
    sizes: ['2 PIECE', '4 PIECE', '8 PIECE', '12 PIECE']
  },
  {
    id: 6,
    name: 'CHICKEN & WAFFLES',
    description: 'Crispy fried chicken served on fluffy Belgian waffles with maple syrup',
    price: 15.99,
    category: 'chicken',
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    spicy: false,
    popular: false,
    rating: 4.7,
    reviews: 145,
    sizes: ['SINGLE', 'DOUBLE', 'TRIPLE']
  },
  // Sides
  {
    id: 7,
    name: 'CAJUN FRIES',
    description: 'Hand-cut fries tossed in our signature Cajun seasoning',
    price: 6.99,
    category: 'sides',
    image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    spicy: true,
    popular: true,
    rating: 4.5,
    reviews: 98
  },
  {
    id: 8,
    name: 'RED BEANS & RICE',
    description: 'Traditional Louisiana red beans and rice with smoked sausage',
    price: 7.99,
    category: 'sides',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    spicy: false,
    popular: false,
    rating: 4.6,
    reviews: 76
  },
  {
    id: 9,
    name: 'MAC & CHEESE',
    description: 'Creamy three-cheese macaroni with a crispy breadcrumb topping',
    price: 8.99,
    category: 'sides',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    spicy: false,
    popular: true,
    rating: 4.7,
    reviews: 112
  },
  // Desserts
  {
    id: 10,
    name: 'BEIGNETS',
    description: 'Traditional New Orleans beignets dusted with powdered sugar',
    price: 5.99,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    spicy: false,
    popular: true,
    rating: 4.8,
    reviews: 167
  },
  {
    id: 11,
    name: 'BREAD PUDDING',
    description: 'Warm bread pudding with bourbon sauce and whipped cream',
    price: 6.99,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    spicy: false,
    popular: false,
    rating: 4.6,
    reviews: 89
  },
  // Drinks
  {
    id: 12,
    name: 'SWEET TEA',
    description: 'Traditional southern sweet tea, brewed fresh daily',
    price: 2.99,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    spicy: false,
    popular: true,
    rating: 4.5,
    reviews: 134
  },
  {
    id: 13,
    name: 'HURRICANE',
    description: 'Classic New Orleans cocktail with rum, passion fruit, and grenadine',
    price: 8.99,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    spicy: false,
    popular: true,
    rating: 4.7,
    reviews: 156
  }
]

const restaurantInfo = {
  name: 'Big Easy Chicken Co.',
  address: '123 Bourbon Street, New Orleans, LA 70116',
  phone: '(504) 555-CHICK',
  email: 'hello@bigeasychicken.com',
  hours: {
    monday: '11:00 AM - 10:00 PM',
    tuesday: '11:00 AM - 10:00 PM',
    wednesday: '11:00 AM - 10:00 PM',
    thursday: '11:00 AM - 10:00 PM',
    friday: '11:00 AM - 11:00 PM',
    saturday: '10:00 AM - 11:00 PM',
    sunday: '10:00 AM - 9:00 PM'
  },
  isOpen: true,
  nextOpenTime: '11:00 AM',
  deliveryRadius: '5 miles',
  deliveryFee: 3.99,
  minOrder: 15.00
}

const testimonials = [
  {
    id: 1,
    name: 'MARIE LEBLANC',
    text: 'Best fried chicken in the Quarter! The Cajun seasoning is absolutely perfect.',
    rating: 5,
    location: 'FRENCH QUARTER'
  },
  {
    id: 2,
    name: 'JACKSON THIBODEAUX',
    text: 'The gumbo bites are incredible! Tastes just like my grandma used to make.',
    rating: 5,
    location: 'GARDEN DISTRICT'
  },
  {
    id: 3,
    name: 'BEATRICE WILLIAMS',
    text: 'Chicken & waffles that will make you dance! The maple syrup is pure magic.',
    rating: 5,
    location: 'TREME'
  }
]

export default function RestaurantDemo() {
  const [selectedCategory, setSelectedCategory] = useState('appetizers')
  const [cart, setCart] = useState<any[]>([])
  const [showCart, setShowCart] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [favorites, setFavorites] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [showContact, setShowContact] = useState(false)
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery')
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [orderNotes, setOrderNotes] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [orderConfirmed, setOrderConfirmed] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [showFavorites, setShowFavorites] = useState(false)

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = item.category === selectedCategory
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const addToCart = (item: any, size?: string) => {
    const cartItem = {
      ...item,
      id: `${item.id}-${size || 'default'}`,
      size: size || 'Regular',
      quantity: 1
    }
    setCart([...cart, cartItem])
  }

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter(item => item.id !== itemId))
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(itemId)
    } else {
      setCart(cart.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      ))
    }
  }

  const toggleFavorite = (itemId: number) => {
    setFavorites(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  const deliveryFee = orderType === 'delivery' ? restaurantInfo.deliveryFee : 0
  const finalTotal = cartTotal + deliveryFee

  const handleLogin = () => {
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
  }

  const handleCheckout = () => {
    setShowCheckout(true)
  }

  const handlePlaceOrder = () => {
    const orderNum = Math.random().toString(36).substr(2, 9).toUpperCase()
    setOrderNumber(orderNum)
    setOrderConfirmed(true)
    setShowCheckout(false)
    setCart([])
  }

  const getCurrentTime = () => {
    const now = new Date()
    const hours = now.getHours()
    const minutes = now.getMinutes()
    const ampm = hours >= 12 ? 'PM' : 'AM'
    const displayHours = hours % 12 || 12
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`
  }

  const isRestaurantOpen = () => {
    const now = new Date()
    const currentHour = now.getHours()
    const currentDay = now.getDay() // 0 = Sunday, 1 = Monday, etc.
    
    // Simple check - restaurant is open 11 AM to 10 PM most days
    if (currentDay === 0) return currentHour >= 10 && currentHour < 21 // Sunday
    if (currentDay === 6) return currentHour >= 10 && currentHour < 23 // Saturday
    return currentHour >= 11 && currentHour < 22 // Monday-Friday
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-red-800 to-yellow-600 relative overflow-hidden">
      {/* Jazz Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-400 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-red-500 rounded-full animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-orange-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-40 right-1/3 w-28 h-28 bg-pink-500 rounded-full animate-bounce"></div>
      </div>

      {/* Header */}
      <header className="bg-gradient-to-r from-purple-900 via-red-800 to-yellow-600 shadow-2xl sticky top-0 z-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            <div className="flex items-center space-x-8">
              <Link href="/portfolio" className="flex items-center space-x-2 text-white hover:text-yellow-300 transition-colors">
                <ArrowLeft className="h-6 w-6" />
                <span className="font-black text-xl">BACK TO PORTFOLIO</span>
              </Link>
              <div className="hidden md:block">
                <h1 className="text-4xl font-black text-white transform -skew-x-12" style={{ 
                  fontFamily: 'serif',
                  textShadow: '4px 4px 0px #ff6b35, 8px 8px 0px #f7931e, 12px 12px 0px #ffd23f',
                  letterSpacing: '2px'
                }}>
                  🎷 BIG EASY CHICKEN CO. 🎺
                </h1>
                <p className="text-yellow-300 text-lg font-bold transform -skew-x-6" style={{ letterSpacing: '3px' }}>
                  ✨ AUTHENTIC NEW ORLEANS FLAVORS ✨
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Restaurant Status */}
              <div className="hidden md:flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                {isRestaurantOpen() ? (
                  <>
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-white font-bold text-sm">OPEN NOW</span>
                  </>
                ) : (
                  <>
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <span className="text-white font-bold text-sm">CLOSED</span>
                  </>
                )}
              </div>

              <button 
                onClick={() => setShowContact(true)}
                className="p-3 text-white hover:text-yellow-300 hover:bg-white/20 rounded-full transition-all duration-300 transform hover:scale-110"
              >
                <MapPin className="h-6 w-6" />
              </button>
              <button 
                onClick={() => setShowSearch(true)}
                className="p-3 text-white hover:text-yellow-300 hover:bg-white/20 rounded-full transition-all duration-300 transform hover:scale-110"
              >
                <Search className="h-6 w-6" />
              </button>
              <button 
                onClick={() => setShowFavorites(true)}
                className="p-3 text-white hover:text-yellow-300 hover:bg-white/20 rounded-full transition-all duration-300 transform hover:scale-110"
              >
                <Heart className="h-6 w-6" />
              </button>
              {isLoggedIn ? (
                <button 
                  onClick={handleLogout}
                  className="p-3 text-white hover:text-yellow-300 hover:bg-white/20 rounded-full transition-all duration-300 transform hover:scale-110"
                >
                  <LogOut className="h-6 w-6" />
                </button>
              ) : (
                <button 
                  onClick={handleLogin}
                  className="p-3 text-white hover:text-yellow-300 hover:bg-white/20 rounded-full transition-all duration-300 transform hover:scale-110"
                >
                  <LogIn className="h-6 w-6" />
                </button>
              )}
              <button 
                onClick={() => setShowCart(true)}
                className="relative p-3 text-white hover:text-yellow-300 hover:bg-white/20 rounded-full transition-all duration-300 transform hover:scale-110"
              >
                <ShoppingCart className="h-6 w-6" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-yellow-400 text-red-800 text-xs font-black rounded-full h-6 w-6 flex items-center justify-center animate-bounce border-2 border-white">
                    {cart.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 via-red-800/30 to-yellow-600/30"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-8xl md:text-9xl font-black text-white mb-8 transform -skew-x-12 animate-pulse" style={{ 
              fontFamily: 'serif',
              textShadow: '6px 6px 0px #ff6b35, 12px 12px 0px #f7931e, 18px 18px 0px #ffd23f, 24px 24px 0px #ff1744',
              letterSpacing: '4px'
            }}>
              WELCOME TO THE
              <span className="block text-yellow-400 animate-bounce">BIG EASY</span>
            </h2>
            <p className="text-3xl text-yellow-200 mb-12 max-w-4xl mx-auto leading-relaxed font-black transform -skew-x-6" style={{ letterSpacing: '2px' }}>
              🎵 WHERE EVERY BITE TELLS A STORY OF NEW ORLEANS TRADITION, SPICE, AND SOUL! 🎵
            </p>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 mb-12">
              <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm px-8 py-4 rounded-full border-4 border-yellow-400 transform -skew-x-12 hover:skew-x-0 transition-all duration-300">
                <Award className="h-8 w-8 text-yellow-600" />
                <span className="font-black text-red-700 text-lg">AWARD WINNING</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm px-8 py-4 rounded-full border-4 border-orange-400 transform -skew-x-12 hover:skew-x-0 transition-all duration-300">
                <Clock className="h-8 w-8 text-orange-600" />
                <span className="font-black text-red-700 text-lg">FRESH DAILY</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm px-8 py-4 rounded-full border-4 border-red-400 transform -skew-x-12 hover:skew-x-0 transition-all duration-300">
                <Flame className="h-8 w-8 text-red-600" />
                <span className="font-black text-red-700 text-lg">SPICY & HOT</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Categories */}
      <section className="py-8 bg-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-6">
            {menuCategories.map((category) => {
              const IconComponent = category.icon
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-4 px-10 py-6 rounded-3xl font-black text-xl transition-all duration-300 transform hover:scale-110 hover:-skew-x-12 ${
                    selectedCategory === category.id
                      ? `bg-gradient-to-r ${category.color} text-white shadow-2xl border-4 border-white`
                      : 'bg-white/90 text-gray-800 hover:bg-white border-4 border-gray-300 hover:border-gray-400'
                  }`}
                  style={{ letterSpacing: '2px' }}
                >
                  <IconComponent className="h-8 w-8" />
                  <span>{category.name}</span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <section className="py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 h-8 w-8" />
            <input
              type="text"
              placeholder="SEARCH FOR YOUR FAVORITE DISH..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-20 pr-6 py-8 bg-white border-4 border-yellow-400 rounded-3xl focus:outline-none focus:border-red-500 transition-all duration-300 shadow-2xl text-2xl font-black transform -skew-x-6 hover:skew-x-0"
              style={{ letterSpacing: '1px' }}
            />
          </div>
        </div>
      </section>

      {/* Menu Items */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                className="group bg-white rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-4 hover:-skew-x-6 overflow-hidden border-4 border-yellow-200 hover:border-red-400"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Item Image */}
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 flex space-x-2">
                    {item.popular && (
                      <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-black animate-pulse border-2 border-white transform -skew-x-12">
                        🔥 POPULAR
                      </span>
                    )}
                    {item.spicy && (
                      <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-black border-2 border-white transform -skew-x-12">
                        🌶️ SPICY
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => toggleFavorite(item.id)}
                    className={`absolute top-4 right-4 p-3 rounded-full transition-all duration-300 transform hover:scale-110 ${
                      favorites.includes(item.id)
                        ? 'bg-red-500 text-white'
                        : 'bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white'
                    }`}
                  >
                    <Heart className={`h-6 w-6 ${favorites.includes(item.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Item Info */}
                <div className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-3xl font-black text-gray-900 transform -skew-x-12" style={{ 
                      fontFamily: 'serif',
                      letterSpacing: '2px',
                      textShadow: '2px 2px 0px #ff6b35'
                    }}>
                      {item.name}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <Star className="h-6 w-6 text-yellow-400 fill-current" />
                      <span className="font-black text-gray-700 text-xl">{item.rating}</span>
                      <span className="text-gray-500 font-bold">({item.reviews})</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed font-bold text-lg">
                    {item.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-4xl font-black text-red-600 transform -skew-x-12" style={{ textShadow: '2px 2px 0px #ff6b35' }}>
                      ${item.price}
                    </span>
                    {item.sizes && (
                      <div className="text-sm text-gray-500 font-bold">
                        <span className="font-black">SIZES:</span> {item.sizes.join(', ')}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => addToCart(item)}
                    className="w-full py-6 px-8 bg-gradient-to-r from-red-500 to-orange-500 text-white font-black text-2xl rounded-2xl hover:from-red-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-2xl border-4 border-white transform -skew-x-12 hover:skew-x-0"
                    style={{ letterSpacing: '2px' }}
                  >
                    ADD TO CART
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-r from-purple-900 via-red-800 to-yellow-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-6xl font-black text-white text-center mb-16 transform -skew-x-12" style={{ 
            fontFamily: 'serif',
            textShadow: '4px 4px 0px #ff6b35, 8px 8px 0px #f7931e',
            letterSpacing: '3px'
          }}>
            WHAT OUR CUSTOMERS SAY
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-4 border-yellow-300 transform -skew-x-6 hover:skew-x-0 transition-all duration-300">
                <div className="flex items-center mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 font-bold italic text-xl" style={{ letterSpacing: '1px' }}>
                  "{testimonial.text}"
                </p>
                <div>
                  <p className="font-black text-red-600 text-2xl transform -skew-x-12" style={{ letterSpacing: '2px' }}>{testimonial.name}</p>
                  <p className="text-gray-500 font-bold text-lg">{testimonial.location}</p>
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
            <div className="p-6 border-b-4 border-yellow-400">
              <div className="flex items-center justify-between">
                <h3 className="text-3xl font-black text-red-600 transform -skew-x-12" style={{ 
                  fontFamily: 'serif',
                  letterSpacing: '2px',
                  textShadow: '2px 2px 0px #ff6b35'
                }}>
                  YOUR ORDER
                </h3>
                <button
                  onClick={() => setShowCart(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="h-20 w-20 text-gray-300 mx-auto mb-6" />
                  <p className="text-gray-500 font-black text-2xl">YOUR CART IS EMPTY</p>
                  <p className="text-gray-400 font-bold text-lg">ADD SOME DELICIOUS ITEMS!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border-4 border-yellow-200">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={60}
                        height={60}
                        className="rounded-xl object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-black text-gray-900 text-lg">{item.name}</h4>
                        <p className="text-sm text-gray-600 font-bold">{item.size}</p>
                        <p className="text-xl font-black text-red-600">${item.price}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="px-4 py-2 bg-white rounded-full text-lg font-black border-4 border-yellow-300">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {cart.length > 0 && (
              <div className="p-6 border-t-4 border-yellow-400">
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-black text-gray-900">SUBTOTAL:</span>
                    <span className="text-2xl font-black text-gray-600">${cartTotal.toFixed(2)}</span>
                  </div>
                  {deliveryFee > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-black text-gray-900">DELIVERY FEE:</span>
                      <span className="text-xl font-black text-gray-600">${deliveryFee.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center border-t-4 border-yellow-400 pt-4">
                    <span className="text-3xl font-black text-gray-900">TOTAL:</span>
                    <span className="text-4xl font-black text-red-600 transform -skew-x-12" style={{ textShadow: '2px 2px 0px #ff6b35' }}>${finalTotal.toFixed(2)}</span>
                  </div>
                </div>
                <button 
                  onClick={handleCheckout}
                  className="w-full py-6 px-8 bg-gradient-to-r from-red-500 to-orange-500 text-white font-black text-2xl rounded-2xl hover:from-red-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-2xl border-4 border-white transform -skew-x-12 hover:skew-x-0" 
                  style={{ letterSpacing: '2px' }}
                >
                  CHECKOUT NOW
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
              <div className="p-6 border-b-4 border-yellow-400">
                <div className="flex items-center justify-between">
                  <h3 className="text-3xl font-black text-red-600 transform -skew-x-12" style={{ 
                    fontFamily: 'serif',
                    letterSpacing: '2px',
                    textShadow: '2px 2px 0px #ff6b35'
                  }}>
                    CHECKOUT
                  </h3>
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
                  {/* Order Type */}
                  <div>
                    <h4 className="text-2xl font-black text-gray-900 mb-4 transform -skew-x-12">ORDER TYPE</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setOrderType('delivery')}
                        className={`p-6 rounded-2xl border-4 transition-all duration-300 transform hover:scale-105 ${
                          orderType === 'delivery'
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-300 bg-white hover:border-gray-400'
                        }`}
                      >
                        <Truck className="h-8 w-8 mx-auto mb-2" />
                        <p className="font-black text-lg">DELIVERY</p>
                        <p className="text-sm text-gray-600">${restaurantInfo.deliveryFee} delivery fee</p>
                      </button>
                      <button
                        onClick={() => setOrderType('pickup')}
                        className={`p-6 rounded-2xl border-4 transition-all duration-300 transform hover:scale-105 ${
                          orderType === 'pickup'
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-300 bg-white hover:border-gray-400'
                        }`}
                      >
                        <Store className="h-8 w-8 mx-auto mb-2" />
                        <p className="font-black text-lg">PICKUP</p>
                        <p className="text-sm text-gray-600">Free pickup</p>
                      </button>
                    </div>
                  </div>

                  {/* Delivery Address */}
                  {orderType === 'delivery' && (
                    <div>
                      <h4 className="text-2xl font-black text-gray-900 mb-4 transform -skew-x-12">DELIVERY ADDRESS</h4>
                      <input
                        type="text"
                        placeholder="Enter your delivery address..."
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        className="w-full p-4 border-4 border-gray-300 rounded-2xl focus:outline-none focus:border-red-500 transition-all duration-300 text-lg font-bold"
                      />
                    </div>
                  )}

                  {/* Payment Method */}
                  <div>
                    <h4 className="text-2xl font-black text-gray-900 mb-4 transform -skew-x-12">PAYMENT METHOD</h4>
                    <div className="space-y-4">
                      <button
                        onClick={() => setPaymentMethod('card')}
                        className={`w-full p-4 rounded-2xl border-4 transition-all duration-300 ${
                          paymentMethod === 'card'
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-300 bg-white hover:border-gray-400'
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <CreditCard className="h-6 w-6" />
                          <span className="font-black text-lg">CREDIT/DEBIT CARD</span>
                        </div>
                      </button>
                      <button
                        onClick={() => setPaymentMethod('cash')}
                        className={`w-full p-4 rounded-2xl border-4 transition-all duration-300 ${
                          paymentMethod === 'cash'
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-300 bg-white hover:border-gray-400'
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <DollarSign className="h-6 w-6" />
                          <span className="font-black text-lg">CASH ON DELIVERY</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Order Notes */}
                  <div>
                    <h4 className="text-2xl font-black text-gray-900 mb-4 transform -skew-x-12">SPECIAL INSTRUCTIONS</h4>
                    <textarea
                      placeholder="Any special instructions for your order..."
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      className="w-full p-4 border-4 border-gray-300 rounded-2xl focus:outline-none focus:border-red-500 transition-all duration-300 text-lg font-bold h-24"
                    />
                  </div>

                  {/* Order Summary */}
                  <div>
                    <h4 className="text-2xl font-black text-gray-900 mb-4 transform -skew-x-12">ORDER SUMMARY</h4>
                    <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                      {cart.map((item) => (
                        <div key={item.id} className="flex justify-between items-center">
                          <div>
                            <p className="font-black text-gray-900">{item.name}</p>
                            <p className="text-gray-600">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-black text-red-600">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      ))}
                      {deliveryFee > 0 && (
                        <div className="flex justify-between items-center border-t-2 border-gray-300 pt-4">
                          <p className="font-black text-gray-900">Delivery Fee</p>
                          <p className="font-black text-red-600">${deliveryFee.toFixed(2)}</p>
                        </div>
                      )}
                      <div className="flex justify-between items-center border-t-4 border-red-500 pt-4">
                        <p className="text-2xl font-black text-gray-900">TOTAL</p>
                        <p className="text-3xl font-black text-red-600">${finalTotal.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Footer */}
              <div className="p-6 border-t-4 border-yellow-400">
                <div className="flex space-x-4">
                  <button
                    onClick={() => setShowCheckout(false)}
                    className="flex-1 py-4 px-6 border-4 border-gray-300 text-gray-700 rounded-2xl font-black text-lg hover:bg-gray-50 transition-colors"
                  >
                    BACK TO CART
                  </button>
                  <button 
                    onClick={handlePlaceOrder}
                    className="flex-1 py-4 px-6 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-2xl font-black text-lg hover:from-red-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105"
                  >
                    PLACE ORDER
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {showContact && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowContact(false)}></div>
          <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-2xl transform transition-transform duration-300">
            <div className="p-6 border-b-4 border-yellow-400">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-red-600 transform -skew-x-12" style={{ 
                  fontFamily: 'serif',
                  letterSpacing: '2px',
                  textShadow: '2px 2px 0px #ff6b35'
                }}>
                  CONTACT INFO
                </h3>
                <button
                  onClick={() => setShowContact(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <MapPin className="h-8 w-8 text-red-600" />
                  <div>
                    <p className="font-black text-gray-900 text-lg">ADDRESS</p>
                    <p className="text-gray-600 font-bold">{restaurantInfo.address}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Phone className="h-8 w-8 text-red-600" />
                  <div>
                    <p className="font-black text-gray-900 text-lg">PHONE</p>
                    <p className="text-gray-600 font-bold">{restaurantInfo.phone}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Mail className="h-8 w-8 text-red-600" />
                  <div>
                    <p className="font-black text-gray-900 text-lg">EMAIL</p>
                    <p className="text-gray-600 font-bold">{restaurantInfo.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Clock className="h-8 w-8 text-red-600" />
                  <div>
                    <p className="font-black text-gray-900 text-lg">HOURS</p>
                    <div className="text-gray-600 font-bold space-y-1">
                      <p>Mon-Thu: {restaurantInfo.hours.monday}</p>
                      <p>Fri: {restaurantInfo.hours.friday}</p>
                      <p>Sat: {restaurantInfo.hours.saturday}</p>
                      <p>Sun: {restaurantInfo.hours.sunday}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-red-50 rounded-2xl p-4 border-4 border-red-200">
                  <div className="flex items-center space-x-2 mb-2">
                    {isRestaurantOpen() ? (
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    ) : (
                      <AlertCircle className="h-6 w-6 text-red-600" />
                    )}
                    <p className="font-black text-lg">
                      {isRestaurantOpen() ? 'WE ARE OPEN!' : 'WE ARE CLOSED'}
                    </p>
                  </div>
                  <p className="text-gray-600 font-bold">
                    {isRestaurantOpen() 
                      ? `Open until ${restaurantInfo.hours.sunday.split(' - ')[1]}`
                      : `Opens at ${restaurantInfo.nextOpenTime}`
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Confirmation Modal */}
      {orderConfirmed && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOrderConfirmed(false)}></div>
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center border-4 border-yellow-400">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-4 transform -skew-x-12" style={{ 
                fontFamily: 'serif',
                letterSpacing: '2px',
                textShadow: '2px 2px 0px #ff6b35'
              }}>
                ORDER CONFIRMED!
              </h3>
              <p className="text-xl font-bold text-gray-600 mb-4">
                Your order #{orderNumber} has been placed successfully!
              </p>
              <p className="text-lg font-bold text-gray-700 mb-6">
                {orderType === 'delivery' 
                  ? `Estimated delivery time: 30-45 minutes`
                  : `Ready for pickup in 20-30 minutes`
                }
              </p>
              <button
                onClick={() => setOrderConfirmed(false)}
                className="w-full py-4 px-6 bg-gradient-to-r from-red-500 to-orange-500 text-white font-black text-xl rounded-2xl hover:from-red-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105"
              >
                CONTINUE SHOPPING
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search Modal */}
      {showSearch && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowSearch(false)}></div>
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 border-4 border-yellow-400">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-black text-gray-900 transform -skew-x-12" style={{ 
                  fontFamily: 'serif',
                  letterSpacing: '2px',
                  textShadow: '2px 2px 0px #ff6b35'
                }}>
                  SEARCH MENU
                </h3>
                <button
                  onClick={() => setShowSearch(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Search for dishes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-yellow-500 focus:outline-none text-lg"
                />
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {menuItems.filter(item => 
                    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.description.toLowerCase().includes(searchQuery.toLowerCase())
                  ).map((item) => (
                    <div key={item.id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <h4 className="font-bold text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-600">{item.description}</p>
                      <p className="text-lg font-bold text-red-600">${item.price}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Favorites Modal */}
      {showFavorites && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowFavorites(false)}></div>
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 border-4 border-yellow-400">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-black text-gray-900 transform -skew-x-12" style={{ 
                  fontFamily: 'serif',
                  letterSpacing: '2px',
                  textShadow: '2px 2px 0px #ff6b35'
                }}>
                  FAVORITES
                </h3>
                <button
                  onClick={() => setShowFavorites(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="space-y-4">
                {favorites.length === 0 ? (
                  <p className="text-center text-gray-600 py-8">No favorites yet! Add some dishes to your favorites.</p>
                ) : (
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {menuItems.filter(item => favorites.includes(item.id)).map((item) => (
                      <div key={item.id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <h4 className="font-bold text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-600">{item.description}</p>
                        <p className="text-lg font-bold text-red-600">${item.price}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}