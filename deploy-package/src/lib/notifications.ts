import { supabase } from './supabase'

export interface Notification {
  id: string
  title: string
  message: string
  type: 'email' | 'system' | 'project' | 'client' | 'payment'
  status: 'unread' | 'read' | 'archived'
  user_id?: string
  project_id?: string
  client_id?: string
  metadata?: any
  sent_at?: string
  created_at: string
}

export async function createNotification(notification: {
  title: string
  message: string
  type: 'email' | 'system' | 'project' | 'client' | 'payment'
  user_id?: string
  project_id?: string
  client_id?: string
  metadata?: any
}): Promise<{
  success: boolean
  notification?: Notification
  error?: string
}> {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert(notification)
      .select()
      .single()

    if (error) {
      throw error
    }

    return {
      success: true,
      notification: data
    }
  } catch (error) {
    console.error('Error creating notification:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export async function getNotifications(userId?: string): Promise<{
  success: boolean
  notifications?: Notification[]
  error?: string
}> {
  try {
    let query = supabase.from('notifications').select('*')

    if (userId) {
      query = query.eq('user_id', userId)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return {
      success: true,
      notifications: data || []
    }
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export async function markNotificationAsRead(notificationId: string): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ status: 'read' })
      .eq('id', notificationId)

    if (error) {
      throw error
    }

    return {
      success: true
    }
  } catch (error) {
    console.error('Error marking notification as read:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export async function markAllNotificationsAsRead(userId?: string): Promise<{
  success: boolean
  error?: string
}> {
  try {
    let query = supabase
      .from('notifications')
      .update({ status: 'read' })

    if (userId) {
      query = query.eq('user_id', userId)
    }

    const { error } = await query

    if (error) {
      throw error
    }

    return {
      success: true
    }
  } catch (error) {
    console.error('Error marking all notifications as read:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export async function deleteNotification(notificationId: string): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId)

    if (error) {
      throw error
    }

    return {
      success: true
    }
  } catch (error) {
    console.error('Error deleting notification:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Email notification functions
export async function sendEmailNotification(
  to: string,
  subject: string,
  message: string,
  metadata?: any
): Promise<{
  success: boolean
  error?: string
}> {
  try {
    // Create notification record
    const notificationResult = await createNotification({
      title: subject,
      message,
      type: 'email',
      metadata: { to, ...metadata }
    })

    if (!notificationResult.success) {
      throw new Error(notificationResult.error)
    }

    // Here you would integrate with your email service (SendGrid, Resend, etc.)
    // For now, we'll just log it
    console.log('Email notification:', { to, subject, message })

    return {
      success: true
    }
  } catch (error) {
    console.error('Error sending email notification:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// System notification for new project requests
export async function notifyNewProjectRequest(projectRequest: {
  id: string
  name: string
  email: string
  project_type: string
}): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const result = await createNotification({
      title: 'New Project Request',
      message: `${projectRequest.name} submitted a new project request for ${projectRequest.project_type}`,
      type: 'project',
      metadata: {
        project_request_id: projectRequest.id,
        client_email: projectRequest.email
      }
    })

    if (!result.success) {
      throw new Error(result.error)
    }

    // Also send email notification
    await sendEmailNotification(
      'admin@atarwebb.com', // Replace with your admin email
      'New Project Request - AtarWebb',
      `A new project request has been submitted:\n\nName: ${projectRequest.name}\nEmail: ${projectRequest.email}\nProject Type: ${projectRequest.project_type}\n\nPlease review it in the admin dashboard.`
    )

    return {
      success: true
    }
  } catch (error) {
    console.error('Error notifying new project request:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}
