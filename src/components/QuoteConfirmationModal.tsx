'use client'

import { useState, useEffect } from 'react'
import { X, Download, Calendar, CheckCircle, FileText, Mail, Globe, Phone, Palette, Database, Monitor, Zap, Workflow } from 'lucide-react'
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
  additionalServices?: Array<{
    id: string
    name: string
    price: number
    description: string
    category: string
    type: string
    icon: string
  }>
  comboDeals?: Array<{
    id: string
    name: string
    description: string
    price: number
    savings: number
    badge: string
    services: string[]
    features: string[]
  }>
  currency?: 'USD' | 'KSH' | 'ZAR'
}

export default function QuoteConfirmationModal({ 
  isOpen, 
  onClose, 
  onScheduleConsultation, 
  service,
  additionalServices = [],
  comboDeals = [],
  currency = 'USD'
}: QuoteConfirmationModalProps) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [selectedAddOns, setSelectedAddOns] = useState(service.addOns)
  const [selectedAdditionalServices, setSelectedAdditionalServices] = useState<Set<string>>(new Set())
  const [showAddMoreServices, setShowAddMoreServices] = useState(false)

  // Reset add-ons when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedAddOns(service.addOns.map(addon => ({ ...addon, selected: false })))
    }
  }, [isOpen, service.addOns])

  const toggleAddOn = (index: number) => {
    setSelectedAddOns(prev => 
      prev.map((addon, i) => 
        i === index ? { ...addon, selected: !addon.selected } : addon
      )
    )
  }

  const toggleAdditionalService = (serviceId: string) => {
    setSelectedAdditionalServices(prev => {
      const newSet = new Set(prev)
      if (newSet.has(serviceId)) {
        newSet.delete(serviceId)
      } else {
        newSet.add(serviceId)
      }
      return newSet
    })
  }

  const calculateTotal = () => {
    let total = service.basePrice + selectedAddOns
      .filter(addon => addon.selected)
      .reduce((sum, addon) => sum + addon.price, 0)
    
    // Add selected additional services
    additionalServices.forEach(service => {
      if (selectedAdditionalServices.has(service.id)) {
        total += service.price
      }
    })
    
    return total
  }

  // Currency conversion (approximate rates)
  const convertPrice = (usdPrice: number) => {
    if (currency === 'KSH') {
      return Math.round(usdPrice * 130) // Approximate USD to KSH rate
    }
    if (currency === 'ZAR') {
      return Math.round(usdPrice * 18) // Approximate USD to ZAR rate
    }
    return usdPrice
  }

  const getCurrencySymbol = () => {
    if (currency === 'KSH') return 'KSh'
    if (currency === 'ZAR') return 'R'
    return '$'
  }

  const generateQuotePDF = async () => {
    setIsGeneratingPDF(true)
    
    try {
      const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
      
      const quoteNumber = `ATW-${Date.now().toString().slice(-6)}`
      
      // Create professional HTML content with new invoice template
      const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Quote Invoice</title>
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
                    align-items: center; 
                    margin-bottom: 40px;
                    padding-bottom: 30px;
                    border-bottom: 2px solid rgba(100, 200, 255, 0.3);
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
                    margin-left: -20px;
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
                    <div class="logo">
                        <img src="/Favicon_clear.png" alt="AtarWebb Logo">
                    </div>
                    
                    <div class="invoice-meta">
                        <div class="invoice-meta-row">
                            <span class="invoice-meta-label">QUOTE #:</span>
                            <span>${quoteNumber}</span>
                        </div>
                        <div class="invoice-meta-row">
                            <span class="invoice-meta-label">DATE:</span>
                            <span>${currentDate}</span>
                        </div>
                        <div class="invoice-meta-row">
                            <span class="invoice-meta-label">VALID UNTIL:</span>
                            <span>${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            
                <div class="bill-to">
                    <h3>QUOTE FOR:</h3>
                    <p>Potential Client</p>
                    <p>Web Development Services</p>
                    <p>Professional Quote</p>
                </div>
                
                <table class="invoice-table">
                    <thead>
                      <tr>
                            <th>DESCRIPTION</th>
                            <th>QTY</th>
                            <th>UNIT PRICE (${getCurrencySymbol()})</th>
                            <th>TOTAL (${getCurrencySymbol()})</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                            <td>${service.name} - Base Service</td>
                            <td>1</td>
                            <td>${getCurrencySymbol()}${convertPrice(service.basePrice).toLocaleString()}</td>
                            <td>${getCurrencySymbol()}${convertPrice(service.basePrice).toLocaleString()}</td>
                      </tr>
                      ${selectedAddOns.filter(addon => addon.selected).map(addon => `
                        <tr>
                                <td>+ ${addon.name}</td>
                                <td>1</td>
                                <td>${getCurrencySymbol()}${convertPrice(addon.price).toLocaleString()}</td>
                                <td>${getCurrencySymbol()}${convertPrice(addon.price).toLocaleString()}</td>
                            </tr>
                        `).join('')}
                      ${additionalServices.filter(service => selectedAdditionalServices.has(service.id)).map(service => `
                        <tr>
                                <td>+ ${service.name} (${service.type})</td>
                                <td>1</td>
                                <td>${getCurrencySymbol()}${convertPrice(service.price).toLocaleString()}</td>
                                <td>${getCurrencySymbol()}${convertPrice(service.price).toLocaleString()}</td>
                            </tr>
                        `).join('')}
                        <tr class="subtotal-row">
                            <td colspan="3">SUBTOTAL</td>
                            <td>${getCurrencySymbol()}${convertPrice(calculateTotal()).toLocaleString()}</td>
                        </tr>
                        <tr class="tax-row">
                            <td colspan="3">TAX (0%)</td>
                            <td>${getCurrencySymbol()}0</td>
                        </tr>
                      <tr class="total-row">
                            <td colspan="3">TOTAL QUOTE</td>
                            <td class="total-amount">${getCurrencySymbol()}${convertPrice(calculateTotal()).toLocaleString()}</td>
                      </tr>
                    </tbody>
                  </table>
                
                <div class="company-footer">
                    <div class="company-name">AtarWebb</div>
                    <p>Email: admin@atarwebb.com</p>
                    <p>Website: www.atarwebb.com</p>
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

      pdf.save(`AtarWebb-Quote-${quoteNumber}.pdf`)
      
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
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Thank You for Choosing AtarWebb!</h3>
              <p className="text-gray-600">
                Your custom quote has been prepared. Download it below and schedule a consultation to get started.
              </p>
            </div>

            {/* Service Selection */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Customize Your Package</h4>
              
              {/* Base Service */}
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-900">{service.name} - Base Service</span>
                <span className="text-sm font-bold text-gray-900">{getCurrencySymbol()}{convertPrice(service.basePrice).toLocaleString()}</span>
              </div>

              {/* Add-ons */}
              <div className="mt-3">
                <h5 className="text-sm font-medium text-gray-700 mb-2">Available Add-ons (Optional)</h5>
                <div className="space-y-2">
                  {selectedAddOns.map((addOn, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={addOn.selected}
                          onChange={() => toggleAddOn(index)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{addOn.name}</span>
                      </label>
                      <span className="text-sm font-medium text-gray-900">{getCurrencySymbol()}{convertPrice(addOn.price).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add More Services Section */}
              {additionalServices.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="text-sm font-medium text-gray-700">Add More Services</h5>
                    <button
                      onClick={() => setShowAddMoreServices(!showAddMoreServices)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      {showAddMoreServices ? 'Hide' : 'Show'} Services
                    </button>
                  </div>
                  
                  {showAddMoreServices && (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {additionalServices.map((service) => (
                        <div key={service.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                              {service.icon === 'Palette' && <Palette className="h-4 w-4 text-blue-600" />}
                              {service.icon === 'Globe' && <Globe className="h-4 w-4 text-green-600" />}
                              {service.icon === 'Database' && <Database className="h-4 w-4 text-purple-600" />}
                              {service.icon === 'Mail' && <Mail className="h-4 w-4 text-red-600" />}
                              {service.icon === 'FileText' && <FileText className="h-4 w-4 text-yellow-600" />}
                              {service.icon === 'Monitor' && <Monitor className="h-4 w-4 text-indigo-600" />}
                              {service.icon === 'Zap' && <Zap className="h-4 w-4 text-orange-600" />}
                              {service.icon === 'Workflow' && <Workflow className="h-4 w-4 text-pink-600" />}
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-700">{service.name}</span>
                              <span className="text-xs text-gray-500 ml-2">({service.type})</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-900">{getCurrencySymbol()}{convertPrice(service.price).toLocaleString()}</span>
                            <button
                              onClick={() => toggleAdditionalService(service.id)}
                              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                                selectedAdditionalServices.has(service.id)
                                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                              }`}
                            >
                              {selectedAdditionalServices.has(service.id) ? 'Remove' : 'Add'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Selected Additional Services */}
              {selectedAdditionalServices.size > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h5 className="text-sm font-medium text-gray-700 mb-3">Selected Additional Services</h5>
                  <div className="space-y-2">
                    {additionalServices
                      .filter(service => selectedAdditionalServices.has(service.id))
                      .map((service, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                              {service.icon === 'Palette' && <Palette className="h-4 w-4 text-blue-600" />}
                              {service.icon === 'Globe' && <Globe className="h-4 w-4 text-green-600" />}
                              {service.icon === 'Database' && <Database className="h-4 w-4 text-purple-600" />}
                              {service.icon === 'Mail' && <Mail className="h-4 w-4 text-red-600" />}
                              {service.icon === 'FileText' && <FileText className="h-4 w-4 text-yellow-600" />}
                              {service.icon === 'Monitor' && <Monitor className="h-4 w-4 text-indigo-600" />}
                              {service.icon === 'Zap' && <Zap className="h-4 w-4 text-orange-600" />}
                              {service.icon === 'Workflow' && <Workflow className="h-4 w-4 text-pink-600" />}
                            </div>
                            <span className="text-sm text-gray-700">{service.name}</span>
                            <span className="text-xs text-gray-500">({service.type})</span>
                          </div>
                          <span className="text-sm font-medium text-gray-900">{getCurrencySymbol()}{convertPrice(service.price).toLocaleString()}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Total */}
              <div className="border-t border-gray-200 pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-bold text-blue-600 text-lg">{getCurrencySymbol()}{convertPrice(calculateTotal()).toLocaleString()}</span>
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
                  <span>admin@atarwebb.com</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Globe className="h-4 w-4" />
                  <span>atarwebb.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
