import { NextResponse } from 'next/server'
import { supabaseDb } from '@/lib/supabase-db'

export const dynamic = 'force-dynamic'

// Business hours: 7 AM to 5 PM CT (excluding 12 PM)
// Each slot is 30 minutes
const BUSINESS_HOURS = {
  start: 7, // 7 AM
  end: 17, // 5 PM
  excludedHours: [12], // 12 PM (noon) blocked
  slotDuration: 30 // 30 minutes
}

function generateTimeSlots(): string[] {
  const slots: string[] = []
  
  for (let hour = BUSINESS_HOURS.start; hour < BUSINESS_HOURS.end; hour++) {
    // Skip excluded hours
    if (BUSINESS_HOURS.excludedHours.includes(hour)) {
      continue
    }
    
    // Add :00 slot
    slots.push(`${hour.toString().padStart(2, '0')}:00`)
    
    // Add :30 slot
    slots.push(`${hour.toString().padStart(2, '0')}:30`)
  }
  
  return slots
}

function isSlotAvailable(time: string, bookedSlots: Array<{ time: string, duration: number }>): boolean {
  const [hours, minutes] = time.split(':').map(Number)
  const slotStart = hours * 60 + minutes // Convert to minutes
  const slotEnd = slotStart + BUSINESS_HOURS.slotDuration
  
  // Check if this slot conflicts with any booked slots
  for (const booked of bookedSlots) {
    const [bookedHours, bookedMinutes] = booked.time.split(':').map(Number)
    const bookedStart = bookedHours * 60 + bookedMinutes
    const bookedEnd = bookedStart + booked.duration
    
    // Check for overlap
    if (
      (slotStart >= bookedStart && slotStart < bookedEnd) || // Our slot starts during a booking
      (slotEnd > bookedStart && slotEnd <= bookedEnd) || // Our slot ends during a booking
      (slotStart <= bookedStart && slotEnd >= bookedEnd) // Our slot completely overlaps a booking
    ) {
      return false
    }
  }
  
  return true
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date') // YYYY-MM-DD format
    
    if (!date) {
      return NextResponse.json(
        { error: 'Date parameter is required' },
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
    
    // Check if date is in the past
    const selectedDate = new Date(date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (selectedDate < today) {
      return NextResponse.json(
        { availableSlots: [], message: 'Cannot book in the past' },
        { status: 200 }
      )
    }
    
    // Check if date is a weekend
    const dayOfWeek = selectedDate.getDay()
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return NextResponse.json(
        { availableSlots: [], message: 'Bookings not available on weekends' },
        { status: 200 }
      )
    }
    
    // Get all bookings for this date
    const bookings = await supabaseDb.booking.findMany({
      where: { date, status: 'CONFIRMED' }
    })
    
    const bookedSlots = bookings.map(b => ({
      time: b.time,
      duration: b.duration
    }))
    
    // Generate all possible time slots
    const allSlots = generateTimeSlots()
    
    // Filter out booked slots
    const availableSlots = allSlots.filter(slot => 
      isSlotAvailable(slot, bookedSlots)
    )
    
    return NextResponse.json({
      date,
      availableSlots,
      bookedCount: bookings.length,
      message: availableSlots.length === 0 ? 'No slots available for this date' : undefined
    })
    
  } catch (error) {
    console.error('Error fetching available slots:', error)
    return NextResponse.json(
      { error: 'Failed to fetch available slots' },
      { status: 500 }
    )
  }
}

