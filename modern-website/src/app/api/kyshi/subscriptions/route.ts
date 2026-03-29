import { NextRequest, NextResponse } from 'next/server';
import { kyshiApi } from '@/lib/kyshi';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerEmail, planId } = body;

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
    const subscription = await kyshiApi.createSubscription({
      customer: customerEmail,
      plan: planId,
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
    const subscriptions = await kyshiApi.listSubscriptions();
    
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
