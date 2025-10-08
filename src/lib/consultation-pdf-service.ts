import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import puppeteer from 'puppeteer'

export interface ConsultationPDFData {
  consultationId: string
  name: string
  email: string
  company?: string
  phone?: string
  preferredDate: string
  preferredTime: string
  projectDetails?: string
  serviceType?: string
  budget?: string
  timeline?: string
  additionalNotes?: string
  date: string
  currency?: 'USD' | 'KSH' | 'ZAR'
  totalAmount?: number
}

export class ConsultationPDFService {
  private doc: jsPDF

  constructor() {
    this.doc = new jsPDF()
  }

  private generateInvoiceHTML(data: ConsultationPDFData): string {
    const currentDate = new Date().toLocaleDateString();
    const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(); // 30 days from now
    const totalAmount = 250.00; // Fixed consultation fee
    
    // Currency conversion (approximate rates)
    const convertPrice = (usdPrice: number, currency: string = 'USD') => {
      if (currency === 'KSH') {
        return Math.round(usdPrice * 130) // Approximate USD to KSH rate
      }
      if (currency === 'ZAR') {
        return Math.round(usdPrice * 18) // Approximate USD to ZAR rate
      }
      return usdPrice
    }

    const getCurrencySymbol = (currency: string = 'USD') => {
      if (currency === 'KSH') return 'KSh'
      if (currency === 'ZAR') return 'R'
      return '$'
    }
    
    const currency = data.currency || 'USD'
    const currencySymbol = getCurrencySymbol(currency)
    const convertedTotalAmount = convertPrice(totalAmount, currency)

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Consultation Invoice</title>
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

              .invoice-title {
                  color: #ffffff;
                  font-size: 36px;
                  font-weight: 700;
                  letter-spacing: 2px;
                  text-align: center;
                  margin: 0 0 30px 0;
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

                     .company-footer {
                         text-align: center;
                         color: #b0c4de;
                         font-size: 14px;
                         margin-top: 20px;
                         padding-top: 20px;
                         border-top: 1px solid rgba(100, 200, 255, 0.2);
                     }

                     .company-footer p {
                         margin: 5px 0;
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
              <h1>CONSULTATION INVOICE</h1>
              
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
                          <span>CONS-${data.consultationId}</span>
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
                   <p>${data.name}</p>
                   <p>${data.company || 'N/A'}</p>
                   <p>${data.email}</p>
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
                          <td>Professional Web Development Consultation</td>
                          <td>1</td>
                          <td>${currencySymbol}${convertedTotalAmount.toLocaleString()}</td>
                          <td>${currencySymbol}${convertedTotalAmount.toLocaleString()}</td>
                      </tr>
                      <tr class="subtotal-row">
                          <td colspan="3">SUBTOTAL</td>
                          <td>${currencySymbol}${convertedTotalAmount.toLocaleString()}</td>
                      </tr>
                      <tr class="tax-row">
                          <td colspan="3">TAX (0%)</td>
                          <td>${currencySymbol}0</td>
                      </tr>
                      <tr class="total-row">
                          <td colspan="3">TOTAL DUE</td>
                          <td class="total-amount">${currencySymbol}${convertedTotalAmount.toLocaleString()}</td>
                      </tr>
                  </tbody>
              </table>
              
              <div class="payment-terms">
                  Payment Terms: Due Net 30 Days. Thank You For Your Business!
              </div>
          </div>
      </body>
      </html>
    `;
  }

  public async generateConsultationPDF(data: ConsultationPDFData): Promise<Buffer> {
    // Use Puppeteer to generate professional HTML-based PDF
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const totalAmount = data.totalAmount || 250;
    
    // Currency conversion (approximate rates)
    const convertPrice = (usdPrice: number, currency: string = 'USD') => {
      if (currency === 'KSH') {
        return Math.round(usdPrice * 130) // Approximate USD to KSH rate
      }
      if (currency === 'ZAR') {
        return Math.round(usdPrice * 18) // Approximate USD to ZAR rate
      }
      return usdPrice
    }

    const getCurrencySymbol = (currency: string = 'USD') => {
      if (currency === 'KSH') return 'KSh'
      if (currency === 'ZAR') return 'R'
      return '$'
    }
    
    const currency = data.currency || 'USD'
    const currencySymbol = getCurrencySymbol(currency)
    const convertedAmount = convertPrice(totalAmount, currency)

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Consultation Invoice</title>
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

              .invoice-title {
                  color: #ffffff;
                  font-size: 36px;
                  font-weight: 700;
                  letter-spacing: 2px;
                  text-align: center;
                  margin: 0 0 30px 0;
              }

                     .header-section {
                         text-align: center;
                         margin-bottom: 40px;
                         padding-bottom: 30px;
                         border-bottom: 2px solid rgba(100, 200, 255, 0.3);
                     }

                     .invoice-meta {
                         margin-top: 20px;
                         display: inline-block;
                     }

                     .content-section {
                         display: flex;
                         gap: 40px;
                         margin-bottom: 40px;
                     }

                     .consultation-info {
                         flex: 1;
                     }

                     .quote-summary {
                         flex: 1;
                         background: rgba(37, 99, 235, 0.1);
                         border: 2px solid rgba(37, 99, 235, 0.3);
                         border-radius: 8px;
                         padding: 20px;
                     }

                     .quote-summary h3 {
                         color: #ffffff;
                         font-size: 16px;
                         font-weight: 600;
                         margin-bottom: 15px;
                         letter-spacing: 1px;
                     }

                     .quote-item, .quote-addon, .quote-total {
                         display: flex;
                         justify-content: space-between;
                         margin: 8px 0;
                         color: #b0c4de;
                         font-size: 14px;
                     }

                     .quote-total {
                         border-top: 1px solid rgba(100, 200, 255, 0.3);
                         padding-top: 10px;
                         margin-top: 15px;
                         font-weight: 600;
                         color: #ffffff;
                     }

              .company-info {
                  display: flex;
                  align-items: center;
                  gap: 20px;
                  margin-top: 40px;
                  padding-top: 30px;
                  border-top: 2px solid rgba(100, 200, 255, 0.3);
              }

                     .logo {
                         width: 200px;
                         height: 200px;
                         display: flex;
                         align-items: center;
                         justify-content: center;
                         position: relative;
                         flex-shrink: 0;
                         margin: 0 auto;
                     }

              .logo img {
                  width: 100%;
                  height: 100%;
                  object-fit: contain;
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
                  margin-left: auto;
                  margin-right: -20px;
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

              .company-footer {
                  margin-top: 40px;
                  padding-top: 30px;
                  border-top: 2px solid rgba(100, 200, 255, 0.3);
                  text-align: center;
              }

              .company-footer .company-name {
                  color: #ffffff;
                  font-size: 24px;
                  font-weight: 600;
                  margin-bottom: 10px;
              }

              .company-footer p {
                  color: #b0c4de;
                  font-size: 14px;
                  margin: 5px 0;
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
              <div class="header-section">
                  <h1 class="invoice-title">CONSULTATION INVOICE</h1>
                  
                  <div class="invoice-meta">
                      <div class="invoice-meta-row">
                          <span class="invoice-meta-label">CONSULTATION #:</span>
                          <span>${data.consultationId}</span>
                      </div>
                      <div class="invoice-meta-row">
                          <span class="invoice-meta-label">DATE:</span>
                          <span>${currentDate}</span>
                      </div>
                      <div class="invoice-meta-row">
                          <span class="invoice-meta-label">DUE DATE:</span>
                          <span>${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
                      </div>
                  </div>
              </div>
          
              <div class="content-section">
                  <div class="consultation-info">
                      <h3>CONSULTATION FOR:</h3>
                      <p>${data.name}</p>
                      <p>${data.company || 'N/A'}</p>
                      <p>${data.email}</p>
                      <p>${data.phone || 'N/A'}</p>
                  </div>
                  
                  ${data.quoteData ? `
                  <div class="quote-summary">
                      <h3>QUOTE SUMMARY:</h3>
                      <div class="quote-item">
                          <span class="quote-service">${data.quoteData.serviceName}</span>
                          <span class="quote-price">${currencySymbol}${convertPrice(data.quoteData.basePrice, currency).toLocaleString()}</span>
                      </div>
                      ${data.quoteData.addOns.filter(addon => addon.selected).map(addon => `
                          <div class="quote-addon">
                              <span>+ ${addon.name}</span>
                              <span>${currencySymbol}${convertPrice(addon.price, currency).toLocaleString()}</span>
                          </div>
                      `).join('')}
                      <div class="quote-total">
                          <span>Total Project Cost:</span>
                          <span>${currencySymbol}${convertPrice(data.quoteData.totalPrice, currency).toLocaleString()}</span>
                      </div>
                  </div>
                  ` : ''}
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
                    ${data.quoteData ? `
                    <tr>
                          <td>${data.quoteData.serviceName}</td>
                          <td>1</td>
                          <td>${currencySymbol}${convertPrice(data.quoteData.basePrice, currency).toLocaleString()}</td>
                          <td>${currencySymbol}${convertPrice(data.quoteData.basePrice, currency).toLocaleString()}</td>
                    </tr>
                    ${data.quoteData.addOns.filter(addon => addon.selected).map(addon => `
                    <tr>
                          <td>+ ${addon.name}</td>
                          <td>1</td>
                          <td>${currencySymbol}${convertPrice(addon.price, currency).toLocaleString()}</td>
                          <td>${currencySymbol}${convertPrice(addon.price, currency).toLocaleString()}</td>
                    </tr>
                    `).join('')}
                    ` : `
                    <tr>
                          <td>Consultation Service</td>
                          <td>1</td>
                          <td>${currencySymbol}${convertedAmount.toLocaleString()}</td>
                          <td>${currencySymbol}${convertedAmount.toLocaleString()}</td>
                    </tr>
                    `}
                      <tr class="subtotal-row">
                          <td colspan="3">SUBTOTAL</td>
                          <td>${currencySymbol}${data.quoteData ? convertPrice(data.quoteData.totalPrice, currency).toLocaleString() : convertedAmount.toLocaleString()}</td>
                      </tr>
                      <tr class="tax-row">
                          <td colspan="3">TAX (0%)</td>
                          <td>${currencySymbol}0</td>
                      </tr>
                      <tr class="total-row">
                          <td colspan="3">TOTAL DUE</td>
                          <td class="total-amount">${currencySymbol}${data.quoteData ? convertPrice(data.quoteData.totalPrice, currency).toLocaleString() : convertedAmount.toLocaleString()}</td>
                      </tr>
                  </tbody>
              </table>
              
              <div class="payment-terms">
                  Payment Terms: Due Net 30 Days. Thank You For Your Business!
              </div>
              
              <div class="company-footer">
                  <p>Email: admin@atarwebb.com</p>
                  <p>Website: www.atarwebb.com</p>
              </div>
              
        </div>
      </body>
      </html>
    `;
    
    try {
      // Use Puppeteer to generate PDF from HTML
      const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      const page = await browser.newPage();
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
      
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '0.5in',
          right: '0.5in',
          bottom: '0.5in',
          left: '0.5in'
        }
      });
      
      await browser.close();
      
      return Buffer.from(pdfBuffer);
    } catch (error) {
      console.error('Error generating PDF with Puppeteer:', error);
      
      // Fallback to simple text-based PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Add professional header
      pdf.setFontSize(24);
      pdf.setTextColor(0, 0, 0);
      pdf.text('CONSULTATION INVOICE', 20, 30);
      
      // Add company info
      pdf.setFontSize(12);
      pdf.text('AtarWebb', 20, 45);
      pdf.text('Email: admin@atarwebb.com', 20, 50);
      pdf.text('Website: www.atarwebb.com', 20, 55);
      
      // Add invoice details box
      pdf.setDrawColor(37, 99, 235);
      pdf.setFillColor(37, 99, 235, 0.1);
      pdf.rect(140, 40, 60, 30, 'FD');
      
      pdf.setFontSize(10);
      pdf.text(`CONSULTATION #:`, 145, 50);
      pdf.text(`${data.consultationId}`, 145, 55);
      pdf.text(`DATE:`, 145, 60);
      pdf.text(`${currentDate}`, 145, 65);
      
      // Add client details
      pdf.setFontSize(12);
      pdf.text('CONSULTATION FOR:', 20, 80);
      pdf.text(`${data.name}`, 20, 90);
      pdf.text(`${data.company || 'N/A'}`, 20, 95);
      pdf.text(`${data.email}`, 20, 100);
      pdf.text(`${data.phone || 'N/A'}`, 20, 105);
      
      // Add project details
      pdf.text('PROJECT DETAILS:', 20, 120);
      pdf.text(`${data.projectDetails || 'N/A'}`, 20, 130);
      pdf.text(`Preferred Date: ${data.preferredDate}`, 20, 140);
      pdf.text(`Preferred Time: ${data.preferredTime}`, 20, 145);
      
      // Add services table
      pdf.setDrawColor(0, 0, 0);
      pdf.rect(20, 160, 170, 30);
      
      pdf.setFontSize(10);
      pdf.text('DESCRIPTION', 25, 170);
      pdf.text('QTY', 120, 170);
      pdf.text('UNIT PRICE', 140, 170);
      pdf.text('TOTAL', 160, 170);
      
      // Draw line under headers
      pdf.line(20, 175, 190, 175);
      
      pdf.text('Consultation Service', 25, 185);
      pdf.text('1', 120, 185);
      pdf.text(`${currencySymbol}${convertedAmount}`, 140, 185);
      pdf.text(`${currencySymbol}${convertedAmount}`, 160, 185);
      
      // Add total
      pdf.setFontSize(12);
      pdf.text(`TOTAL DUE: ${currencySymbol}${convertedAmount}`, 20, 210);
      
      // Add footer
      pdf.setFontSize(10);
      pdf.text('Payment Terms: Due Net 30 Days. Thank You For Your Business!', 20, 280);
      
      return Buffer.from(pdf.output('arraybuffer'));
    }
  }

  public async downloadConsultationPDF(data: ConsultationPDFData, filename: string = 'consultation-invoice.pdf') {
    const pdfBuffer = await this.generateConsultationPDF(data);
    // For client-side download, we'll need to handle this differently
    // This method is mainly for server-side use
    return pdfBuffer;
  }

  public async getPDFBuffer(data: ConsultationPDFData): Promise<Buffer> {
    return await this.generateConsultationPDF(data);
  }
}

export default ConsultationPDFService