import { supabase } from './supabase'

export interface FileUploadOptions {
  bucket: string
  path?: string
  upsert?: boolean
}

export interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  url: string
  path: string
  created_at: string
}

export class FileUploadService {
  private static instance: FileUploadService

  static getInstance(): FileUploadService {
    if (!FileUploadService.instance) {
      FileUploadService.instance = new FileUploadService()
    }
    return FileUploadService.instance
  }

  // Upload a single file
  async uploadFile(
    file: File, 
    options: FileUploadOptions,
    metadata?: {
      project_id?: string
      client_id?: string
      description?: string
    }
  ): Promise<{ success: boolean; file?: UploadedFile; error?: string }> {
    try {
      // Generate unique filename
      const timestamp = Date.now()
      const randomString = Math.random().toString(36).substring(2, 15)
      const fileExtension = file.name.split('.').pop()
      const fileName = `${timestamp}_${randomString}.${fileExtension}`
      const filePath = options.path ? `${options.path}/${fileName}` : fileName

      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(options.bucket)
        .upload(filePath, file, {
          upsert: options.upsert || false,
          contentType: file.type
        })

      if (uploadError) {
        console.error('Upload error:', uploadError)
        return { success: false, error: uploadError.message }
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(options.bucket)
        .getPublicUrl(filePath)

      // Save file metadata to database
      const { data: fileRecord, error: dbError } = await supabase
        .from('files')
        .insert({
          name: file.name,
          file_name: fileName,
          file_path: filePath,
          file_size: file.size,
          file_type: file.type,
          file_url: urlData.publicUrl,
          project_id: metadata?.project_id || null,
          client_id: metadata?.client_id || null,
          description: metadata?.description || null,
          bucket: options.bucket
        })
        .select()
        .single()

      if (dbError) {
        console.error('Database error:', dbError)
        // Try to clean up uploaded file
        await supabase.storage
          .from(options.bucket)
          .remove([filePath])
        
        return { success: false, error: dbError.message }
      }

      return {
        success: true,
        file: {
          id: fileRecord.id,
          name: fileRecord.name,
          size: fileRecord.file_size,
          type: fileRecord.file_type,
          url: fileRecord.file_url,
          path: fileRecord.file_path,
          created_at: fileRecord.created_at
        }
      }
    } catch (error) {
      console.error('File upload failed:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  // Upload multiple files
  async uploadMultipleFiles(
    files: File[],
    options: FileUploadOptions,
    metadata?: {
      project_id?: string
      client_id?: string
      description?: string
    }
  ): Promise<{ success: boolean; files: UploadedFile[]; errors: string[] }> {
    const results = []
    const errors = []

    for (const file of files) {
      const result = await this.uploadFile(file, options, metadata)
      if (result.success && result.file) {
        results.push(result.file)
      } else {
        errors.push(`${file.name}: ${result.error || 'Upload failed'}`)
      }
    }

    return {
      success: results.length > 0,
      files: results,
      errors
    }
  }

  // Delete a file
  async deleteFile(fileId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Get file record
      const { data: fileRecord, error: fetchError } = await supabase
        .from('files')
        .select('*')
        .eq('id', fileId)
        .single()

      if (fetchError) {
        return { success: false, error: fetchError.message }
      }

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from(fileRecord.bucket)
        .remove([fileRecord.file_path])

      if (storageError) {
        console.error('Storage deletion error:', storageError)
        // Continue with database deletion even if storage deletion fails
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('files')
        .delete()
        .eq('id', fileId)

      if (dbError) {
        return { success: false, error: dbError.message }
      }

      return { success: true }
    } catch (error) {
      console.error('File deletion failed:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  // Get files by project
  async getFilesByProject(projectId: string): Promise<UploadedFile[]> {
    const { data, error } = await supabase
      .from('files')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching project files:', error)
      return []
    }

    return data.map(file => ({
      id: file.id,
      name: file.name,
      size: file.file_size,
      type: file.file_type,
      url: file.file_url,
      path: file.file_path,
      created_at: file.created_at
    }))
  }

  // Get files by client
  async getFilesByClient(clientId: string): Promise<UploadedFile[]> {
    const { data, error } = await supabase
      .from('files')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching client files:', error)
      return []
    }

    return data.map(file => ({
      id: file.id,
      name: file.name,
      size: file.file_size,
      type: file.file_type,
      url: file.file_url,
      path: file.file_path,
      created_at: file.created_at
    }))
  }

  // Get all files
  async getAllFiles(): Promise<UploadedFile[]> {
    const { data, error } = await supabase
      .from('files')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching files:', error)
      return []
    }

    return data.map(file => ({
      id: file.id,
      name: file.name,
      size: file.file_size,
      type: file.file_type,
      url: file.file_url,
      path: file.file_path,
      created_at: file.created_at
    }))
  }

  // Get file by ID
  async getFileById(fileId: string): Promise<UploadedFile | null> {
    const { data, error } = await supabase
      .from('files')
      .select('*')
      .eq('id', fileId)
      .single()

    if (error) {
      console.error('Error fetching file:', error)
      return null
    }

    return {
      id: data.id,
      name: data.name,
      size: data.file_size,
      type: data.file_type,
      url: data.file_url,
      path: data.file_path,
      created_at: data.created_at
    }
  }

  // Format file size
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Get file type icon
  getFileTypeIcon(fileType: string): string {
    if (fileType.startsWith('image/')) return '🖼️'
    if (fileType.startsWith('video/')) return '🎥'
    if (fileType.startsWith('audio/')) return '🎵'
    if (fileType.includes('pdf')) return '📄'
    if (fileType.includes('word')) return '📝'
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return '📊'
    if (fileType.includes('powerpoint') || fileType.includes('presentation')) return '📽️'
    if (fileType.includes('zip') || fileType.includes('rar')) return '📦'
    return '📁'
  }
}

export default FileUploadService
