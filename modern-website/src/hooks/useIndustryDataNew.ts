import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

// Operation type detection based on metadata and data structure
const detectOperationType = (data: any, dataType: string) => {
  // Transaction-based operations
  if (dataType === 'transactions') {
    if (data.metadata?.inventory_item_id) return 'inventory_sale'
    if (data.metadata?.credit_id) return 'credit_payment'
    if (data.metadata?.appointment_id || data.metadata?.service_name) return 'appointment_completion'
    if (data.category?.includes('appointment')) return 'appointment_completion'
    if (data.category === 'payment') return 'payment'
    if (data.category === 'sale') return 'sale'
    if (data.description?.toLowerCase().includes('payment for credit')) return 'credit_payment'
    if (data.description?.toLowerCase().includes('payment for') && data.metadata?.service_name) return 'appointment_completion'
  }
  
  // Direct data operations
  if (dataType === 'inventory') {
    console.log('🔍 Inventory operation detected:', data)
    return 'inventory_update'
  }
  if (dataType === 'credit') {
    // Check if this is a payment update (paid_amount changing)
    if (data.paid_amount !== undefined || data.status !== undefined) return 'credit_payment'
    return 'credit_update'
  }
  if (dataType === 'appointments') return 'appointment_update'
  if (dataType === 'services') return 'service_update'
  
  console.log('🔍 Default operation type for:', dataType, data)
  return 'general'
}

// Cross-invalidation based on operation type
const invalidateRelatedQueries = (queryClient: any, industry: string, country: string, operationType: string) => {
  console.log(`🔄 Cross-invalidating queries for operation: ${operationType}`);
  
  const baseKeys = [
    [industry, country, 'transactions'],
    [industry, country, 'inventory'], 
    [industry, country, 'credit'],
    [industry, country, 'appointments'],
    [industry, country, 'services']
  ]
  
  switch (operationType) {
    case 'inventory_sale':
      console.log('📦 Inventory sale - invalidating transactions and inventory');
      queryClient.invalidateQueries([industry, country, 'transactions'])
      queryClient.invalidateQueries([industry, country, 'inventory'])
      break
    case 'credit_payment':
    case 'payment':
      console.log('💳 Credit payment - invalidating credit and transactions');
      queryClient.invalidateQueries([industry, country, 'credit'])
      queryClient.invalidateQueries([industry, country, 'transactions'])
      break
    case 'appointment_completion':
    case 'appointment_update':
      console.log('📅 Appointment operation - invalidating appointments, services, and transactions');
      queryClient.invalidateQueries([industry, country, 'appointments'])
      queryClient.invalidateQueries([industry, country, 'services'])
      queryClient.invalidateQueries([industry, country, 'transactions'])
      break
    case 'inventory_update':
      console.log('📦 Inventory update - invalidating inventory');
      queryClient.invalidateQueries([industry, country, 'inventory'])
      break
    case 'credit_update':
      console.log('💳 Credit update - invalidating credit and transactions');
      queryClient.invalidateQueries([industry, country, 'credit'])
      queryClient.invalidateQueries([industry, country, 'transactions'])
      break
    case 'service_update':
      console.log('🔧 Service update - invalidating services and appointments');
      queryClient.invalidateQueries([industry, country, 'services'])
      queryClient.invalidateQueries([industry, country, 'appointments'])
      break
    case 'sale':
    default:
      console.log('💰 General operation - invalidating transactions');
      // For general operations, invalidate transactions and related data
      queryClient.invalidateQueries([industry, country, 'transactions'])
      break
  }
}

