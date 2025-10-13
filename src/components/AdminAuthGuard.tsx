'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  name: string
  role: 'ADMIN' | 'SALES'
}

interface AdminAuthGuardProps {
  children: React.ReactNode
  allowedRoles?: ('ADMIN' | 'SALES')[]
}

export default function AdminAuthGuard({ children, allowedRoles = ['ADMIN', 'SALES'] }: AdminAuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')
      const userData = localStorage.getItem('user')

      if (!token || !userData) {
        // No auth, redirect to login
        router.push('/admin')
        return
      }

      try {
        const user: User = JSON.parse(userData)
        
        // Check if user role is allowed
        if (!allowedRoles.includes(user.role)) {
          // User doesn't have permission
          router.push('/admin')
          return
        }

        setIsAuthenticated(true)
      } catch (error) {
        // Invalid user data
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        router.push('/admin')
        return
      }
    }
    
    setIsLoading(false)
  }, [router, allowedRoles])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Verifying authentication...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect, so show nothing
  }

  return <>{children}</>
}

