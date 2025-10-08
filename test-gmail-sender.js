const sgMail = require('@sendgrid/mail')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  console.log('SendGrid API key loaded:', process.env.SENDGRID_API_KEY.substring(0, 10) + '...')
} else {
  console.log('No SendGrid API key found')
  process.exit(1)
}

async function testGmailSender() {
  try {
    console.log('Testing with Gmail sender address...')
    
    // Test with a Gmail address (you need to replace this with your actual Gmail)
    const testEmail = await sgMail.send({
      to: 'admin@atarwebb.com',
      from: 'your-gmail@gmail.com', // Replace with your actual Gmail
      subject: 'Test Email - Gmail Sender',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Test Email - Gmail Sender</h2>
          <p>This is a test email using a Gmail sender address.</p>
          <p><strong>Test Details:</strong></p>
          <ul>
            <li>From: your-gmail@gmail.com</li>
            <li>To: admin@atarwebb.com</li>
            <li>Time: ${new Date().toLocaleString()}</li>
          </ul>
          <p>If you receive this email, Gmail sender addresses work!</p>
        </div>
      `
    })
    
    console.log('✅ Gmail sender test sent successfully:', testEmail[0].statusCode)
    console.log('📧 Check your email inbox (including spam folder)')
    console.log('')
    console.log('💡 To fix your consultation system:')
    console.log('   1. Update .env.local: SENDGRID_FROM_EMAIL=your-gmail@gmail.com')
    console.log('   2. Verify your Gmail address in SendGrid')
    console.log('   3. Restart your development server')
    
  } catch (error) {
    console.error('❌ Error sending test email:', error)
    if (error.response) {
      console.error('Error details:', error.response.body)
    }
  }
}

testGmailSender()
