// Email service using SendGrid
const sgMail = require('@sendgrid/mail');

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export const sendDepositInvoiceEmail = async (consultation) => {
  if (!process.env.SENDGRID_API_KEY) {
    console.log('SendGrid API key not configured. Email not sent.');
    return { success: false, error: 'SendGrid not configured' };
  }

  try {
    const { depositInvoiceEmail } = await import('./email-templates');
    const emailTemplate = depositInvoiceEmail(consultation);
    
    const msg = {
      to: consultation.email,
      from: {
        email: 'noreply@atarwebb.com',
        name: 'AtarWebb'
      },
      replyTo: 'admin@atarwebb.com',
      subject: emailTemplate.subject,
      text: emailTemplate.text,
      html: emailTemplate.html,
    };

    await sgMail.send(msg);
    console.log(`Deposit invoice email sent to ${consultation.email}`);
    return { success: true };
  } catch (error) {
    console.error('Error sending deposit invoice email:', error);
    return { success: false, error: error.message };
  }
};

export const sendFinalInvoiceEmail = async (consultation) => {
  if (!process.env.SENDGRID_API_KEY) {
    console.log('SendGrid API key not configured. Email not sent.');
    return { success: false, error: 'SendGrid not configured' };
  }

  try {
    const { finalInvoiceEmail } = await import('./email-templates');
    const emailTemplate = finalInvoiceEmail(consultation);
    
    const msg = {
      to: consultation.email,
      from: {
        email: 'noreply@atarwebb.com',
        name: 'AtarWebb'
      },
      replyTo: 'admin@atarwebb.com',
      subject: emailTemplate.subject,
      text: emailTemplate.text,
      html: emailTemplate.html,
    };

    await sgMail.send(msg);
    console.log(`Final invoice email sent to ${consultation.email}`);
    return { success: true };
  } catch (error) {
    console.error('Error sending final invoice email:', error);
    return { success: false, error: error.message };
  }
};
