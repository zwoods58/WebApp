'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot, User } from 'lucide-react'

interface Message {
  id: number
  text: string
  isUser: boolean
  timestamp: Date
}

const websiteContent = {
  services: [
    'The Basic Launchpad - Single page websites for startups ($150)',
    'The Standard Optimizer - Multi-page websites for growing businesses ($250)',
    'The Premium Accelerator - Advanced websites with custom features ($500)'
  ],
  pricing: [
    'The Basic Launchpad: $150 - Perfect for startups and budget-focused campaigns',
    'The Standard Optimizer: $250 - Ideal for growing businesses (Most Popular)',
    'The Premium Accelerator: $500 - Advanced features and custom functionality',
    'All packages include 7-day delivery with professional development standards',
    'Transparent pricing with no hidden fees or surprises'
  ],
  timeline: [
    '7 days delivery time vs 3-6 months industry standard',
    'Fast delivery without compromising quality',
    'Multiple review rounds included in each package',
    'Professional development standards maintained'
  ],
  process: [
    'Discovery & Planning - Understanding your vision and requirements',
    'Strategy & Design - Creating comprehensive strategy and design mockups',
    'Development & Testing - Building with modern technologies and best practices',
    'Refinement & Optimization - Polishing and optimizing performance',
    'Launch & Support - Deploying and providing ongoing support'
  ],
  values: [
    'Passion-Driven Excellence - We genuinely love what we do',
    'Results-Focused - We measure success by the impact we create',
    'Technical Integrity - We write clean, maintainable code',
    'Reliable Partnership - We believe in long-term relationships',
    'Scalable Architecture - Building solutions that grow with your business'
  ],
  features: [
    'Mobile-first responsive design',
    'SEO optimization included',
    'Fast loading times and performance',
    'Modern, clean code architecture',
    'Professional design and user experience'
  ],
  mission: 'To democratize high-quality web development by making professional-grade solutions accessible to businesses of all sizes',
  contact: 'For questions we cannot answer, please contact us at admin@atarwebb.com or schedule a consultation'
}

const predefinedQuestions = [
  'What packages do you offer?',
  'How much does a website cost?',
  'How long does it take?',
  'What is included in each package?',
  'Do you offer custom development?',
  'How do I get started?'
]

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! I'm the AtarWebb Assistant. I can help you learn about our website packages, pricing, and development process. What would you like to know?",
      isUser: false,
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Handle click outside to close and reset
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen) {
        const target = event.target as Element
        if (!target.closest('.chatbot-container')) {
          resetChatbot()
        }
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase()
    
    // Services/Packages
    if (message.includes('service') || message.includes('package') || message.includes('what do you do') || message.includes('offer')) {
      return `We offer three main website packages:\n\n${websiteContent.services.map(service => `• ${service}`).join('\n')}\n\nEach package is designed for different business needs and budgets. Would you like to know more about any specific package?`
    }
    
    // Pricing
    if (message.includes('price') || message.includes('cost') || message.includes('how much')) {
      return `Our pricing packages:\n\n${websiteContent.pricing.map(price => `• ${price}`).join('\n')}\n\nAll packages include 7-day delivery with professional development standards. No hidden fees!`
    }
    
    // Timeline
    if (message.includes('time') || message.includes('how long') || message.includes('duration') || message.includes('delivery')) {
      return `Our delivery timeline:\n\n${websiteContent.timeline.map(timeline => `• ${timeline}`).join('\n')}\n\nThis is much faster than traditional agencies who take 3-6 months.`
    }
    
    // What's included
    if (message.includes('include') || message.includes('what comes with') || message.includes('features')) {
      return `What's included in our packages:\n\n${websiteContent.features.map(feature => `• ${feature}`).join('\n')}\n\nEach package also includes multiple review rounds and professional support.`
    }
    
    // Process
    if (message.includes('process') || message.includes('how do you work') || message.includes('workflow')) {
      return `Our development process:\n\n${websiteContent.process.map((step, index) => `${index + 1}. ${step}`).join('\n')}\n\nWe keep you involved throughout the entire process with regular updates.`
    }
    
    // Getting started
    if (message.includes('start') || message.includes('begin') || message.includes('get started') || message.includes('how to')) {
      return `Getting started is easy!\n\n1. Choose a package that fits your needs\n2. Schedule a consultation to discuss your project\n3. We'll create a custom strategy and timeline\n4. Development begins with regular updates\n\nReady to get started? Visit our contact page or schedule a consultation!`
    }
    
    // Custom development
    if (message.includes('custom') || message.includes('bespoke') || message.includes('special')) {
      return `We focus on our three main website packages that cover most business needs:\n\n• The Basic Launchpad ($150) - Single page websites\n• The Standard Optimizer ($250) - Multi-page websites\n• The Premium Accelerator ($500) - Advanced websites\n\nIf you have specific requirements that don't fit these packages, please contact us at admin@atarwebb.com to discuss your project.`
    }
    
    // Values/Differentiation
    if (message.includes('different') || message.includes('why choose') || message.includes('values') || message.includes('what makes you')) {
      return `What makes us different:\n\n${websiteContent.values.map(value => `• ${value}`).join('\n')}\n\nWe focus on delivering quality work that drives real business results with fast turnaround times.`
    }
    
    // Mission
    if (message.includes('mission') || message.includes('about') || message.includes('who are you')) {
      return `Our mission: ${websiteContent.mission}\n\nWe believe every business deserves access to cutting-edge technology and exceptional user experiences, regardless of their size or budget.`
    }
    
    // Support
    if (message.includes('support') || message.includes('help') || message.includes('after launch')) {
      return `Yes! We provide ongoing support after launch:\n\n• Bug fixes and maintenance\n• Performance optimization\n• Content updates\n• Technical support\n• Future enhancements\n\nWe believe in long-term partnerships with our clients.`
    }
    
    // Default response for unrecognized questions
    return `I understand you're asking about "${userMessage}". While I can help with questions about our packages, pricing, timeline, and process, for more specific inquiries, please contact us at admin@atarwebb.com or schedule a consultation. Our team will get back to you within 24 hours!`
  }

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Simulate typing delay
    setTimeout(() => {
      const botResponse = getBotResponse(inputValue)
      const botMessage: Message = {
        id: messages.length + 2,
        text: botResponse,
        isUser: false,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botMessage])
      setIsTyping(false)
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleQuickQuestion = (question: string) => {
    setInputValue(question)
    handleSendMessage()
  }

  const resetChatbot = () => {
    setIsOpen(false)
    setMessages([
      {
        id: 1,
        text: "Hi! I'm the AtarWebb Assistant. I can help you learn about our website packages, pricing, and development process. What would you like to know?",
        isUser: false,
        timestamp: new Date()
      }
    ])
    setInputValue('')
    setIsTyping(false)
  }

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-[9999] group"
        >
          <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-container fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-[9999] flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">AtarWebb Assistant</h3>
                <p className="text-xs opacity-90">Ask me anything!</p>
              </div>
            </div>
            <button
              onClick={resetChatbot}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    message.isUser
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {!message.isUser && (
                      <Bot className="w-4 h-4 mt-1 flex-shrink-0" />
                    )}
                    {message.isUser && (
                      <User className="w-4 h-4 mt-1 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm whitespace-pre-line">{message.text}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 p-3 rounded-2xl">
                  <div className="flex items-center space-x-2">
                    <Bot className="w-4 h-4" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>


          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-full hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
