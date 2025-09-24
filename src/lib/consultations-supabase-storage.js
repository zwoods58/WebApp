// Supabase storage for consultations using existing project_requests table
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Create Supabase client function
function getSupabaseClient() {
  return createClient(supabaseUrl, supabaseKey)
}

// Add a new consultation
export async function addConsultation(consultationData) {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('project_requests')
      .insert([
        {
          name: consultationData.name,
          email: consultationData.email,
          phone: consultationData.phone,
          company: consultationData.company,
          project_type: 'Consultation Request',
          description: consultationData.projectDetails,
          timeline: `${consultationData.preferredDate} at ${consultationData.preferredTime}`,
          status: 'new'
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Error adding consultation:', error)
      throw error
    }

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.company,
      projectDetails: data.description,
      preferredDate: consultationData.preferredDate,
      preferredTime: consultationData.preferredTime,
      hasFileUpload: !!consultationData.uploadedFile,
      status: data.status,
      paymentStatus: 'pending',
      createdAt: data.created_at
    }
  } catch (error) {
    console.error('Error adding consultation:', error)
    throw error
  }
}

// Get all consultations
export async function getConsultations() {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('project_requests')
      .select('*')
      .eq('project_type', 'Consultation Request')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error getting consultations:', error)
      throw error
    }

    return data.map(consultation => ({
      id: consultation.id,
      name: consultation.name,
      email: consultation.email,
      phone: consultation.phone,
      company: consultation.company,
      projectDetails: consultation.description,
      preferredDate: consultation.timeline?.split(' at ')[0] || '',
      preferredTime: consultation.timeline?.split(' at ')[1] || '',
      hasFileUpload: false,
      status: consultation.status,
      paymentStatus: 'pending',
      createdAt: consultation.created_at
    }))
  } catch (error) {
    console.error('Error getting consultations:', error)
    return []
  }
}

// Get consultation by ID
export async function getConsultationById(id) {
  try {
    const { data, error } = await supabase
      .from('project_requests')
      .select('*')
      .eq('id', id)
      .eq('project_type', 'Consultation Request')
      .single()

    if (error) {
      console.error('Error getting consultation:', error)
      return null
    }

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.company,
      projectDetails: data.description,
      preferredDate: data.timeline?.split(' at ')[0] || '',
      preferredTime: data.timeline?.split(' at ')[1] || '',
      hasFileUpload: false,
      status: data.status,
      paymentStatus: 'pending',
      createdAt: data.created_at
    }
  } catch (error) {
    console.error('Error getting consultation:', error)
    return null
  }
}

// Update a consultation
export async function updateConsultation(id, updates) {
  try {
    const updateData = {}
    
    if (updates.name) updateData.name = updates.name
    if (updates.email) updateData.email = updates.email
    if (updates.phone !== undefined) updateData.phone = updates.phone
    if (updates.company !== undefined) updateData.company = updates.company
    if (updates.projectDetails) updateData.description = updates.projectDetails
    if (updates.status) updateData.status = updates.status
    if (updates.notes) updateData.notes = updates.notes

    const { data, error } = await supabase
      .from('project_requests')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating consultation:', error)
      throw error
    }

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.company,
      projectDetails: data.description,
      preferredDate: data.timeline?.split(' at ')[0] || '',
      preferredTime: data.timeline?.split(' at ')[1] || '',
      hasFileUpload: false,
      status: data.status,
      paymentStatus: 'pending',
      createdAt: data.created_at
    }
  } catch (error) {
    console.error('Error updating consultation:', error)
    throw error
  }
}

// Delete a consultation
export async function deleteConsultation(id) {
  try {
    const { error } = await supabase
      .from('project_requests')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting consultation:', error)
      throw error
    }

    return true
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
    const { error } = await supabase
      .from('project_requests')
      .delete()
      .eq('project_type', 'Consultation Request')

    if (error) {
      console.error('Error clearing consultations:', error)
      throw error
    }

    return true
  } catch (error) {
    console.error('Error clearing consultations:', error)
    throw error
  }
}