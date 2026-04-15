import { NextResponse } from 'next/server';
import { SubscriptionAPI } from '@/lib/subscription-api';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get('country');

    if (!country) {
      return NextResponse.json(
        { error: 'Country parameter is required' },
        { status: 400 }
      );
    }

    const plans = await SubscriptionAPI.getPlans(country);
    
    return NextResponse.json({
      success: true,
      plans: plans,
      country: country,
      count: plans.length
    });

  } catch (error) {
    console.error('Error getting plans:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to get plans',
        success: false 
      },
      { status: 500 }
    );
  }
}
