'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Eye, EyeOff, Bell, Settings, Search, Plus, Minus, Check, Clock, MapPin, QrCode, CreditCard, TrendingUp, AlertCircle, CheckCircle, Home, BarChart3, User, Wallet, Smartphone, Lock, Download, Upload, Calendar, Target, PieChart, DollarSign, Phone, Mail, HelpCircle, Moon, Sun, RefreshCw, X, ChevronRight, Star, Zap, Building, Car, ShoppingBag, Utensils, Gamepad2, BookOpen, Heart, Plane, Train, Bus, Coffee, Gift, Camera, FileText, Share2, Edit3, Trash2, MoreHorizontal, Copy, ExternalLink, AlertTriangle, Info, CheckCircle2, XCircle, Loader2, Shield, Filter, Fingerprint } from 'lucide-react'

const accounts = [
  { id: 1, name: 'Primary Checking', number: '****1234', balance: 15420.50, type: 'checking', available: 15420.50, interest: '0.01%', color: 'blue' },
  { id: 2, name: 'High-Yield Savings', number: '****5678', balance: 32850.75, type: 'savings', available: 32850.75, interest: '4.25%', color: 'green' },
  { id: 3, name: 'Business Credit Card', number: '****9012', balance: -1250.00, type: 'credit', available: 8750.00, interest: '18.99%', color: 'purple' },
  { id: 4, name: 'Investment Account', number: '****3456', balance: 45620.30, type: 'investment', available: 45620.30, interest: '7.2%', color: 'orange' }
]

const transactions = [
  { id: 1, description: 'Starbucks Coffee', amount: -4.50, date: 'Today', time: '2:30 PM', category: 'Food & Dining', icon: '☕' },
  { id: 2, description: 'Salary Deposit', amount: 3500.00, date: 'Today', time: '9:00 AM', category: 'Income', icon: '💰' },
  { id: 3, description: 'Amazon Purchase', amount: -89.99, date: 'Yesterday', time: '7:45 PM', category: 'Shopping', icon: '🛒' },
  { id: 4, description: 'Electric Bill', amount: -125.30, date: 'Yesterday', time: '6:20 PM', category: 'Utilities', icon: '⚡' },
  { id: 5, description: 'Transfer to Savings', amount: -500.00, date: 'Dec 1', time: '3:15 PM', category: 'Transfer', icon: '💸' },
  { id: 6, description: 'ATM Withdrawal', amount: -100.00, date: 'Dec 1', time: '1:30 PM', category: 'Cash', icon: '🏧' }
]

const quickActions = [
  { name: 'Transfer Money', icon: ArrowLeft, color: 'bg-blue-500' },
  { name: 'Pay Bills', icon: CreditCard, color: 'bg-green-500' },
  { name: 'Deposit Check', icon: Plus, color: 'bg-purple-500' },
  { name: 'QR Payment', icon: QrCode, color: 'bg-orange-500' }
]

