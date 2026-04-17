import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const baseUrl = process.env.STARTBUTTON_BASE_URL || 'https://api.startbutton.tech';
    const secretKey = process.env.STARTBUTTON_SECRET_KEY || '';
    
    console.log('Testing StartButton connectivity...');
    console.log('Base URL:', baseUrl);
    console.log('Secret Key format:', secretKey.substring(0, 10) + '...');
    console.log('Secret Key length:', secretKey.length);

    // Test basic connectivity to the API
    const response = await fetch(`${baseUrl}/transaction/initialize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${secretKey}`,
      },
      body: JSON.stringify({
        email: 'test@example.com',
        amount: 10000,
        currency: 'NGN',
        reference: `connectivity_test_${Date.now()}`
      }),
    });

    const responseText = await response.text();
    console.log('Response Status:', response.status);
    console.log('Response Headers:', Object.fromEntries(response.headers.entries()));
    console.log('Response Body:', responseText);

    return NextResponse.json({
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      baseUrl: baseUrl,
      secretKeyFormat: secretKey.substring(0, 10) + '...',
      secretKeyLength: secretKey.length,
      responseText: responseText,
      headers: Object.fromEntries(response.headers.entries())
    });

  } catch (error) {
    console.error('Connectivity test error:', error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
      error: error
    }, { status: 500 });
  }
}

