import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test with basic authentication instead of x-api-key header
    const baseUrl = 'https://kyshi-mor-dev-qkuod6snia-nw.a.run.app';
    const secretKey = 'sk_test_cb94e10dcbdd4030a79f644b68ebc863';
    
    const endpoints = [
      '/v1/transactions',
      '/v1/subscriptions',
      '/v1/plans'
    ];

    const results: any[] = [];

    for (const endpoint of endpoints) {
      try {
        const url = `${baseUrl}${endpoint}`;
        
        // Try basic authentication (username:password format)
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${Buffer.from(secretKey + ':').toString('base64')}`,
          },
        });

        const result: any = {
          endpoint,
          authMethod: 'basic',
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

        results.push(result);
      } catch (error) {
        results.push({
          endpoint,
          authMethod: 'basic',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Basic authentication test complete',
      baseUrl,
      secretKeyPrefix: secretKey.substring(0, 10) + '...',
      results
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: `Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    }, { status: 500 });
  }
}
