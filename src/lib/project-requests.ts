import { supabase } from './supabase'
import { Database } from './supabase'

type ProjectRequest = Database['public']['Tables']['project_requests']['Insert']

export interface ProjectRequestData {
  name: string
  email: string
  phone?: string
  company?: string
  projectType: string
  budget?: string
  timeline?: string
  description: string
  requirements?: string
}

export async function submitProjectRequest(data: ProjectRequestData): Promise<{
  success: boolean
  error?: string
  id?: string
}> {
  try {
    const requestData: ProjectRequest = {
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      company: data.company || null,
      project_type: data.projectType,
      budget: data.budget || null,
      timeline: data.timeline || null,
      description: data.description,
      requirements: data.requirements || null,
      status: 'new'
    }

    const { data: result, error } = await supabase
      .from('project_requests')
      .insert(requestData)
      .select()
      .single()

    if (error) {
      console.error('Error submitting project request:', error)
      return {
        success: false,
        error: error.message
      }
    }

    return {
      success: true,
      id: result.id
    }
  } catch (error) {
    console.error('Unexpected error:', error)
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.'
    }
  }
}

export async function getProjectRequests(): Promise<{
  success: boolean
  data?: any[]
  error?: string
}> {
  try {
    const { data, error } = await supabase
      .from('project_requests')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching project requests:', error)
      return {
        success: false,
        error: error.message
      }
    }

    return {
      success: true,
      data
    }
  } catch (error) {
    console.error('Unexpected error:', error)
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.'
    }
  }
}

export async function updateProjectRequestStatus(
  id: string,
  status: 'new' | 'contacted' | 'quoted' | 'accepted' | 'rejected',
  notes?: string
): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const { error } = await supabase
      .from('project_requests')
      .update({
        status,
        notes: notes || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)

    if (error) {
      console.error('Error updating project request:', error)
      return {
        success: false,
        error: error.message
      }
    }

    return {
      success: true
    }
  } catch (error) {
    console.error('Unexpected error:', error)
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.'
    }
  }
}
