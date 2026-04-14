import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { kyshiApi, KyshiSubscription } from '@/lib/kyshi';
import { 
  isMobileMoneyCountry, 
  getMobileMoneyProviders, 
  getDefaultProvider,
  getPaymentChannels 
} from '@/lib/mobile-money-config';

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Initialize Supabase client with service role key
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, firstName, lastName, phone, countryCode, planId, industry = 'retail', redirectUrl } = body;

    // Validate required fields
    if (!email || !firstName || !countryCode || !planId) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields: email, firstName, countryCode, planId'
      }, { status: 400 });
    }

    console.log(`Creating subscription for ${email} in ${countryCode}`);

    // Check if customer exists in our database (Kyshi will create customer automatically)
    let customer;
    const { data: existingCustomer, error: customerError } = await supabase
      .from('kyshi_customers')
      .select('*')
      .eq('email', email)
      .single();

    if (customerError && customerError.code !== 'PGRST116') {
      console.error('Error checking customer:', customerError);
      return NextResponse.json({
        success: false,
        message: 'Database error checking customer'
      }, { status: 500 });
    }

    if (existingCustomer) {
      customer = existingCustomer;
      console.log(`Found existing customer: ${customer.id}`);
    } else {
      // Store customer in database (Kyshi creates customer during subscription)
      console.log('Creating customer record in database...');
      const { data: newCustomer, error: insertError } = await supabase
        .from('kyshi_customers')
        .insert({
          email,
          first_name: firstName,
          last_name: lastName,
          phone,
          country_code: countryCode,
          kyshi_customer_id: null, // Will be updated via webhook
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error inserting customer:', insertError);
        return NextResponse.json({
          success: false,
          message: 'Database error creating customer'
        }, { status: 500 });
      }

      customer = newCustomer;
      console.log(`Created customer record: ${customer.id}`);
    }

    // Get the plan from database
    const { data: plan, error: planError } = await supabase
      .from('kyshi_plans')
      .select('*')
      .eq('id', planId)
      .eq('is_active', true)
      .single();

    if (planError || !plan) {
      console.error('Plan not found:', planError);
      return NextResponse.json({
        success: false,
        message: 'Plan not found or inactive'
      }, { status: 404 });
    }

    console.log(`Found plan: ${plan.name} (${plan.kyshi_plan_code})`);

    // Check if customer already has an active subscription for this plan
    const { data: existingSubscription, error: subCheckError } = await supabase
      .from('kyshi_subscriptions')
      .select('*')
      .eq('customer_id', customer.id)
      .eq('plan_id', planId)
      .eq('status', 'active')
      .single();

    if (subCheckError && subCheckError.code !== 'PGRST116') {
      console.error('Error checking existing subscription:', subCheckError);
      return NextResponse.json({
        success: false,
        message: 'Database error checking subscription'
      }, { status: 500 });
    }

    if (existingSubscription) {
      console.log('Customer already has active subscription for this plan');
      return NextResponse.json({
        success: false,
        message: 'Customer already has an active subscription for this plan',
        subscription: existingSubscription
      }, { status: 409 });
    }

    // Create subscription in Kyshi
    console.log('Creating subscription in Kyshi...');
    console.log('Plan details:', {
      name: plan.name,
      amount: plan.amount,
      currency: plan.currency,
      country_code: plan.country_code,
      kyshi_plan_code: plan.kyshi_plan_code
    });
    
    // Get mobile money configuration using centralized config
    const isMobileMoneySubscription = isMobileMoneyCountry(countryCode);
    const paymentChannels = getPaymentChannels(countryCode);
    const mobileMoneyProviders = getMobileMoneyProviders(countryCode);
    const defaultProvider = getDefaultProvider(countryCode);

    // Get the base URL - supports both ngrok and production
const getBaseUrl = () => {
  // Check for ngrok URL first (for local development)
  if (process.env.NGROK_URL) {
    console.log('Using ngrok URL:', process.env.NGROK_URL);
    return process.env.NGROK_URL;
  }
  // Fall back to production URL
  const productionUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com';
  console.log('Using production URL:', productionUrl);
  return productionUrl;
};

const baseUrl = getBaseUrl();

const kyshiSubscriptionData = {
      customer: email,
      planCode: plan.kyshi_plan_code,
      paymentMethod: isMobileMoneySubscription ? "mobile_money" : "card",
      country: countryCode, // Pass country to Kyshi
      callback_url: `${baseUrl}/api/kyshi/payment-success`,
      metadata: {
        country: countryCode,
        payment_channels: paymentChannels,
        mobile_money_providers: mobileMoneyProviders.map(p => p.code),
        currency: plan.currency,
        return_url: redirectUrl || `${baseUrl}/Beezee-App/app/${countryCode.toLowerCase()}/food/more/`,
        is_mobile_money_subscription: isMobileMoneySubscription,
        // Enhanced business data
        business_type: 'small_business',
        industry: industry || 'general',
        customer_name: `${firstName} ${lastName}`,
        customer_phone: phone,
        source: 'beezee_platform',
        plan_name: plan.name,
        plan_amount: plan.amount,
        created_at: new Date().toISOString()
      }
    };
    
    console.log('Kyshi subscription request:', kyshiSubscriptionData);

    const kyshiSubscription = await kyshiApi().createSubscription(kyshiSubscriptionData);
    
    console.log('Kyshi subscription response:', {
      id: kyshiSubscription.id,
      code: kyshiSubscription.code,
      authorizationUrl: kyshiSubscription.authorizationUrl,
      isActive: kyshiSubscription.isActive,
      plan: kyshiSubscription.plan
    });
    
    const kyshiSubscriptionId = kyshiSubscription.id;
    let authorizationUrl = kyshiSubscription.authorizationUrl;

    
    if (!kyshiSubscriptionId) {
      console.error('Failed to create subscription in Kyshi:', kyshiSubscription);
      return NextResponse.json({
        success: false,
        message: 'Failed to create subscription in Kyshi'
      }, { status: 500 });
    }

    // Calculate billing dates
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    // Store subscription in database
    const { data: subscription, error: subInsertError } = await supabase
      .from('kyshi_subscriptions')
      .insert({
        customer_id: customer.id,
        plan_id: planId,
        kyshi_subscription_id: kyshiSubscriptionId,
        email: email,
        country_code: countryCode,
        plan_code: plan.kyshi_plan_code,
        status: authorizationUrl ? 'pending' : 'active',
        current_period_start: today.toISOString().split('T')[0],
        current_period_end: nextWeek.toISOString().split('T')[0],
        payment_method: isMobileMoneySubscription ? 'mobile_money' : 'card',
        is_mobile_money_subscription: isMobileMoneySubscription,
        preferred_provider: isMobileMoneySubscription ? defaultProvider?.code : null,
      })
      .select(`
        *,
        kyshi_customers!kyshi_subscriptions_customer_id_fkey (
          email,
          first_name,
          last_name,
          country_code
        ),
        kyshi_plans!kyshi_subscriptions_plan_id_fkey (
          name,
          amount,
          currency,
          country_code
        )
      `)
      .single();

    if (subInsertError) {
      console.error('Error inserting subscription:', subInsertError);
      return NextResponse.json({
        success: false,
        message: 'Database error creating subscription'
      }, { status: 500 });
    }

    console.log(`Created subscription: ${subscription.id}`);

    // Send additional customer data to Kyshi after subscription creation
    try {
      console.log('Sending enhanced customer data to Kyshi...');
      
      const customerUpdateResponse = await fetch(`${baseUrl}/api/kyshi/update-customer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          businessData: {
            business_type: 'small_business',
            industry: industry || 'general',
            customer_name: `${firstName} ${lastName}`,
            customer_phone: phone,
            plan_name: plan.name,
            plan_amount: plan.amount,
            subscription_id: subscription.id,
            kyshi_subscription_id: kyshiSubscriptionId
          },
          industry: industry || 'general',
          businessType: 'small_business',
          additionalMetadata: {
            payment_channels: paymentChannels,
            mobile_money_providers: mobileMoneyProviders.map(p => p.code),
            is_mobile_money_subscription: isMobileMoneySubscription,
            source: 'beezee_platform_subscription_flow'
          }
        })
      });

      if (customerUpdateResponse.ok) {
        const customerUpdateResult = await customerUpdateResponse.json();
        console.log('Customer data sent to Kyshi successfully:', customerUpdateResult);
      } else {
        console.error('Failed to send customer data to Kyshi:', await customerUpdateResponse.text());
      }
    } catch (customerUpdateError) {
      console.error('Error sending customer data to Kyshi:', customerUpdateError);
      // Don't fail the subscription creation if customer update fails
    }

    const response: {
      success: boolean;
      message: string;
      subscription: any;
      kyshiSubscriptionId: any;
      authorizationUrl?: string;
    } = {
      success: true,
      message: 'Subscription created successfully',
      subscription,
      kyshiSubscriptionId,
    };

    // Include authorization URL if returned by Kyshi
    if (authorizationUrl) {
      response.authorizationUrl = authorizationUrl;
      console.log(`Authorization URL provided: ${authorizationUrl}`);
    } else {
      console.log('Subscription created without authorization URL (already active)');
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('Create subscription error:', error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to create subscription',
      error: error
    }, { status: 500 });
  }
}
