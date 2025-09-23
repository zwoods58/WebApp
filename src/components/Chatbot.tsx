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
    'Web Development - Custom websites and web applications built with modern technologies',
    'Mobile Applications - Native and cross-platform mobile apps for iOS and Android'
  ],
  pricing: [
    'Majority of base services under $1,000 with no hidden fees',
    'Transparent pricing with no surprises'
  ],
  timeline: [
    '21 days delivery time vs 3-6 months industry standard',
    'Fast delivery without compromising quality'
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
    'Reliable Partnership - We believe in long-term relationships'
  ],
  mission: 'To democratize high-quality web development by making professional-grade solutions accessible to businesses of all sizes',
  contact: 'For questions we cannot answer, please contact us at support@atarweb.com'
}

const predefinedQuestions = [
  'What services do you offer?',
  'How much do your projects cost?',
  'How long does a project take?',
  'What is your development process?',
  'What makes you different?',
  'Do you offer support after launch?'
]

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! I'm here to help answer questions about AtarWeb's services. What would you like to know?",
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

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase()
    
    // Services
    if (message.includes('service') || message.includes('what do you do') || message.includes('offer')) {
      return `We offer two main services:\n\n${websiteContent.services.map(service => `• ${service}`).join('\n')}\n\nWould you like to know more about any specific service?`
    }
    
    // Pricing
    if (message.includes('price') || message.includes('cost') || message.includes('how much')) {
      return `Our pricing is very competitive:\n\n${websiteContent.pricing.map(price => `• ${price}`).join('\n')}\n\nAll projects are delivered in 21 days with 12 months of free support included.`
    }
    
    // Timeline
    if (message.includes('time') || message.includes('how long') || message.includes('duration') || message.includes('delivery')) {
      return `Our delivery timeline:\n\n${websiteContent.timeline.map(timeline => `• ${timeline}`).join('\n')}\n\nThis is much faster than traditional agencies who take 3-6 months.`
    }
    
    // Process
    if (message.includes('process') || message.includes('how do you work') || message.includes('workflow')) {
      return `Our development process:\n\n${websiteContent.process.map((step, index) => `${index + 1}. ${step}`).join('\n')}\n\nWe keep you involved throughout the entire process.`
    }
    
    // Values/Differentiation
    if (message.includes('different') || message.includes('why choose') || message.includes('values') || message.includes('what makes you')) {
      return `What makes us different:\n\n${websiteContent.values.map(value => `• ${value}`).join('\n')}\n\nWe focus on delivering quality work that drives real business results.`
    }
    
    // Support
    if (message.includes('support') || message.includes('maintenance') || message.includes('after launch')) {
      return `Yes! We provide 12 months of free support and maintenance after launch. This includes:\n\n• Bug fixes and updates\n• Performance monitoring\n• Technical support\n• Minor feature adjustments\n\nAfter 12 months, we offer ongoing support packages.`
    }
    
    // Mission
    if (message.includes('mission') || message.includes('about') || message.includes('who are you')) {
      return `Our mission: ${websiteContent.mission}\n\nWe believe every business deserves access to cutting-edge technology and exceptional user experiences, regardless of their size or budget.`
    }
    
    // Default response for unrecognized questions
    return `I understand you're asking about "${userMessage}". While I can help with general questions about our services, pricing, timeline, and process, for more specific inquiries, please contact us at support@atarweb.com and our team will get back to you within 24 hours.`
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

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 group"
        >
          <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">AtarWeb Assistant</h3>
                <p className="text-xs opacity-90">Ask me anything!</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
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

          {/* Quick Questions */}
          {messages.length === 1 && (
            <div className="p-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
              <div className="flex flex-wrap gap-2">
                {predefinedQuestions.slice(0, 3).map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickQuestion(question)}
                    className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

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
