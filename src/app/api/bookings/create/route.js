import { NextResponse } from 'next/server'
import { fileDb } from '@/lib/file-db'

export async function POST(request) {
  try {
    const bookingData = await request.json()
    
    console.log('Creating booking with data:', bookingData)
    
    // Create booking in Supabase database
        const booking = await fileDb.booking.create({
      name: bookingData.name,
      email: bookingData.email,
      phone: bookingData.phone || '',
      date: bookingData.date,
      time: bookingData.time,
      duration: 30, // Default 30 minutes
      type: bookingData.type || 'CONSULTATION',
      status: 'PENDING',
      notes: bookingData.notes || ''
    })
    
    console.log('Booking created successfully:', booking.id)
    
    return NextResponse.json({
      success: true,
      booking: booking
    })
    
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}
