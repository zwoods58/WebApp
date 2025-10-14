import { NextResponse } from 'next/server'
import { mockDb } from '@/lib/mock-db'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, date, time, type, notes } = body
    
    // Validate required fields
    if (!name || !email || !date || !time) {
      return NextResponse.json(
        { error: 'Name, email, date, and time are required' },
        { status: 400 }
      )
    }
    
    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(date)) {
      return NextResponse.json(
        { error: 'Invalid date format. Use YYYY-MM-DD' },
        { status: 400 }
      )
    }
    
    // Validate time format
    const timeRegex = /^\d{2}:\d{2}$/
    if (!timeRegex.test(time)) {
      return NextResponse.json(
        { error: 'Invalid time format. Use HH:MM' },
        { status: 400 }
      )
    }
    
    // Check if date is in the past
    const selectedDate = new Date(date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (selectedDate < today) {
      return NextResponse.json(
        { error: 'Cannot book in the past' },
        { status: 400 }
      )
    }
    
    // Check for existing booking at this time
    const existingBookings = await mockDb.booking.findMany({
      where: { date, status: 'CONFIRMED' }
    })
    
    const [hours, minutes] = time.split(':').map(Number)
    const slotStart = hours * 60 + minutes
    const slotEnd = slotStart + 30 // 30 minute slots
    
    const hasConflict = existingBookings.some(booking => {
      const [bookedHours, bookedMinutes] = booking.time.split(':').map(Number)
      const bookedStart = bookedHours * 60 + bookedMinutes
      const bookedEnd = bookedStart + booking.duration
      
      return (
        (slotStart >= bookedStart && slotStart < bookedEnd) ||
        (slotEnd > bookedStart && slotEnd <= bookedEnd) ||
        (slotStart <= bookedStart && slotEnd >= bookedEnd)
      )
    })
    
    if (hasConflict) {
      return NextResponse.json(
        { error: 'This time slot is already booked' },
        { status: 409 }
      )
    }
    
    // Create the booking
    const booking = await mockDb.booking.create({
      data: {
        name,
        email,
        phone: phone || '',
        date,
        time,
        duration: 30, // 30 minutes
        type: type || 'CONSULTATION',
        status: 'CONFIRMED',
        notes: notes || '',
        createdAt: new Date().toISOString()
      }
    })
    
    return NextResponse.json({
      success: true,
      booking,
      message: 'Booking created successfully'
    }, { status: 201 })
    
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}

