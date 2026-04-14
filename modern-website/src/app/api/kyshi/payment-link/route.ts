import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

// For Kenya (KES), Ghana (GHS), Côte d'Ivoire (XOF)
const CURRENCY_MAP = {
  KE: 'KES',
  GH: 'GHS', 
  CI: 'XOF'  // West African CFA franc
} as const;

export async function POST(request: Request) {
  try {
    console.log('=== PAYMENT LINK INITIATION START ===');
    
    const { 
      paymentLinkCode,  // The :code from your Kyshi payment link
      customerEmail,
      customerFirstName,
      customerLastName,
      countryCode,
      redirectUrl  // Where to send user after payment
    } = await request.json();

    console.log('Payment link request:', {
      paymentLinkCode,
      customerEmail,
      customerFirstName,
      customerLastName,
      countryCode,
      redirectUrl
    });

    const localCurrency = CURRENCY_MAP[countryCode as keyof typeof CURRENCY_MAP];
    
    if (!localCurrency) {
      console.error('Invalid country code:', countryCode);
      return NextResponse.json({ error: 'Invalid country' }, { status: 400 });
    }

    // Step 1: Initialize checkout with Kyshi (no auth required)
    const kyshiResponse = await fetch(
      `https://api.kyshi.co/v1/pay/general/verify/${paymentLinkCode}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customer: {
            email: customerEmail,
            firstName: customerFirstName,
            lastName: customerLastName
          },
          localCurrency: localCurrency,
          redirectUrl: redirectUrl || `https://jonathon-precognizable-contestably.ngrok-free.dev/payment/return`  // Critical: Paystack will redirect here after payment
        })
      }
    );

    console.log('Kyshi API response status:', kyshiResponse.status);
    
    const data = await kyshiResponse.json();
    console.log('Kyshi API response:', data);

    if (!data.status) {
      console.error('Kyshi API error:', data.message);
      return NextResponse.json({ error: data.message }, { status: 400 });
    }

    // Step 2: Store transaction in database
    try {
      const { data: transaction, error } = await supabaseAdmin
        .from('payment_link_transactions')
        .insert({
          reference: data.data.reference,
          payment_link_code: paymentLinkCode,
          customer_email: customerEmail,
          customer_name: `${customerFirstName} ${customerLastName}`.trim(),
          local_currency: localCurrency,
          status: 'PENDING',
          amount: data.data.amount.value,
          fx_rate: data.data.fxRate,
          authorization_url: data.data.authorizationUrl,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Database error creating transaction:', error);
      } else {
        console.log('Transaction created:', transaction.id);
      }
    } catch (dbError) {
      console.error('Database error creating transaction:', dbError);
      // Continue even if DB fails - payment can still work
    }

    // Step 3: Return the authorization URL for the frontend
    const response = {
      authorizationUrl: data.data.authorizationUrl,
      reference: data.data.reference,
      status: 'PENDING',
      amount: data.data.amount.value,
      currency: localCurrency
    };

    console.log('Payment link initiated successfully:', response);
    
    return NextResponse.json(response);

  } catch (error) {
    console.error('=== PAYMENT LINK ERROR ===', error);
    return NextResponse.json({ 
      error: 'Payment initialization failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// GET method for testing
export async function GET() {
  return NextResponse.json({ 
    status: 'Payment link API active',
    timestamp: new Date().toISOString()
  });
}