export function useIndustryData<T = any>(
  industry: string, 
  country: string, 
  dataType: string
) {
  const queryClient = useQueryClient()
  const isClient = typeof window !== 'undefined'
  
  // localStorage persistence keys
  const storageKey = `beezee_${industry}_${country}_${dataType}`
  
  // Load initial data from localStorage if available
  const getInitialData = () => {
    if (!isClient) return []
    try {
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        const parsed = JSON.parse(stored)
        console.log(`📦 Loaded ${parsed.length} ${dataType} from localStorage`)
        return parsed
      }
    } catch (error) {
      console.warn(`Failed to load ${dataType} from localStorage:`, error)
    }
    return []
  }
  
  // Save data to localStorage when it changes
  const saveToLocalStorage = (data: any[]) => {
    if (!isClient) return
    try {
      localStorage.setItem(storageKey, JSON.stringify(data))
      console.log(`💾 Saved ${data.length} ${dataType} to localStorage`)
    } catch (error) {
      console.warn(`Failed to save ${dataType} to localStorage:`, error)
    }
  }

  // Query - reading data
  const { 
    data, 
    isLoading, 
    isPaused: isQueryPaused,
    error,
    refetch 
  } = useQuery({
    queryKey: [industry, country, dataType],
    queryFn: async () => {
      // Check if Supabase is properly configured
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        const error = new Error('Supabase configuration missing. Please check environment variables.')
        console.error(`Error fetching ${dataType}:`, error.message)
        throw error
      }

      try {
        const { data, error } = await supabase
          .from(dataType)
          .select('*')
          .eq('industry', industry)
          .order('created_at', { ascending: false })
        
        if (error) {
          console.error(`Supabase error fetching ${dataType}:`, {
            error,
            details: error.details,
            hint: error.hint,
            code: error.code,
            message: error.message,
            industry
          })
          throw error
        }
        
        console.log(`✅ Successfully fetched ${data?.length || 0} ${dataType}`)
        
        // Save to localStorage for offline persistence
        saveToLocalStorage(data || [])
        
        return (data || []) as T[]
      } catch (err) {
        console.error(`Failed to fetch ${dataType}:`, {
          error: err,
          industry,
          supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'configured' : 'missing',
          anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'configured' : 'missing'
        })
        throw err
      }
    },
    enabled: isClient && !!industry && !!country,
    initialData: getInitialData(),
    networkMode: 'offlineFirst',
    staleTime: 5 * 60 * 1000,
    gcTime: 7 * 24 * 60 * 60 * 1000,
    retry: 3,
  })
  
  // Mutation - adding data (NO onError rollback!)
  const mutation = useMutation({
    mutationKey: [industry, country, dataType],
    mutationFn: async (newItem: any) => {
      const { data, error } = await supabase
        .from(dataType)
        .insert({
          ...newItem,
          industry,
          country,
          created_at: new Date().toISOString(),
        })
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    
    // Optimistic update - show item immediately
    onMutate: async (newItem) => {
      await queryClient.cancelQueries({ queryKey: [industry, country, dataType] })
      
      const previousData = queryClient.getQueryData([industry, country, dataType])
      
      const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 6)}` 
      const optimisticItem = {
        ...newItem,
        id: tempId,
        created_at: new Date().toISOString(),
        pendingSync: true,  // Visual indicator
      }
      
      queryClient.setQueryData([industry, country, dataType], 
        (old = []) => {
          const newItems = [optimisticItem, ...(old as any[])]
          // Save optimistic data to localStorage
          saveToLocalStorage(newItems)
          return newItems
        }
      )
      
      return { previousData, optimisticItem, tempId }
    },
    
    // ❌ REMOVED onError - Let TanStack Query handle failures and queue offline mutations
    // The mutation will automatically go into isPaused state and retry when online
    
    // ✅ Keep onSuccess - Replace temp ID with real data + cross-invalidate related queries
    onSuccess: (result, variables, context) => {
      // Detect operation type and invalidate related queries
      const operationType = detectOperationType(variables, dataType)
      console.log(`🔄 ${dataType} operation successful: ${operationType} - invalidating related queries`)
      
      // Invalidate related queries for UI synchronization
      invalidateRelatedQueries(queryClient, industry, country, operationType)
      
      if (context?.optimisticItem) {
        queryClient.setQueryData([industry, country, dataType], 
          (old = []) => {
            const items = old as any[]
            // Find and replace the optimistic item
            const index = items.findIndex(item => item.id === context.optimisticItem?.id)
            if (index !== -1) {
              const newItems = [...items]
              newItems[index] = { ...result, pendingSync: false }
              // Save to localStorage
              saveToLocalStorage(newItems)
              return newItems
            }
            // Fallback: just add the real item
            const updatedItems = [result, ...items.filter(i => !i.id?.toString().startsWith('temp_'))]
            saveToLocalStorage(updatedItems)
            return updatedItems
          }
        )
      }
    },
    
    networkMode: 'offlineFirst',  // ← This enables offline queue
    retry: 3,
  })

  const deleteMutation = useMutation({
    mutationKey: [industry, country, dataType, 'delete'],
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from(dataType)
        .delete()
        .eq('id', id)
      
      if (error) throw error
      return { success: true }
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: [industry, country, dataType] })
      const previousData = queryClient.getQueryData([industry, country, dataType])
      
      queryClient.setQueryData([industry, country, dataType], 
        (old = []) => {
          const newItems = (old as any[]).filter((item: any) => item.id !== id)
          // Save to localStorage after optimistic delete
          saveToLocalStorage(newItems)
          return newItems
        }
      )
      
      return { previousData }
    },
    // ❌ REMOVED onError - Let TanStack Query handle offline failures
    onSuccess: (id) => {
      console.log(`🔄 ${dataType} delete operation successful - invalidating related queries`)
      
      // Save updated data to localStorage after delete
      const currentData = queryClient.getQueryData([industry, country, dataType]) as any[] || []
      saveToLocalStorage(currentData)
      
      // For delete operations, invalidate the current data type and related queries
      invalidateRelatedQueries(queryClient, industry, country, dataType + '_update')
      queryClient.invalidateQueries({ queryKey: [industry, country, dataType] })
    },
    networkMode: 'offlineFirst',
    retry: 3,
  })

  const updateMutation = useMutation({
    mutationKey: [industry, country, dataType, 'update'],
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { data, error } = await supabase
        .from(dataType)
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey: [industry, country, dataType] })
      const previousData = queryClient.getQueryData([industry, country, dataType])
      
      // Optimistic update
      queryClient.setQueryData([industry, country, dataType], 
        (old = []) => {
          const items = old as any[]
          const index = items.findIndex(item => item.id === id)
          if (index !== -1) {
            const newItems = [...items]
            newItems[index] = { ...newItems[index], ...updates, updated_at: new Date().toISOString() }
            // Save optimistic update to localStorage
            saveToLocalStorage(newItems)
            return newItems
          }
          return items
        }
      )
      
      return { previousData }
    },
    onSuccess: (result, variables, context) => {
      // Detect operation type and invalidate related queries
      const operationType = detectOperationType(variables.updates || variables, dataType)
      console.log(`🔄 ${dataType} update operation successful: ${operationType} - invalidating related queries`)
      console.log('🔍 Update variables:', variables)
      console.log('🔍 Detected operation type:', operationType)
      
      // Invalidate related queries for UI synchronization
      invalidateRelatedQueries(queryClient, industry, country, operationType)
      
      queryClient.setQueryData([industry, country, dataType], 
        (old = []) => {
          const items = old as any[]
          const index = items.findIndex(item => item.id === variables.id)
          if (index !== -1) {
            const newItems = [...items]
            newItems[index] = { ...result, updated_at: new Date().toISOString() }
            console.log(`✅ Updated ${dataType} item at index ${index}`)
            // Save to localStorage
            saveToLocalStorage(newItems)
            return newItems
          }
          return items
        }
      )
    },
    networkMode: 'offlineFirst',
    retry: 3,
  })
  
  return {
    data: (data || []) as T[],
    isLoading,
    error,
    isPaused: isQueryPaused || mutation.isPaused || deleteMutation.isPaused || updateMutation.isPaused,
    addItem: mutation.mutate,
    deleteItem: deleteMutation.mutate,
    updateItem: updateMutation.mutate,
    isAdding: mutation.isPending,
    isDeleting: deleteMutation.isPending,
    isUpdating: updateMutation.isPending,
    refetch,
  }
}
