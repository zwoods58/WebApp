// Email service for sending notifications
// This is a placeholder implementation - in production, you'd use a service like SendGrid, AWS SES, or Nodemailer

export async function sendEmail({ to, subject, html, text }) {
  try {
    // In production, replace this with actual email service
    console.log('📧 Email would be sent:')
    console.log('To:', to)
    console.log('Subject:', subject)
    console.log('HTML:', html)
    console.log('Text:', text)
    
    // Simulate email sending
    await new Promise(resolve => setTimeout(resolve, 100))
    
    return {
      success: true,
      messageId: `email_${Date.now()}`,
      message: 'Email sent successfully (simulated)'
    }
  } catch (error) {
    console.error('Email sending error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Email templates
export const emailTemplates = {
  consultationRequest: {
    admin: (data) => ({
      subject: 'New Consultation Request - AtarWebb',
      html: `
        <h2>New Consultation Request</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
        <p><strong>Company:</strong> ${data.company || 'Not provided'}</p>
        <p><strong>Preferred Time:</strong> ${data.preferredDateTime}</p>
        <p><strong>Project Details:</strong></p>
        <p>${data.projectDetails || 'No details provided'}</p>
        <p><strong>File Uploaded:</strong> ${data.uploadedFile ? 'Yes' : 'No'}</p>
        <p>Please contact the client to confirm the consultation time.</p>
      `
    }),
    client: (data) => ({
      subject: 'Consultation Request Received - AtarWebb',
      html: `
        <h2>Thank you for your consultation request!</h2>
        <p>Hi ${data.name},</p>
        <p>We've received your consultation request and will contact you soon to confirm your preferred time:</p>
        <p><strong>Requested Time:</strong> ${data.preferredDateTime}</p>
        <p>Our team will review your project details and get back to you within 24 hours to schedule your consultation.</p>
        <p>If you have any questions, please don't hesitate to contact us at admin@atarwebb.com</p>
        <p>Best regards,<br>The AtarWebb Team</p>
      `
    })
  },
  
  depositPayment: {
    client: (data) => ({
      subject: 'Deposit Payment Confirmation - AtarWebb',
      html: `
        <h2>Deposit Payment Received!</h2>
        <p>Hi ${data.customerName},</p>
        <p>Thank you for your deposit payment of <strong>$${data.depositAmount}</strong> for your <strong>${data.serviceName}</strong> project.</p>
        <p><strong>Project Details:</strong></p>
        <ul>
          <li>Total Project Cost: $${data.totalPrice}</li>
          <li>Deposit Paid: $${data.depositAmount}</li>
          <li>Remaining Balance: $${data.remainingAmount}</li>
        </ul>
        <p>We'll begin working on your project and keep you updated on our progress. You'll receive a final invoice for the remaining balance upon project completion.</p>
        <p>If you have any questions, please contact us at admin@atarwebb.com</p>
        <p>Best regards,<br>The AtarWebb Team</p>
      `
    }),
    admin: (data) => ({
      subject: 'Deposit Payment Received - AtarWebb',
      html: `
        <h2>Deposit Payment Received</h2>
        <p><strong>Customer:</strong> ${data.customerName} (${data.customerEmail})</p>
        <p><strong>Project:</strong> ${data.serviceName}</p>
        <p><strong>Deposit Amount:</strong> $${data.depositAmount}</p>
        <p><strong>Total Project Cost:</strong> $${data.totalPrice}</p>
        <p><strong>Remaining Balance:</strong> $${data.remainingAmount}</p>
        <p>You can now begin work on this project.</p>
      `
    })
  },
  
  finalInvoice: {
    client: (data) => ({
      subject: 'Final Invoice - Project Complete - AtarWebb',
      html: `
        <h2>Project Complete - Final Invoice</h2>
        <p>Hi ${data.customerName},</p>
        <p>Great news! Your <strong>${data.serviceName}</strong> project has been completed successfully.</p>
        <p><strong>Final Invoice Details:</strong></p>
        <ul>
          <li>Total Project Cost: $${data.totalPrice}</li>
          <li>Deposit Paid: $${data.depositAmount}</li>
          <li>Final Payment Due: $${data.remainingAmount}</li>
        </ul>
        <p>Please complete the final payment to receive your project deliverables.</p>
        <p>Thank you for choosing AtarWebb for your project needs!</p>
        <p>Best regards,<br>The AtarWebb Team</p>
      `
    }),
    admin: (data) => ({
      subject: 'Final Payment Received - Project Complete - AtarWebb',
      html: `
        <h2>Final Payment Received - Project Complete</h2>
        <p><strong>Customer:</strong> ${data.customerName} (${data.customerEmail})</p>
        <p><strong>Project:</strong> ${data.serviceName}</p>
        <p><strong>Final Payment:</strong> $${data.remainingAmount}</p>
        <p><strong>Total Project Revenue:</strong> $${data.totalPrice}</p>
        <p>Project is now fully paid and complete. Deliverables can be released to the client.</p>
      `
    })
  }
}
