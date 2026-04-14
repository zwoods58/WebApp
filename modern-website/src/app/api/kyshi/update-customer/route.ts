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
    console.log('=== KYSHI UPDATE CUSTOMER START ===');
    
    const body = await request.json();
    const { 
      customerId, 
      email, 
      businessData,
      industry,
      businessType,
      additionalMetadata 
    } = body;

    console.log('Update customer request:', {
      customerId,
      email,
      industry,
      businessType
    });

    // Find customer in our database
    let customer;
    if (customerId) {
      const { data: customerData, error: customerError } = await supabase
        .from('kyshi_customers')
        .select('*')
        .eq('id', customerId)
        .single();

      if (customerError || !customerData) {
        console.error('Customer not found by ID:', customerError);
        return NextResponse.json({
          success: false,
          message: 'Customer not found'
        }, { status: 404 });
      }
      customer = customerData;
    } else if (email) {
      const { data: customerData, error: customerError } = await supabase
        .from('kyshi_customers')
        .select('*')
        .eq('email', email)
        .single();

      if (customerError || !customerData) {
        console.error('Customer not found by email:', customerError);
        return NextResponse.json({
          success: false,
          message: 'Customer not found'
        }, { status: 404 });
      }
      customer = customerData;
    } else {
      return NextResponse.json({
        success: false,
        message: 'Either customerId or email is required'
      }, { status: 400 });
    }

    console.log('Found customer:', customer.email);

    // Prepare customer data for Kyshi
    const kyshiCustomerData = {
      email: customer.email,
      firstName: customer.first_name,
      lastName: customer.last_name,
      phoneNumber: customer.phone,
      currencyCode: getCurrencyFromCountry(customer.country_code),
      country: customer.country_code,
      metadata: {
        country: customer.country_code,
        business_type: businessType || 'small_business',
        industry: industry || 'general',
        source: 'beezee_platform',
        registered_at: customer.created_at,
        updated_at: new Date().toISOString(),
        ...businessData,
        ...additionalMetadata
      }
    };

    console.log('Sending customer data to Kyshi:', {
      email: customer.email,
      kyshiCustomerId: customer.kyshi_customer_id,
      hasKyshiId: !!customer.kyshi_customer_id
    });

    // Update customer in Kyshi
    let kyshiResponse;
    if (customer.kyshi_customer_id) {
      // Update existing customer
      try {
        kyshiResponse = await kyshiApi().createCustomer(kyshiCustomerData);
        console.log('Customer updated in Kyshi:', kyshiResponse.id);
      } catch (updateError) {
        console.error('Error updating customer in Kyshi:', updateError);
        // Try to create new customer if update fails
        kyshiResponse = await kyshiApi().createCustomer(kyshiCustomerData);
        console.log('Created new customer in Kyshi:', kyshiResponse.id);
      }
    } else {
      // Create new customer
      kyshiResponse = await kyshiApi().createCustomer(kyshiCustomerData);
      console.log('Created new customer in Kyshi:', kyshiResponse.id);
      
      // Update our database with the new Kyshi customer ID
      const { error: updateError } = await supabase
        .from('kyshi_customers')
        .update({
          kyshi_customer_id: kyshiResponse.id,
          updated_at: new Date().toISOString()
        })
        .eq('id', customer.id);

      if (updateError) {
        console.error('Error updating customer with Kyshi ID:', updateError);
      } else {
        console.log('Updated local customer with Kyshi ID');
      }
    }

    console.log('=== KYSHI UPDATE CUSTOMER COMPLETE ===');
    
    return NextResponse.json({
      success: true,
      message: 'Customer updated successfully in Kyshi',
      customer: {
        id: customer.id,
        email: customer.email,
        kyshiCustomerId: kyshiResponse.id
      },
      kyshiResponse
    });

  } catch (error) {
    console.error('=== KYSHI UPDATE CUSTOMER ERROR ===', error);
    return NextResponse.json({
      success: false,
      message: 'Customer update failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Handle GET requests for testing
export async function GET() {
  return NextResponse.json({ 
    status: 'Kyshi update customer endpoint active',
    timestamp: new Date().toISOString()
  });
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
