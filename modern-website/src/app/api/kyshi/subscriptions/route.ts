import { NextRequest, NextResponse } from 'next/server';
import { kyshiApi } from '@/lib/kyshi';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerEmail, planId, industry = 'retail', country = 'ke', redirectUrl } = body;

    if (!customerEmail || !planId) {
      return NextResponse.json(
        {
          success: false,
          message: 'customerEmail and planId are required',
        },
        { status: 400 }
      );
    }

    // Create subscription
    const subscription = await kyshiApi().createSubscription({
      customer: customerEmail,
      planCode: planId,
      country: country.toUpperCase(),
      metadata: {
        country: country.toLowerCase(),
        industry: industry,
        redirect_url: redirectUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com'}/Beezee-App/app/${country.toLowerCase()}/${industry}/payment-success`
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Subscription created successfully',
      subscription,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: `Subscription creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const subscriptions = await kyshiApi().listSubscriptions();
    
    return NextResponse.json({
      success: true,
      message: 'Subscriptions retrieved successfully',
      subscriptions,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: `Failed to retrieve subscriptions: ${error instanceof Error ? error.message : 'Unknown error'}`,
      },
      { status: 500 }
    );
  }
}
