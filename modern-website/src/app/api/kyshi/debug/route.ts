import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test the Kyshi API connection directly
    const baseUrl = process.env.KYSHI_BASE_URL || 'https://kyshi-mor-dev-qkuod6snia-nw.a.run.app/v1';
    const secretKey = process.env.KYSHI_SECRET_KEY || '';
    
    console.log('Testing Kyshi API connection...');
    console.log('Base URL:', baseUrl);
    console.log('Secret Key (first 10 chars):', secretKey.substring(0, 10) + '...');

    // Try different endpoints to find the correct one
    const endpoints = [
      '/plans',
      '/transactions',
      '/',
      '/status',
      '/health'
    ];

    let workingEndpoint = null;
    let lastError = null;

    for (const endpoint of endpoints) {
      try {
        const url = `${baseUrl}${endpoint}`;
        console.log('Trying endpoint:', url);
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': secretKey,
          },
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));

        if (response.ok) {
          const data = await response.json();
          console.log('Response data:', data);
          workingEndpoint = endpoint;
          break;
        } else {
          const errorText = await response.text();
          console.log('Error response:', errorText);
          lastError = `${response.status}: ${errorText}`;
        }
      } catch (error) {
        console.log('Request failed for endpoint:', endpoint, error);
        lastError = error instanceof Error ? error.message : 'Unknown error';
      }
    }

    if (workingEndpoint) {
      return NextResponse.json({
        success: true,
        message: `Kyshi API connection successful! Working endpoint: ${workingEndpoint}`,
        workingEndpoint,
        baseUrl,
        secretKeyPrefix: secretKey.substring(0, 10) + '...',
      });
    } else {
      return NextResponse.json({
        success: false,
        message: `Could not connect to any Kyshi API endpoint. Last error: ${lastError}`,
        testedEndpoints: endpoints,
        baseUrl,
        secretKeyPrefix: secretKey.substring(0, 10) + '...',
        lastError,
      }, { status: 400 });
    }
  } catch (error) {
    console.error('API test failed:', error);
    return NextResponse.json({
      success: false,
      message: `API test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
