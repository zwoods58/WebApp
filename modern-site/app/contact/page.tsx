'use client'

import { useState } from 'react'
import { PageHeader } from '../../src/components/sections/PageHeader'
import { HeroGeometric } from '../../src/components/ui/shape-landing-hero'
import { CTAWithFooter } from '../../src/components/sections/CTAWithFooter'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    product: '',
    country: '',
    partnerId: '',
    message: '',
  })

  const [formSubmitted, setFormSubmitted] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Prepare partnerId as empty string when not provided
    const partnerIdValue = formData.partnerId?.trim() || ""

    // Prepare payload with all fields
    const payload = {
      name: formData.name?.trim() || "",
      email: formData.email?.trim() || "",
      phoneNumber: formData.phoneNumber?.trim() || "",
      product: formData.product || "",
      country: formData.country || "",
      partnerId: partnerIdValue,
      message: formData.message?.trim() || "",
      timestamp: new Date().toISOString(),
    }

    console.log('Submitting form with payload:', payload)

    try {
      // Send data to webhook
      const response = await fetch('https://n8n.srv1075493.hstgr.cloud/webhook/referral-submission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        console.log('Form submitted successfully:', payload)

        // Track Google Ads conversion
        if (typeof window !== 'undefined' && 'gtag' in window) {
          (window as { gtag: (...args: unknown[]) => void }).gtag('event', 'conversion', {
            'send_to': 'AW-CONVERSION_ID/AW-CONVERSION_LABEL',
            'value': 1.0,
            'currency': 'USD',
            'transaction_id': `contact-${Date.now()}`
          })
        }

        setFormSubmitted(true)
        // Reset form after 5 seconds
        setTimeout(() => {
          setFormSubmitted(false)
          setFormData({
            name: '',
            email: '',
            phoneNumber: '',
            product: '',
            country: '',
            partnerId: '',
            message: '',
          })
        }, 5000)
      } else {
        const errorText = await response.text()
        console.error('Failed to submit form:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText,
          payload: payload
        })
        // Still show success to user even if webhook fails
        setFormSubmitted(true)
        setTimeout(() => {
          setFormSubmitted(false)
          setFormData({
            name: '',
            email: '',
            phoneNumber: '',
            product: '',
            country: '',
            partnerId: '',
            message: '',
          })
        }, 5000)
      }
    } catch (error) {
      console.error('Error submitting form:', error, 'Payload was:', payload)
      // Still show success to user even if webhook fails
      setFormSubmitted(true)
      setTimeout(() => {
        setFormSubmitted(false)
        setFormData({
          name: '',
          email: '',
          phoneNumber: '',
          product: '',
          country: '',
          partnerId: '',
          message: '',
        })
      }, 5000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-black relative overflow-hidden" style={{ fontFamily: 'Encode Sans, sans-serif' }}>
      {/* Background Component */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none opacity-50">
        <HeroGeometric />
      </div>

      <PageHeader />
      <div className="pt-24 relative z-10">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-20">
          {/* Header Section */}
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-block mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 border border-gray-300 text-sm text-gray-700 font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Let&apos;s Build Something Amazing
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Encode Sans, sans-serif' }}>
              Get Started
            </h1>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto mb-8" style={{ fontFamily: 'Encode Sans, sans-serif' }}>
              Ready to launch your website? Get in touch with us and let&apos;s bring your vision to life.
            </p>
            <a
              href="#contact-form"
              className="inline-flex items-center gap-2 px-8 py-4 bg-teal-600 border border-teal-700 rounded-xl text-white font-semibold hover:bg-teal-700 transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Start Your Project
            </a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-8">
            {/* Contact Information Card */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 h-full shadow-lg"
                style={{
                  fontFamily: 'Encode Sans, sans-serif',
                }}
              >
                <h2 className="text-xl md:text-2xl font-bold text-black mb-6" style={{ fontFamily: 'Encode Sans, sans-serif' }}>Contact Information</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-black mb-2 text-sm uppercase tracking-wider">Email</h3>
                    <a href="mailto:admin@atarwebb.com" className="text-gray-700 hover:text-black transition-colors text-sm md:text-base flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      admin@atarwebb.com
                    </a>
                  </div>
                  <div>
                    <h3 className="font-semibold text-black mb-2 text-sm uppercase tracking-wider">WhatsApp</h3>
                    <a href="https://wa.me/14693065247" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-black transition-colors text-sm md:text-base flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      +1 (469) 306-5247
                    </a>
                  </div>
                  <div>
                    <h3 className="font-semibold text-black mb-2 text-sm uppercase tracking-wider">Business Hours</h3>
                    <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                      Monday - Friday: 9:00 AM - 6:00 PM<br />
                      Saturday: 10:00 AM - 4:00 PM<br />
                      Sunday: Closed
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-black mb-3 text-sm uppercase tracking-wider">Follow Us</h3>
                    <div className="flex gap-4">
                      <a
                        href="https://www.facebook.com/atarwebb"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-blue-600 transition-all transform hover:scale-110"
                        aria-label="Facebook"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                      </a>
                      <a
                        href="https://www.linkedin.com/company/atarwebb"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-blue-600 transition-all transform hover:scale-110"
                        aria-label="LinkedIn"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      </a>
                      <a
                        href="https://www.tiktok.com/@atarwebb"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-black transition-all transform hover:scale-110"
                        aria-label="TikTok"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form Card */}
            <div id="contact-form" className="lg:col-span-2">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-lg"
                style={{
                  fontFamily: 'Encode Sans, sans-serif',
                }}
              >
                <h2 className="text-xl md:text-2xl font-bold text-black mb-6" style={{ fontFamily: 'Encode Sans, sans-serif' }}>Send Us a Message</h2>

                {formSubmitted ? (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 border border-green-500/30 mb-6">
                      <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-black mb-2">Message Sent!</h3>
                    <p className="text-gray-700">Thank you for contacting us. We&apos;ll get back to you soon.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-black mb-2">
                          Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 bg-white border border-gray-900 rounded-xl text-black placeholder-gray-700 focus:ring-2 focus:ring-gray-500 focus:border-gray-900 focus:outline-none transition-all"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-black mb-2">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 bg-white border border-gray-900 rounded-xl text-black placeholder-gray-700 focus:ring-2 focus:ring-gray-500 focus:border-gray-900 focus:outline-none transition-all"
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-black mb-2">
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          id="phoneNumber"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 bg-white border border-gray-900 rounded-xl text-black placeholder-gray-700 focus:ring-2 focus:ring-gray-500 focus:border-gray-900 focus:outline-none transition-all"
                          placeholder="Enter your phone number"
                        />
                      </div>
                      <div>
                        <label htmlFor="product" className="block text-sm font-medium text-black mb-2">
                          Product Interest <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="product"
                          name="product"
                          value={formData.product}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 bg-white border border-gray-900 rounded-xl text-black focus:ring-2 focus:ring-gray-500 focus:border-gray-900 focus:outline-none transition-all appearance-none cursor-pointer"
                        >
                          <option value="">Select a product</option>
                          <option value="tier-1">Tier 1</option>
                          <option value="tier-2">Tier 2</option>
                          <option value="tier-3">Tier 3</option>
                          <option value="hosting">Hosting</option>
                          <option value="custom">Custom</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-black mb-2">
                        Country <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-white border border-gray-900 rounded-xl text-black focus:ring-2 focus:ring-gray-500 focus:border-gray-900 focus:outline-none transition-all appearance-none cursor-pointer"
                      >
                        <option value="">Select your country</option>
                        <option value="algeria">Algeria</option>
                        <option value="angola">Angola</option>
                        <option value="benin">Benin</option>
                        <option value="botswana">Botswana</option>
                        <option value="burkina-faso">Burkina Faso</option>
                        <option value="burundi">Burundi</option>
                        <option value="cameroon">Cameroon</option>
                        <option value="cape-verde">Cape Verde</option>
                        <option value="chad">Chad</option>
                        <option value="comoros">Comoros</option>
                        <option value="cote-divoire">Cote d&apos;Ivoire</option>
                        <option value="democratic-republic-of-the-congo">Democratic Republic of the Congo</option>
                        <option value="djibouti">Djibouti</option>
                        <option value="egypt">Egypt</option>
                        <option value="eritrea">Eritrea</option>
                        <option value="ethiopia">Ethiopia</option>
                        <option value="gabon-republic">Gabon Republic</option>
                        <option value="gambia">Gambia</option>
                        <option value="guinea">Guinea</option>
                        <option value="guinea-bissau">Guinea-Bissau</option>
                        <option value="kenya">Kenya</option>
                        <option value="lesotho">Lesotho</option>
                        <option value="madagascar">Madagascar</option>
                        <option value="malawi">Malawi</option>
                        <option value="mali">Mali</option>
                        <option value="mauritania">Mauritania</option>
                        <option value="mauritius">Mauritius</option>
                        <option value="morocco">Morocco</option>
                        <option value="mozambique">Mozambique</option>
                        <option value="namibia">Namibia</option>
                        <option value="niger">Niger</option>
                        <option value="nigeria">Nigeria</option>
                        <option value="republic-of-the-congo">Republic of the Congo</option>
                        <option value="rwanda">Rwanda</option>
                        <option value="saint-helena">Saint Helena</option>
                        <option value="sao-tome-and-principe">Sao Tome and Principe</option>
                        <option value="senegal">Senegal</option>
                        <option value="seychelles">Seychelles</option>
                        <option value="sierra-leone">Sierra Leone</option>
                        <option value="somalia">Somalia</option>
                        <option value="south-africa">South Africa</option>
                        <option value="swaziland">Swaziland</option>
                        <option value="tanzania">Tanzania</option>
                        <option value="togo">Togo</option>
                        <option value="tunisia">Tunisia</option>
                        <option value="uganda">Uganda</option>
                        <option value="zambia">Zambia</option>
                        <option value="zimbabwe">Zimbabwe</option>
                        <option value="united-states">United States</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="partnerId" className="block text-sm font-medium text-black mb-2">
                        Partner ID <span className="text-gray-500 text-xs font-normal">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        id="partnerId"
                        name="partnerId"
                        value={formData.partnerId}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white border border-gray-900 rounded-xl text-black placeholder-gray-700 focus:ring-2 focus:ring-gray-500 focus:border-gray-900 focus:outline-none transition-all"
                        placeholder="Enter your partner ID if applicable"
                      />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-black mb-2">
                        Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-white border border-gray-900 rounded-xl text-black placeholder-gray-700 focus:ring-2 focus:ring-gray-500 focus:border-gray-900 focus:outline-none transition-all resize-none"
                        placeholder="Tell us about your project..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full mt-6 px-8 py-4 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        Send Message
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* CEO Section */}
          <div className="max-w-6xl mx-auto px-4 md:px-8 pb-12 md:pb-20">
            <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-8 md:p-12 shadow-lg">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white text-5xl md:text-6xl font-bold shadow-xl">
                    DW
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <div className="inline-block mb-3">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 border border-teal-300 text-xs text-teal-700 font-semibold uppercase tracking-wider">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Chief Executive Officer
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Encode Sans, sans-serif' }}>
                    Daevon Wesley Woods
                  </h2>
                  <div className="space-y-4 text-gray-700 leading-relaxed">
                    <p className="text-base md:text-lg">
                      At <span className="font-semibold text-teal-600">AtarWebb</span>, we believe that innovation and technology are the catalysts for transformative change. Our mission is to empower businesses across Africa and beyond with cutting-edge digital solutions that drive growth, efficiency, and success in an ever-evolving digital landscape.
                    </p>
                    <p className="text-base md:text-lg">
                      I envision a future where technology bridges gaps, creates opportunities, and unlocks potential for every business—regardless of size or industry. Through our commitment to excellence, creativity, and client-centric solutions, we&apos;re not just building websites; we&apos;re crafting digital experiences that inspire and deliver measurable results.
                    </p>
                    <div className="pt-4 flex flex-col sm:flex-row gap-4 items-center md:items-start justify-center md:justify-start">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium">Innovation-Driven</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span className="font-medium">Technology-Focused</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="font-medium">Client-Centric</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CTAWithFooter />
    </div>
  )
}

