import { NextResponse } from 'next/server'
import { mockDb } from '@/lib/mock-db'

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

// In-memory notifications storage
let notifications: Notification[] = []

export async function GET() {
  try {
    // Return notifications sorted by newest first
    const sortedNotifications = notifications.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    
    return NextResponse.json(sortedNotifications)
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const notificationData = await request.json()
    
    const newNotification: Notification = {
      id: (notifications.length + 1).toString(),
      type: notificationData.type,
      title: notificationData.title,
      message: notificationData.message,
      salesRepName: notificationData.salesRepName,
      leadName: notificationData.leadName,
      leadCompany: notificationData.leadCompany,
      appointmentDate: notificationData.appointmentDate,
      appointmentType: notificationData.appointmentType,
      createdAt: new Date().toISOString(),
      read: false
    }

    notifications.push(newNotification)
    
    return NextResponse.json(newNotification, { status: 201 })
  } catch (error) {
    console.error('Error creating notification:', error)
    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const { notificationId, read } = await request.json()
    
    const notification = notifications.find(n => n.id === notificationId)
    if (notification) {
      notification.read = read
      return NextResponse.json(notification)
    }
    
    return NextResponse.json(
      { error: 'Notification not found' },
      { status: 404 }
    )
  } catch (error) {
    console.error('Error updating notification:', error)
    return NextResponse.json(
      { error: 'Failed to update notification' },
      { status: 500 }
    )
  }
}
