import { NextRequest, NextResponse } from 'next/server';

export async function POST() {
  try {
    const baseUrl = 'https://kyshi-mor-dev-qkuod6snia-nw.a.run.app/v1';
    const secretKey = 'sk_test_cb94e10dcbdd4030a79f644b68ebc863';
    
    // Try to create the Kenya weekly plan directly
    const planData = {
      name: 'Kenya Weekly Premium',
      description: 'Weekly subscription for BeeZee premium features in Kenya',
      interval: 'weekly',
      amount: 200,
      localCurrency: 'KES',
    };

    const response = await fetch(`${baseUrl}/plans`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': secretKey,
      },
      body: JSON.stringify(planData),
    });

    const result: any = {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries())
    };

    if (response.ok) {
      result.data = await response.json();
    } else {
      result.error = await response.text();
    }

    return NextResponse.json({
      success: response.ok,
      message: response.ok ? 'Plan created successfully' : 'Plan creation failed',
      result,
      planData,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: `Request failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
