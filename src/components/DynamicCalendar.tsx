'use client'

import { useState, useEffect } from 'react'
import { Calendar, Clock, CheckCircle, XCircle } from 'lucide-react'

interface TimeSlot {
  time: string
  label: string
  available: boolean
}

interface DynamicCalendarProps {
  selectedDate: string
  selectedTime: string
  onDateChange: (date: string) => void
  onTimeChange: (time: string) => void
  className?: string
}

export default function DynamicCalendar({
  selectedDate,
  selectedTime,
  onDateChange,
  onTimeChange,
  className = ''
}: DynamicCalendarProps) {
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Generate next 30 days for date selection
  const generateDateOptions = () => {
    const dates = []
    const today = new Date()
    
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      
      // Skip weekends
      if (date.getDay() === 0 || date.getDay() === 6) continue
      
      const dateString = date.toISOString().split('T')[0]
      const displayDate = date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
      dates.push({ value: dateString, label: displayDate })
    }
    return dates
  }

  const dateOptions = generateDateOptions()

  // Fetch available time slots when date changes
  useEffect(() => {
    if (!selectedDate) return

    const fetchAvailableSlots = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        const response = await fetch(`/api/bookings/available-slots?date=${selectedDate}`)
        const data = await response.json()
        
        if (response.ok) {
          // Convert time slots to our format
          const slots: TimeSlot[] = data.availableSlots.map((time: string) => {
            const [hours, minutes] = time.split(':').map(Number)
            const hour12 = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours
            const ampm = hours >= 12 ? 'PM' : 'AM'
            const label = `${hour12}:${minutes.toString().padStart(2, '0')} ${ampm} CT`
            
            return {
              time,
              label,
              available: true
            }
          })
          
          setAvailableSlots(slots)
        } else {
          setError(data.error || 'Failed to fetch available slots')
          setAvailableSlots([])
        }
      } catch (err) {
        console.error('Error fetching slots:', err)
        setError('Failed to fetch available slots')
        setAvailableSlots([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchAvailableSlots()
  }, [selectedDate])

  // Reset time when date changes
  useEffect(() => {
    if (selectedDate && selectedTime) {
      // Check if selected time is still available
      const isStillAvailable = availableSlots.some(slot => slot.time === selectedTime)
      if (!isStillAvailable) {
        onTimeChange('')
      }
    }
  }, [selectedDate, availableSlots, selectedTime, onTimeChange])

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Date Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Select Date *
        </label>
        <select
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Choose a date</option>
          {dateOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Time Selection */}
      {selectedDate && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Select Time *
          </label>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-2 text-gray-600">Loading available times...</span>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-600">
                <XCircle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
            </div>
          ) : availableSlots.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-yellow-600">
                <XCircle className="h-4 w-4" />
                <span className="text-sm">No available time slots for this date</span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {availableSlots.map((slot) => (
                <button
                  key={slot.time}
                  type="button"
                  onClick={() => onTimeChange(slot.time)}
                  disabled={!slot.available}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedTime === slot.time
                      ? 'bg-blue-600 text-white shadow-lg'
                      : slot.available
                      ? 'bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                      : 'bg-gray-100 border-2 border-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center justify-center gap-1">
                    {selectedTime === slot.time && <CheckCircle className="h-4 w-4" />}
                    {slot.label}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Selected Summary */}
      {selectedDate && selectedTime && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-green-700">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">
              Selected: {new Date(selectedDate).toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })} at {availableSlots.find(s => s.time === selectedTime)?.label}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
