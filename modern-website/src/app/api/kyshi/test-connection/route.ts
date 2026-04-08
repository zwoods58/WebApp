import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const baseUrl = process.env.KYSHI_BASE_URL || 'https://kyshi-mor-dev-qkuod6snia-nw.a.run.app/api';
    const secretKey = process.env.KYSHI_SECRET_KEY;

    if (!secretKey) {
      return NextResponse.json({
        success: false,
        message: 'KYSHI_SECRET_KEY not configured',
        baseUrl: baseUrl
      }, { status: 500 });
    }

    console.log('Testing Kyshi API connection...');
    console.log('Base URL:', baseUrl);
    console.log('Secret Key:', secretKey.substring(0, 10) + '...');

    // Test basic connectivity to plans endpoint
    const response = await fetch(`${baseUrl}/plans`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': secretKey,
      },
    });

    console.log('Kyshi API Response Status:', response.status);
    console.log('Kyshi API Response Headers:', Object.fromEntries(response.headers.entries()));

    const responseText = await response.text();
    console.log('Kyshi API Response Body:', responseText);

    if (!response.ok) {
      return NextResponse.json({
        success: false,
        message: `Kyshi API error: ${response.status} ${response.statusText}`,
        responseText: responseText,
        baseUrl: baseUrl,
        authMethod: 'x-api-key header'
      }, { status: response.status });
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      return NextResponse.json({
        success: false,
        message: 'Invalid JSON response from Kyshi API',
        responseText: responseText
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Kyshi API connection successful',
      data: data,
      baseUrl: baseUrl,
      authMethod: 'x-api-key header'
    });

  } catch (error) {
    console.error('Kyshi connection test error:', error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
      error: error
    }, { status: 500 });
  }
}
