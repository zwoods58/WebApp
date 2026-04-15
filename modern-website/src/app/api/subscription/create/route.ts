import { NextResponse } from 'next/server';
import { SubscriptionAPI } from '@/lib/subscription-api';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { user_id, user_email, user_phone, country, full_name } = body;

    if (!user_email || !country) {
      return NextResponse.json(
        { error: 'Missing required fields: user_email, country' },
        { status: 400 }
      );
    }

    // Create subscription request
    const subscriptionRequest = {
      email: user_email,
      firstName: full_name?.split(' ')[0] || 'User',
      lastName: full_name?.split(' ').slice(1).join(' ') || '',
      phone: user_phone,
      countryCode: country,
      paymentMethod: 'mobile_money'
    };

    const response = await SubscriptionAPI.createSubscription(subscriptionRequest);
    
    return NextResponse.json({
      success: response.success,
      message: response.message,
      subscription: response.subscription,
      paymentUrl: response.paymentUrl,
      authorizationUrl: response.authorizationUrl,
      subscriptionId: response.subscriptionId,
      amount: response.amount,
      currency: response.currency,
      redirectBehavior: response.redirectBehavior,
      mobileMoneyProvider: response.mobileMoneyProvider,
      error: response.error
    });

  } catch (error) {
    console.error('Error creating subscription:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to create subscription',
        success: false 
      },
      { status: 500 }
    );
  }
}
