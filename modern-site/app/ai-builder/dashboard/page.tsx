'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../src/lib/supabase'
import { getFastAccount, isFastAdmin, isFastPro, clearFastAccountCache } from '../../../src/lib/fast-auth'
import { 
  LayoutDashboard, Sparkles, Grid3x3, List, MoreVertical, Trash2,
  FileText, Plus, LogOut, AlertCircle
} from 'lucide-react'

interface DraftProject {
  id: string
  business_name: string
  draft_url: string | null
  status: string
  generation_count: number
  max_generations: number
  preview_expires_at: string | null
  generated_at: string | null
  created_at: string
  updated_at: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [account, setAccount] = useState<any>(null)
  const [drafts, setDrafts] = useState<DraftProject[]>([])
  const [loading, setLoading] = useState(true)
  const [checkingAdmin, setCheckingAdmin] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [openProjectMenu, setOpenProjectMenu] = useState<string | null>(null)

  useEffect(() => {
    checkAdminAndRedirect()
  }, [])

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenProjectMenu(null)
    }
    if (openProjectMenu) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [openProjectMenu])

  const checkAdminAndRedirect = async () => {
    try {
      console.time('⚡ Dashboard: checkAdminAndRedirect')
      
      // FAST - Check if user is admin (cached, <5ms)
      const isAdmin = await isFastAdmin()
      console.log('⚡ isAdmin check:', isAdmin ? 'YES' : 'NO')
      
      if (isAdmin) {
        console.timeEnd('⚡ Dashboard: checkAdminAndRedirect')
        setCheckingAdmin(false)
        window.location.href = '/admin/dashboard'
        return
      }

      // FAST - Check if user is Pro (cached, <5ms)
      const isPro = await isFastPro()
      console.log('⚡ isPro check:', isPro ? 'YES' : 'NO')
      
      if (isPro) {
        console.timeEnd('⚡ Dashboard: checkAdminAndRedirect')
        setCheckingAdmin(false)
        router.push('/ai-builder/pro-dashboard')
        return
      }

      console.timeEnd('⚡ Dashboard: checkAdminAndRedirect')
      setCheckingAdmin(false)
      // If not admin or pro, proceed with normal dashboard loading
      loadData()
    } catch (error) {
      console.error('Error checking admin status:', error)
      setCheckingAdmin(false)
      // Continue with normal load if check fails
      loadData()
    }
  }

  const loadData = async () => {
    try {
      console.time('⚡ Dashboard: loadData')
      
      // Get current user
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) {
        router.push('/ai-builder/login')
        return
      }

      // FAST - Get account info (cached, <5ms)
      // Auto-creates account if it doesn't exist
      const userAccount = await getFastAccount()
      console.log('⚡ Account loaded:', userAccount ? 'YES' : 'NO')
      
      // If account is null, create a default account object to prevent errors
      // The account will be created automatically by getFastAccount() on next call
      if (!userAccount) {
        console.warn('⚠️ No user account found - using default account (will be created automatically)')
        // Create a temporary default account object
        const defaultAccount = {
          id: authUser.id,
          email: authUser.email || '',
          account_tier: 'default_draft' as const,
          has_buyout: false,
          created_at: new Date().toISOString()
        }
        setAccount(defaultAccount)
      } else {
      setAccount(userAccount)
      }

      // Get draft projects
      const { data, error } = await supabase
        .from('draft_projects')
        .select('*')
        .eq('user_id', authUser.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setDrafts(data || [])
      
      console.timeEnd('⚡ Dashboard: loadData')
    } catch (error) {
      console.error('Error loading dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (draftId: string) => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return
    }

    try {
      const { error } = await supabase
        .from('draft_projects')
        .delete()
        .eq('id', draftId)
      
      if (error) throw error
      
      // Remove from local state
      setDrafts(drafts.filter(d => d.id !== draftId))
      setOpenProjectMenu(null)
    } catch (error) {
      console.error('Error deleting project:', error)
      alert('Failed to delete project. Please try again.')
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    clearFastAccountCache() // Clear cache on logout
    router.push('/ai-builder/login')
  }

  const getDaysAgo = (date: string) => {
    const days = Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24))
    if (days === 0) return 'Today'
    if (days === 1) return '1 day ago'
    return `${days} days ago`
  }

  const isPreviewExpired = (expiresAt: string | null) => {
    if (!expiresAt) return false
    return new Date(expiresAt) < new Date()
  }

  // Show loading while checking admin status or loading data
  if (checkingAdmin || loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-[#1a1a1a] flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-[#2a2a2a] border-r border-[#3a3a3a] flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-[#3a3a3a]">
          <div className="flex items-center gap-3">
            <img 
              src="/favicom.png" 
              alt="AtarWebb Logo" 
              className="w-10 h-10 object-contain"
              style={{ filter: 'brightness(0) invert(1)' } as React.CSSProperties}
            />
            <div>
              <span className="text-lg font-bold text-white">AtarWebb</span>
              <p className="text-xs text-gray-400">Dashboard</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4">
          <nav className="space-y-1">
            <button
              onClick={() => router.push('/ai-builder/dashboard')}
              className="w-full flex items-center gap-3 px-4 py-3 bg-[#3a3a3a] text-white rounded-lg font-medium"
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </button>
            <button
              onClick={() => router.push('/ai-builder')}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-[#3a3a3a] hover:text-white rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              New Project
            </button>
            <button
              onClick={() => router.push('/ai-builder/upgrade')}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-[#3a3a3a] hover:text-white rounded-lg transition-colors"
            >
              <Sparkles className="w-5 h-5" />
              Upgrade to Pro
            </button>
          </nav>
        </div>

        {/* User Section */}
        <div className="p-4 border-t border-[#3a3a3a]">
          <div className="mb-3">
            <p className="text-sm text-gray-400 mb-1">Account</p>
            <p className="text-sm font-semibold text-white capitalize">
              {account?.account_tier === 'default_draft' ? 'Free Plan' : 'Pro Plan'}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-gray-400 hover:bg-[#3a3a3a] hover:text-white rounded-lg transition-colors text-sm"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="bg-[#1a1a1a] border-b border-[#3a3a3a] px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-semibold text-white">My Projects</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-[#3a3a3a]' : 'hover:bg-[#2a2a2a]'}`}
                >
                  <Grid3x3 className="w-4 h-4 text-white" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-[#3a3a3a]' : 'hover:bg-[#2a2a2a]'}`}
                >
                  <List className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div 
          className="flex-1 overflow-y-auto p-6 bg-[#1a1a1a]" 
          onClick={() => setOpenProjectMenu(null)}
        >
          {drafts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-center">
                <Sparkles className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No projects yet</h3>
                <p className="text-gray-400 mb-6">Create your first website draft</p>
                <button
                  onClick={() => router.push('/ai-builder')}
                  className="px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-lg font-semibold hover:from-teal-700 hover:to-teal-800 transition-all shadow-lg"
                >
                  <Plus className="w-5 h-5 inline mr-2" />
                  Create New Project
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Projects Grid */}
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-3 gap-4">
                  {drafts.map((draft) => (
                    <div
                      key={draft.id}
                      onClick={() => router.push(`/ai-builder/editor/${draft.id}`)}
                      className="group bg-[#2a2a2a] rounded-lg overflow-hidden hover:bg-[#3a3a3a] transition-colors cursor-pointer"
                    >
                      {/* Thumbnail */}
                      <div className="aspect-video bg-gradient-to-br from-teal-600/20 to-blue-600/20 relative overflow-hidden">
                        {draft.draft_url && !isPreviewExpired(draft.preview_expires_at) ? (
                          <iframe
                            src={draft.draft_url}
                            className="w-full h-full scale-50 origin-top-left pointer-events-none"
                            style={{ width: '200%', height: '200%' }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FileText className="w-16 h-16 text-gray-600" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-3 left-3 right-3">
                          <p className="text-white text-sm font-medium line-clamp-2">
                            {draft.business_name}
                          </p>
                        </div>
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="relative">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation()
                                setOpenProjectMenu(openProjectMenu === draft.id ? null : draft.id)
                              }}
                              className="p-2 bg-black/50 rounded-lg hover:bg-black/70"
                            >
                              <MoreVertical className="w-4 h-4 text-white" />
                            </button>
                            {openProjectMenu === draft.id && (
                              <div className="absolute right-0 top-full mt-2 w-48 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg shadow-lg z-50">
                                <div className="py-1">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleDelete(draft.id)
                                    }}
                                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                    Delete
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Project Info */}
                      <div className="p-3">
                        <h3 className="text-sm font-medium text-white mb-1 line-clamp-1">
                          {draft.business_name}
                        </h3>
                        <p className="text-xs text-gray-400">
                          Edited {getDaysAgo(draft.updated_at || draft.created_at)}
                        </p>
                        {isPreviewExpired(draft.preview_expires_at) && (
                          <p className="text-xs text-orange-400 mt-1">Preview expired</p>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Add New Project Card */}
                  <div
                    onClick={() => router.push('/ai-builder')}
                    className="group bg-[#2a2a2a] border-2 border-dashed border-[#3a3a3a] rounded-lg overflow-hidden hover:border-teal-500 hover:bg-[#3a3a3a] transition-colors cursor-pointer flex flex-col items-center justify-center aspect-video"
                  >
                    <Plus className="w-12 h-12 text-gray-500 group-hover:text-teal-400 mb-2" />
                    <p className="text-sm text-gray-400 group-hover:text-white">New Project</p>
                  </div>
                </div>
              ) : (
                /* List View */
                <div className="space-y-2">
                  {drafts.map((draft) => (
                    <div
                      key={draft.id}
                      onClick={() => router.push(`/ai-builder/editor/${draft.id}`)}
                      className="bg-[#2a2a2a] rounded-lg p-4 hover:bg-[#3a3a3a] transition-colors cursor-pointer flex items-center gap-4"
                    >
                      <div className="w-16 h-16 bg-gradient-to-br from-teal-600/20 to-blue-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="w-8 h-8 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-white mb-1 truncate">
                          {draft.business_name}
                        </h3>
                        <p className="text-sm text-gray-400">
                          Edited {getDaysAgo(draft.updated_at || draft.created_at)}
                          {isPreviewExpired(draft.preview_expires_at) && ' • Preview expired'}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setOpenProjectMenu(openProjectMenu === draft.id ? null : draft.id)
                        }}
                        className="p-2 hover:bg-[#3a3a3a] rounded-lg"
                      >
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </button>
                      {openProjectMenu === draft.id && (
                        <div className="absolute right-0 top-full mt-2 w-48 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg shadow-lg z-50">
                          <div className="py-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDelete(draft.id)
                              }}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
