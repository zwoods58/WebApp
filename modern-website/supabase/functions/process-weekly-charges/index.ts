/// <reference path="./deno-types.d.ts" />
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Country configuration types
type MobileMoneyConfig = {
  currency: string;
  amount: number;
  method: string;
  channels: string[];
};

type BankTransferConfig = {
  currency: string;
  amount: number;
  method: string;
  chargeType: string;
};

type CountryConfig = MobileMoneyConfig | BankTransferConfig;

// Country configuration
const COUNTRY_CONFIG: Record<string, CountryConfig> = {
  KE: { currency: 'KES', amount: 200, method: 'initialize', channels: ['mobileMoney'] },
  GH: { currency: 'GHS', amount: 20, method: 'initialize', channels: ['mobileMoney'] },
  CI: { currency: 'XOF', amount: 1000, method: 'initialize', channels: ['mobileMoney'] },
  NG: { currency: 'NGN', amount: 500, method: 'charge', chargeType: 'BANK_TRANSFER' }
};

// Helper function to send emails via Resend
async function sendEmail(
  to: string,
  subject: string,
  html: string,
  resendApiKey: string,
  fromEmail: string
): Promise<boolean> {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [to],
        subject,
        html
      })
    });

    return response.ok;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}

// Helper function to call Kyshi API
async function callKyshi(
  country: string,
  userEmail: string,
  reference: string,
  kyshiSecretKey: string,
  appUrl: string
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const config = COUNTRY_CONFIG[country as keyof typeof COUNTRY_CONFIG];
    if (!config) {
      return { success: false, error: 'Unsupported country' };
    }

    if (country === 'NG') {
      // Nigeria: Bank Transfer
      const bankTransferBody = {
        email: userEmail,
        amount: config.amount,
        localCurrency: config.currency,
        reference: reference,
        chargeType: 'chargeType' in config ? config.chargeType : 'BANK_TRANSFER',
        expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString()
      };

      const response = await fetch(`https://api.kyshi.co/v1/transactions/charge`, {
        method: 'POST',
        headers: {
          'x-api-key': kyshiSecretKey || '',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bankTransferBody)
      });

      const data = await response.json();
      if (!response.ok) {
        return { success: false, error: data.message || 'Failed to initialize bank transfer' };
      }

      return { success: true, data };
    } else {
      // Kenya, Ghana, Côte d'Ivoire: Mobile Money
      const mobileMoneyBody = {
        email: userEmail,
        amount: config.amount,
        localCurrency: config.currency,
        reference: reference,
        channels: 'channels' in config ? config.channels : [],
        redirectUrl: `${appUrl}/subscription/callback?reference=${reference}`
      };

      const response = await fetch(`https://api.kyshi.co/v1/transactions/initialize`, {
        method: 'POST',
        headers: {
          'x-api-key': kyshiSecretKey || '',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(mobileMoneyBody)
      });

      const data = await response.json();
      if (!response.ok) {
        return { success: false, error: data.message || 'Failed to initialize mobile money transaction' };
      }

      return { success: true, data };
    }
  } catch (error) {
    console.error('Kyshi API error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Only accept POST requests
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Security: Check Authorization header
  const authHeader = req.headers.get('authorization');
  const cronSecret = Deno.env.get('CRON_SECRET');
  
  if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.slice(7) !== cronSecret) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Environment variables
  const KYSHI_SECRET_KEY = Deno.env.get('KYSHI_SECRET_KEY');
  const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
  const RESEND_FROM_EMAIL = Deno.env.get('RESEND_FROM_EMAIL');
  const NEXT_PUBLIC_APP_URL = Deno.env.get('NEXT_PUBLIC_APP_URL');
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!KYSHI_SECRET_KEY || !RESEND_API_KEY || !RESEND_FROM_EMAIL || !NEXT_PUBLIC_APP_URL || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Missing required environment variables');
    return new Response(
      JSON.stringify({ error: 'Server configuration error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  let cancelledCount = 0;
  let remindedCount = 0;
  let renewedCount = 0;
  let errorCount = 0;

  try {
    console.log('🔄 Starting weekly charges process...');

    // STEP A — CANCEL overdue
    console.log('📋 STEP A: Cancelling overdue subscriptions...');
    const { data: overdueSubs, error: overdueError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('status', 'past_due')
      .gte('grace_period_day', 3);

    if (overdueError) {
      console.error('Error fetching overdue subscriptions:', overdueError);
      errorCount++;
    } else if (overdueSubs) {
      for (const sub of overdueSubs) {
        try {
          // Update subscription
          const { error: updateError } = await supabase
            .from('subscriptions')
            .update({
              status: 'cancelled',
              is_active: false,
              cancelled_at: new Date().toISOString()
            })
            .eq('id', sub.id);

          if (updateError) {
            console.error(`Failed to cancel subscription ${sub.id}:`, updateError);
            errorCount++;
            continue;
          }

          // Send cancellation email
          const cancellationHtml = `
            <h2>Your subscription has been cancelled</h2>
            <p>Hi ${sub.user_name},</p>
            <p>Your subscription has been cancelled due to non-payment after grace period.</p>
            <p>Your access to service has been revoked.</p>
            <p>To resubscribe and regain access, please visit our website and start a new subscription.</p>
            <p>Thank you for your understanding.</p>
          `;

          const emailSent = await sendEmail(
            sub.user_email,
            'Your subscription has been cancelled',
            cancellationHtml,
            RESEND_API_KEY,
            RESEND_FROM_EMAIL
          );

          if (emailSent) {
            console.log(`✅ Cancelled subscription ${sub.id} and sent email`);
            cancelledCount++;
          } else {
            console.error(`❌ Cancelled subscription ${sub.id} but failed to send email`);
            errorCount++;
          }
        } catch (error) {
          console.error(`Error processing subscription ${sub.id}:`, error);
          errorCount++;
        }
      }
    }

    // STEP B — RETRY grace period
    console.log('📋 STEP B: Processing grace period retries...');
    const { data: graceSubs, error: graceError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('status', 'past_due')
      .lt('grace_period_day', 3);

    if (graceError) {
      console.error('Error fetching grace period subscriptions:', graceError);
      errorCount++;
    } else if (graceSubs) {
      for (const sub of graceSubs) {
        try {
          const newReference = `RETRY-${sub.country}-${sub.user_id.slice(-8)}-${Date.now()}`;
          
          // Call Kyshi API
          const kyshiResult = await callKyshi(
            sub.country,
            sub.user_email,
            newReference,
            KYSHI_SECRET_KEY,
            NEXT_PUBLIC_APP_URL
          );

          if (!kyshiResult.success) {
            console.error(`Failed to call Kyshi for subscription ${sub.id}:`, kyshiResult.error);
            errorCount++;
            continue;
          }

          // Update subscription
          const updateData: any = {
            kyshi_reference: newReference,
            grace_period_day: sub.grace_period_day + 1
          };

          if (sub.country === 'NG') {
            // Nigeria: Update bank account details
            updateData.bank_account_number = kyshiResult.data?.accountNumber || '';
            updateData.bank_account_name = kyshiResult.data?.accountName || '';
            updateData.bank_name = kyshiResult.data?.bankName || '';
            updateData.bank_account_expires_at = new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString();
          } else {
            // Kenya, Ghana, Côte d'Ivoire: Update checkout URL
            updateData.kyshi_checkout_url = kyshiResult.data?.authorizationUrl || kyshiResult.data?.checkoutUrl;
          }

          const { error: updateError } = await supabase
            .from('subscriptions')
            .update(updateData)
            .eq('id', sub.id);

          if (updateError) {
            console.error(`Failed to update subscription ${sub.id}:`, updateError);
            errorCount++;
            continue;
          }

          // Send reminder email
          let subject = '';
          let html = '';

          switch (sub.grace_period_day) {
            case 0:
              subject = 'Reminder: your payment is due';
              html = `
                <h2>Payment Reminder</h2>
                <p>Hi ${sub.user_name},</p>
                <p>This is a reminder that your subscription payment is due.</p>
                ${sub.country === 'NG' ? `
                  <p>Please make payment using the following bank details:</p>
                  <table>
                    <tr><td><strong>Bank:</strong></td><td>${kyshiResult.data?.bankName}</td></tr>
                    <tr><td><strong>Account Name:</strong></td><td>${kyshiResult.data?.accountName}</td></tr>
                    <tr><td><strong>Account Number:</strong></td><td>${kyshiResult.data?.accountNumber}</td></tr>
                    <tr><td><strong>Amount:</strong></td><td>${COUNTRY_CONFIG[sub.country as keyof typeof COUNTRY_CONFIG]?.amount} ${COUNTRY_CONFIG[sub.country as keyof typeof COUNTRY_CONFIG]?.currency}</td></tr>
                  </table>
                ` : `
                  <p>Please complete your payment by clicking the button below:</p>
                  <a href="${kyshiResult.data?.authorizationUrl || kyshiResult.data?.checkoutUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius:4px; display: inline-block;">Pay Now</a>
                `}
                <p>Thank you for your continued support!</p>
              `;
              break;
            case 1:
              subject = 'Urgent: complete payment to keep access';
              html = `
                <h2>Urgent Payment Required</h2>
                <p>Hi ${sub.user_name},</p>
                <p>Your subscription payment is now overdue. Please complete payment immediately to keep your access.</p>
                ${sub.country === 'NG' ? `
                  <p>Please make payment using the following bank details:</p>
                  <table>
                    <tr><td><strong>Bank:</strong></td><td>${kyshiResult.data?.bankName}</td></tr>
                    <tr><td><strong>Account Name:</strong></td><td>${kyshiResult.data?.accountName}</td></tr>
                    <tr><td><strong>Account Number:</strong></td><td>${kyshiResult.data?.accountNumber}</td></tr>
                    <tr><td><strong>Amount:</strong></td><td>${COUNTRY_CONFIG[sub.country as keyof typeof COUNTRY_CONFIG]?.amount} ${COUNTRY_CONFIG[sub.country as keyof typeof COUNTRY_CONFIG]?.currency}</td></tr>
                  </table>
                ` : `
                  <p>Please complete your payment by clicking the button below:</p>
                  <a href="${kyshiResult.data?.authorizationUrl || kyshiResult.data?.checkoutUrl}" style="background-color: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius:4px; display: inline-block;">Pay Now</a>
                `}
                <p>Your access will be cancelled if payment is not received.</p>
              `;
              break;
            case 2:
              subject = 'Final warning: pay today or lose access';
              html = `
                <h2>Final Warning - Access Will Be Cancelled</h2>
                <p>Hi ${sub.user_name},</p>
                <p>This is your final warning. Your subscription payment is severely overdue and your access will be cancelled today if payment is not received.</p>
                ${sub.country === 'NG' ? `
                  <p>Please make payment immediately using the following bank details:</p>
                  <table>
                    <tr><td><strong>Bank:</strong></td><td>${kyshiResult.data?.bankName}</td></tr>
                    <tr><td><strong>Account Name:</strong></td><td>${kyshiResult.data?.accountName}</td></tr>
                    <tr><td><strong>Account Number:</strong></td><td>${kyshiResult.data?.accountNumber}</td></tr>
                    <tr><td><strong>Amount:</strong></td><td>${COUNTRY_CONFIG[sub.country as keyof typeof COUNTRY_CONFIG]?.amount} ${COUNTRY_CONFIG[sub.country as keyof typeof COUNTRY_CONFIG]?.currency}</td></tr>
                  </table>
                ` : `
                  <p>Please complete your payment immediately by clicking the button below:</p>
                  <a href="${kyshiResult.data?.authorizationUrl || kyshiResult.data?.checkoutUrl}" style="background-color: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius:4px; display: inline-block;">Pay Now or Lose Access</a>
                `}
                <p>This is your last chance to maintain your subscription.</p>
              `;
              break;
          }

          const emailSent = await sendEmail(
            sub.user_email,
            subject,
            html,
            RESEND_API_KEY,
            RESEND_FROM_EMAIL
          );

          if (emailSent) {
            console.log(`✅ Processed grace period for subscription ${sub.id} and sent reminder`);
            remindedCount++;
          } else {
            console.error(`❌ Processed grace period for subscription ${sub.id} but failed to send email`);
            errorCount++;
          }
        } catch (error) {
          console.error(`Error processing grace period for subscription ${sub.id}:`, error);
          errorCount++;
        }
      }
    }

    // STEP C — NEW CHARGES due today
    console.log('📋 STEP C: Processing new charges...');
    const { data: dueSubs, error: dueError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('status', 'active')
      .eq('is_active', true)
      .lte('next_charge_date', new Date().toISOString());

    if (dueError) {
      console.error('Error fetching due subscriptions:', dueError);
      errorCount++;
    } else if (dueSubs) {
      for (const sub of dueSubs) {
        try {
          const newReference = `RENEW-${sub.country}-${sub.user_id.slice(-8)}-${Date.now()}`;
          
          // Call Kyshi API
          const kyshiResult = await callKyshi(
            sub.country,
            sub.user_email,
            newReference,
            KYSHI_SECRET_KEY,
            NEXT_PUBLIC_APP_URL
          );

          if (!kyshiResult.success) {
            console.error(`Failed to call Kyshi for subscription ${sub.id}:`, kyshiResult.error);
            errorCount++;
            continue;
          }

          // Update subscription
          const updateData: any = {
            status: 'past_due',
            grace_period_day: 0,
            kyshi_reference: newReference
          };

          if (sub.country === 'NG') {
            // Nigeria: Update bank account details
            updateData.bank_account_number = kyshiResult.data?.accountNumber || '';
            updateData.bank_account_name = kyshiResult.data?.accountName || '';
            updateData.bank_name = kyshiResult.data?.bankName || '';
            updateData.bank_account_expires_at = new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString();
          } else {
            // Kenya, Ghana, Côte d'Ivoire: Update checkout URL
            updateData.kyshi_checkout_url = kyshiResult.data?.authorizationUrl || kyshiResult.data?.checkoutUrl;
          }

          const { error: updateError } = await supabase
            .from('subscriptions')
            .update(updateData)
            .eq('id', sub.id);

          if (updateError) {
            console.error(`Failed to update subscription ${sub.id}:`, updateError);
            errorCount++;
            continue;
          }

          // Send renewal email
          const renewalHtml = `
            <h2>Subscription Renewal</h2>
            <p>Hi ${sub.user_name},</p>
            <p>Your subscription is due for renewal. Please complete your payment to continue enjoying our service.</p>
            ${sub.country === 'NG' ? `
              <p>Please make payment using the following bank details:</p>
              <table>
                <tr><td><strong>Bank:</strong></td><td>${kyshiResult.data?.bankName}</td></tr>
                <tr><td><strong>Account Name:</strong></td><td>${kyshiResult.data?.accountName}</td></tr>
                <tr><td><strong>Account Number:</strong></td><td>${kyshiResult.data?.accountNumber}</td></tr>
                <tr><td><strong>Amount:</strong></td><td>${COUNTRY_CONFIG[sub.country as keyof typeof COUNTRY_CONFIG]?.amount} ${COUNTRY_CONFIG[sub.country as keyof typeof COUNTRY_CONFIG]?.currency}</td></tr>
              </table>
            ` : `
              <p>Please complete your payment by clicking the button below:</p>
              <a href="${kyshiResult.data?.authorizationUrl || kyshiResult.data?.checkoutUrl}" style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius:4px; display: inline-block;">Renew Now</a>
            `}
            <p>Thank you for your continued support!</p>
          `;

          const emailSent = await sendEmail(
            sub.user_email,
            'Subscription Renewal',
            renewalHtml,
            RESEND_API_KEY,
            RESEND_FROM_EMAIL
          );

          if (emailSent) {
            console.log(`✅ Processed renewal for subscription ${sub.id} and sent email`);
            renewedCount++;
          } else {
            console.error(`❌ Processed renewal for subscription ${sub.id} but failed to send email`);
            errorCount++;
          }
        } catch (error) {
          console.error(`Error processing renewal for subscription ${sub.id}:`, error);
          errorCount++;
        }
      }
    }

    console.log(`✅ Weekly charges process completed: ${cancelledCount} cancelled, ${remindedCount} reminded, ${renewedCount} renewed, ${errorCount} errors`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        cancelled: cancelledCount, 
        reminded: remindedCount, 
        renewed: renewedCount, 
        errors: errorCount 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('❌ Weekly charges process error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Internal server error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
