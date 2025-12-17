/**
 * Enhanced AI Chat Component
 * P1 Feature 8: Enhanced AI Chat
 * 
 * Chat with code highlighting, copy buttons, regenerate, branch conversations, file attachments
 */

'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Send, Copy, RefreshCw, Code, FileText, Image, X } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  codeBlocks?: Array<{ language: string; code: string }>
  attachments?: Array<{ type: string; name: string; content: string }>
}

interface EnhancedChatProps {
  projectId: string
  onCodeGenerated?: (code: string) => void
}

export default function EnhancedChat({ projectId, onCodeGenerated }: EnhancedChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null)
  const [branches, setBranches] = useState<Record<string, Message[]>>({})
  const [attachments, setAttachments] = useState<File[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Extract code blocks from markdown
  const extractCodeBlocks = (content: string): Array<{ language: string; code: string }> => {
    const codeBlocks: Array<{ language: string; code: string }> = []
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g
    let match

    while ((match = codeBlockRegex.exec(content)) !== null) {
      codeBlocks.push({
        language: match[1] || 'text',
        code: match[2]
      })
    }

    return codeBlocks
  }

  // Send message
  const handleSend = async () => {
    if (!input.trim() && attachments.length === 0) return

    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: Date.now(),
      attachments: attachments.map(file => ({
        type: file.type,
        name: file.name,
        content: '' // Would read file content in production
      }))
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setAttachments([])
    setIsLoading(true)

    try {
      // Call chat API
      const response = await fetch('/api/ai-builder/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          })),
          projectId
        })
      })

      if (!response.ok) {
        throw new Error('Chat API error')
      }

      const data = await response.json()
      const codeBlocks = extractCodeBlocks(data.message || '')

      const assistantMessage: Message = {
        id: `msg_${Date.now()}_assistant`,
        role: 'assistant',
        content: data.message || '',
        timestamp: Date.now(),
        codeBlocks
      }

      setMessages(prev => [...prev, assistantMessage])

      // Extract and call onCodeGenerated if code blocks found
      if (codeBlocks.length > 0 && onCodeGenerated) {
        const firstCodeBlock = codeBlocks[0]
        onCodeGenerated(firstCodeBlock.code)
      }
    } catch (error: any) {
      const errorMessage: Message = {
        id: `msg_${Date.now()}_error`,
        role: 'assistant',
        content: `Error: ${error.message}`,
        timestamp: Date.now()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // Copy code block
  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
  }

  // Regenerate last response
  const handleRegenerate = async () => {
    if (messages.length === 0) return

    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user')
    if (!lastUserMessage) return

    // Remove last assistant message
    setMessages(prev => prev.filter(m => m.role !== 'assistant' || m.id !== prev[prev.length - 1].id))

    // Resend
    setInput(lastUserMessage.content)
    setTimeout(() => handleSend(), 100)
  }

  // Branch conversation
  const handleBranch = (messageId: string) => {
    const branchId = `branch_${Date.now()}`
    const messageIndex = messages.findIndex(m => m.id === messageId)
    const branchMessages = messages.slice(0, messageIndex + 1)
    
    setBranches(prev => ({ ...prev, [branchId]: branchMessages }))
    setSelectedBranch(branchId)
    setMessages(branchMessages)
  }

  // Handle file attachment
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setAttachments(prev => [...prev, ...files])
  }

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-700 flex items-center justify-between">
        <h2 className="text-white font-semibold">AI Chat</h2>
        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <button
              onClick={handleRegenerate}
              className="px-3 py-1.5 text-sm bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
              title="Regenerate last response"
            >
              <RefreshCw className="w-4 h-4 inline mr-1" />
              Regenerate
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-100'
              }`}
            >
              {/* Attachments */}
              {message.attachments && message.attachments.length > 0 && (
                <div className="mb-2 space-y-1">
                  {message.attachments.map((att, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      {att.type.startsWith('image/') ? (
                        <Image className="w-4 h-4" />
                      ) : (
                        <FileText className="w-4 h-4" />
                      )}
                      <span>{att.name}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Content */}
              {message.role === 'assistant' && message.codeBlocks && message.codeBlocks.length > 0 ? (
                <div>
                  <ReactMarkdown
                    components={{
                      code({ node, inline, className, children, ...props }: any) {
                        const match = /language-(\w+)/.exec(className || '')
                        return !inline && match ? (
                          <div className="relative">
                            <div className="absolute top-2 right-2">
                              <button
                                onClick={() => copyCode(String(children).replace(/\n$/, ''))}
                                className="p-1 bg-gray-700 rounded hover:bg-gray-600"
                                title="Copy code"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                            </div>
                            <SyntaxHighlighter
                              style={vscDarkPlus}
                              language={match[1]}
                              PreTag="div"
                              {...props}
                            >
                              {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                          </div>
                        ) : (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        )
                      }
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="whitespace-pre-wrap">{message.content}</div>
              )}

              {/* Branch button */}
              {message.role === 'assistant' && (
                <button
                  onClick={() => handleBranch(message.id)}
                  className="mt-2 text-xs text-gray-400 hover:text-gray-300"
                >
                  Branch conversation
                </button>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-400">
                <div className="animate-spin">⏳</div>
                <span>AI is thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-700 p-4">
        {/* Attachments */}
        {attachments.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {attachments.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded text-sm"
              >
                <FileText className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300">{file.name}</span>
                <button
                  onClick={() => setAttachments(prev => prev.filter((_, i) => i !== idx))}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded"
            title="Attach file"
          >
            <FileText className="w-5 h-5" />
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Ask AI to build something..."
            className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={handleSend}
            disabled={isLoading || (!input.trim() && attachments.length === 0)}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}





