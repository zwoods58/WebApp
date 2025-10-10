'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ShoppingCart, Heart, Star, Plus, Minus, Truck, Shield, Award, Check, Share2, ChevronLeft, ChevronRight } from 'lucide-react'

const products = [
  {
    id: 1,
    name: 'Sony WH-1000XM5 Wireless Headphones',
    price: 399.99,
    originalPrice: 499.99,
    rating: 4.8,
    reviews: 2847,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522143049013-2519756a52cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    category: 'Electronics',
    inStock: true,
    badge: 'Best Seller',
    description: 'Industry-leading noise canceling with Dual Noise Sensor technology',
    longDescription: 'The Sony WH-1000XM5 wireless headphones deliver industry-leading noise canceling with Dual Noise Sensor technology. Experience crystal-clear hands-free calling with 4 beamforming microphones and precise voice pickup. Enjoy up to 30 hours of battery life with quick charge capability, and get 3 hours of playback from just a 3-minute charge.',
    features: ['30-hour battery life', 'Quick charge', 'Touch controls', 'Hi-Res Audio', 'Dual Noise Sensor technology', '4 beamforming microphones', 'Speak-to-Chat technology', 'Multipoint connection'],
    specifications: {
      'Driver Unit': '30mm dynamic',
      'Frequency Response': '4Hz-40kHz',
      'Battery Life': '30 hours (NC on)',
      'Charging Time': '3.5 hours',
      'Weight': '250g',
      'Connectivity': 'Bluetooth 5.2',
      'Codec Support': 'SBC, AAC, LDAC'
    },
    brand: 'Sony',
    shipping: 'Free 2-day shipping',
    warranty: '2 years',
    returnPolicy: '30-day return policy'
  },
  {
    id: 2,
    name: 'Apple Watch Series 9 GPS',
    price: 399.99,
    originalPrice: 499.99,
    rating: 4.9,
    reviews: 1892,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544117519-31a4b719223d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    category: 'Electronics',
    inStock: true,
    badge: 'New',
    description: 'The most advanced Apple Watch with health monitoring and fitness tracking',
    longDescription: 'Apple Watch Series 9 features the most advanced health monitoring capabilities, including ECG app, blood oxygen monitoring, and fall detection. The always-on Retina display is 30% larger than Series 3, and the watch is water resistant to 50 meters. Track your fitness goals with comprehensive workout metrics and stay connected with cellular connectivity.',
    features: ['Always-on display', 'ECG app', 'Fall detection', 'Water resistant', 'Blood oxygen monitoring', 'Sleep tracking', 'Cellular connectivity', 'Siri integration'],
    specifications: {
      'Display': 'Always-on Retina LTPO OLED',
      'Size': '45mm or 41mm',
      'Water Resistance': '50 meters',
      'Battery Life': 'Up to 18 hours',
      'Processor': 'S9 SiP',
      'Storage': '64GB',
      'Connectivity': 'GPS + Cellular'
    },
    brand: 'Apple',
    shipping: 'Free 2-day shipping',
    warranty: '1 year',
    returnPolicy: '14-day return policy'
  },
  {
    id: 3,
    name: 'Peak Design Everyday Backpack 30L',
    price: 289.99,
    originalPrice: 329.99,
    rating: 4.7,
    reviews: 1234,
    image: 'https://images.unsplash.com/photo-1553062407-98e64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    images: [
      'https://images.unsplash.com/photo-1553062407-98e64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1553062407-98e64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1553062407-98e64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1553062407-98e64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    category: 'Accessories',
    inStock: true,
    badge: 'Premium',
    description: 'Professional camera backpack with modular organization system',
    longDescription: 'The Peak Design Everyday Backpack 30L is the ultimate camera backpack for photographers and professionals. Features a modular organization system with customizable dividers, weatherproof construction, and a dedicated laptop compartment. Built to last with lifetime warranty and designed for comfort during long days of shooting.',
    features: ['Weatherproof', 'Modular dividers', 'Laptop compartment', 'Lifetime warranty', 'Expandable design', 'Comfortable straps', 'Multiple access points', 'Durable construction'],
    specifications: {
      'Capacity': '30L',
      'Dimensions': '20" x 12" x 7.5"',
      'Weight': '3.2 lbs',
      'Material': 'Weatherproof canvas',
      'Laptop Size': 'Up to 15"',
      'Warranty': 'Lifetime',
      'Color Options': 'Charcoal, Sage, Midnight'
    },
    brand: 'Peak Design',
    shipping: 'Free 2-day shipping',
    warranty: 'Lifetime',
    returnPolicy: '30-day return policy'
  }
]

