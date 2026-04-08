import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  let body = {};
  try {
    body = await request.json();
  } catch (e) {
    // No body provided, that's okay for auth test
  }
  
  const baseUrl = process.env.STARTBUTTON_BASE_URL || 'https://api.startbutton.tech';
  const publicKey = process.env.STARTBUTTON_PUBLIC_KEY || '';
  const secretKey = process.env.STARTBUTTON_SECRET_KEY || '';

  const results = [];

  // Test 1: Bearer token with secret key (recommended by docs)
  try {
    const response1 = await fetch(`${baseUrl}/transaction/initialize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${secretKey}`,
      },
      body: JSON.stringify({
        email: 'test@example.com',
        amount: 10000,
        currency: 'NGN',
        reference: `test_bearer_secret_${Date.now()}`
      }),
    });
    
    const result1 = await response1.json();
    results.push({
      method: 'Bearer + Secret Key (Recommended)',
      status: response1.status,
      success: response1.ok,
      data: result1
    });
  } catch (error) {
    results.push({
      method: 'Bearer + Secret Key (Recommended)',
      status: 'Error',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }

  // Test 2: Custom header with secret key
  try {
    const response2 = await fetch(`${baseUrl}/transaction/initialize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-StartButton-Key': secretKey,
      },
      body: JSON.stringify({
        email: 'test@example.com',
        amount: 10000,
        currency: 'NGN',
        reference: `test_custom_secret_${Date.now()}`
      }),
    });
    
    const result2 = await response2.json();
    results.push({
      method: 'X-StartButton-Key + Secret Key',
      status: response2.status,
      success: response2.ok,
      data: result2
    });
  } catch (error) {
    results.push({
      method: 'X-StartButton-Key + Secret Key',
      status: 'Error',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }

  // Test 3: Custom header with public key
  try {
    const response3 = await fetch(`${baseUrl}/transaction/initialize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-StartButton-Key': publicKey,
      },
      body: JSON.stringify({
        email: 'test@example.com',
        amount: 10000,
        currency: 'NGN',
        reference: `test_custom_public_${Date.now()}`
      }),
    });
    
    const result3 = await response3.json();
    results.push({
      method: 'X-StartButton-Key + Public Key',
      status: response3.status,
      success: response3.ok,
      data: result3
    });
  } catch (error) {
    results.push({
      method: 'X-StartButton-Key + Public Key',
      status: 'Error',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }

  // Test 4: Custom header with secret key
  try {
    const response4 = await fetch(`${baseUrl}/transaction/initialize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-StartButton-Key': secretKey,
      },
      body: JSON.stringify({
        email: 'test@example.com',
        amount: 10000,
        currency: 'NGN',
        reference: `test_custom_secret_${Date.now()}`
      }),
    });
    
    const result4 = await response4.json();
    results.push({
      method: 'X-StartButton-Key + Secret Key',
      status: response4.status,
      success: response4.ok,
      data: result4
    });
  } catch (error) {
    results.push({
      method: 'X-StartButton-Key + Secret Key',
      status: 'Error',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }

  // Test 5: Basic auth with public key
  try {
    const response5 = await fetch(`${baseUrl}/transaction/initialize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(publicKey + ':').toString('base64')}`,
      },
      body: JSON.stringify({
        email: 'test@example.com',
        amount: 10000,
        currency: 'NGN',
        reference: `test_basic_public_${Date.now()}`
      }),
    });
    
    const result5 = await response5.json();
    results.push({
      method: 'Basic Auth + Public Key',
      status: response5.status,
      success: response5.ok,
      data: result5
    });
  } catch (error) {
    results.push({
      method: 'Basic Auth + Public Key',
      status: 'Error',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }

  // Test 6: No auth (just to see the error)
  try {
    const response6 = await fetch(`${baseUrl}/transaction/initialize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        amount: 10000,
        currency: 'NGN',
        reference: `test_no_auth_${Date.now()}`
      }),
    });
    
    const result6 = await response6.json();
    results.push({
      method: 'No Auth',
      status: response6.status,
      success: response6.ok,
      data: result6
    });
  } catch (error) {
    results.push({
      method: 'No Auth',
      status: 'Error',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }

  return NextResponse.json({
    message: 'Authentication method testing complete',
    results,
    keysUsed: {
      publicKey: publicKey.substring(0, 10) + '...',
      secretKey: secretKey.substring(0, 10) + '...'
    }
  });
}

export async function GET() {
  return NextResponse.json({
    message: 'StartButton Authentication Test Endpoint',
    usage: 'POST to test different authentication methods',
    methods: [
      'Bearer + Public Key',
      'Bearer + Secret Key', 
      'X-StartButton-Key + Public Key',
      'X-StartButton-Key + Secret Key',
      'Basic Auth + Public Key',
      'No Auth'
    ]
  });
}
