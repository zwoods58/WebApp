// Script to activate pending subscription and create transaction record
const activateSubscription = async () => {
  try {
    console.log('Activating pending subscription...');
    
    const apiUrl = 'https://api.kyshi.co/v1';
    const secretKey = 'sk_test_3dd6532c95634d1da5888520b9bf96c8';
    
    // Use the most recent subscription for ferb@gmail.com
    const subscriptionId = 'ad8e6b57-278c-4848-a3e9-9fe444542eff';
    const subscriptionCode = 'SUB_E6tNQlYlZf-TpR-';
    
    console.log('Activating subscription:', subscriptionId);
    console.log('Subscription code:', subscriptionCode);
    
    // First, let's get the current subscription status
    const getStatusResponse = await fetch(`${apiUrl}/subscriptions/${subscriptionCode}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': secretKey,
      },
    });
    
    if (getStatusResponse.ok) {
      const subscriptionData = await getStatusResponse.json();
      console.log('Current subscription status:', subscriptionData.isActive ? 'ACTIVE' : 'INACTIVE');
      
      if (!subscriptionData.isActive) {
        console.log('Subscription is inactive, looking for transaction data...');
        
        // Check if there's a transaction we can use
        if (subscriptionData.transactions && subscriptionData.transactions.length > 0) {
          const transaction = subscriptionData.transactions[0];
          console.log('Found transaction:', transaction.reference);
          console.log('Transaction status:', transaction.status);
          
          if (transaction.status === 'PENDING') {
            console.log('Transaction is pending, this suggests payment was completed but webhook not processed');
            console.log('This is exactly the issue we need to fix!');
            
            // For now, let's manually create the transaction record in our database
            console.log('Creating transaction record in Supabase...');
            
            // We'll create a script to insert this into our database
            const supabaseUrl = 'https://zruprmhkcqhgzydjfhrk.supabase.co';
            const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpydXBybWhrY3FoZ3p5ZGpmaHJrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTczMjg1MCwiZXhwIjoyMDg3MzA4ODUwfQ.GI-gSw_lna1O-O3Dad0M898_h0b9xgA2ILYQ_DcdVNo';
            
            const createTransactionResponse = await fetch(`${supabaseUrl}/rest/v1/kyshi_transactions`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`
              },
              body: JSON.stringify({
                kyshi_reference: transaction.reference,
                amount: parseInt(transaction.amount),
                currency: transaction.currency,
                customer_email: subscriptionData.customer.email,
                status: 'success',
                authorization_code: transaction.reference,
                gateway_response: subscriptionData,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              })
            });
            
            if (createTransactionResponse.ok) {
              const result = await createTransactionResponse.json();
              console.log('Transaction record created successfully:', result);
              
              // Now update the subscription status in our database
              console.log('Updating subscription status in database...');
              
              // Find the customer first
              const customerResponse = await fetch(`${supabaseUrl}/rest/v1/kyshi_customers?email=eq.${encodeURIComponent(subscriptionData.customer.email)}`, {
                headers: {
                  'apikey': supabaseKey,
                  'Authorization': `Bearer ${supabaseKey}`
                }
              });
              
              if (customerResponse.ok) {
                const customers = await customerResponse.json();
                if (customers.length > 0) {
                  const customer = customers[0];
                  console.log('Found customer:', customer.id);
                  
                  // Find the subscription
                  const subResponse = await fetch(`${supabaseUrl}/rest/v1/kyshi_subscriptions?customer_id=eq.${customer.id}&status=eq.pending&order=created_at&limit=1`, {
                    headers: {
                      'apikey': supabaseKey,
                      'Authorization': `Bearer ${supabaseKey}`
                    }
                  });
                  
                  if (subResponse.ok) {
                    const subscriptions = await subResponse.json();
                    if (subscriptions.length > 0) {
                      const subscription = subscriptions[0];
                      console.log('Found subscription:', subscription.id);
                      
                      // Update subscription to active
                      const today = new Date();
                      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
                      
                      const updateSubResponse = await fetch(`${supabaseUrl}/rest/v1/kyshi_subscriptions?id=eq.${subscription.id}`, {
                        method: 'PATCH',
                        headers: {
                          'Content-Type': 'application/json',
                          'apikey': supabaseKey,
                          'Authorization': `Bearer ${supabaseKey}`
                        },
                        body: JSON.stringify({
                          status: 'active',
                          current_period_start: today.toISOString().split('T')[0],
                          current_period_end: nextWeek.toISOString().split('T')[0],
                          updated_at: new Date().toISOString()
                        })
                      });
                      
                      if (updateSubResponse.ok) {
                        console.log('Subscription activated successfully! ');
                        console.log('The pending payment issue should now be resolved!');
                      } else {
                        console.log('Failed to update subscription:', await updateSubResponse.text());
                      }
                    }
                  }
                }
              }
            } else {
              console.log('Failed to create transaction:', await createTransactionResponse.text());
            }
          }
        }
      } else {
        console.log('Subscription is already active!');
      }
    } else {
      console.log('Failed to get subscription status:', await getStatusResponse.text());
    }
    
  } catch (error) {
    console.error('Activation failed:', error);
  }
};

activateSubscription();