const reviews = [
  {
    id: 1,
    name: 'Sarah Johnson',
    rating: 5,
    date: '2024-01-15',
    title: 'Absolutely amazing!',
    comment: 'These headphones exceeded my expectations. The noise canceling is incredible and the sound quality is outstanding.',
    verified: true
  },
  {
    id: 2,
    name: 'Mike Chen',
    rating: 4,
    date: '2024-01-10',
    title: 'Great product, minor issues',
    comment: 'Love the sound quality and comfort. The only downside is the touch controls can be a bit sensitive.',
    verified: true
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    rating: 5,
    date: '2024-01-08',
    title: 'Perfect for work and travel',
    comment: 'I use these daily for work calls and they work flawlessly. The battery life is impressive.',
    verified: true
  }
]

export default function ProductDetail() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<any>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState('')
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [showReviews, setShowReviews] = useState(false)

  useEffect(() => {
    const productId = parseInt(params.id as string)
    const foundProduct = products.find(p => p.id === productId)
    setProduct(foundProduct || null)
  }, [params.id])

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    // Add to cart logic here
    console.log('Added to cart:', product, quantity)
  }

  const handleWishlistToggle = () => {
    setIsInWishlist(!isInWishlist)
  }

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % product.images.length)
  }

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-8">
              <button 
                onClick={() => router.back()}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="font-medium">Back</span>
              </button>
              <div className="hidden md:block">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  TechStore Pro
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all duration-300">
                <Heart className="h-6 w-6" />
              </button>
              <button className="p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all duration-300">
                <ShoppingCart className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-6">
            {/* Main Image */}
            <div className="relative aspect-square bg-white rounded-3xl shadow-lg overflow-hidden">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
              />
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                    selectedImage === index
                      ? 'border-blue-500 shadow-lg'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    width={100}
                    height={100}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            {/* Badge and Brand */}
            <div className="flex items-center space-x-4">
              <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                product.badge === 'Best Seller' ? 'bg-red-500 text-white' :
                product.badge === 'New' ? 'bg-green-500 text-white' :
                product.badge === 'Premium' ? 'bg-purple-500 text-white' :
                'bg-yellow-500 text-white'
              }`}>
                {product.badge}
              </span>
              <span className="text-sm text-gray-500 font-medium">{product.brand}</span>
            </div>

            {/* Title and Rating */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="text-lg font-semibold text-gray-900">{product.rating}</span>
                  <span className="text-gray-500">({product.reviews} reviews)</span>
                </div>
                <button
                  onClick={() => setShowReviews(!showReviews)}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  View Reviews
                </button>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-4xl font-bold text-gray-900">${product.price}</span>
              {product.originalPrice && (
                <span className="text-2xl text-gray-500 line-through">${product.originalPrice}</span>
              )}
              <span className="text-lg text-green-600 font-semibold">
                Save ${(product.originalPrice - product.price).toFixed(2)}
              </span>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.longDescription}</p>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Key Features</h3>
              <div className="grid grid-cols-2 gap-3">
                {product.features.map((feature: string, index: number) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <span className="text-lg font-semibold text-gray-900">Quantity:</span>
                <div className="flex items-center space-x-2 border border-gray-300 rounded-2xl">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-100 rounded-l-2xl transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-gray-100 rounded-r-2xl transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 px-8 rounded-2xl font-bold text-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Add to Cart - ${(product.price * quantity).toFixed(2)}
                </button>
                <button
                  onClick={handleWishlistToggle}
                  className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                    isInWishlist
                      ? 'border-red-500 bg-red-50 text-red-500'
                      : 'border-gray-300 hover:border-red-500 hover:text-red-500'
                  }`}
                >
                  <Heart className={`h-6 w-6 ${isInWishlist ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              <div className="text-center">
                <Truck className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Free Shipping</p>
                <p className="text-xs text-gray-500">2-day delivery</p>
              </div>
              <div className="text-center">
                <Shield className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Warranty</p>
                <p className="text-xs text-gray-500">{product.warranty}</p>
              </div>
              <div className="text-center">
                <Award className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Returns</p>
                <p className="text-xs text-gray-500">{product.returnPolicy}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="mt-16 bg-white rounded-3xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(product.specifications).map(([key, value]) => (
              <div key={key} className="flex justify-between py-3 border-b border-gray-100">
                <span className="font-medium text-gray-700">{key}</span>
                <span className="text-gray-600">{value as string}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews */}
        {showReviews && (
          <div className="mt-16 bg-white rounded-3xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{review.name}</p>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">{review.date}</span>
                          {review.verified && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                              Verified Purchase
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>
                  <p className="text-gray-600">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
