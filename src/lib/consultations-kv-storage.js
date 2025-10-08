// Vercel KV storage for consultations
import { kv } from '@vercel/kv'

const CONSULTATIONS_KEY = 'consultations'

// Load consultations from KV
export async function loadConsultations() {
  try {
    const consultations = await kv.get(CONSULTATIONS_KEY)
    return consultations || []
  } catch (error) {
    console.error('Error loading consultations from KV:', error)
    return []
  }
}

// Save consultations to KV
export async function saveConsultations(consultations) {
  try {
    await kv.set(CONSULTATIONS_KEY, consultations)
  } catch (error) {
    console.error('Error saving consultations to KV:', error)
  }
}

// Add a new consultation
export async function addConsultation(consultationData) {
  try {
    const consultations = await loadConsultations()
    const newConsultation = {
      id: `CONS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...consultationData,
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: new Date().toISOString()
    }
    consultations.push(newConsultation)
    await saveConsultations(consultations)
    return newConsultation
  } catch (error) {
    console.error('Error adding consultation:', error)
    throw error
  }
}

// Get all consultations
export async function getConsultations() {
  return await loadConsultations()
}

// Get consultation by ID
export async function getConsultationById(id) {
  const consultations = await loadConsultations()
  return consultations.find(c => c.id === id)
}

// Update a consultation
export async function updateConsultation(id, updates) {
  try {
    const consultations = await loadConsultations()
    const index = consultations.findIndex(c => c.id === id)
    if (index !== -1) {
      consultations[index] = { ...consultations[index], ...updates }
      await saveConsultations(consultations)
      return consultations[index]
    }
    return null
  } catch (error) {
    console.error('Error updating consultation:', error)
    throw error
  }
}

// Delete a consultation
export async function deleteConsultation(id) {
  try {
    const consultations = await loadConsultations()
    const initialLength = consultations.length
    const filteredConsultations = consultations.filter(c => c.id !== id)
    if (filteredConsultations.length < initialLength) {
      await saveConsultations(filteredConsultations)
      return true
    }
    return false
  } catch (error) {
    console.error('Error deleting consultation:', error)
    throw error
  }
}

// Accept a consultation (change status to 'accepted')
export async function acceptConsultation(id, additionalUpdates = {}) {
  return await updateConsultation(id, { status: 'accepted', ...additionalUpdates })
}

// Reject a consultation (change status to 'rejected')
export async function rejectConsultation(id) {
  return await updateConsultation(id, { status: 'rejected' })
}

// Clear all consultations
export async function clearAllConsultations() {
  try {
    await kv.del(CONSULTATIONS_KEY)
  } catch (error) {
    console.error('Error clearing consultations:', error)
    throw error
  }
}
