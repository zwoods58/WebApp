'use client'

import { useState } from 'react'
import { PageHeader } from '../../src/components/sections/PageHeader'
import { SparklesCore } from '../../src/components/ui/sparkles'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { CTAWithFooter } from '../../src/components/sections/CTAWithFooter'

interface FormErrors {
  fullName?: string
  email?: string
  phoneNumber?: string
  country?: string
  consent?: string
}

// Scroll animation wrapper component
function ScrollAnimation({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}


export default function PartnerProgram() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    country: '',
    consent: false,
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [formSubmitted, setFormSubmitted] = useState(false)

  const validateField = (name: string, value: string | boolean): string | undefined => {
    switch (name) {
      case 'fullName':
        if (!value || (typeof value === 'string' && value.trim().length === 0)) {
          return 'Full name is required'
        }
        if (typeof value === 'string' && value.trim().length < 2) {
          return 'Full name must be at least 2 characters'
        }
        break
      case 'email':
        if (!value || (typeof value === 'string' && value.trim().length === 0)) {
          return 'Email is required'
        }
        if (typeof value === 'string') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          if (!emailRegex.test(value.trim())) {
            return 'Please enter a valid email address'
          }
        }
        break
      case 'phoneNumber':
        if (!value || (typeof value === 'string' && value.trim().length === 0)) {
          return 'Phone number is required'
        }
        if (typeof value === 'string') {
          const phoneRegex = /^[\d\s\-\+\(\)]+$/
          if (!phoneRegex.test(value.trim()) || value.trim().length < 10) {
            return 'Please enter a valid phone number'
          }
        }
        break
      case 'country':
        if (!value || (typeof value === 'string' && value.trim().length === 0)) {
          return 'Country selection is required'
        }
        break
      case 'consent':
        if (!value) {
          return 'You must agree to the terms and conditions to submit'
        }
        break
    }
    return undefined
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const fieldValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    
    setFormData((prev) => ({
      ...prev,
      [name]: fieldValue,
    }))

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name as keyof FormErrors]
        return newErrors
      })
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const fieldValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    
    setTouched((prev) => ({ ...prev, [name]: true }))
    
    const error = validateField(name, fieldValue)
    if (error) {
      setErrors((prev) => ({ ...prev, [name]: error }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    
    Object.keys(formData).forEach((key) => {
      const value = formData[key as keyof typeof formData]
      const error = validateField(key, value)
      if (error) {
        newErrors[key as keyof FormErrors] = error
      }
    })

    setErrors(newErrors)
    setTouched({
      fullName: true,
      email: true,
      phoneNumber: true,
      country: true,
      consent: true,
    })

    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      try {
        // Send data to webhook
        const response = await fetch('https://n8n.srv1075493.hstgr.cloud/webhook/partner-referral', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fullName: formData.fullName,
            email: formData.email,
            phoneNumber: formData.phoneNumber,
            country: formData.country,
            consent: formData.consent,
            timestamp: new Date().toISOString(),
          }),
        })

        if (response.ok) {
          console.log('Form submitted successfully:', formData)
          setFormSubmitted(true)
          setErrors({})
        } else {
          console.error('Failed to submit form:', response.statusText)
          // Still show success to user even if webhook fails
          setFormSubmitted(true)
          setErrors({})
        }
      } catch (error) {
        console.error('Error submitting form:', error)
        // Still show success to user even if webhook fails
        setFormSubmitted(true)
        setErrors({})
      }
    } else {
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0]
      if (firstErrorField) {
        const element = document.getElementById(firstErrorField)
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        element?.focus()
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-black relative overflow-hidden" style={{ fontFamily: 'Encode Sans, sans-serif' }}>
      {/* Sparkles Background */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none opacity-40">
        <SparklesCore
          id="partner-program-sparkles"
          background="transparent"
          minSize={0.8}
          maxSize={2}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#000000"
          speed={1}
        />
      </div>
      
      <PageHeader />
      <div className="pt-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
            {/* Hero Section */}
            <ScrollAnimation>
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-black mb-4" style={{ fontFamily: 'Encode Sans, sans-serif' }}>
            Partner Program
          </h1>
                <p className="text-lg text-black max-w-2xl mx-auto" style={{ fontFamily: 'Encode Sans, sans-serif' }}>
            Join our partner program and earn commissions by referring clients to AtarWebb.
          </p>
              </div>
            </ScrollAnimation>

          {/* Four Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {/* Grid Item 1 - Program Overview */}
            <ScrollAnimation delay={0.1}>
            <div className="bg-white border border-gray-200 rounded-lg p-6 h-full transition-all duration-300 hover:scale-105 hover:z-10 shadow-lg"
              style={{
                fontFamily: 'Encode Sans, sans-serif',
              }}
            >
                <h2 className="text-xl font-bold text-black mb-4" style={{ fontFamily: 'Encode Sans, sans-serif' }}>
                  Program Overview
                </h2>
                <div className="space-y-3 text-black text-sm">
                  <p>
              AtarWebb invites individuals or businesses to join our Referral & Partnership Program. 
                    Partners help refer clients to AtarWebb&apos;s services and earn <strong className="text-black">20% commission</strong> for every successful referral.
                  </p>
                  <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded">
                    <p className="font-semibold text-amber-900 mb-1 text-xs">Important Notice</p>
                    <p className="text-amber-900 text-xs">
                      The information you provide must exactly match your PayPal account (name, email, and country).
              </p>
            </div>
                  <p>
                    Partners can receive revenue from all three tier websites (Tier 1, Tier 2, and Tier 3) featured on our Products page.
                  </p>
                  <div className="bg-gray-100 border border-gray-300 rounded p-3">
                    <p className="text-xs text-black">
                      <strong>Before applying:</strong> Please review{' '}
              <a 
                href="https://www.paypal.com/us/webapps/mpp/country-worldwide?locale.x=en_US" 
                target="_blank"
                rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline"
              >
                the PayPal supported countries list
              </a>
            </p>
          </div>
              </div>
            </div>
            </ScrollAnimation>

            {/* Grid Item 2 - How It Works */}
            <ScrollAnimation delay={0.2}>
            <div className="bg-white border border-gray-200 rounded-lg p-6 h-full transition-all duration-300 hover:scale-105 hover:z-10 shadow-lg"
              style={{
                fontFamily: 'Encode Sans, sans-serif',
              }}
            >
                <h2 className="text-xl font-bold text-black mb-4" style={{ fontFamily: 'Encode Sans, sans-serif' }}>
                  How It Works
                </h2>
                <ol className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center font-bold text-xs">1</span>
                <div>
                      <h3 className="font-semibold text-black mb-1 text-sm">Sign Up</h3>
                      <p className="text-black text-xs">Sign up using information identical to your PayPal account.</p>
                </div>
              </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center font-bold text-xs">2</span>
                <div>
                      <h3 className="font-semibold text-black mb-1 text-sm">Referral</h3>
                      <p className="text-black text-xs">Refer clients using your unique referral link or code.</p>
                </div>
              </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center font-bold text-xs">3</span>
                <div>
                      <h3 className="font-semibold text-black mb-1 text-sm">Tracking</h3>
                      <p className="text-black text-xs">Receive email notifications at key stages of the referral process.</p>
                </div>
              </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center font-bold text-xs">4</span>
                <div>
                      <h3 className="font-semibold text-black mb-1 text-sm">Payment</h3>
                      <p className="text-black text-xs">Receive 20% commission via PayPal within 48 hours after full payment.</p>
                </div>
              </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center font-bold text-xs">5</span>
                <div>
                      <h3 className="font-semibold text-black mb-1 text-sm">Refunds</h3>
                      <p className="text-black text-xs">No commission paid if client requests a refund.</p>
                </div>
              </li>
            </ol>
          </div>
            </ScrollAnimation>

            {/* Grid Item 3 - Partner Benefits */}
            <ScrollAnimation delay={0.3}>
            <div className="bg-white border border-gray-200 rounded-lg p-6 h-full transition-all duration-300 hover:scale-105 hover:z-10 shadow-lg"
              style={{
                fontFamily: 'Encode Sans, sans-serif',
              }}
            >
                <h2 className="text-xl font-bold text-black mb-4" style={{ fontFamily: 'Encode Sans, sans-serif' }}>
                  Partner Benefits
                </h2>
                <ul className="space-y-3 text-black text-sm">
                  <li>
                    <strong className="text-black">20% Commission:</strong> Earn on every successfully referred client across all tiers.
                </li>
                  <li>
                    <strong className="text-black">Marketing Materials:</strong> Access to live demos, ads, and promotional content.
                </li>
                  <li>
                    <strong className="text-black">Email Updates:</strong> Notified at every step of your referral&apos;s journey.
                </li>
                  <li>
                    <strong className="text-black">Fast Payouts:</strong> Payments processed via PayPal within 48 hours.
                </li>
              </ul>
            </div>
            </ScrollAnimation>

            {/* Grid Item 4 - Partner Responsibilities */}
            <ScrollAnimation delay={0.4}>
            <div className="bg-white border border-gray-200 rounded-lg p-6 h-full transition-all duration-300 hover:scale-105 hover:z-10 shadow-lg"
              style={{
                fontFamily: 'Encode Sans, sans-serif',
              }}
            >
                <h2 className="text-xl font-bold text-black mb-4" style={{ fontFamily: 'Encode Sans, sans-serif' }}>
                  Partner Responsibilities
                </h2>
                <ul className="space-y-2 text-black text-sm">
                  <li>• Provide accurate information matching your PayPal account</li>
                  <li>• Act professionally and ethically when promoting AtarWebb</li>
                  <li>• Use only approved marketing materials</li>
                  <li>• Refrain from activities that violate the agreement</li>
                  <li>• Ensure all referrals are legitimate and have consent</li>
              </ul>
            </div>
            </ScrollAnimation>
          </div>

          {/* PayPal Setup - Full Width */}
          <ScrollAnimation delay={0.2}>
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-12 transition-all duration-300 hover:scale-[1.02] hover:z-10 shadow-lg"
            style={{
              fontFamily: 'Encode Sans, sans-serif',
            }}
          >
              <h2 className="text-xl font-bold text-black mb-4" style={{ fontFamily: 'Encode Sans, sans-serif' }}>
                PayPal Setup Instructions
              </h2>
              <p className="text-black text-sm mb-4">
                To receive commission payments, partners must have a verified PayPal account linked to a bank account.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center font-bold text-xs">1</span>
                    <h3 className="font-semibold text-black text-sm">Create Account</h3>
                  </div>
                  <p className="text-black text-xs ml-8">Visit PayPal.com, sign up, and choose Personal Account.</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center font-bold text-xs">2</span>
                    <h3 className="font-semibold text-black text-sm">Verify Email</h3>
                  </div>
                  <p className="text-black text-xs ml-8">Check your inbox and click the verification link.</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center font-bold text-xs">3</span>
                    <h3 className="font-semibold text-black text-sm">Link Bank</h3>
                  </div>
                  <p className="text-black text-xs ml-8">Go to Wallet → Link a bank account and enter your details.</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center font-bold text-xs">4</span>
                    <h3 className="font-semibold text-black text-sm">Verify Identity</h3>
                  </div>
                  <p className="text-black text-xs ml-8">Follow on-screen instructions if requested.</p>
                </div>
              </div>
              <div className="bg-gray-100 border border-gray-300 rounded p-4 mt-4">
                <p className="text-sm text-black">
                  <strong>Important Note:</strong> Ensure that the name and email on your PayPal account match your AtarWebb partnership account to avoid delays.
              </p>
            </div>
          </div>
          </ScrollAnimation>

          {/* Application Form - Full Width at Bottom */}
          <ScrollAnimation delay={0.3}>
          <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-lg"
            style={{ 
              fontFamily: 'Encode Sans, sans-serif',
            }}
          >
            <h2 className="text-2xl font-bold text-black mb-6" style={{ fontFamily: 'Encode Sans, sans-serif' }}>
              Application Form
            </h2>
            
            {formSubmitted ? (
              <div className="text-center py-8">
                    <div className="text-green-400 text-4xl mb-4">✓</div>
                    <h3 className="text-xl font-bold text-black mb-2">Application Submitted!</h3>
                    <p className="text-black text-sm">Thank you for your interest. We&apos;ll be in touch soon.</p>
              </div>
            ) : (
                  <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-black mb-2">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3 bg-white border rounded-lg text-black placeholder-gray-700 focus:ring-2 focus:ring-gray-500 focus:border-transparent ${
                      touched.fullName && errors.fullName
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-900'
                    }`}
                    placeholder="Enter your full name (must match PayPal account)"
                    aria-invalid={touched.fullName && errors.fullName ? 'true' : 'false'}
                    aria-describedby={touched.fullName && errors.fullName ? 'fullName-error' : undefined}
                  />
                  {touched.fullName && errors.fullName && (
                      <p id="fullName-error" className="mt-1 text-sm text-red-400" role="alert">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-black mb-2">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3 bg-white border rounded-lg text-black placeholder-gray-700 focus:ring-2 focus:ring-gray-500 focus:border-transparent ${
                      touched.email && errors.email
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-900'
                    }`}
                    placeholder="Enter your email (must match PayPal account)"
                    aria-invalid={touched.email && errors.email ? 'true' : 'false'}
                    aria-describedby={touched.email && errors.email ? 'email-error' : undefined}
                  />
                  {touched.email && errors.email && (
                    <p id="email-error" className="mt-1 text-sm text-red-400" role="alert">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-black mb-2">
                    Phone Number <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3 bg-white border rounded-lg text-black placeholder-gray-700 focus:ring-2 focus:ring-gray-500 focus:border-transparent ${
                      touched.phoneNumber && errors.phoneNumber
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-900'
                    }`}
                    placeholder="Enter your phone number"
                    aria-invalid={touched.phoneNumber && errors.phoneNumber ? 'true' : 'false'}
                    aria-describedby={touched.phoneNumber && errors.phoneNumber ? 'phoneNumber-error' : undefined}
                  />
                  {touched.phoneNumber && errors.phoneNumber && (
                    <p id="phoneNumber-error" className="mt-1 text-sm text-red-400" role="alert">
                      {errors.phoneNumber}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-black mb-2">
                    Country <span className="text-red-400">*</span>
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3 bg-white border rounded-lg text-black focus:ring-2 focus:ring-gray-500 focus:border-transparent ${
                      touched.country && errors.country
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-900'
                    }`}
                    style={{ color: '#000000' }}
                    aria-invalid={touched.country && errors.country ? 'true' : 'false'}
                    aria-describedby={touched.country && errors.country ? 'country-error' : undefined}
                  >
                    <option value="" style={{ backgroundColor: '#ffffff', color: '#000000' }}>Select your country</option>
                    <option value="algeria" style={{ backgroundColor: '#ffffff', color: '#000000' }}>Algeria</option>
                    <option value="angola" style={{ backgroundColor: '#ffffff', color: '#000000' }}>Angola</option>
                    <option value="benin" style={{ backgroundColor: '#ffffff', color: '#000000' }}>Benin</option>
                    <option value="botswana" style={{ backgroundColor: '#ffffff', color: '#000000' }}>Botswana</option>
                    <option value="burkina-faso" style={{ backgroundColor: '#ffffff', color: '#000000' }}>Burkina Faso</option>
                    <option value="burundi" style={{ backgroundColor: '#ffffff', color: '#000000' }}>Burundi</option>
                    <option value="cameroon" style={{ backgroundColor: '#ffffff', color: '#000000' }}>Cameroon</option>
                    <option value="cape-verde" style={{ backgroundColor: '#ffffff', color: '#000000' }}>Cape Verde</option>
                    <option value="chad" style={{ backgroundColor: '#ffffff', color: '#000000' }}>Chad</option>
                    <option value="comoros" style={{ backgroundColor: '#ffffff', color: '#000000' }}>Comoros</option>
                    <option value="cote-divoire" style={{ backgroundColor: '#ffffff', color: '#000000' }}>Cote d&apos;Ivoire</option>
                    <option value="democratic-republic-of-the-congo" style={{ backgroundColor: '#ffffff', color: '#000000' }}>Democratic Republic of the Congo</option>
                    <option value="djibouti" style={{ backgroundColor: '#ffffff', color: '#000000' }}>Djibouti</option>
                    <option value="egypt" style={{ backgroundColor: '#ffffff', color: '#000000' }}>Egypt</option>
                    <option value="eritrea" style={{ backgroundColor: '#ffffff', color: '#000000' }}>Eritrea</option>
                    <option value="ethiopia" style={{ backgroundColor: '#ffffff', color: '#000000' }}>Ethiopia</option>
                    <option value="gabon-republic" style={{ backgroundColor: '#ffffff', color: '#000000' }}>Gabon Republic</option>
                    <option value="gambia" style={{ backgroundColor: '#ffffff', color: '#000000' }}>Gambia</option>
                    <option value="guinea" style={{ backgroundColor: '#ffffff', color: '#000000' }}>Guinea</option>
                    <option value="guinea-bissau" style={{ backgroundColor: '#ffffff', color: '#000000' }}>Guinea-Bissau</option>
                    <option value="kenya" style={{ backgroundColor: '#ffffff', color: '#000000' }}>Kenya</option>
                    <option value="lesotho" style={{ backgroundColor: '#ffffff', color: '#000000' }}>Lesotho</option>
                    <option value="madagascar" style={{ backgroundColor: '#ffffff', color: '#000000' }}>Madagascar</option>
                    <option value="malawi" style={{ backgroundColor: '#ffffff', color: '#000000' }}>Malawi</option>
                    <option value="mali" style={{ backgroundColor: '#ffffff', color: '#000000' }}>Mali</option>
                    <option value="mauritania" style={{ backgroundColor: '#ffffff', color: '#000000' }}>Mauritania</option>
                    <option value="mauritius" style={{ backgroundColor: '#ffffff', color: '#000000' }}>Mauritius</option>
                    <option value="morocco" style={{ backgroundColor: '#ffffff', color: '#000000' }}>Morocco</option>
                    <option value="mozambique" style={{ backgroundColor: '#ffffff', color: '#000000' }}>Mozambique</option>
                    <option value="namibia" style={{ backgroundColor: '#ffffff', color: '#000000' }}>Namibia</option>
                    <option value="niger" style={{ backgroundColor: '#ffffff', color: '#000000' }}>Niger</option>
                    <option value="nigeria" style={{ backgroundColor: '#ffffff', color: '#000000' }}>Nigeria</option>
                    <option value="republic-of-the-congo" style={{ backgroundColor: '#ffffff', color: '#000000' }}>Republic of the Congo</option>
                    <option value="rwanda" style={{ backgroundColor: '#ffffff', color: '#000000' }}>Rwanda</option>
                    <option value="saint-helena" style={{ backgroundColor: '#ffffff', color: '#000000' }}>Saint Helena</option>
                    <option value="sao-tome-and-principe" style={{ backgroundColor: '#ffffff', color: '#000000' }}>Sao Tome and Principe</option>
                    <option value="senegal" style={{ backgroundColor: '#ffffff', color: '#000000' }}>Senegal</option>
                    <option value="seychelles" style={{ backgroundColor: '#ffffff', color: '#000000' }}>Seychelles</option>
                    <option value="sierra-leone" style={{ backgroundColor: '#ffffff', color: '#000000' }}>Sierra Leone</option>
                    <option value="somalia" style={{ backgroundColor: '#ffffff', color: '#000000' }}>Somalia</option>
                    <option value="south-africa" style={{ backgroundColor: '#ffffff', color: '#000000' }}>South Africa</option>
                    <option value="swaziland" style={{ backgroundColor: '#ffffff', color: '#000000' }}>Swaziland</option>
                    <option value="tanzania" style={{ backgroundColor: '#ffffff', color: '#000000' }}>Tanzania</option>
                    <option value="togo" style={{ backgroundColor: '#ffffff', color: '#000000' }}>Togo</option>
                    <option value="tunisia" style={{ backgroundColor: '#ffffff', color: '#000000' }}>Tunisia</option>
                    <option value="uganda" style={{ backgroundColor: '#ffffff', color: '#000000' }}>Uganda</option>
                    <option value="zambia" style={{ backgroundColor: '#ffffff', color: '#000000' }}>Zambia</option>
                    <option value="zimbabwe" style={{ backgroundColor: '#ffffff', color: '#000000' }}>Zimbabwe</option>
                    <option value="united-states" style={{ backgroundColor: '#ffffff', color: '#000000' }}>United States</option>
                  </select>
                  {touched.country && errors.country && (
                    <p id="country-error" className="mt-1 text-sm text-red-400" role="alert">
                      {errors.country}
                    </p>
                  )}
                </div>

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="consent"
                    name="consent"
                    checked={formData.consent}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`mt-1 mr-3 h-5 w-5 text-black focus:ring-gray-500 border-gray-900 bg-white rounded ${
                      touched.consent && errors.consent ? 'border-red-500' : ''
                    }`}
                    aria-invalid={touched.consent && errors.consent ? 'true' : 'false'}
                    aria-describedby={touched.consent && errors.consent ? 'consent-error' : undefined}
                  />
                  <div className="flex-1">
                    <label htmlFor="consent" className="text-sm text-black">
                      <span className="text-red-500">*</span> By checking this box and submitting this form, you agree to our{' '}
                      <a
                        href="/partner-program/terms"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline font-medium"
                      >
                        Partner Program Terms and Conditions
                      </a>
                      . I also confirm that the information provided matches my PayPal account details.
                    </label>
                    {touched.consent && errors.consent && (
                      <p id="consent-error" className="mt-1 text-sm text-red-400" role="alert">
                        {errors.consent}
                      </p>
                    )}
                  </div>
                </div>

                {Object.keys(errors).length > 0 && (
                  <div className="bg-red-900/30 border border-red-500 rounded-lg p-4 mb-6">
                    <p className="text-sm text-red-300 font-semibold mb-1">Please fix the following errors:</p>
                    <ul className="list-disc list-inside text-sm text-red-400 space-y-1">
                      {Object.values(errors).map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="pt-6 pb-4">
                  <button
                    type="submit"
                    className="w-full px-8 py-4 bg-teal-600 text-white text-lg font-bold rounded-lg hover:bg-teal-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                    style={{ 
                      color: '#ffffff', 
                      fontWeight: '700',
                      backgroundColor: '#0d9488',
                      border: '2px solid #0d9488',
                      zIndex: 10,
                      position: 'relative'
                    }}
                  >
                    Submit Application
                  </button>
                </div>
              </form>
            )}
          </div>
          </ScrollAnimation>
        </div>
      </div>
      <CTAWithFooter />
    </div>
  )
}
