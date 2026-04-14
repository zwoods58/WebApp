// Test webhook endpoint through ngrok and simulate webhook payload
const testWebhookSimulation = async () => {
  try {
    console.log('=== WEBHOOK ACCESSIBILITY TEST ===');
    
    // Test 1: Check if webhook endpoint is accessible through ngrok
    const ngrokUrl = 'https://jonathon-precognizable-contestably.ngrok-free.dev';
    const webhookUrl = `${ngrokUrl}/api/webhooks/kyshi/`;
    
    console.log('Testing webhook URL:', webhookUrl);
    
    try {
      const response = await fetch(webhookUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      console.log('Webhook endpoint response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Webhook endpoint response:', data);
        console.log('Webhook endpoint is ACCESSIBLE through ngrok! ');
      } else {
        console.log('Webhook endpoint NOT accessible through ngrok');
        const text = await response.text();
        console.log('Response body:', text.substring(0, 200));
      }
    } catch (error) {
      console.error('Error accessing webhook through ngrok:', error.message);
    }
    
    // Test 2: Simulate a webhook payload
    console.log('\n=== WEBHOOK SIMULATION TEST ===');
    
    const webhookPayload = {
      event: 'successful',
      data: {
        reference: 'TEST-WEBHOOK-' + Date.now(),
        amount: 2000,
        currency: 'GHS',
        customer: {
          email: 'test.webhook@example.com',
          firstName: 'Test',
          lastName: 'Webhook'
        },
        meta: {
          localCurrency: 'GHS',
          localAmount: 2000,
          feeBreakdown: {
            fee: 71,
            vat: 300,
            totalFees: 371
          }
        },
        authorizationCode: 'AUTH_TEST_123',
        createdAt: new Date().toISOString()
      }
    };
    
    // Generate webhook signature
    const crypto = require('crypto');
    const webhookSecret = 'c4accdbb6b2f49608ef729cd9afed411';
    const payloadString = JSON.stringify(webhookPayload);
    const signature = crypto
      .createHmac('sha256', webhookSecret)
      .update(payloadString)
      .digest('hex');
    
    console.log('Sending test webhook payload...');
    console.log('Reference:', webhookPayload.data.reference);
    
    try {
      const webhookResponse = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-kyshi-signature': `sha256=${signature}`
        },
        body: payloadString
      });
      
      console.log('Webhook POST response status:', webhookResponse.status);
      
      if (webhookResponse.ok) {
        const result = await webhookResponse.json();
        console.log('Webhook processed successfully:', result);
        
        // Check if transaction was created
        console.log('\n=== CHECKING DATABASE UPDATES ===');
        await checkDatabaseUpdates(webhookPayload.data.reference);
        
      } else {
        const errorText = await webhookResponse.text();
        console.log('Webhook failed:', errorText);
      }
    } catch (webhookError) {
      console.error('Error sending webhook:', webhookError.message);
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
};

// Helper function to check if webhook created database records
async function checkDatabaseUpdates(reference) {
  try {
    const supabaseUrl = 'https://zruprmhkcqhgzydjfhrk.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpydXBybWhrY3FoZ3p5ZGpmaHJrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTczMjg1MCwiZXhwIjoyMDg3MzA4ODUwfQ.GI-gSw_lna1O-O3Dad0M898_h0b9xgA2ILYQ_DcdVNo';
    
    // Check transaction table
    const transactionResponse = await fetch(`${supabaseUrl}/rest/v1/kyshi_transactions?kyshi_reference=eq.${reference}`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });
    
    if (transactionResponse.ok) {
      const transactions = await transactionResponse.json();
      console.log('Transactions created:', transactions.length);
      if (transactions.length > 0) {
        console.log('Transaction details:', {
          id: transactions[0].id,
          status: transactions[0].status,
          amount: transactions[0].amount,
          customer_email: transactions[0].customer_email
        });
      }
    }
    
    // Check webhook logs
    const logResponse = await fetch(`${supabaseUrl}/rest/v1/kyshi_webhook_logs?reference=eq.${reference}&order=created_at&limit=1`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });
    
    if (logResponse.ok) {
      const logs = await logResponse.json();
      console.log('Webhook logs created:', logs.length);
      if (logs.length > 0) {
        console.log('Log details:', {
          event_type: logs[0].event_type,
          processed: logs[0].processed,
          error_message: logs[0].error_message
        });
      }
    }
    
  } catch (dbError) {
    console.error('Error checking database:', dbError.message);
  }
}

testWebhookSimulation();
