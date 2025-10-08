// Email service for sending notifications
// This is a mock implementation - in production, you'd integrate with services like:
// - SendGrid, Mailgun, AWS SES, or Resend

export interface EmailTemplate {
  subject: string
  html: string
  text: string
}

export interface EmailData {
  to: string
  from?: string
  subject: string
  html: string
  text: string
  attachments?: Array<{
    filename: string
    content: string
    type: string
  }>
}

export class EmailService {
  private static instance: EmailService
  private apiKey: string
  private fromEmail: string

  constructor() {
    this.apiKey = process.env.EMAIL_API_KEY || ''
    this.fromEmail = process.env.FROM_EMAIL || 'noreply@atarwebb.com'
  }

  static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService()
    }
    return EmailService.instance
  }

  // Send a single email
  async sendEmail(data: EmailData): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      // Mock implementation - replace with real email service
      console.log('📧 Sending email:', {
        to: data.to,
        subject: data.subject,
        from: data.from || this.fromEmail
      })

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Mock success response
      return {
        success: true,
        messageId: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }
    } catch (error) {
      console.error('Email sending failed:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Send bulk emails
  async sendBulkEmails(emails: EmailData[]): Promise<{ success: boolean; results: any[] }> {
    const results = []
    
    for (const email of emails) {
      const result = await this.sendEmail(email)
      results.push({ ...result, to: email.to })
    }

    const successCount = results.filter(r => r.success).length
    return {
      success: successCount > 0,
      results
    }
  }

  // Email templates
  static getTemplates() {
    return {
      projectRequestReceived: (data: { name: string; projectType: string }): EmailTemplate => ({
        subject: 'Thank you for your project request!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Thank you for your interest!</h2>
            <p>Hi ${data.name},</p>
            <p>We've received your request for a <strong>${data.projectType}</strong> project and we're excited to work with you!</p>
            <p>Our team will review your requirements and get back to you within 24 hours with a detailed proposal.</p>
            <p>In the meantime, feel free to reach out if you have any questions.</p>
            <p>Best regards,<br>The AtarWebb Team</p>
          </div>
        `,
        text: `Hi ${data.name},\n\nThank you for your interest! We've received your request for a ${data.projectType} project and we're excited to work with you!\n\nOur team will review your requirements and get back to you within 24 hours with a detailed proposal.\n\nBest regards,\nThe AtarWebb Team`
      }),

      projectStatusUpdate: (data: { name: string; projectTitle: string; status: string }): EmailTemplate => ({
        subject: `Project Update: ${data.projectTitle}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Project Status Update</h2>
            <p>Hi ${data.name},</p>
            <p>We wanted to update you on the status of your project: <strong>${data.projectTitle}</strong></p>
            <p><strong>Current Status:</strong> ${data.status}</p>
            <p>You can view more details and track progress in your client portal.</p>
            <p>If you have any questions, please don't hesitate to contact us.</p>
            <p>Best regards,<br>The AtarWebb Team</p>
          </div>
        `,
        text: `Hi ${data.name},\n\nProject Status Update\n\nWe wanted to update you on the status of your project: ${data.projectTitle}\n\nCurrent Status: ${data.status}\n\nYou can view more details and track progress in your client portal.\n\nBest regards,\nThe AtarWebb Team`
      }),

      invoiceGenerated: (data: { name: string; amount: number; dueDate: string }): EmailTemplate => ({
        subject: 'New Invoice Available',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">New Invoice Available</h2>
            <p>Hi ${data.name},</p>
            <p>A new invoice has been generated for your account.</p>
            <p><strong>Amount:</strong> $${data.amount.toLocaleString()}</p>
            <p><strong>Due Date:</strong> ${data.dueDate}</p>
            <p>You can view and pay your invoice through the client portal.</p>
            <p>Thank you for your business!</p>
            <p>Best regards,<br>The AtarWebb Team</p>
          </div>
        `,
        text: `Hi ${data.name},\n\nNew Invoice Available\n\nA new invoice has been generated for your account.\n\nAmount: $${data.amount.toLocaleString()}\nDue Date: ${data.dueDate}\n\nYou can view and pay your invoice through the client portal.\n\nThank you for your business!\n\nBest regards,\nThe AtarWebb Team`
      }),

      welcomeClient: (data: { name: string; company: string }): EmailTemplate => ({
        subject: 'Welcome to AtarWebb Solutions!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Welcome to AtarWebb Solutions!</h2>
            <p>Hi ${data.name},</p>
            <p>Welcome to AtarWebb Solutions! We're thrilled to have ${data.company} as our new client.</p>
            <p>Our team is committed to delivering exceptional web development services that will help your business grow.</p>
            <p>You'll receive regular updates about your projects and can always reach out to us with any questions.</p>
            <p>Let's build something amazing together!</p>
            <p>Best regards,<br>The AtarWebb Team</p>
          </div>
        `,
        text: `Hi ${data.name},\n\nWelcome to AtarWebb Solutions!\n\nWe're thrilled to have ${data.company} as our new client.\n\nOur team is committed to delivering exceptional web development services that will help your business grow.\n\nLet's build something amazing together!\n\nBest regards,\nThe AtarWebb Team`
      })
    }
  }
}

export default EmailService
