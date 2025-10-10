import { supabase } from './supabase'
import EmailService from './email-service'

export interface NotificationData {
  type: 'project_request' | 'project_update' | 'invoice' | 'welcome' | 'custom'
  recipient_email: string
  recipient_name: string
  subject: string
  message: string
  metadata?: any
  priority?: 'low' | 'medium' | 'high'
}

export class NotificationService {
  private emailService: EmailService

  constructor() {
    this.emailService = EmailService.getInstance()
  }

  // Send a notification
  async sendNotification(data: NotificationData): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      // Save notification to database
      const { data: notification, error: dbError } = await supabase
        .from('notifications')
        .insert({
          type: data.type,
          recipient_email: data.recipient_email,
          recipient_name: data.recipient_name,
          subject: data.subject,
          message: data.message,
          metadata: data.metadata,
          priority: data.priority || 'medium',
          status: 'pending'
        })
        .select()
        .single()

      if (dbError) {
        console.error('Database error:', dbError)
        return { success: false, error: dbError.message }
      }

      // Send email
      const emailResult = await this.emailService.sendEmail({
        to: data.recipient_email,
        subject: data.subject,
        html: this.formatHtmlMessage(data.message),
        text: data.message
      })

      if (emailResult.success) {
        // Update notification status
        await supabase
          .from('notifications')
          .update({ 
            status: 'sent',
            sent_at: new Date().toISOString(),
            message_id: emailResult.messageId
          })
          .eq('id', notification.id)

        return { success: true, messageId: emailResult.messageId }
      } else {
        // Update notification status to failed
        await supabase
          .from('notifications')
          .update({ 
            status: 'failed',
            error_message: emailResult.error
          })
          .eq('id', notification.id)

        return { success: false, error: emailResult.error }
      }
    } catch (error) {
      console.error('Notification sending failed:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  // Send bulk notifications
  async sendBulkNotifications(notifications: NotificationData[]): Promise<{ success: boolean; results: any[] }> {
    const results = []
    
    for (const notification of notifications) {
      const result = await this.sendNotification(notification)
      results.push({ ...result, recipient: notification.recipient_email })
    }

    const successCount = results.filter(r => r.success).length
    return {
      success: successCount > 0,
      results
    }
  }

  // Send project request confirmation
  async sendProjectRequestConfirmation(data: {
    name: string
    email: string
    projectType: string
  }): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const template = EmailService.getTemplates().projectRequestReceived(data)
    
    return this.sendNotification({
      type: 'project_request',
      recipient_email: data.email,
      recipient_name: data.name,
      subject: template.subject,
      message: template.text,
      metadata: { projectType: data.projectType },
      priority: 'high'
    })
  }

  // Send project status update
  async sendProjectStatusUpdate(data: {
    name: string
    email: string
    projectTitle: string
    status: string
  }): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const template = EmailService.getTemplates().projectStatusUpdate(data)
    
    return this.sendNotification({
      type: 'project_update',
      recipient_email: data.email,
      recipient_name: data.name,
      subject: template.subject,
      message: template.text,
      metadata: { projectTitle: data.projectTitle, status: data.status },
      priority: 'medium'
    })
  }

  // Send invoice notification
  async sendInvoiceNotification(data: {
    name: string
    email: string
    amount: number
    dueDate: string
  }): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const template = EmailService.getTemplates().invoiceGenerated(data)
    
    return this.sendNotification({
      type: 'invoice',
      recipient_email: data.email,
      recipient_name: data.name,
      subject: template.subject,
      message: template.text,
      metadata: { amount: data.amount, dueDate: data.dueDate },
      priority: 'high'
    })
  }

  // Send welcome email to new client
  async sendWelcomeEmail(data: {
    name: string
    email: string
    company: string
  }): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const template = EmailService.getTemplates().welcomeClient(data)
    
    return this.sendNotification({
      type: 'welcome',
      recipient_email: data.email,
      recipient_name: data.name,
      subject: template.subject,
      message: template.text,
      metadata: { company: data.company },
      priority: 'medium'
    })
  }

  // Get notification history
  async getNotificationHistory(limit: number = 50): Promise<any[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching notifications:', error)
      return []
    }

    return data || []
  }

  // Get notification stats
  async getNotificationStats(): Promise<{
    total: number
    sent: number
    pending: number
    failed: number
  }> {
    const { data, error } = await supabase
      .from('notifications')
      .select('status')

    if (error) {
      console.error('Error fetching notification stats:', error)
      return { total: 0, sent: 0, pending: 0, failed: 0 }
    }

    const stats = data.reduce((acc, notification) => {
      acc.total++
      acc[notification.status as keyof typeof acc]++
      return acc
    }, { total: 0, sent: 0, pending: 0, failed: 0 })

    return stats
  }

  // Format HTML message
  private formatHtmlMessage(message: string): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #2563eb;">
          ${message.replace(/\n/g, '<br>')}
        </div>
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
          <p>This email was sent from AtarWebb Solutions admin dashboard.</p>
          <p>If you have any questions, please contact us at admin@atarwebb.com</p>
        </div>
      </div>
    `
  }
}

export default NotificationService
