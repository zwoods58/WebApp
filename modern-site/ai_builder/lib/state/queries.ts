/**
 * React Query / TanStack Query Setup
 * P1 Feature 6: State Management - Server State
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getSupabaseClient } from '../supabase/client-db'

// Query Keys
export const queryKeys = {
  projects: ['projects'] as const,
  project: (id: string) => ['projects', id] as const,
  projectFiles: (id: string) => ['projects', id, 'files'] as const,
  projectDeployments: (id: string) => ['projects', id, 'deployments'] as const,
  user: ['user'] as const
}

/**
 * Fetch user projects
 */
export function useProjects(userId: string) {
  return useQuery({
    queryKey: queryKeys.projects,
    queryFn: async () => {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from('draft_projects')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })

      if (error) throw error
      return data || []
    },
    enabled: !!userId
  })
}

/**
 * Fetch single project
 */
export function useProject(projectId: string) {
  return useQuery({
    queryKey: queryKeys.project(projectId),
    queryFn: async () => {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from('draft_projects')
        .select('*')
        .eq('id', projectId)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!projectId
  })
}

/**
 * Fetch project files
 */
export function useProjectFiles(projectId: string) {
  return useQuery({
    queryKey: queryKeys.projectFiles(projectId),
    queryFn: async () => {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from('draft_projects')
        .select('metadata')
        .eq('id', projectId)
        .single()

      if (error) throw error
      return data?.metadata?.file_tree || {}
    },
    enabled: !!projectId
  })
}

/**
 * Update project mutation
 */
export function useUpdateProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ projectId, updates }: { projectId: string; updates: any }) => {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from('draft_projects')
        .update(updates)
        .eq('id', projectId)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.project(data.id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.projects })
    }
  })
}

/**
 * Create project mutation
 */
export function useCreateProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (projectData: any) => {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from('draft_projects')
        .insert(projectData)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects })
    }
  })
}

/**
 * Delete project mutation
 */
export function useDeleteProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (projectId: string) => {
      const supabase = getSupabaseClient()
      const { error } = await supabase
        .from('draft_projects')
        .delete()
        .eq('id', projectId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects })
    }
  })
}





