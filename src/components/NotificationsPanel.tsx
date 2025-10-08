'use client'

import { useState, useEffect } from 'react'
import { Bell, Calendar, Phone, User, X, CheckCircle, Clock } from 'lucide-react'

interface Notification {
  id: string
  type: 'APPOINTMENT_BOOKED' | 'CALL_LOGGED' | 'LEAD_UPDATED'
  title: string
  message: string
  salesRepName: string
  leadName: string
  leadCompany: string
  appointmentDate?: string
  appointmentType?: string
  createdAt: string
  read: boolean
}

interface NotificationsPanelProps {
  isOpen: boolean
  onClose: () => void
}

export default function NotificationsPanel({ isOpen, onClose }: NotificationsPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isOpen) {
      fetchNotifications()
    }
  }, [isOpen])

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications')
      if (response.ok) {
        const data = await response.json()
        setNotifications(data)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId, read: true })
      })

      if (response.ok) {
        setNotifications(prev => 
          prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
        )
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'APPOINTMENT_BOOKED':
        return <Calendar className="h-5 w-5 text-green-400" />
      case 'CALL_LOGGED':
        return <Phone className="h-5 w-5 text-blue-400" />
      case 'LEAD_UPDATED':
        return <User className="h-5 w-5 text-yellow-400" />
      default:
        return <Bell className="h-5 w-5 text-slate-400" />
    }
  }

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'APPOINTMENT_BOOKED':
        return 'border-l-green-500 bg-green-900/10'
      case 'CALL_LOGGED':
        return 'border-l-blue-500 bg-blue-900/10'
      case 'LEAD_UPDATED':
        return 'border-l-yellow-500 bg-yellow-900/10'
      default:
        return 'border-l-slate-500 bg-slate-900/10'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return date.toLocaleDateString()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-semibold text-white flex items-center">
            <Bell className="h-6 w-6 mr-2" />
            Admin Notifications
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[60vh]">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center p-8">
              <Bell className="h-12 w-12 mx-auto text-slate-400 mb-4" />
              <p className="text-slate-400">No notifications yet</p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border-l-4 ${getNotificationColor(notification.type)} ${
                    !notification.read ? 'bg-slate-700/30' : 'bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-white">{notification.title}</h3>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          )}
                        </div>
                        <p className="text-slate-300 text-sm mb-2">{notification.message}</p>
                        
                        <div className="flex items-center space-x-4 text-xs text-slate-400">
                          <span className="flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            {notification.salesRepName}
                          </span>
                          <span>{notification.leadName} - {notification.leadCompany}</span>
                          {notification.appointmentDate && (
                            <span className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {new Date(notification.appointmentDate).toLocaleDateString()}
                            </span>
                          )}
                          {notification.appointmentType && (
                            <span className="capitalize">
                              {notification.appointmentType.toLowerCase().replace('_', ' ')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <span className="text-xs text-slate-400">
                        {formatDate(notification.createdAt)}
                      </span>
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-blue-400 hover:text-blue-300 p-1"
                          title="Mark as read"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center justify-between text-sm text-slate-400">
            <span>{notifications.length} total notifications</span>
            <span>{notifications.filter(n => !n.read).length} unread</span>
          </div>
        </div>
      </div>
    </div>
  )
}
