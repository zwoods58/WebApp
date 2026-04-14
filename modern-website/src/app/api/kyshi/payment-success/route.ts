import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { kyshiApi } from '@/lib/kyshi';

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Initialize Supabase client with service role key
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export async function POST(request: NextRequest) {
  try {
    console.log('=== KYSHI PAYMENT SUCCESS CALLBACK START ===');
    
    const body = await request.json();
    const { 
      reference, 
      status, 
      customer_id: kyshiCustomerId, 
      subscription_id: kyshiSubscriptionId,
      customer: kyshiCustomerData 
    } = body;

    console.log('Payment success callback received:', {
      reference,
      status,
      kyshiCustomerId,
      kyshiSubscriptionId
    });

    if (!reference) {
      console.error('Missing reference in payment success callback');
      return NextResponse.json({
        success: false,
        message: 'Missing reference'
      }, { status: 400 });
    }

    // Find the transaction in our database
    const { data: transaction, error: transactionError } = await supabase
      .from('kyshi_transactions')
      .select(`
        *,
        kyshi_subscriptions!kyshi_transactions_subscription_id_fkey (
          id,
          customer_id,
          kyshi_customers!kyshi_subscriptions_customer_id_fkey (
            id,
            email,
            first_name,
            last_name,
            phone,
            country_code
          )
        )
      `)
      .eq('kyshi_reference', reference)
      .single();

    if (transactionError || !transaction) {
      console.error('Transaction not found:', transactionError);
      return NextResponse.json({
        success: false,
        message: 'Transaction not found'
      }, { status: 404 });
    }

    console.log('Found transaction:', transaction.id);

    // Update transaction status
    const { error: updateError } = await supabase
      .from('kyshi_transactions')
      .update({
        status: status === 'success' ? 'success' : 'failed',
        updated_at: new Date().toISOString()
      })
      .eq('id', transaction.id);

    if (updateError) {
      console.error('Error updating transaction:', updateError);
    }

    // Update customer record with Kyshi customer ID if provided
    if (kyshiCustomerId && transaction.kyshi_subscriptions?.kyshi_customers) {
      const customer = transaction.kyshi_subscriptions.kyshi_customers;
      
      console.log('Updating customer with Kyshi ID:', kyshiCustomerId);
      
      const { error: customerUpdateError } = await supabase
        .from('kyshi_customers')
        .update({
          kyshi_customer_id: kyshiCustomerId,
          updated_at: new Date().toISOString()
        })
        .eq('id', customer.id);

      if (customerUpdateError) {
        console.error('Error updating customer:', customerUpdateError);
      } else {
        console.log('Customer updated successfully with Kyshi ID');
      }

      // Send additional business data to Kyshi
      if (kyshiCustomerData) {
        try {
          await sendBusinessDataToKyshi(customer, kyshiCustomerId);
        } catch (businessDataError) {
          console.error('Error sending business data to Kyshi:', businessDataError);
        }
      }
    }

    // Update subscription status if we have the subscription
    if (transaction.kyshi_subscriptions && kyshiSubscriptionId) {
      const { error: subUpdateError } = await supabase
        .from('kyshi_subscriptions')
        .update({
          kyshi_subscription_id: kyshiSubscriptionId,
          status: status === 'success' ? 'active' : 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('id', transaction.kyshi_subscriptions.id);

      if (subUpdateError) {
        console.error('Error updating subscription:', subUpdateError);
      } else {
        console.log('Subscription updated successfully');
      }
    }

    console.log('=== KYSHI PAYMENT SUCCESS CALLBACK COMPLETE ===');
    
    return NextResponse.json({
      success: true,
      message: 'Payment success processed successfully',
      transaction: {
        id: transaction.id,
        reference: transaction.kyshi_reference,
        status: status
      }
    });

  } catch (error) {
    console.error('=== KYSHI PAYMENT SUCCESS CALLBACK ERROR ===', error);
    return NextResponse.json({
      success: false,
      message: 'Payment success processing failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Handle GET requests for testing
export async function GET() {
  return NextResponse.json({ 
    status: 'Kyshi payment success callback endpoint active',
    timestamp: new Date().toISOString()
  });
}

async function sendBusinessDataToKyshi(customer: any, kyshiCustomerId: string) {
  console.log('Sending business data to Kyshi for customer:', customer.email);
  
  try {
    // Prepare customer data with business information
    const customerData = {
      email: customer.email,
      firstName: customer.first_name,
      lastName: customer.last_name,
      phoneNumber: customer.phone,
      currencyCode: getCurrencyFromCountry(customer.country_code),
      country: customer.country_code,
      metadata: {
        country: customer.country_code,
        business_type: 'small_business', // Default, can be enhanced
        source: 'beezee_platform',
        registered_at: customer.created_at
      }
    };

    // Update customer in Kyshi with additional business data
    const updatedCustomer = await kyshiApi().createCustomer(customerData);
    
    console.log('Business data sent to Kyshi successfully:', {
      kyshiCustomerId,
      customerEmail: customer.email,
      updatedCustomer: updatedCustomer.id
    });

    return updatedCustomer;
    
  } catch (error) {
    console.error('Failed to send business data to Kyshi:', error);
    throw error;
  }
}

function getCurrencyFromCountry(countryCode: string): string {
  const currencyMap = {
    'KE': 'KES',
    'GH': 'GHS',
    'NG': 'NGN',
    'CI': 'XOF'
  };
  return currencyMap[countryCode as keyof typeof currencyMap] || 'USD';
}
