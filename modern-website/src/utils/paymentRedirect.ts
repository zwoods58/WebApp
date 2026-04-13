export function redirectToPayment(url: string, onFail?: (error: string) => void) {
  // Log for debugging
  console.log('=== PWA PAYMENT REDIRECT ===');
  console.log('Redirecting to:', url);
  console.log('Display mode:', window.matchMedia('(display-mode: standalone)').matches ? 'PWA' : 'Browser');
  console.log('User agent:', navigator.userAgent);
  
  // Check if URL is valid
  if (!url || url === 'undefined') {
    console.error('Invalid redirect URL');
    if (onFail) onFail('Invalid URL');
    return;
  }
  
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);
  
  try {
    if (isStandalone && isIOS) {
      // iOS PWA - must open in Safari
      console.log('iOS PWA detected - using Safari redirect');
      window.location.href = url;
      // Fallback: if fails, show alert
      setTimeout(() => {
        alert('If payment page doesn\'t open, please tap and hold link to open in Safari');
      }, 1000);
    } 
    else if (isStandalone && isAndroid) {
      // Android PWA - try to open in Chrome
      console.log('Android PWA detected - using Chrome redirect');
      const newTab = window.open(url, '_blank', 'noopener,noreferrer');
      if (!newTab || newTab.closed) {
        // Popup blocked - use location
        console.log('Popup blocked, falling back to location redirect');
        window.location.href = url;
      } else {
        // Success - show user instruction
        setTimeout(() => {
          alert('Payment opened in Chrome. Complete payment and return to BeeZee app.');
        }, 500);
      }
    }
    else if (isStandalone) {
      // Other PWA (desktop PWA, etc.)
      console.log('Other PWA detected - using new tab redirect');
      const newTab = window.open(url, '_blank', 'noopener,noreferrer');
      if (!newTab) {
        window.location.href = url;
      }
    }
    else {
      // Browser mode - normal redirect
      console.log('Browser mode detected - using normal redirect');
      window.location.href = url;
    }
  } catch (error) {
    console.error('=== REDIRECT FAILED ===', error);
    showManualPaymentLink(url);
    if (onFail) onFail(`Redirect failed: ${error}`);
  }
}

function showManualPaymentLink(url: string) {
  console.log('=== SHOWING MANUAL PAYMENT LINK ===');
  
  // Remove any existing modal
  const existingModal = document.getElementById('payment-redirect-modal');
  if (existingModal) {
    existingModal.remove();
  }
  
  const modal = document.createElement('div');
  modal.id = 'payment-redirect-modal';
  modal.innerHTML = `
    <div style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.8);z-index:9999;display:flex;align-items:center;justify-content:center;">
      <div style="background:white;padding:24px;border-radius:12px;max-width:400px;width:90%;text-align:center;box-shadow:0 20px 40px rgba(0,0,0,0.3);">
        <h3 style="margin:0 0 16px 0;color:#333;font-size:18px;">Payment Redirect Failed</h3>
        <p style="margin:0 0 20px 0;color:#666;line-height:1.5;">Please click the button below to complete your payment in a new browser window.</p>
        <a href="${url}" target="_blank" rel="noopener noreferrer" style="display:inline-block;background:#1B5E20;color:white;padding:16px 32px;border-radius:8px;margin:16px 0;text-decoration:none;font-weight:600;">
          Complete Payment
        </a>
        <button onclick="this.parentElement.parentElement.remove()" style="padding:12px 24px;background:#f5f5f5;border:none;border-radius:6px;color:#666;cursor:pointer;font-size:14px;">
          Close
        </button>
        <p style="font-size:12px;color:#999;margin-top:16px;">After payment, return to BeeZee app to see your subscription activated</p>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  
  // Auto-close after 30 seconds
  setTimeout(() => {
    if (document.getElementById('payment-redirect-modal')) {
      modal.remove();
    }
  }, 30000);
}

// Utility to check current environment
export function getPWAEnvironment() {
  return {
    isStandalone: window.matchMedia('(display-mode: standalone)').matches,
    isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent),
    isAndroid: /Android/.test(navigator.userAgent),
    isPWA: window.matchMedia('(display-mode: standalone)').matches,
    userAgent: navigator.userAgent
  };
}
