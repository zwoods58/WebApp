import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  console.log('=== PAYMENT SUCCESS REQUEST START ===');
  console.log('Request URL:', request.url);
  console.log('Request method:', request.method);
  
  const { searchParams } = new URL(request.url);
  const reference = searchParams.get('trxref') || searchParams.get('reference');
  const allParams = Object.fromEntries(searchParams.entries());
  
  console.log('All URL parameters:', allParams);
  console.log('Extracted reference:', reference);
  console.log('Environment NGROK_URL:', process.env.NGROK_URL);
  
  // Get the base URL - supports both ngrok and production
  const getBaseUrl = () => {
    // Check for ngrok URL first (for local development)
    const ngrokUrl = process.env.NGROK_URL;
    if (ngrokUrl) {
      console.log('Payment success: Using ngrok URL:', ngrokUrl);
      return ngrokUrl;
    }
    
    // Check for hardcoded ngrok URL as fallback
    const hardcodedNgrok = 'https://jonathon-precognizable-contestably.ngrok-free.dev';
    console.log('Payment success: Trying hardcoded ngrok URL:', hardcodedNgrok);
    return hardcodedNgrok;
    
    // Fall back to production URL (commented out for now)
    // const productionUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://your-app.com';
    // console.log('Payment success: Using production URL:', productionUrl);
    // return productionUrl;
  };
  
  const baseUrl = getBaseUrl();
  
  // Construct redirect URL with proper debugging
  const redirectUrl = `${baseUrl}/Beezee-App/app/ke/freelance/more?payment=success&reference=${reference || ''}`;
  console.log('Payment success: Full redirect URL:', redirectUrl);
  
  // HTML page with immediate redirect and comprehensive debugging
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Successful - BeeZee</title>
        <meta http-equiv="refresh" content="1;url=${redirectUrl}">
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
          .redirect-text {
            font-size: 12px;
            color: #999;
            margin: 8px 0;
          }
          .debug-info {
            font-size: 10px;
            color: #ccc;
            margin: 16px 0;
            word-break: break-all;
            text-align: left;
            background: #f5f5f5;
            padding: 8px;
            border-radius: 4px;
          }
          .manual-redirect {
            display: inline-block;
            margin-top: 20px;
            padding: 16px 32px;
            background: #1B5E20;
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            transition: all 0.2s;
            box-shadow: 0 4px 12px rgba(27, 94, 32, 0.3);
          }
          .manual-redirect:hover {
            background: #2E7D32;
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(27, 94, 32, 0.4);
          }
          .countdown {
            font-size: 36px;
            font-weight: bold;
            color: #1B5E20;
            margin: 16px 0;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          .pulse {
            animation: pulse 1.5s infinite;
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
          <div class="countdown pulse" id="countdown">1</div>
          <p class="redirect-text">Auto-redirecting to BeeZee...</p>
          <a href="${redirectUrl}" class="manual-redirect" id="manualBtn">
            Continue to BeeZee Now
          </a>
          <div class="debug-info">
            <strong>Debug Info:</strong><br>
            Base URL: ${baseUrl}<br>
            Reference: ${reference || 'None'}<br>
            Redirect: ${redirectUrl}
          </div>
        </div>
        <script>
          console.log('=== PAYMENT SUCCESS DEBUG ===');
          console.log('Page loaded successfully');
          const redirectUrl = '${redirectUrl}';
          console.log('Redirect URL:', redirectUrl);
          console.log('Reference:', '${reference || ''}');
          console.log('Base URL:', '${baseUrl}');
          
          // PWA Detection
          const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
          const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
          const isAndroid = /Android/.test(navigator.userAgent);
          
          console.log('PWA Environment:', { isStandalone, isIOS, isAndroid });
          
          let countdown = 1;
          const countdownEl = document.getElementById('countdown');
          const manualBtn = document.getElementById('manualBtn');
          
          const performRedirect = () => {
            console.log('=== EXECUTING PWA-AWARE REDIRECT ===');
            console.log('Redirecting to:', redirectUrl);
            
            try {
              if (isStandalone && isIOS) {
                // iOS PWA - must use Safari
                console.log('iOS PWA: Using Safari redirect');
                window.location.href = redirectUrl;
              } 
              else if (isStandalone && isAndroid) {
                // Android PWA - open in Chrome
                console.log('Android PWA: Using Chrome new tab');
                const newTab = window.open(redirectUrl, '_blank', 'noopener,noreferrer');
                if (!newTab || newTab.closed) {
                  console.log('Chrome popup blocked, using location redirect');
                  window.location.href = redirectUrl;
                } else {
                  console.log('Chrome tab opened successfully');
                  setTimeout(() => {
                    alert('Payment opened in Chrome. Complete payment and return to BeeZee app.');
                  }, 500);
                }
              }
              else if (isStandalone) {
                // Other PWA
                console.log('Other PWA: Using new tab');
                const newTab = window.open(redirectUrl, '_blank', 'noopener,noreferrer');
                if (!newTab) {
                  window.location.href = redirectUrl;
                }
              }
              else {
                // Browser mode
                console.log('Browser mode: Using normal redirect');
                window.location.href = redirectUrl;
              }
            } catch (error) {
              console.error('=== REDIRECT FAILED ===', error);
              // Show manual link
              showManualPaymentLink(redirectUrl);
            }
          };
          
          const updateCountdown = () => {
            countdownEl.textContent = countdown;
            if (countdown <= 0) {
              performRedirect();
            } else {
              countdown--;
              setTimeout(updateCountdown, 1000);
            }
          };
          
          // Start countdown
          setTimeout(updateCountdown, 100);
          
          // Manual redirect on button click
          manualBtn.addEventListener('click', (e) => {
            console.log('=== MANUAL REDIRECT TRIGGERED ===');
            e.preventDefault();
            performRedirect();
          });
          
          function showManualPaymentLink(url) {
            console.log('=== SHOWING MANUAL PAYMENT LINK ===');
            const modal = document.createElement('div');
            modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.8);z-index:9999;display:flex;align-items:center;justify-content:center;';
            modal.innerHTML = \`
              <div style="background:white;padding:24px;border-radius:12px;max-width:400px;width:90%;text-align:center;box-shadow:0 20px 40px rgba(0,0,0,0.3);">
                <h3 style="margin:0 0 16px 0;color:#333;font-size:18px;">Auto-Redirect Failed</h3>
                <p style="margin:0 0 20px 0;color:#666;line-height:1.5;">Please click below to return to BeeZee:</p>
                <a href="\${url}" style="display:inline-block;background:#1B5E20;color:white;padding:16px 32px;border-radius:8px;margin:16px 0;text-decoration:none;font-weight:600;">
                  Return to BeeZee
                </a>
                <button onclick="this.parentElement.parentElement.remove()" style="padding:12px 24px;background:#f5f5f5;border:none;border-radius:6px;color:#666;cursor:pointer;font-size:14px;">
                  Close
                </button>
              </div>
            \`;
            document.body.appendChild(modal);
          }
          
          console.log('=== DEBUG SCRIPT COMPLETE ===');
        </script>
      </body>
    </html>
  `;
  
  console.log('=== PAYMENT SUCCESS RESPONSE ===');
  console.log('Returning HTML page with redirect URL:', redirectUrl);
  
  const response = new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });
  
  console.log('=== PAYMENT SUCCESS REQUEST END ===');
  return response;
}
