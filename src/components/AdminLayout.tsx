'use client'

import { useState, useEffect } from 'react'
import { Users, DollarSign, Target, BarChart3, Settings, Plus, LogOut, Menu, X, Home, Calendar } from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'SALES'
}

interface AdminLayoutProps {
  children: React.ReactNode
  currentPage?: string
}

export default function AdminLayout({ children, currentPage = 'dashboard' }: AdminLayoutProps) {
  const [user, setUser] = useState<User | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user')
      if (userData) {
        setUser(JSON.parse(userData))
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/admin'
  }

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: Home, current: currentPage === 'dashboard' },
    { name: 'Leads', href: '/admin/leads', icon: Users, current: currentPage === 'leads' },
    { name: 'Tasks', href: '/admin/tasks', icon: Calendar, current: currentPage === 'tasks' },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3, current: currentPage === 'analytics' },
    { name: 'Import', href: '/admin/import', icon: Plus, current: currentPage === 'import' },
    { name: 'Settings', href: '/admin/settings', icon: Settings, current: currentPage === 'settings' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 w-64 bg-slate-800 shadow-xl">
          <div className="flex items-center justify-between p-4 border-b border-slate-700">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8">
                <img src="/Logo.png" alt="AtarWebb" className="w-full h-full object-contain" />
              </div>
              <span className="text-white font-semibold">AtarWebb CRM</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="mt-4 px-4">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg mb-1 transition-colors ${
                  item.current
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-slate-800 border-r border-slate-700">
          <div className="flex items-center space-x-3 p-4 border-b border-slate-700">
            <div className="w-8 h-8">
              <img src="/Logo.png" alt="AtarWebb" className="w-full h-full object-contain" />
            </div>
            <span className="text-white font-semibold">AtarWebb CRM</span>
          </div>
          <nav className="mt-4 px-4 flex-1">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg mb-1 transition-colors ${
                  item.current
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </a>
            ))}
          </nav>
          <div className="p-4 border-t border-slate-700">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.name?.charAt(0) || 'A'}
                </span>
              </div>
              <div>
                <p className="text-white text-sm font-medium">{user?.name}</p>
                <p className="text-slate-400 text-xs">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 w-full px-3 py-2 text-slate-300 hover:bg-slate-700 hover:text-white rounded-lg transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50">
          <div className="flex items-center justify-between px-4 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-slate-400 hover:text-white"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center space-x-4">
              {/* Empty space for future content if needed */}
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}

