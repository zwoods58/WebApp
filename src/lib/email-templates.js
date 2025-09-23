// Email templates for AtarWeb consultation workflow

export const depositInvoiceEmail = (consultation) => {
  const depositAmount = consultation.totalAmount * 0.5; // 50% deposit
  const remainingAmount = consultation.totalAmount - depositAmount;

  return {
    subject: `Deposit Invoice - ${consultation.serviceType} Project`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Deposit Invoice - AtarWeb</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .invoice-details { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .amount { font-size: 24px; font-weight: bold; color: #667eea; }
          .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #666; }
          .highlight { background: #e3f2fd; padding: 15px; border-left: 4px solid #2196f3; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Project Accepted!</h1>
            <p>Your ${consultation.serviceType} project has been approved</p>
          </div>
          
          <div class="content">
            <h2>Hello ${consultation.name}!</h2>
            
            <p>Great news! We've reviewed your project request and are excited to work with you on your <strong>${consultation.serviceType}</strong> project.</p>
            
            <div class="highlight">
              <h3>📋 Project Details</h3>
              <p><strong>Project:</strong> ${consultation.projectDetails || 'Custom Project'}</p>
              <p><strong>Company:</strong> ${consultation.company || 'N/A'}</p>
              <p><strong>Service Type:</strong> ${consultation.serviceType}</p>
            </div>
            
            <div class="invoice-details">
              <h3>💰 Payment Information</h3>
              <p><strong>Total Project Value:</strong> $${consultation.totalAmount.toLocaleString()}</p>
              <p><strong>Deposit Required (50%):</strong> <span class="amount">$${depositAmount.toLocaleString()}</span></p>
              <p><strong>Remaining Balance:</strong> $${remainingAmount.toLocaleString()}</p>
              <p><em>Final payment due upon project completion</em></p>
            </div>
            
            <div style="text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/payment?consultationId=${consultation.id}&type=deposit" class="button">
                💳 Pay Deposit Now
              </a>
            </div>
            
            <div class="highlight">
              <h3>🚀 What Happens Next?</h3>
              <ol>
                <li>Pay the deposit to secure your project slot</li>
                <li>We'll begin development within 24 hours</li>
                <li>You'll receive regular updates on progress</li>
                <li>Final invoice sent upon completion</li>
              </ol>
            </div>
            
            <p>If you have any questions, feel free to reach out to us at <a href="mailto:support@atarweb.com">support@atarweb.com</a></p>
          </div>
          
          <div class="footer">
            <p><strong>AtarWeb</strong> - Professional Web Development Services</p>
            <p>This is an automated message. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Project Accepted - Deposit Required
      
      Hello ${consultation.name}!
      
      Great news! We've reviewed your project request and are excited to work with you on your ${consultation.serviceType} project.
      
      Project Details:
      - Project: ${consultation.projectDetails || 'Custom Project'}
      - Company: ${consultation.company || 'N/A'}
      - Service Type: ${consultation.serviceType}
      
      Payment Information:
      - Total Project Value: $${consultation.totalAmount.toLocaleString()}
      - Deposit Required (50%): $${depositAmount.toLocaleString()}
      - Remaining Balance: $${remainingAmount.toLocaleString()}
      
      Pay your deposit here: ${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/payment?consultationId=${consultation.id}&type=deposit
      
      What Happens Next:
      1. Pay the deposit to secure your project slot
      2. We'll begin development within 24 hours
      3. You'll receive regular updates on progress
      4. Final invoice sent upon completion
      
      If you have any questions, contact us at support@atarweb.com
      
      Best regards,
      AtarWeb Team
    `
  };
};

export const finalInvoiceEmail = (consultation) => {
  const remainingAmount = consultation.totalAmount - consultation.depositAmount;

  return {
    subject: `Final Invoice - ${consultation.serviceType} Project Complete`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Final Invoice - AtarWeb</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .invoice-details { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .amount { font-size: 24px; font-weight: bold; color: #28a745; }
          .button { display: inline-block; background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #666; }
          .highlight { background: #e8f5e8; padding: 15px; border-left: 4px solid #28a745; margin: 20px 0; }
          .completed { background: #d4edda; padding: 15px; border-radius: 8px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Project Complete!</h1>
            <p>Your ${consultation.serviceType} project is ready for delivery</p>
          </div>
          
          <div class="content">
            <h2>Hello ${consultation.name}!</h2>
            
            <div class="completed">
              <h3>✅ Project Status: COMPLETED</h3>
              <p>Congratulations! Your <strong>${consultation.serviceType}</strong> project has been completed and is ready for delivery.</p>
            </div>
            
            <div class="highlight">
              <h3>📋 Project Summary</h3>
              <p><strong>Project:</strong> ${consultation.projectDetails || 'Custom Project'}</p>
              <p><strong>Company:</strong> ${consultation.company || 'N/A'}</p>
              <p><strong>Service Type:</strong> ${consultation.serviceType}</p>
              <p><strong>Completion Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
            
            <div class="invoice-details">
              <h3>💰 Final Payment Due</h3>
              <p><strong>Total Project Value:</strong> $${consultation.totalAmount.toLocaleString()}</p>
              <p><strong>Deposit Paid:</strong> $${consultation.depositAmount.toLocaleString()}</p>
              <p><strong>Remaining Balance:</strong> <span class="amount">$${remainingAmount.toLocaleString()}</span></p>
              <p><em>Payment due within 7 days of project completion</em></p>
            </div>
            
            <div style="text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/payment?consultationId=${consultation.id}&type=final" class="button">
                💳 Pay Final Balance
              </a>
            </div>
            
            <div class="highlight">
              <h3>📦 What's Included in Your Delivery?</h3>
              <ul>
                <li>Complete project files and source code</li>
                <li>Documentation and setup instructions</li>
                <li>12 months of free support and maintenance</li>
                <li>Project handover and training session</li>
              </ul>
            </div>
            
            <p>Once payment is received, we'll send you all project files and schedule your handover session.</p>
            
            <p>Thank you for choosing AtarWeb! If you have any questions, contact us at <a href="mailto:support@atarweb.com">support@atarweb.com</a></p>
          </div>
          
          <div class="footer">
            <p><strong>AtarWeb</strong> - Professional Web Development Services</p>
            <p>This is an automated message. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Project Complete - Final Payment Due
      
      Hello ${consultation.name}!
      
      Congratulations! Your ${consultation.serviceType} project has been completed and is ready for delivery.
      
      Project Summary:
      - Project: ${consultation.projectDetails || 'Custom Project'}
      - Company: ${consultation.company || 'N/A'}
      - Service Type: ${consultation.serviceType}
      - Completion Date: ${new Date().toLocaleDateString()}
      
      Final Payment Information:
      - Total Project Value: $${consultation.totalAmount.toLocaleString()}
      - Deposit Paid: $${consultation.depositAmount.toLocaleString()}
      - Remaining Balance: $${remainingAmount.toLocaleString()}
      
      Pay your final balance here: ${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/payment?consultationId=${consultation.id}&type=final
      
      What's Included in Your Delivery:
      - Complete project files and source code
      - Documentation and setup instructions
      - 12 months of free support and maintenance
      - Project handover and training session
      
      Once payment is received, we'll send you all project files and schedule your handover session.
      
      Thank you for choosing AtarWeb!
      
      Best regards,
      AtarWeb Team
    `
  };
};
