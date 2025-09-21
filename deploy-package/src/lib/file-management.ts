import { supabase } from './supabase'

export interface FileUpload {
  file: File
  projectId?: string
  clientId?: string
  fileType: 'document' | 'image' | 'contract' | 'proposal' | 'asset' | 'other'
  description?: string
  isPublic?: boolean
}

export interface FileRecord {
  id: string
  filename: string
  original_filename: string
  file_path: string
  file_size: number
  mime_type: string
  file_type: string
  project_id?: string
  client_id?: string
  uploaded_by?: string
  is_public: boolean
  description?: string
  created_at: string
}

export async function uploadFile(fileData: FileUpload): Promise<{
  success: boolean
  file?: FileRecord
  error?: string
}> {
  try {
    // Generate unique filename
    const fileExt = fileData.file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    
    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('files')
      .upload(fileName, fileData.file)

    if (uploadError) {
      throw uploadError
    }

    // Save file record to database
    const { data: fileRecord, error: dbError } = await supabase
      .from('files')
      .insert({
        filename: fileName,
        original_filename: fileData.file.name,
        file_path: uploadData.path,
        file_size: fileData.file.size,
        mime_type: fileData.file.type,
        file_type: fileData.fileType,
        project_id: fileData.projectId || null,
        client_id: fileData.clientId || null,
        is_public: fileData.isPublic || false,
        description: fileData.description || null
      })
      .select()
      .single()

    if (dbError) {
      throw dbError
    }

    return {
      success: true,
      file: fileRecord
    }
  } catch (error) {
    console.error('Error uploading file:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export async function getFiles(filters?: {
  projectId?: string
  clientId?: string
  fileType?: string
}): Promise<{
  success: boolean
  files?: FileRecord[]
  error?: string
}> {
  try {
    let query = supabase.from('files').select('*')

    if (filters?.projectId) {
      query = query.eq('project_id', filters.projectId)
    }
    if (filters?.clientId) {
      query = query.eq('client_id', filters.clientId)
    }
    if (filters?.fileType) {
      query = query.eq('file_type', filters.fileType)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return {
      success: true,
      files: data || []
    }
  } catch (error) {
    console.error('Error fetching files:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export async function deleteFile(fileId: string): Promise<{
  success: boolean
  error?: string
}> {
  try {
    // Get file record first
    const { data: fileRecord, error: fetchError } = await supabase
      .from('files')
      .select('file_path')
      .eq('id', fileId)
      .single()

    if (fetchError) {
      throw fetchError
    }

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('files')
      .remove([fileRecord.file_path])

    if (storageError) {
      console.warn('Error deleting from storage:', storageError)
    }

    // Delete from database
    const { error: dbError } = await supabase
      .from('files')
      .delete()
      .eq('id', fileId)

    if (dbError) {
      throw dbError
    }

    return {
      success: true
    }
  } catch (error) {
    console.error('Error deleting file:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export function getFileUrl(filePath: string): string {
  const { data } = supabase.storage
    .from('files')
    .getPublicUrl(filePath)
  
  return data.publicUrl
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
