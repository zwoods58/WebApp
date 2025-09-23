'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Eye, EyeOff, Bell, Settings, Search, Plus, Minus, Check, Clock, MapPin, QrCode, CreditCard, TrendingUp, AlertCircle, CheckCircle, Home, BarChart3, User, Wallet, Smartphone, Lock, Download, Upload, Calendar, Target, PieChart, DollarSign, Phone, Mail, HelpCircle, Moon, Sun, RefreshCw, X, ChevronRight, Star, Zap, Building, Car, ShoppingBag, Utensils, Gamepad2, BookOpen, Heart, Plane, Train, Bus, Coffee, Gift, Camera, FileText, Share2, Edit3, Trash2, MoreHorizontal, Copy, ExternalLink, AlertTriangle, Info, CheckCircle2, XCircle, Loader2, Shield, Filter, Fingerprint, SwipeUp, SwipeDown, Touch } from 'lucide-react'

const accounts = [
  { id: 1, name: 'Primary Checking', number: '****1234', balance: 15420.50, type: 'checking', available: 15420.50, interest: '0.01%', color: 'blue' },
  { id: 2, name: 'High-Yield Savings', number: '****5678', balance: 32850.75, type: 'savings', available: 32850.75, interest: '4.25%', color: 'green' },
  { id: 3, name: 'Business Credit Card', number: '****9012', balance: -1250.00, type: 'credit', available: 8750.00, interest: '18.99%', color: 'purple' },
  { id: 4, name: 'Investment Account', number: '****3456', balance: 45620.30, type: 'investment', available: 45620.30, interest: '7.2%', color: 'orange' }
]