export default function MobileBankingDemo() {
  const [showBalance, setShowBalance] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState(0)
  const [activeTab, setActiveTab] = useState('home')
  const [darkMode, setDarkMode] = useState(false)
  const [biometricAuth, setBiometricAuth] = useState(false)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setBiometricAuth(true)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  if (!biometricAuth) {
    return (
      <div className="min-h-screen max-w-md mx-auto bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center relative overflow-hidden">
        <div className="text-center text-white p-8 relative z-10">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse shadow-2xl">
            <Fingerprint className="h-12 w-12" />
          </div>
          <h1 className="text-3xl font-bold mb-3">Secure Banking</h1>
          <p className="text-blue-100 mb-8 text-lg">Touch ID or Face ID to continue</p>
          <div className="w-16 h-16 border-2 border-white/30 rounded-full mx-auto animate-spin">
            <div className="w-full h-full border-t-2 border-white rounded-full"></div>
          </div>
          <p className="text-blue-200 text-sm mt-4">Authenticating...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center p-8">
      {/* App Store Style Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">SecureBank Mobile</h1>
        <p className="text-lg text-gray-600 mb-4">Your personal banking companion</p>
        <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Live Demo</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Interactive</span>
          </div>
        </div>
      </div>

      {/* Phone Frame */}
      <div className="relative">
        <div className="absolute -inset-4 bg-black/20 rounded-[3rem] blur-xl"></div>
        <div className="relative bg-black rounded-[2.5rem] p-2 shadow-2xl">
          <div className={`w-80 h-[640px] rounded-[2rem] relative overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} select-none`}>
            {/* Phone Notch */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-10"></div>
            
            {/* Status Bar */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} px-4 py-2 text-xs flex justify-between items-center pt-8`}>
              <span className="font-semibold">9:41</span>
              <div className="flex items-center space-x-1">
                <div className="w-4 h-2 bg-black rounded-sm"></div>
                <div className="w-4 h-2 bg-black rounded-sm"></div>
                <div className="w-4 h-2 bg-black rounded-sm"></div>
                <div className="w-4 h-2 bg-gray-300 rounded-sm"></div>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-4 h-2 bg-black rounded-sm"></div>
                <div className="w-4 h-2 bg-black rounded-sm"></div>
                <div className="w-4 h-2 bg-black rounded-sm"></div>
              </div>
            </div>

            {/* Header */}
            <header className={`${darkMode ? 'bg-gray-800' : 'bg-white'} text-gray-900 px-4 py-3 border-b border-gray-200`}>
              <div className="flex items-center justify-between">
                <Link href="/portfolio" className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
                  <ArrowLeft className="h-6 w-6 mr-2" />
                  <span className="font-medium">Back</span>
                </Link>
                <div className="flex items-center space-x-3">
                  <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <Bell className="h-6 w-6 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <Settings className="h-6 w-6 text-gray-600" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 mt-3">
                <Image
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                  alt="User"
                  width={44}
                  height={44}
                  className="rounded-full"
                />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Good morning, John!</h1>
                  <p className="text-gray-500 text-sm">Ready to manage your finances?</p>
                </div>
              </div>
            </header>

            {/* Main Content */}
            <div className={`pb-20 ${darkMode ? 'text-white' : 'text-gray-900'} overflow-y-auto`}>
              <div className="px-4 space-y-4">
                {/* Account Balance Card */}
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-6 shadow-sm border border-gray-100`}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Total Balance</h2>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => setShowBalance(!showBalance)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        {showBalance ? <EyeOff className="h-5 w-5 text-gray-600" /> : <Eye className="h-5 w-5 text-gray-600" />}
                      </button>
                    </div>
                  </div>
                  
                  <div className={`text-4xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {showBalance ? formatCurrency(totalBalance) : '••••••'}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-green-600">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      <span className="font-medium">+2.5% from last month</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Last updated: 2 min ago
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-6 shadow-sm border border-gray-100`}>
                  <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Quick Actions</h3>
                  <div className="grid grid-cols-4 gap-4">
                    {quickActions.map((action, index) => (
                      <button
                        key={index}
                        className={`flex flex-col items-center p-4 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} rounded-2xl transition-all active:scale-95`}
                      >
                        <div className={`w-14 h-14 ${action.color} rounded-2xl flex items-center justify-center mb-3 shadow-lg`}>
                          <action.icon className="h-7 w-7 text-white" />
                        </div>
                        <span className={`text-xs font-medium text-center ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{action.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Navigation */}
            <div className={`absolute bottom-0 left-0 right-0 ${darkMode ? 'bg-gray-800' : 'bg-white'} border-t border-gray-200 safe-area-pb`}>
              <div className="flex items-center justify-around py-2 px-4">
                <button className={`flex flex-col items-center p-3 rounded-2xl transition-all text-blue-600 bg-blue-50`}>
                  <Home className="h-6 w-6 scale-110 transition-transform" />
                  <span className="text-xs mt-1 font-medium">Home</span>
                </button>
                <button className={`flex flex-col items-center p-3 rounded-2xl transition-all ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <BarChart3 className="h-6 w-6 transition-transform" />
                  <span className="text-xs mt-1 font-medium">Activity</span>
                </button>
                <button className={`flex flex-col items-center p-3 rounded-2xl transition-all ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <CreditCard className="h-6 w-6 transition-transform" />
                  <span className="text-xs mt-1 font-medium">Cards</span>
                </button>
                <button className={`flex flex-col items-center p-3 rounded-2xl transition-all ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <User className="h-6 w-6 transition-transform" />
                  <span className="text-xs mt-1 font-medium">Profile</span>
                </button>
              </div>
              
              {/* Home Indicator */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gray-400 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* App Store Style Features */}
      <div className="mt-12 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Bank-Grade Security</h3>
            <p className="text-gray-600">256-bit encryption and biometric authentication keep your data safe</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Zap className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Lightning Fast</h3>
            <p className="text-gray-600">Instant transfers and real-time balance updates</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Smartphone className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Mobile First</h3>
            <p className="text-gray-600">Designed specifically for mobile banking experience</p>
          </div>
        </div>
        
        {/* App Store Style Rating and Download */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <span className="text-lg font-semibold text-gray-900">4.9</span>
            <span className="text-gray-500">(2.1M reviews)</span>
          </div>
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-600 mb-6">
            <span>#1 in Finance</span>
            <span>•</span>
            <span>4+ Rating</span>
            <span>•</span>
            <span>2.1M Downloads</span>
          </div>
          <div className="flex items-center justify-center space-x-4">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-semibold hover:bg-blue-700 transition-colors shadow-lg">
              Download Now
            </button>
            <button className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-2xl font-semibold hover:bg-gray-50 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}