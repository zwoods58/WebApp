'use client'

import { useState, useRef } from 'react'
import { Upload, X, File, Image, Video, Music, FileText, Archive, CheckCircle, AlertCircle } from 'lucide-react'
import FileUploadService from '@/lib/file-upload-service'

interface FileUploadProps {
  onUploadComplete: (files: any[]) => void
  onUploadError: (error: string) => void
  projectId?: string
  clientId?: string
  description?: string
  maxFiles?: number
  maxSize?: number // in MB
  acceptedTypes?: string[]
  className?: string
}

export default function FileUpload({
  onUploadComplete,
  onUploadError,
  projectId,
  clientId,
  description,
  maxFiles = 10,
  maxSize = 4, // 4MB default to stay within Vercel limits
  acceptedTypes = ['image/*', 'application/pdf', 'text/*', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  className = ""
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const fileUploadService = FileUploadService.getInstance()

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      handleFiles(files)
    }
  }

  const handleFiles = async (files: File[]) => {
    // Validate files
    const validation = validateFiles(files)
    if (!validation.valid) {
      onUploadError(validation.error!)
      return
    }

    setUploading(true)
    setUploadedFiles([])

    try {
      const results = await fileUploadService.uploadMultipleFiles(
        files,
        { bucket: 'project-files' },
        {
          project_id: projectId,
          client_id: clientId,
          description
        }
      )

      if (results.success) {
        setUploadedFiles(results.files)
        onUploadComplete(results.files)
      }

      if (results.errors.length > 0) {
        onUploadError(`Some files failed to upload: ${results.errors.join(', ')}`)
      }
    } catch (error) {
      console.error('Upload error:', error)
      onUploadError('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const validateFiles = (files: File[]): { valid: boolean; error?: string } => {
    if (files.length > maxFiles) {
      return { valid: false, error: `Maximum ${maxFiles} files allowed` }
    }

    for (const file of files) {
      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        return { valid: false, error: `File ${file.name} is too large. Maximum size is ${maxSize}MB` }
      }

      // Check file type
      const isValidType = acceptedTypes.some(type => {
        if (type.endsWith('/*')) {
          return file.type.startsWith(type.slice(0, -1))
        }
        return file.type === type
      })

      if (!isValidType) {
        return { valid: false, error: `File type ${file.type} is not allowed` }
      }
    }

    return { valid: true }
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image className="h-5 w-5 text-green-600" />
    if (fileType.startsWith('video/')) return <Video className="h-5 w-5 text-blue-600" />
    if (fileType.startsWith('audio/')) return <Music className="h-5 w-5 text-purple-600" />
    if (fileType.includes('pdf')) return <FileText className="h-5 w-5 text-red-600" />
    if (fileType.includes('zip') || fileType.includes('rar')) return <Archive className="h-5 w-5 text-orange-600" />
    return <File className="h-5 w-5 text-gray-600" />
  }

  const formatFileSize = (bytes: number) => {
    return fileUploadService.formatFileSize(bytes)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${uploading ? 'pointer-events-none opacity-50' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <Upload className="h-8 w-8 text-gray-400" />
          </div>
          
          <div>
            <p className="text-lg font-medium text-gray-900">
              {uploading ? 'Uploading files...' : 'Drop files here or click to upload'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Maximum {maxFiles} files, {maxSize}MB each
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Supported: Images, PDFs, Documents, Archives
            </p>
          </div>
        </div>
      </div>

      {/* Upload Progress */}
      {uploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Uploading files...</span>
            <span className="text-gray-500">Please wait</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
        </div>
      )}

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-900">Uploaded Files</h4>
          <div className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getFileIcon(file.type)}
                  <div>
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
