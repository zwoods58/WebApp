import { NextResponse } from 'next/server'
const { addConsultation } = require('../../../../lib/consultations-storage')

export async function POST(req) {
  try {
    const { count = 5 } = await req.json()

    const testConsultations = [
      {
        name: 'John Smith',
        email: 'john@example.com',
        phone: '555-0101',
        company: 'Tech Startup Inc',
        projectDetails: 'E-commerce website with payment integration',
        preferredDate: '2024-02-01',
        preferredTime: '10:00',
        hasFileUpload: false,
        totalAmount: 1200,
        depositAmount: 600,
        remainingAmount: 600,
        paymentStatus: 'pending'
      },
      {
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        phone: '555-0102',
        company: 'Local Restaurant',
        projectDetails: 'Restaurant website with online ordering',
        preferredDate: '2024-02-02',
        preferredTime: '14:00',
        hasFileUpload: true,
        totalAmount: 800,
        depositAmount: 400,
        remainingAmount: 400,
        paymentStatus: 'deposit_paid'
      },
      {
        name: 'Mike Wilson',
        email: 'mike@example.com',
        phone: '555-0103',
        company: 'Healthcare Clinic',
        projectDetails: 'Patient portal and appointment booking system',
        preferredDate: '2024-02-03',
        preferredTime: '09:00',
        hasFileUpload: false,
        totalAmount: 1500,
        depositAmount: 750,
        remainingAmount: 750,
        paymentStatus: 'fully_paid'
      },
      {
        name: 'Emily Davis',
        email: 'emily@example.com',
        phone: '555-0104',
        company: 'Real Estate Agency',
        projectDetails: 'Property listing website with search functionality',
        preferredDate: '2024-02-04',
        preferredTime: '11:00',
        hasFileUpload: true,
        totalAmount: 1000,
        depositAmount: 500,
        remainingAmount: 500,
        paymentStatus: 'failed'
      },
      {
        name: 'David Brown',
        email: 'david@example.com',
        phone: '555-0105',
        company: 'Fitness Center',
        projectDetails: 'Mobile app for gym members with workout tracking',
        preferredDate: '2024-02-05',
        preferredTime: '16:00',
        hasFileUpload: false,
        totalAmount: 2000,
        depositAmount: 1000,
        remainingAmount: 1000,
        paymentStatus: 'pending'
      }
    ]

    const createdConsultations = []
    
    for (let i = 0; i < Math.min(count, testConsultations.length); i++) {
      const consultation = addConsultation(testConsultations[i])
      createdConsultations.push(consultation)
    }

    return NextResponse.json({
      success: true,
      message: `Generated ${createdConsultations.length} test consultations`,
      consultations: createdConsultations
    })

  } catch (error) {
    console.error('Error generating test consultations:', error)
    return NextResponse.json(
      { error: 'Failed to generate test consultations' },
      { status: 500 }
    )
  }
}
