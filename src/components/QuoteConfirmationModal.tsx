'use client'

import { useState } from 'react'
import { X, Download, Calendar, CheckCircle, FileText, Mail, Globe, Phone } from 'lucide-react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

interface QuoteConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onScheduleConsultation: () => void
  service: {
    name: string
    basePrice: number
    addOns: Array<{ name: string; price: number; selected: boolean }>
    totalPrice: number
  }
}

export default function QuoteConfirmationModal({ 
  isOpen, 
  onClose, 
  onScheduleConsultation, 
  service 
}: QuoteConfirmationModalProps) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  const generateQuotePDF = async () => {
    setIsGeneratingPDF(true)
    
    try {
      const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
      
      const quoteNumber = `ATW-${Date.now().toString().slice(-6)}`
      
      // Create professional HTML content
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>AtarWeb Professional Quote</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              line-height: 1.4; 
              color: #333; 
              background: #ffffff;
            }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            
            /* Header */
            .header { 
              margin-bottom: 30px;
            }
            .logo-section { 
              display: flex; 
              justify-content: space-between; 
              align-items: flex-start; 
              margin-bottom: 20px;
            }
            .logo { 
              font-size: 12px; 
              font-weight: 700; 
              color: #000; 
              letter-spacing: -0.5px;
            }
            .quote-meta {
              text-align: right;
              color: #666;
            }
            .quote-number { 
              font-size: 12px; 
              font-weight: 600; 
              color: #000; 
              margin-bottom: 4px;
            }
            .quote-date { font-size: 12px; }
            
            .header-title {
              text-align: left;
              margin-top: 0px;
            }
            .header-title h1 { 
              font-size: 12px; 
              color: #000; 
              margin-bottom: 8px;
              font-weight: 700;
            }
            .header-title p { 
              color: #666; 
              font-size: 12px;
            }
            
            /* Service Details */
            .service-details { 
              margin-bottom: 30px;
            }
            .service-details h3 { 
              color: #000; 
              margin-bottom: 15px; 
              font-size: 12px;
              font-weight: 700;
            }
            .service-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            .service-table th {
              text-align: left;
              padding: 12px 0;
              border-bottom: 1px solid #e5e5e5;
              font-weight: 600;
              font-size: 12px;
              color: #666;
            }
            .service-table td {
              padding: 12px 0;
              border-bottom: 1px solid #f0f0f0;
              font-size: 12px;
            }
            .service-table .description {
              color: #000;
            }
            .service-table .qty {
              text-align: center;
              color: #666;
            }
            .service-table .unit-price {
              text-align: right;
              color: #666;
            }
            .service-table .amount {
              text-align: right;
              font-weight: 600;
              color: #000;
            }
            .service-table .total-row {
              border-top: 2px solid #000;
              font-weight: 700;
            }
            
            /* Payment Summary */
            .payment-summary {
              margin-bottom: 30px;
            }
            .payment-amount {
              font-size: 12px;
              font-weight: 700;
              color: #000;
              margin-bottom: 20px;
            }
            .payment-details {
              display: flex;
              flex-direction: column;
              align-items: flex-end;
            }
            .payment-row {
              display: flex;
              justify-content: space-between;
              width: 200px;
              padding: 4px 0;
              font-size: 12px;
            }
            .payment-row.total {
              font-weight: 700;
              border-top: 1px solid #e5e5e5;
              padding-top: 8px;
              margin-top: 4px;
            }
            
            
            /* Footer */
            .footer { 
              margin-top: 30px; 
              text-align: center; 
              color: #666; 
              font-size: 12px;
              border-top: 1px solid #e5e5e5;
              padding-top: 20px;
            }
            .footer-brand {
              font-size: 12px;
              font-weight: 700;
              color: #000;
              margin-bottom: 8px;
            }
            .footer-contact {
              margin-bottom: 8px;
            }
            .footer-contact a {
              color: #2563eb;
              text-decoration: none;
            }
            .footer-note {
              font-style: italic;
              color: #999;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <!-- Header -->
            <div class="header">
              <div class="logo-section">
                <div class="logo">AtarWeb</div>
                <div class="quote-meta">
                  <div class="quote-number">Quote #${quoteNumber}</div>
                  <div class="quote-date">${currentDate}</div>
                </div>
              </div>
              <div class="header-title">
                <h1>Professional Web Development Quote</h1>
                <p>Custom Solutions for Your Business Success</p>
              </div>
            </div>
            
                <!-- Service Details -->
                <div class="service-details">
                  <h3>Line Items</h3>
                  <table class="service-table">
                    <thead>
                      <tr>
                        <th>Description</th>
                        <th class="qty">Qty</th>
                        <th class="unit-price">Unit price</th>
                        <th class="amount">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td class="description">${service.name} - Base Service</td>
                        <td class="qty">1</td>
                        <td class="unit-price">$${service.basePrice.toFixed(2)}</td>
                        <td class="amount">$${service.basePrice.toFixed(2)}</td>
                      </tr>
                      ${service.addOns.filter(addon => addon.selected).map(addon => `
                        <tr>
                          <td class="description">+ ${addon.name}</td>
                          <td class="qty">1</td>
                          <td class="unit-price">$${addon.price.toFixed(2)}</td>
                          <td class="amount">$${addon.price.toFixed(2)}</td>
                        </tr>
                      `).join('')}
                      <tr class="total-row">
                        <td class="description">Total</td>
                        <td class="qty"></td>
                        <td class="unit-price"></td>
                        <td class="amount">$${service.totalPrice.toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <!-- Payment Summary -->
                <div class="payment-summary">
                  <div class="payment-amount">
                    <strong>$${service.totalPrice.toFixed(2)} paid on ${currentDate}</strong>
                  </div>
                  <div class="payment-details">
                    <div class="payment-row">
                      <span>Subtotal</span>
                      <span>$${service.totalPrice.toFixed(2)}</span>
                    </div>
                    <div class="payment-row">
                      <span>Total</span>
                      <span>$${service.totalPrice.toFixed(2)}</span>
                    </div>
                    <div class="payment-row total">
                      <span>Amount paid</span>
                      <span>$${service.totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
            
            
            <!-- Footer -->
            <div class="footer">
              <div class="footer-brand">AtarWeb</div>
              <div class="footer-contact">
                <a href="mailto:admin@atarweb.com">admin@atarweb.com</a> | 
                <a href="https://atarweb.com">atarweb.com</a>
              </div>
              <div class="footer-note">
                Thank you for considering AtarWeb for your digital transformation needs.<br>
                We look forward to helping you achieve your business goals.
              </div>
            </div>
          </div>
        </body>
        </html>
      `
      
      // Create a temporary div with the HTML content
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = htmlContent
      tempDiv.style.position = 'absolute'
      tempDiv.style.left = '-9999px'
      tempDiv.style.top = '-9999px'
      document.body.appendChild(tempDiv)
      
      const canvas = await html2canvas(tempDiv, { 
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      })
      
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgWidth = 210 // A4 width in mm
      const pageHeight = 297 // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight
      let position = 0

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      pdf.save(`AtarWeb-Quote-${quoteNumber}.pdf`)
      
      // Clean up the temporary div
      document.body.removeChild(tempDiv)
      
    } catch (error) {
      console.error('Error generating PDF:', error)
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Quote Ready!</h3>
                <p className="text-sm text-gray-500">Your custom quote is prepared</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Success Message */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Thank You for Choosing AtarWeb!</h3>
              <p className="text-gray-600">
                Your custom quote has been prepared. Download it below and schedule a consultation to get started.
              </p>
            </div>

            {/* Quote Summary */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Quote Summary</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">{service.name} - Base Service</span>
                  <span className="text-sm font-medium">${service.basePrice}</span>
                </div>
                {service.addOns.map((addOn, index) => (
                  addOn.selected && (
                    <div key={index} className="flex justify-between">
                      <span className="text-sm text-gray-600">+ {addOn.name}</span>
                      <span className="text-sm font-medium">${addOn.price}</span>
                    </div>
                  )
                ))}
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="font-bold text-blue-600">${service.totalPrice}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={generateQuotePDF}
                disabled={isGeneratingPDF}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                {isGeneratingPDF ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Generating PDF...</span>
                  </>
                ) : (
                  <>
                    <Download className="h-5 w-5" />
                    <span>Download Quote PDF</span>
                  </>
                )}
              </button>
              
              <button
                onClick={onScheduleConsultation}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Calendar className="h-5 w-5" />
                <span>Schedule A Consultation</span>
              </button>
            </div>

            {/* Company Info */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Mail className="h-4 w-4" />
                  <span>admin@atarweb.com</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Globe className="h-4 w-4" />
                  <span>atarweb.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