const cards = [
  { id: 1, name: 'Visa Platinum', number: '4532 1234 5678 9012', expiry: '12/26', cvv: '123', type: 'credit', balance: 8750.00, limit: 10000, color: 'blue', frozen: false },
  { id: 2, name: 'Debit Card', number: '4532 9876 5432 1098', expiry: '08/27', cvv: '456', type: 'debit', balance: 15420.50, limit: 15420.50, color: 'green', frozen: false },
  { id: 3, name: 'Business Card', number: '4532 5555 6666 7777', expiry: '03/28', cvv: '789', type: 'credit', balance: 5000.00, limit: 15000, color: 'purple', frozen: true }
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

const recentContacts = [
  { name: 'Sarah Johnson', phone: '(555) 123-4567', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' },
  { name: 'Mike Chen', phone: '(555) 987-6543', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' },
  { name: 'Emily Davis', phone: '(555) 456-7890', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' }
]

const notifications = [
  { id: 1, title: 'Large Purchase Alert', message: 'Transaction of $89.99 at Amazon', time: '2 min ago', type: 'transaction', read: false },
  { id: 2, title: 'Bill Due Soon', message: 'Electric bill due in 3 days', time: '1 hour ago', type: 'bill', read: false },
  { id: 3, title: 'Security Alert', message: 'New login from iPhone 15', time: '2 hours ago', type: 'security', read: true },
  { id: 4, title: 'Payment Received', message: 'Salary deposit of $3,500', time: '1 day ago', type: 'deposit', read: true }
]

const userProfile = {
  name: 'John Smith',
  email: 'john.smith@email.com',
  phone: '(555) 123-4567',
  address: '123 Main St, New York, NY 10001',
  memberSince: '2020-03-15',
  creditScore: 785,
  riskLevel: 'Low',
  preferences: {
    notifications: true,
    biometric: true,
    darkMode: false,
    twoFactor: true
  }
}

export default function MobileBankingDemo() {
  const [showBalance, setShowBalance] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState(0)
  const [activeTab, setActiveTab] = useState('home')
  const [showTransferModal, setShowTransferModal] = useState(false)
  const [transferAmount, setTransferAmount] = useState('')
  const [transferTo, setTransferTo] = useState('')
  const [darkMode, setDarkMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [showNotifications, setShowNotifications] = useState(false)
  const [showCardDetails, setShowCardDetails] = useState(false)
  const [selectedCard, setSelectedCard] = useState(0)
  const [showProfile, setShowProfile] = useState(false)
  const [showBillPay, setShowBillPay] = useState(false)
  const [showSpendingAnalytics, setShowSpendingAnalytics] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showTransactionDetails, setShowTransactionDetails] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState(0)
  const [swipeDirection, setSwipeDirection] = useState('')
  const [isScrolling, setIsScrolling] = useState(false)
  const [pullToRefresh, setPullToRefresh] = useState(false)
  const [showQuickActions, setShowQuickActions] = useState(false)
  const [biometricAuth, setBiometricAuth] = useState(false)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0)
  
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterCategory === 'all' || transaction.category === filterCategory
    return matchesSearch && matchesFilter
  })

  const unreadNotifications = notifications.filter(n => !n.read).length

  // Mobile-specific functions
  useEffect(() => {
    // Simulate biometric authentication on app start
    const timer = setTimeout(() => {
      setBiometricAuth(true)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1500)
  }

  const handlePullToRefresh = () => {
    setPullToRefresh(true)
    setTimeout(() => {
      setPullToRefresh(false)
      handleRefresh()
    }, 1000)
  }

  const toggleCardFreeze = (cardId: number) => {
    console.log(`Toggling freeze for card ${cardId}`)
  }

  const payBill = (billId: number) => {
    console.log(`Paying bill ${billId}`)
  }

  const handleSwipe = (direction: 'up' | 'down') => {
    setSwipeDirection(direction)
    setTimeout(() => setSwipeDirection(''), 300)
  }

  const simulateHapticFeedback = () => {
    // Simulate haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(50)
    }
  }

  // Biometric authentication screen
  if (!biometricAuth) {
    return (
      <div className="min-h-screen max-w-md mx-auto bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute top-1/4 -right-10 w-16 h-16 bg-white/5 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 -left-5 w-12 h-12 bg-white/10 rounded-full animate-pulse delay-2000"></div>
        </div>
        
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
        {/* Phone Frame Shadow */}
        <div className="absolute -inset-4 bg-black/20 rounded-[3rem] blur-xl"></div>
        
        {/* Phone Body */}
        <div className="relative bg-black rounded-[2.5rem] p-2 shadow-2xl">
          {/* Screen */}
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
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Bell className="h-6 w-6 text-gray-600" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
            </button>
            <button 
              onClick={() => setShowProfile(true)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
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

      {/* Pull to Refresh Indicator */}
      {pullToRefresh && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-white rounded-full p-3 shadow-lg">
            <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => {
          setShowQuickActions(!showQuickActions)
          simulateHapticFeedback()
        }}
        className="fixed bottom-24 right-4 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all z-40 flex items-center justify-center"
      >
        <Plus className="h-6 w-6" />
      </button>

      {/* Quick Actions Menu */}
      {showQuickActions && (
        <div className="fixed bottom-32 right-4 z-50 space-y-3">
          <div className="bg-white rounded-2xl shadow-lg p-4 space-y-3">
            <button
              onClick={() => {
                setShowTransferModal(true)
                setShowQuickActions(false)
                simulateHapticFeedback()
              }}
              className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-xl transition-colors"
            >
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <ArrowLeft className="h-5 w-5 text-white" />
              </div>
              <span className="font-medium">Transfer Money</span>
            </button>
            <button
              onClick={() => {
                setShowBillPay(true)
                setShowQuickActions(false)
                simulateHapticFeedback()
              }}
              className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-xl transition-colors"
            >
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-white" />
              </div>
              <span className="font-medium">Pay Bills</span>
            </button>
            <button
              onClick={() => {
                setShowQuickActions(false)
                simulateHapticFeedback()
              }}
              className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-xl transition-colors"
            >
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                <QrCode className="h-5 w-5 text-white" />
              </div>
              <span className="font-medium">QR Payment</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div 
        className={`pb-20 ${darkMode ? 'text-white' : 'text-gray-900'} overflow-y-auto`}
        onTouchStart={(e) => {
          const touch = e.touches[0]
          const startY = touch.clientY
          
          const handleTouchMove = (e: TouchEvent) => {
            const touch = e.touches[0]
            const currentY = touch.clientY
            const diff = startY - currentY
            
            if (diff > 50 && window.scrollY === 0) {
              handlePullToRefresh()
            }
          }
          
          const handleTouchEnd = () => {
            document.removeEventListener('touchmove', handleTouchMove)
            document.removeEventListener('touchend', handleTouchEnd)
          }
          
          document.addEventListener('touchmove', handleTouchMove)
          document.addEventListener('touchend', handleTouchEnd)
        }}
      >
        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-8 flex flex-col items-center mx-4">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
              <p className="text-gray-600 font-medium">Updating your account...</p>
            </div>
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'home' && (
          <div className="px-4 space-y-4">
            {/* Account Balance Card */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-6 shadow-sm border border-gray-100`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Total Balance</h2>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={handleRefresh}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <RefreshCw className="h-5 w-5 text-gray-600" />
                  </button>
                  <button 
                    onClick={() => {
                      setShowBalance(!showBalance)
                      simulateHapticFeedback()
                    }}
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

            {/* Account Cards - Horizontal Scroll */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Your Accounts</h3>
                <button className="text-blue-600 text-sm font-medium">View All</button>
              </div>
              
              <div className="flex space-x-4 overflow-x-auto pb-2 -mx-4 px-4">
                {accounts.map((account, index) => (
                  <div 
                    key={account.id}
                    className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-4 shadow-sm cursor-pointer transition-all min-w-[280px] ${
                      selectedAccount === index ? 'ring-2 ring-blue-500' : 'hover:shadow-md'
                    }`}
                    onClick={() => {
                      setSelectedAccount(index)
                      simulateHapticFeedback()
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{account.name}</h3>
                        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{account.number}</p>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${
                        account.color === 'blue' ? 'bg-blue-500' :
                        account.color === 'green' ? 'bg-green-500' :
                        account.color === 'purple' ? 'bg-purple-500' : 'bg-orange-500'
                      }`}></div>
                    </div>
                    
                    <div className="text-right mb-3">
                      <div className={`text-2xl font-bold ${
                        account.balance < 0 ? 'text-red-600' : darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {showBalance ? formatCurrency(account.balance) : '••••'}
                      </div>
                      <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} capitalize`}>{account.type}</div>
                    </div>
                    
                    {showBalance && (
                      <div className="flex items-center justify-between text-sm">
                        <div>
                          <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Available:</span>
                          <span className={`ml-1 font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{formatCurrency(account.available)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <TrendingUp className="h-3 w-3 text-green-500" />
                          <span className="text-xs text-green-600">+2.1%</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
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
                    onClick={() => {
                      if (action.name === 'Transfer Money') {
                        setShowTransferModal(true)
                        simulateHapticFeedback()
                      }
                    }}
                  >
                    <div className={`w-14 h-14 ${action.color} rounded-2xl flex items-center justify-center mb-3 shadow-lg`}>
                      <action.icon className="h-7 w-7 text-white" />
                    </div>
                    <span className={`text-xs font-medium text-center ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{action.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Transactions */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-6 shadow-sm border border-gray-100`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Recent Transactions</h3>
                <button 
                  onClick={() => {
                    setActiveTab('transactions')
                    simulateHapticFeedback()
                  }}
                  className="text-blue-600 text-sm font-medium"
                >
                  View All
                </button>
              </div>
              
              <div className="space-y-3">
                {transactions.slice(0, 4).map((transaction) => (
                  <div 
                    key={transaction.id} 
                    className="flex items-center space-x-3 cursor-pointer p-3 rounded-2xl hover:bg-gray-50 transition-colors"
                    onClick={() => {
                      setSelectedTransaction(transaction.id - 1)
                      setShowTransactionDetails(true)
                      simulateHapticFeedback()
                    }}
                  >
                    <div className={`w-12 h-12 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-2xl flex items-center justify-center`}>
                      <span className="text-xl">{transaction.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{transaction.description}</p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{transaction.category} • {transaction.date} {transaction.time}</p>
                    </div>
                    <div className={`text-right ${
                      transaction.amount < 0 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      <p className="font-bold text-lg">
                        {transaction.amount < 0 ? '-' : '+'}{formatCurrency(Math.abs(transaction.amount))}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Security Features */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-sm`}>
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Security</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-green-600" />
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Biometric Login</span>
                  </div>
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    <span className="text-sm">Enabled</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Bell className="h-5 w-5 text-blue-600" />
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Transaction Alerts</span>
                  </div>
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    <span className="text-sm">Enabled</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="h-5 w-5 text-orange-600" />
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Fraud Protection</span>
                  </div>
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    <span className="text-sm">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-sm`}>
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-200'} border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
                <button className="p-3 bg-blue-600 text-white rounded-xl">
                  <Filter className="h-5 w-5" />
                </button>
              </div>
              
              <div className="flex space-x-2 overflow-x-auto">
                {['all', 'Food & Dining', 'Shopping', 'Income', 'Transfer', 'Utilities'].map((category) => (
                  <button
                    key={category}
                    onClick={() => setFilterCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                      filterCategory === category
                        ? 'bg-blue-600 text-white'
                        : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Transactions List */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-sm`}>
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                All Transactions ({filteredTransactions.length})
              </h3>
              
              <div className="space-y-4">
                {filteredTransactions.map((transaction) => (
                  <div 
                    key={transaction.id} 
                    className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg"
                    onClick={() => {
                      setSelectedTransaction(transaction.id - 1)
                      setShowTransactionDetails(true)
                    }}
                  >
                    <div className={`w-10 h-10 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-full flex items-center justify-center`}>
                      <span className="text-lg">{transaction.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{transaction.description}</p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{transaction.category} • {transaction.date} {transaction.time}</p>
                    </div>
                    <div className={`text-right ${
                      transaction.amount < 0 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      <p className="font-semibold">
                        {transaction.amount < 0 ? '-' : '+'}{formatCurrency(Math.abs(transaction.amount))}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Cards Tab */}
        {activeTab === 'cards' && (
          <div className="space-y-6">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-sm`}>
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Your Cards</h3>
              
              <div className="space-y-4">
                {cards.map((card, index) => (
                  <div 
                    key={card.id}
                    className={`relative rounded-2xl p-6 text-white cursor-pointer transform transition-all hover:scale-105 ${
                      card.color === 'blue' ? 'bg-gradient-to-r from-blue-600 to-blue-800' :
                      card.color === 'green' ? 'bg-gradient-to-r from-green-600 to-green-800' :
                      'bg-gradient-to-r from-purple-600 to-purple-800'
                    }`}
                    onClick={() => {
                      setSelectedCard(index)
                      setShowCardDetails(true)
                    }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold">{card.name}</h4>
                        <p className="text-sm opacity-90">{card.type.toUpperCase()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm opacity-90">Balance</p>
                        <p className="text-xl font-bold">{formatCurrency(card.balance)}</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm opacity-90 mb-1">Card Number</p>
                      <p className="text-lg font-mono tracking-wider">{card.number}</p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm opacity-90">Expires</p>
                        <p className="font-semibold">{card.expiry}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {card.frozen ? (
                          <div className="flex items-center space-x-1 bg-red-500/20 px-2 py-1 rounded-full">
                            <XCircle className="h-4 w-4" />
                            <span className="text-xs">Frozen</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1 bg-green-500/20 px-2 py-1 rounded-full">
                            <CheckCircle2 className="h-4 w-4" />
                            <span className="text-xs">Active</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            {/* User Profile */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-sm`}>
              <div className="flex items-center space-x-4 mb-6">
                <Image
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                  alt="User"
                  width={60}
                  height={60}
                  className="rounded-full"
                />
                <div>
                  <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{userProfile.name}</h3>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{userProfile.email}</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Member since {new Date(userProfile.memberSince).getFullYear()}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className={`p-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl`}>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Credit Score</p>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{userProfile.creditScore}</p>
                </div>
                <div className={`p-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl`}>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Risk Level</p>
                  <p className={`text-2xl font-bold text-green-600`}>{userProfile.riskLevel}</p>
                </div>
              </div>
            </div>

            {/* Settings */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-sm`}>
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Settings</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Bell className="h-5 w-5 text-blue-600" />
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Push Notifications</span>
                  </div>
                  <button className={`w-12 h-6 rounded-full ${userProfile.preferences.notifications ? 'bg-blue-600' : 'bg-gray-300'} transition-colors`}>
                    <div className={`w-5 h-5 bg-white rounded-full transform transition-transform ${userProfile.preferences.notifications ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Fingerprint className="h-5 w-5 text-green-600" />
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Biometric Login</span>
                  </div>
                  <button className={`w-12 h-6 rounded-full ${userProfile.preferences.biometric ? 'bg-green-600' : 'bg-gray-300'} transition-colors`}>
                    <div className={`w-5 h-5 bg-white rounded-full transform transition-transform ${userProfile.preferences.biometric ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Moon className="h-5 w-5 text-purple-600" />
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Dark Mode</span>
                  </div>
                  <button 
                    onClick={() => setDarkMode(!darkMode)}
                    className={`w-12 h-6 rounded-full ${darkMode ? 'bg-purple-600' : 'bg-gray-300'} transition-colors`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transform transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-orange-600" />
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Two-Factor Authentication</span>
                  </div>
                  <button className={`w-12 h-6 rounded-full ${userProfile.preferences.twoFactor ? 'bg-orange-600' : 'bg-gray-300'} transition-colors`}>
                    <div className={`w-5 h-5 bg-white rounded-full transform transition-transform ${userProfile.preferences.twoFactor ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-sm`}>
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Quick Actions</h3>
              
              <div className="space-y-3">
                <button className={`w-full flex items-center justify-between p-4 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} rounded-xl transition-colors`}>
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Download Statements</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </button>
                
                <button className={`w-full flex items-center justify-between p-4 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} rounded-xl transition-colors`}>
                  <div className="flex items-center space-x-3">
                    <HelpCircle className="h-5 w-5 text-green-600" />
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Help & Support</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </button>
                
                <button className={`w-full flex items-center justify-between p-4 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} rounded-xl transition-colors`}>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-purple-600" />
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Contact Us</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

            {/* Bottom Navigation */}
            <div className={`absolute bottom-0 left-0 right-0 ${darkMode ? 'bg-gray-800' : 'bg-white'} border-t border-gray-200 safe-area-pb`}>
        <div className="flex items-center justify-around py-2 px-4">
          <button 
            onClick={() => {
              setActiveTab('home')
              simulateHapticFeedback()
            }}
            className={`flex flex-col items-center p-3 rounded-2xl transition-all ${
              activeTab === 'home' ? 'text-blue-600 bg-blue-50' : darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            <Home className={`h-6 w-6 ${activeTab === 'home' ? 'scale-110' : ''} transition-transform`} />
            <span className="text-xs mt-1 font-medium">Home</span>
          </button>
          <button 
            onClick={() => {
              setActiveTab('transactions')
              simulateHapticFeedback()
            }}
            className={`flex flex-col items-center p-3 rounded-2xl transition-all ${
              activeTab === 'transactions' ? 'text-blue-600 bg-blue-50' : darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            <BarChart3 className={`h-6 w-6 ${activeTab === 'transactions' ? 'scale-110' : ''} transition-transform`} />
            <span className="text-xs mt-1 font-medium">Activity</span>
          </button>
          <button 
            onClick={() => {
              setActiveTab('cards')
              simulateHapticFeedback()
            }}
            className={`flex flex-col items-center p-3 rounded-2xl transition-all ${
              activeTab === 'cards' ? 'text-blue-600 bg-blue-50' : darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            <CreditCard className={`h-6 w-6 ${activeTab === 'cards' ? 'scale-110' : ''} transition-transform`} />
            <span className="text-xs mt-1 font-medium">Cards</span>
          </button>
          <button 
            onClick={() => {
              setActiveTab('profile')
              simulateHapticFeedback()
            }}
            className={`flex flex-col items-center p-3 rounded-2xl transition-all ${
              activeTab === 'profile' ? 'text-blue-600 bg-blue-50' : darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            <User className={`h-6 w-6 ${activeTab === 'profile' ? 'scale-110' : ''} transition-transform`} />
            <span className="text-xs mt-1 font-medium">Profile</span>
          </button>
        </div>
        
        {/* Home Indicator */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gray-400 rounded-full"></div>
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

      {/* Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end justify-center z-50">
          <div className="bg-white rounded-t-3xl w-full max-w-md p-6 transform transition-transform">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Transfer Money</h3>
              <button
                onClick={() => setShowTransferModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-6 w-6 text-gray-600" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl font-bold text-gray-500">$</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-4 text-2xl font-bold border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Transfer to</label>
                <select
                  value={transferTo}
                  onChange={(e) => setTransferTo(e.target.value)}
                  className="w-full px-4 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select account</option>
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.name} - {account.number}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-8">
              <button
                onClick={() => setShowTransferModal(false)}
                className="flex-1 px-6 py-4 border-2 border-gray-200 text-gray-700 rounded-2xl hover:bg-gray-50 transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowTransferModal(false)
                  simulateHapticFeedback()
                }}
                className="flex-1 px-6 py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-colors font-semibold"
              >
                Transfer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Panel */}
      {showNotifications && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowNotifications(false)}></div>
          <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-2xl transform transition-transform duration-300">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Notifications</h3>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div key={notification.id} className={`p-4 rounded-xl ${notification.read ? 'bg-gray-50' : 'bg-blue-50'} border border-gray-200`}>
                    <div className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${notification.read ? 'bg-gray-400' : 'bg-blue-500'}`}></div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{notification.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
