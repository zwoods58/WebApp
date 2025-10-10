// Email templates for AtarWebb consultation workflow

export const depositInvoiceEmail = (consultation) => {
  const depositAmount = consultation.totalAmount * 0.5; // 50% deposit
  const remainingAmount = consultation.totalAmount - depositAmount;
  const currentDate = new Date().toLocaleDateString();
  const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(); // 30 days from now
  
  // Currency conversion (approximate rates)
  const convertPrice = (usdPrice, currency = 'USD') => {
    if (currency === 'KSH') {
      return Math.round(usdPrice * 130) // Approximate USD to KSH rate
    }
    if (currency === 'ZAR') {
      return Math.round(usdPrice * 18) // Approximate USD to ZAR rate
    }
    return usdPrice
  }

  const getCurrencySymbol = (currency = 'USD') => {
    if (currency === 'KSH') return 'KSh'
    if (currency === 'ZAR') return 'R'
    return '$'
  }
  
  const currency = consultation.currency || 'USD'
  const currencySymbol = getCurrencySymbol(currency)
  const convertedDepositAmount = convertPrice(depositAmount, currency)
  const convertedRemainingAmount = convertPrice(remainingAmount, currency)

  return {
    subject: `Deposit Invoice - ${consultation.serviceType} Project`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Deposit Invoice</title>
        <style>
              * {
                  margin: 0;
                  padding: 0;
                  box-sizing: border-box;
              }

              body {
                  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                  background: linear-gradient(135deg, #1a2332 0%, #1e3a4a 50%, #2a4a4a 100%);
                  min-height: 100vh;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  padding: 20px;
                  position: relative;
                  overflow: hidden;
              }

              .background-effects {
                  position: absolute;
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 100%;
                  overflow: hidden;
                  z-index: 0;
              }

              .graph-illustration {
                  position: absolute;
                  right: 5%;
                  top: 50%;
                  transform: translateY(-50%);
                  width: 400px;
                  height: 400px;
                  opacity: 0.6;
              }

              .hexagon {
                  position: absolute;
                  width: 50px;
                  height: 50px;
                  opacity: 0.1;
              }

              .invoice-container {
                  background: rgba(30, 40, 60, 0.95);
                  border-radius: 12px;
                  padding: 50px 60px;
                  max-width: 900px;
                  width: 100%;
                  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                  position: relative;
                  z-index: 1;
              }

              h1 {
                  color: #ffffff;
                  font-size: 48px;
                  font-weight: 700;
                  letter-spacing: 2px;
                  margin-bottom: 40px;
              }

              .header-section {
                  display: flex;
                  justify-content: space-between;
                  align-items: flex-start;
                  margin-bottom: 40px;
                  padding-bottom: 30px;
                  border-bottom: 2px solid rgba(100, 200, 255, 0.3);
              }

               .company-info {
                   display: flex;
                   align-items: center;
                   gap: 20px;
               }

              .company-details {
                  color: #b0c4de;
              }

              .company-name {
                  color: #ffffff;
                  font-size: 24px;
                  font-weight: 600;
                  margin-bottom: 5px;
              }

              .company-details p {
                  font-size: 14px;
                  margin: 3px 0;
              }

              .invoice-meta {
                  background: rgba(37, 99, 235, 0.15);
                  border: 2px solid rgba(37, 99, 235, 0.4);
                  border-radius: 8px;
                  padding: 15px 25px;
                  min-width: 250px;
              }

              .invoice-meta-row {
                  display: flex;
                  justify-content: space-between;
                  margin: 8px 0;
                  color: #ffffff;
                  font-size: 14px;
              }

              .invoice-meta-label {
                  font-weight: 600;
              }

              .bill-to {
                  margin-bottom: 40px;
              }

              .bill-to h3 {
                  color: #ffffff;
                  font-size: 16px;
                  font-weight: 600;
                  margin-bottom: 15px;
                  letter-spacing: 1px;
              }

              .bill-to p {
                  color: #b0c4de;
                  font-size: 14px;
                  margin: 5px 0;
              }

              .invoice-table {
                  width: 100%;
                  border-collapse: collapse;
                  margin-bottom: 30px;
              }

              .invoice-table thead {
                  background: rgba(37, 99, 235, 0.2);
                  border: 2px solid rgba(37, 99, 235, 0.4);
              }

              .invoice-table th {
                  color: #ffffff;
                  font-weight: 600;
                  padding: 15px;
                  text-align: left;
                  font-size: 14px;
                  letter-spacing: 1px;
              }

              .invoice-table th:last-child,
              .invoice-table td:last-child {
                  text-align: right;
              }

              .invoice-table tbody tr {
                  border-bottom: 1px solid rgba(100, 200, 255, 0.2);
              }

              .invoice-table td {
                  padding: 15px;
                  color: #b0c4de;
                  font-size: 14px;
              }

              .subtotal-row td {
                  text-align: right;
                  padding: 10px 15px;
                  font-size: 14px;
              }

              .tax-row td {
                  text-align: right;
                  padding: 10px 15px;
                  font-size: 14px;
                  color: #b0c4de;
              }

              .total-row {
                  background: rgba(37, 99, 235, 0.15);
                  border-top: 2px solid rgba(37, 99, 235, 0.4);
              }

              .total-row td {
                  padding: 15px;
                  font-size: 16px;
                  font-weight: 700;
              }

              .total-row .total-amount {
                  color: #10b981;
                  font-size: 20px;
              }

              .payment-terms {
                  text-align: center;
                  color: #ffffff;
                  font-size: 16px;
                  margin-top: 40px;
                  padding-top: 30px;
                  border-top: 2px solid rgba(100, 200, 255, 0.3);
              }

              .graph-svg {
                  filter: drop-shadow(0 0 20px rgba(16, 185, 129, 0.4));
              }

              @media (max-width: 768px) {
                  .invoice-container {
                      padding: 30px 20px;
                  }
                  
                  .header-section {
                      flex-direction: column;
                      gap: 20px;
                  }
                  
                  .graph-illustration {
                      display: none;
                  }
              }
        </style>
      </head>
      <body>
          <div class="background-effects">
              <svg class="hexagon" style="left: 10%; top: 20%;">
                  <polygon points="25,5 45,15 45,35 25,45 5,35 5,15" fill="rgba(37, 99, 235, 0.3)"/>
              </svg>
              <svg class="hexagon" style="left: 85%; top: 70%; width: 40px; height: 40px;">
                  <polygon points="20,4 36,12 36,28 20,36 4,28 4,12" fill="rgba(6, 182, 212, 0.3)"/>
              </svg>
              <svg class="hexagon" style="left: 15%; top: 75%; width: 35px; height: 35px;">
                  <polygon points="17.5,3.5 31.5,10.5 31.5,24.5 17.5,31.5 3.5,24.5 3.5,10.5" fill="rgba(37, 99, 235, 0.3)"/>
              </svg>
              
              <div class="graph-illustration">
                  <svg class="graph-svg" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                          <linearGradient id="arrowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" style="stop-color:#10b981;stop-opacity:0.8" />
                              <stop offset="100%" style="stop-color:#06b6d4;stop-opacity:0.9" />
                          </linearGradient>
                      </defs>
                      
                      <rect x="250" y="150" width="120" height="180" rx="8" fill="rgba(16, 185, 129, 0.15)" stroke="rgba(16, 185, 129, 0.4)" stroke-width="2"/>
                      <rect x="200" y="200" width="120" height="130" rx="8" fill="rgba(6, 182, 212, 0.15)" stroke="rgba(6, 182, 212, 0.4)" stroke-width="2"/>
                      
                      <line x1="260" y1="180" x2="360" y2="180" stroke="rgba(16, 185, 129, 0.3)" stroke-width="1"/>
                      <line x1="260" y1="220" x2="360" y2="220" stroke="rgba(16, 185, 129, 0.3)" stroke-width="1"/>
                      <line x1="260" y1="260" x2="360" y2="260" stroke="rgba(16, 185, 129, 0.3)" stroke-width="1"/>
                      
                      <path d="M 100 300 Q 150 200 200 180 T 300 80" stroke="url(#arrowGradient)" stroke-width="6" fill="none" stroke-linecap="round"/>
                      <polygon points="300,80 285,95 305,100 310,80" fill="url(#arrowGradient)"/>
                      
                      <circle cx="320" cy="70" r="3" fill="#10b981" opacity="0.8">
                          <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2s" repeatCount="indefinite"/>
                      </circle>
                      <circle cx="340" cy="90" r="2" fill="#06b6d4" opacity="0.6">
                          <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2.5s" repeatCount="indefinite"/>
                      </circle>
                      <circle cx="310" cy="55" r="2.5" fill="#ffffff" opacity="0.7">
                          <animate attributeName="opacity" values="0.7;0.2;0.7" dur="3s" repeatCount="indefinite"/>
                      </circle>
                  </svg>
              </div>
            </div>
            
          <div class="invoice-container">
              <h1>DEPOSIT INVOICE</h1>
              
              <div class="header-section">
                   <div class="company-info">
                       <div class="company-details">
                           <div class="company-name">AtarWebb</div>
                           <p>Email: admin@atarwebb.com</p>
                           <p>Website: www.atarwebb.com</p>
                       </div>
            </div>
            
                  <div class="invoice-meta">
                      <div class="invoice-meta-row">
                          <span class="invoice-meta-label">INVOICE #:</span>
                          <span>DEP-${consultation.id}</span>
                      </div>
                      <div class="invoice-meta-row">
                          <span class="invoice-meta-label">DATE:</span>
                          <span>${currentDate}</span>
                      </div>
                      <div class="invoice-meta-row">
                          <span class="invoice-meta-label">DUE DATE:</span>
                          <span>${dueDate}</span>
                      </div>
                  </div>
            </div>
            
              <div class="bill-to">
                  <h3>BILL TO:</h3>
                  <p>${consultation.name}</p>
                  <p>${consultation.company || 'N/A'}</p>
                  <p>${consultation.email}</p>
            </div>
            
              <table class="invoice-table">
                  <thead>
                      <tr>
                          <th>DESCRIPTION</th>
                          <th>QTY</th>
                          <th>UNIT PRICE (${currencySymbol})</th>
                          <th>TOTAL (${currencySymbol})</th>
                      </tr>
                  </thead>
                  <tbody>
                      <tr>
                          <td>${consultation.serviceType} - Project Deposit (50%)</td>
                          <td>1</td>
                          <td>${currencySymbol}${convertedDepositAmount.toLocaleString()}</td>
                          <td>${currencySymbol}${convertedDepositAmount.toLocaleString()}</td>
                      </tr>
                      <tr class="subtotal-row">
                          <td colspan="3">SUBTOTAL</td>
                          <td>${currencySymbol}${convertedDepositAmount.toLocaleString()}</td>
                      </tr>
                      <tr class="tax-row">
                          <td colspan="3">TAX (0%)</td>
                          <td>${currencySymbol}0</td>
                      </tr>
                      <tr class="total-row">
                          <td colspan="3">TOTAL DUE</td>
                          <td class="total-amount">${currencySymbol}${convertedDepositAmount.toLocaleString()}</td>
                      </tr>
                  </tbody>
              </table>
              
              <div class="payment-terms">
                  Payment Terms: Due Net 30 Days. Thank You For Your Business!
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Project Accepted - Deposit Required
      
      Hello ${consultation.name}!
      
      Great news! We've reviewed your project request and are excited to work with you on your ${consultation.serviceType} project.
      
      Project Details:
      - Project: ${consultation.projectDetails || 'Custom Project'}
      - Company: ${consultation.company || 'N/A'}
      - Service Type: ${consultation.serviceType}
      
      Payment Information:
      - Total Project Value: $${consultation.totalAmount.toLocaleString()}
      - Deposit Required (50%): $${depositAmount.toLocaleString()}
      - Remaining Balance: $${remainingAmount.toLocaleString()}
      
      Pay your deposit here: ${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/payment?consultationId=${consultation.id}&type=deposit
      
      What Happens Next:
      1. Pay the deposit to secure your project slot
      2. We'll begin development within 24 hours
      3. You'll receive regular updates on progress
      4. Final invoice sent upon completion
      
      If you have any questions, contact us at admin@atarwebb.com
      
      Best regards,
      AtarWebb Team
    `
  };
};

export const finalInvoiceEmail = (consultation) => {
  const remainingAmount = consultation.totalAmount - consultation.depositAmount;
  const currentDate = new Date().toLocaleDateString();
  const dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(); // 7 days from now
  
  // Currency conversion (approximate rates)
  const convertPrice = (usdPrice, currency = 'USD') => {
    if (currency === 'KSH') {
      return Math.round(usdPrice * 130) // Approximate USD to KSH rate
    }
    if (currency === 'ZAR') {
      return Math.round(usdPrice * 18) // Approximate USD to ZAR rate
    }
    return usdPrice
  }

  const getCurrencySymbol = (currency = 'USD') => {
    if (currency === 'KSH') return 'KSh'
    if (currency === 'ZAR') return 'R'
    return '$'
  }
  
  const currency = consultation.currency || 'USD'
  const currencySymbol = getCurrencySymbol(currency)
  const convertedRemainingAmount = convertPrice(remainingAmount, currency)

  return {
    subject: `Final Invoice - ${consultation.serviceType} Project Complete`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Final Invoice</title>
        <style>
              * {
                  margin: 0;
                  padding: 0;
                  box-sizing: border-box;
              }

              body {
                  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                  background: linear-gradient(135deg, #1a2332 0%, #1e3a4a 50%, #2a4a4a 100%);
                  min-height: 100vh;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  padding: 20px;
                  position: relative;
                  overflow: hidden;
              }

              .background-effects {
                  position: absolute;
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 100%;
                  overflow: hidden;
                  z-index: 0;
              }

              .graph-illustration {
                  position: absolute;
                  right: 5%;
                  top: 50%;
                  transform: translateY(-50%);
                  width: 400px;
                  height: 400px;
                  opacity: 0.6;
              }

              .hexagon {
                  position: absolute;
                  width: 50px;
                  height: 50px;
                  opacity: 0.1;
              }

              .invoice-container {
                  background: rgba(30, 40, 60, 0.95);
                  border-radius: 12px;
                  padding: 50px 60px;
                  max-width: 900px;
                  width: 100%;
                  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                  position: relative;
                  z-index: 1;
              }

              h1 {
                  color: #ffffff;
                  font-size: 48px;
                  font-weight: 700;
                  letter-spacing: 2px;
                  margin-bottom: 40px;
              }

              .header-section {
                  display: flex;
                  justify-content: space-between;
                  align-items: flex-start;
                  margin-bottom: 40px;
                  padding-bottom: 30px;
                  border-bottom: 2px solid rgba(100, 200, 255, 0.3);
              }

               .company-info {
                   display: flex;
                   align-items: center;
                   gap: 20px;
               }

              .company-details {
                  color: #b0c4de;
              }

              .company-name {
                  color: #ffffff;
                  font-size: 24px;
                  font-weight: 600;
                  margin-bottom: 5px;
              }

              .company-details p {
                  font-size: 14px;
                  margin: 3px 0;
              }

              .invoice-meta {
                  background: rgba(37, 99, 235, 0.15);
                  border: 2px solid rgba(37, 99, 235, 0.4);
                  border-radius: 8px;
                  padding: 15px 25px;
                  min-width: 250px;
              }

              .invoice-meta-row {
                  display: flex;
                  justify-content: space-between;
                  margin: 8px 0;
                  color: #ffffff;
                  font-size: 14px;
              }

              .invoice-meta-label {
                  font-weight: 600;
              }

              .bill-to {
                  margin-bottom: 40px;
              }

              .bill-to h3 {
                  color: #ffffff;
                  font-size: 16px;
                  font-weight: 600;
                  margin-bottom: 15px;
                  letter-spacing: 1px;
              }

              .bill-to p {
                  color: #b0c4de;
                  font-size: 14px;
                  margin: 5px 0;
              }

              .invoice-table {
                  width: 100%;
                  border-collapse: collapse;
                  margin-bottom: 30px;
              }

              .invoice-table thead {
                  background: rgba(37, 99, 235, 0.2);
                  border: 2px solid rgba(37, 99, 235, 0.4);
              }

              .invoice-table th {
                  color: #ffffff;
                  font-weight: 600;
                  padding: 15px;
                  text-align: left;
                  font-size: 14px;
                  letter-spacing: 1px;
              }

              .invoice-table th:last-child,
              .invoice-table td:last-child {
                  text-align: right;
              }

              .invoice-table tbody tr {
                  border-bottom: 1px solid rgba(100, 200, 255, 0.2);
              }

              .invoice-table td {
                  padding: 15px;
                  color: #b0c4de;
                  font-size: 14px;
              }

              .subtotal-row td {
                  text-align: right;
                  padding: 10px 15px;
                  font-size: 14px;
              }

              .tax-row td {
                  text-align: right;
                  padding: 10px 15px;
                  font-size: 14px;
                  color: #b0c4de;
              }

              .total-row {
                  background: rgba(37, 99, 235, 0.15);
                  border-top: 2px solid rgba(37, 99, 235, 0.4);
              }

              .total-row td {
                  padding: 15px;
                  font-size: 16px;
                  font-weight: 700;
              }

              .total-row .total-amount {
                  color: #10b981;
                  font-size: 20px;
              }

              .payment-terms {
                  text-align: center;
                  color: #ffffff;
                  font-size: 16px;
                  margin-top: 40px;
                  padding-top: 30px;
                  border-top: 2px solid rgba(100, 200, 255, 0.3);
              }

              .graph-svg {
                  filter: drop-shadow(0 0 20px rgba(16, 185, 129, 0.4));
              }

              @media (max-width: 768px) {
                  .invoice-container {
                      padding: 30px 20px;
                  }
                  
                  .header-section {
                      flex-direction: column;
                      gap: 20px;
                  }
                  
                  .graph-illustration {
                      display: none;
                  }
              }
        </style>
      </head>
      <body>
          <div class="background-effects">
              <svg class="hexagon" style="left: 10%; top: 20%;">
                  <polygon points="25,5 45,15 45,35 25,45 5,35 5,15" fill="rgba(37, 99, 235, 0.3)"/>
              </svg>
              <svg class="hexagon" style="left: 85%; top: 70%; width: 40px; height: 40px;">
                  <polygon points="20,4 36,12 36,28 20,36 4,28 4,12" fill="rgba(6, 182, 212, 0.3)"/>
              </svg>
              <svg class="hexagon" style="left: 15%; top: 75%; width: 35px; height: 35px;">
                  <polygon points="17.5,3.5 31.5,10.5 31.5,24.5 17.5,31.5 3.5,24.5 3.5,10.5" fill="rgba(37, 99, 235, 0.3)"/>
              </svg>
              
              <div class="graph-illustration">
                  <svg class="graph-svg" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                          <linearGradient id="arrowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" style="stop-color:#10b981;stop-opacity:0.8" />
                              <stop offset="100%" style="stop-color:#06b6d4;stop-opacity:0.9" />
                          </linearGradient>
                      </defs>
                      
                      <rect x="250" y="150" width="120" height="180" rx="8" fill="rgba(16, 185, 129, 0.15)" stroke="rgba(16, 185, 129, 0.4)" stroke-width="2"/>
                      <rect x="200" y="200" width="120" height="130" rx="8" fill="rgba(6, 182, 212, 0.15)" stroke="rgba(6, 182, 212, 0.4)" stroke-width="2"/>
                      
                      <line x1="260" y1="180" x2="360" y2="180" stroke="rgba(16, 185, 129, 0.3)" stroke-width="1"/>
                      <line x1="260" y1="220" x2="360" y2="220" stroke="rgba(16, 185, 129, 0.3)" stroke-width="1"/>
                      <line x1="260" y1="260" x2="360" y2="260" stroke="rgba(16, 185, 129, 0.3)" stroke-width="1"/>
                      
                      <path d="M 100 300 Q 150 200 200 180 T 300 80" stroke="url(#arrowGradient)" stroke-width="6" fill="none" stroke-linecap="round"/>
                      <polygon points="300,80 285,95 305,100 310,80" fill="url(#arrowGradient)"/>
                      
                      <circle cx="320" cy="70" r="3" fill="#10b981" opacity="0.8">
                          <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2s" repeatCount="indefinite"/>
                      </circle>
                      <circle cx="340" cy="90" r="2" fill="#06b6d4" opacity="0.6">
                          <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2.5s" repeatCount="indefinite"/>
                      </circle>
                      <circle cx="310" cy="55" r="2.5" fill="#ffffff" opacity="0.7">
                          <animate attributeName="opacity" values="0.7;0.2;0.7" dur="3s" repeatCount="indefinite"/>
                      </circle>
                  </svg>
              </div>
          </div>
          
          <div class="invoice-container">
              <h1>FINAL INVOICE</h1>
              
              <div class="header-section">
                   <div class="company-info">
                       <div class="company-details">
                           <div class="company-name">AtarWebb</div>
                           <p>Email: admin@atarwebb.com</p>
                           <p>Website: www.atarwebb.com</p>
                       </div>
            </div>
            
                  <div class="invoice-meta">
                      <div class="invoice-meta-row">
                          <span class="invoice-meta-label">INVOICE #:</span>
                          <span>FIN-${consultation.id}</span>
                      </div>
                      <div class="invoice-meta-row">
                          <span class="invoice-meta-label">DATE:</span>
                          <span>${currentDate}</span>
                      </div>
                      <div class="invoice-meta-row">
                          <span class="invoice-meta-label">DUE DATE:</span>
                          <span>${dueDate}</span>
            </div>
            </div>
            </div>
            
              <div class="bill-to">
                  <h3>BILL TO:</h3>
                  <p>${consultation.name}</p>
                  <p>${consultation.company || 'N/A'}</p>
                  <p>${consultation.email}</p>
            </div>
            
              <table class="invoice-table">
                  <thead>
                      <tr>
                          <th>DESCRIPTION</th>
                          <th>QTY</th>
                          <th>UNIT PRICE (${currencySymbol})</th>
                          <th>TOTAL (${currencySymbol})</th>
                      </tr>
                  </thead>
                  <tbody>
                      <tr>
                          <td>${consultation.serviceType} - Final Payment</td>
                          <td>1</td>
                          <td>${currencySymbol}${convertedRemainingAmount.toLocaleString()}</td>
                          <td>${currencySymbol}${convertedRemainingAmount.toLocaleString()}</td>
                      </tr>
                      <tr class="subtotal-row">
                          <td colspan="3">SUBTOTAL</td>
                          <td>${currencySymbol}${convertedRemainingAmount.toLocaleString()}</td>
                      </tr>
                      <tr class="tax-row">
                          <td colspan="3">TAX (0%)</td>
                          <td>${currencySymbol}0</td>
                      </tr>
                      <tr class="total-row">
                          <td colspan="3">TOTAL DUE</td>
                          <td class="total-amount">${currencySymbol}${convertedRemainingAmount.toLocaleString()}</td>
                      </tr>
                  </tbody>
              </table>
              
              <div class="payment-terms">
                  Payment Terms: Due Net 7 Days. Thank You For Your Business!
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Project Complete - Final Payment Due
      
      Hello ${consultation.name}!
      
      Congratulations! Your ${consultation.serviceType} project has been completed and is ready for delivery.
      
      Project Summary:
      - Project: ${consultation.projectDetails || 'Custom Project'}
      - Company: ${consultation.company || 'N/A'}
      - Service Type: ${consultation.serviceType}
      - Completion Date: ${new Date().toLocaleDateString()}
      
      Final Payment Information:
      - Total Project Value: $${consultation.totalAmount.toLocaleString()}
      - Deposit Paid: $${consultation.depositAmount.toLocaleString()}
      - Remaining Balance: $${remainingAmount.toLocaleString()}
      
      Pay your final balance here: ${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/payment?consultationId=${consultation.id}&type=final
      
      What's Included in Your Delivery:
      - Complete project files and source code
      - Documentation and setup instructions
      - 12 months of free support and maintenance
      - Project handover and training session
      
      Once payment is received, we'll send you all project files and schedule your handover session.
      
      Thank you for choosing AtarWebb!
      
      Best regards,
      AtarWebb Team
    `
  };
};
