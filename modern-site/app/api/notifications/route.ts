/**
 * Notifications API Route
 * P1 Feature 20: Notification System
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '../../../src/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    // Get notifications from database
    const { data: notifications, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      throw error
    }

    const unreadCount = notifications?.filter(n => !n.read).length || 0

    return NextResponse.json({
      success: true,
      notifications: notifications || [],
      unreadCount
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to get notifications' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()
    const { userId, type, title, message, action } = await request.json()

    if (!userId || !type || !title || !message) {
      return NextResponse.json(
        { error: 'userId, type, title, and message required' },
        { status: 400 }
      )
    }

    // Create notification
    const { data: notification, error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type,
        title,
        message,
        action: action || null,
        read: false
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      notification
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create notification' },
      { status: 500 }
    )
  }
}





