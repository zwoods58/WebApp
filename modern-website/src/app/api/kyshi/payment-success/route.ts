import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const reference = searchParams.get('trxref') || searchParams.get('reference');
  
  // Get the base URL - supports both ngrok and production
  const getBaseUrl = () => {
    // Check for ngrok URL first (for local development)
    if (process.env.NGROK_URL) {
      console.log('Payment success: Using ngrok URL:', process.env.NGROK_URL);
      return process.env.NGROK_URL;
    }
    // Fall back to production URL
    const productionUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://your-app.com';
    console.log('Payment success: Using production URL:', productionUrl);
    return productionUrl;
  };
  
  const baseUrl = getBaseUrl();
  
  // HTML page that auto-redirects after 3 seconds
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Successful - BeeZee</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background: linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .container {
            text-align: center;
            background: white;
            padding: 40px 32px;
            border-radius: 24px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            max-width: 320px;
            width: 90%;
          }
          .checkmark {
            width: 80px;
            height: 80px;
            background: #4CAF50;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 24px;
          }
          .checkmark svg {
            width: 48px;
            height: 48px;
            color: white;
          }
          h1 {
            font-size: 24px;
            color: #1a1a1a;
            margin: 0 0 8px 0;
          }
          p {
            font-size: 14px;
            color: #666;
            margin: 0 0 24px 0;
          }
          .timer {
            font-size: 48px;
            font-weight: bold;
            color: #1B5E20;
            margin: 16px 0;
          }
          .redirect-text {
            font-size: 12px;
            color: #999;
          }
          .spinner {
            width: 40px;
            height: 40px;
            border: 3px solid #e0e0e0;
            border-top-color: #1B5E20;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 16px auto 0;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="checkmark">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1>Payment Successful!</h1>
          <p>Your subscription has been activated.</p>
          <div class="timer" id="timer">3</div>
          <div class="spinner"></div>
          <p class="redirect-text">Redirecting you back to BeeZee...</p>
        </div>
        <script>
          let seconds = 3;
          const timerElement = document.getElementById('timer');
          const redirectUrl = '${baseUrl}/Beezee-App/app/ke/freelance/more?payment=success&reference=${reference || ''}';
          
          const countdown = setInterval(() => {
            seconds--;
            timerElement.textContent = seconds;
            if (seconds <= 0) {
              clearInterval(countdown);
              window.location.href = redirectUrl;
            }
          }, 1000);
        </script>
      </body>
    </html>
  `;
  
  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}
