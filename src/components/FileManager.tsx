'use client'

import { useState, useEffect } from 'react'
import { 
  Upload, 
  Download, 
  Trash2, 
  Eye, 
  File, 
  Image, 
  Video, 
  Music, 
  FileText, 
  Archive,
  Search,
  Filter,
  Grid,
  List,
  MoreHorizontal,
  AlertCircle,
  X
} from 'lucide-react'
import FileUploadService from '@/lib/file-upload-service'
import FileUpload from './FileUpload'

interface FileManagerProps {
  projectId?: string
  clientId?: string
  className?: string
}

export default function FileManager({ projectId, clientId, className = "" }: FileManagerProps) {
  const [files, setFiles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showUpload, setShowUpload] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])

  const fileUploadService = FileUploadService.getInstance()

  useEffect(() => {
    loadFiles()
  }, [projectId, clientId])

  const loadFiles = async () => {
    try {
      setLoading(true)
      setError(null)

      let filesData
      if (projectId) {
        filesData = await fileUploadService.getFilesByProject(projectId)
      } else if (clientId) {
        filesData = await fileUploadService.getFilesByClient(clientId)
      } else {
        filesData = await fileUploadService.getAllFiles()
      }

      setFiles(filesData)
    } catch (err) {
      console.error('Error loading files:', err)
      setError('Failed to load files')
    } finally {
      setLoading(false)
    }
  }

  const handleUploadComplete = (uploadedFiles: any[]) => {
    setFiles(prev => [...uploadedFiles, ...prev])
    setShowUpload(false)
  }

  const handleUploadError = (error: string) => {
    setError(error)
  }

  const handleDeleteFile = async (fileId: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return

    try {
      const result = await fileUploadService.deleteFile(fileId)
      if (result.success) {
        setFiles(prev => prev.filter(f => f.id !== fileId))
      } else {
        setError(result.error || 'Failed to delete file')
      }
    } catch (err) {
      console.error('Error deleting file:', err)
      setError('Failed to delete file')
    }
  }

  const handleBulkDelete = async () => {
    if (selectedFiles.length === 0) return
    if (!confirm(`Are you sure you want to delete ${selectedFiles.length} files?`)) return

    try {
      const deletePromises = selectedFiles.map(fileId => fileUploadService.deleteFile(fileId))
      await Promise.all(deletePromises)
      
      setFiles(prev => prev.filter(f => !selectedFiles.includes(f.id)))
      setSelectedFiles([])
    } catch (err) {
      console.error('Error deleting files:', err)
      setError('Failed to delete files')
    }
  }

  const handleDownload = (file: any) => {
    const link = document.createElement('a')
    link.href = file.url
    link.download = file.name
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleSelectFile = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    )
  }

  const handleSelectAll = () => {
    setSelectedFiles(files.map(f => f.id))
  }

  const handleClearSelection = () => {
    setSelectedFiles([])
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

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading files...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">File Manager</h2>
          <p className="text-gray-600">Manage project files and documents</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
          >
            {viewMode === 'grid' ? <List className="h-5 w-5" /> : <Grid className="h-5 w-5" />}
          </button>
          <button
            onClick={() => setShowUpload(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Files
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search files..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedFiles.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900">
              {selectedFiles.length} file(s) selected
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleClearSelection}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Clear
              </button>
              <button
                onClick={handleBulkDelete}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Delete Selected
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      )}

      {/* Files Grid/List */}
      {filteredFiles.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <File className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No files found</h3>
          <p className="text-gray-600 mb-6">
            {searchQuery ? 'No files match your search.' : 'Upload some files to get started.'}
          </p>
          <button
            onClick={() => setShowUpload(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Upload Files
          </button>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' : 'space-y-2'}>
          {filteredFiles.map((file) => (
            <div
              key={file.id}
              className={`border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow ${
                selectedFiles.includes(file.id) ? 'ring-2 ring-blue-500 bg-blue-50' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={selectedFiles.includes(file.id)}
                  onChange={() => handleSelectFile(file.id)}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    {getFileIcon(file.type)}
                    <span className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">
                    {formatFileSize(file.size)}
                  </p>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleDownload(file)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => window.open(file.url, '_blank')}
                      className="text-green-600 hover:text-green-800"
                      title="Preview"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteFile(file.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 z-50 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Upload Files</h3>
              <button
                onClick={() => setShowUpload(false)}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <FileUpload
                onUploadComplete={handleUploadComplete}
                onUploadError={handleUploadError}
                projectId={projectId}
                clientId={clientId}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

