/**
 * State Management with Zustand
 * P1 Feature 6: State Management
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ProjectState {
  projects: any[]
  activeProjectId: string | null
  setActiveProject: (projectId: string | null) => void
  addProject: (project: any) => void
  updateProject: (projectId: string, updates: Partial<any>) => void
  removeProject: (projectId: string) => void
}

interface EditorState {
  openFiles: string[]
  activeFileId: string | null
  fileContents: Record<string, string>
  setActiveFile: (fileId: string) => void
  openFile: (fileId: string, content: string) => void
  closeFile: (fileId: string) => void
  updateFileContent: (fileId: string, content: string) => void
}

interface UISate {
  sidebarOpen: boolean
  previewMode: 'desktop' | 'tablet' | 'mobile'
  theme: 'light' | 'dark'
  toggleSidebar: () => void
  setPreviewMode: (mode: 'desktop' | 'tablet' | 'mobile') => void
  setTheme: (theme: 'light' | 'dark') => void
}

// Project Store
export const useProjectStore = create<ProjectState>()(
  persist(
    (set) => ({
      projects: [],
      activeProjectId: null,
      setActiveProject: (projectId) => set({ activeProjectId: projectId }),
      addProject: (project) => set((state) => ({ 
        projects: [...state.projects, project] 
      })),
      updateProject: (projectId, updates) => set((state) => ({
        projects: state.projects.map(p => 
          p.id === projectId ? { ...p, ...updates } : p
        )
      })),
      removeProject: (projectId) => set((state) => ({
        projects: state.projects.filter(p => p.id !== projectId),
        activeProjectId: state.activeProjectId === projectId ? null : state.activeProjectId
      }))
    }),
    {
      name: 'project-storage'
    }
  )
)

// Editor Store
export const useEditorStore = create<EditorState>()(
  persist(
    (set) => ({
      openFiles: [],
      activeFileId: null,
      fileContents: {},
      setActiveFile: (fileId) => set({ activeFileId: fileId }),
      openFile: (fileId, content) => set((state) => ({
        openFiles: state.openFiles.includes(fileId) 
          ? state.openFiles 
          : [...state.openFiles, fileId],
        activeFileId: fileId,
        fileContents: {
          ...state.fileContents,
          [fileId]: content
        }
      })),
      closeFile: (fileId) => set((state) => ({
        openFiles: state.openFiles.filter(id => id !== fileId),
        activeFileId: state.activeFileId === fileId 
          ? state.openFiles[state.openFiles.indexOf(fileId) - 1] || null
          : state.activeFileId,
        fileContents: Object.fromEntries(
          Object.entries(state.fileContents).filter(([id]) => id !== fileId)
        )
      })),
      updateFileContent: (fileId, content) => set((state) => ({
        fileContents: {
          ...state.fileContents,
          [fileId]: content
        }
      }))
    }),
    {
      name: 'editor-storage'
    }
  )
)

// UI Store
export const useUIStore = create<UISate>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      previewMode: 'desktop',
      theme: 'dark',
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setPreviewMode: (mode) => set({ previewMode: mode }),
      setTheme: (theme) => set({ theme })
    }),
    {
      name: 'ui-storage'
    }
  )
)





