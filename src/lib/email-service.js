// Email service using Brevo SMTP
const nodemailer = require('nodemailer');

// Create Brevo SMTP transporter
function createTransporter() {
  if (process.env.BREVO_SMTP_USER && process.env.BREVO_SMTP_PASSWORD) {
    return nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.BREVO_SMTP_USER,
        pass: process.env.BREVO_SMTP_PASSWORD
      }
    });
  }
  return null;
}

export const sendDepositInvoiceEmail = async (consultation) => {
  const transporter = createTransporter();
  
  if (!transporter) {
    console.log('Brevo SMTP credentials not configured. Email not sent.');
    return { success: false, error: 'Brevo SMTP not configured' };
  }

  try {
    const { depositInvoiceEmail } = await import('./email-templates');
    const emailTemplate = depositInvoiceEmail(consultation);
    
    const mailOptions = {
      from: process.env.BREVO_SMTP_USER,
      to: consultation.email,
      subject: emailTemplate.subject,
      text: emailTemplate.text,
      html: emailTemplate.html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Deposit invoice email sent to ${consultation.email}`);
    return { success: true };
  } catch (error) {
    console.error('Error sending deposit invoice email:', error);
    return { success: false, error: error.message };
  }
};

export const sendFinalInvoiceEmail = async (consultation) => {
  const transporter = createTransporter();
  
  if (!transporter) {
    console.log('Brevo SMTP credentials not configured. Email not sent.');
    return { success: false, error: 'Brevo SMTP not configured' };
  }

  try {
    const { finalInvoiceEmail } = await import('./email-templates');
    const emailTemplate = finalInvoiceEmail(consultation);
    
    const mailOptions = {
      from: process.env.BREVO_SMTP_USER,
      to: consultation.email,
      subject: emailTemplate.subject,
      text: emailTemplate.text,
      html: emailTemplate.html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Final invoice email sent to ${consultation.email}`);
    return { success: true };
  } catch (error) {
    console.error('Error sending final invoice email:', error);
    return { success: false, error: error.message };
  }
};