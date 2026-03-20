import { useIndustryData } from './useIndustryDataNew'

export interface BeehiveRequest {
  id: string;
  business_id: string;
  user_id?: string;
  country: string;
  industry: string;
  title: string;
  description: string;
  category?: string;
  status: 'open' | 'in_progress' | 'completed' | 'closed';
  upvotes_count: number;
  downvotes_count: number;
  comments_count: number;
  is_featured: boolean;
  priority: 'low' | 'medium' | 'high';
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface BeehiveComment {
  id: string;
  request_id: string;
  business_id: string;
  comment_text: string;
  parent_comment_id?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface BeehiveVote {
  id: string;
  request_id: string;
  business_id: string;
  vote_type: 'upvote' | 'downvote';
  created_at: string;
  updated_at: string;
}

export interface UseBeehiveOptions {
  businessId?: string;
  industry?: string;
  country?: string;
  status?: 'open' | 'in_progress' | 'completed' | 'closed';
  category?: string;
  isFeatured?: boolean;
  priority?: 'low' | 'medium' | 'high';
  select?: string;
  filters?: Record<string, any>;
  orderBy?: { column: string; ascending?: boolean };
  limit?: number;
}

export function useBeehiveTanStack(options: UseBeehiveOptions = {}) {
  // Default to Kenya and retail if not specified
  const industry = options.industry || 'retail'
  const country = options.country || 'ke'
  
  // Use the new TanStack Query hook for requests
  const { data, isLoading, addItem, deleteItem, isAdding, isDeleting, isPaused, error, refetch } = 
    useIndustryData<BeehiveRequest>(industry, country, 'beehive')

  // Filter data based on options (basic implementation)
  let filteredData = data || []
  
  if (options.status) {
    filteredData = filteredData.filter((b: any) => b.status === options.status)
  }
  
  if (options.category) {
    filteredData = filteredData.filter((b: any) => b.category === options.category)
  }
  
  if (options.isFeatured !== undefined) {
    filteredData = filteredData.filter((b: any) => b.is_featured === options.isFeatured)
  }
  
  if (options.priority) {
    filteredData = filteredData.filter((b: any) => b.priority === options.priority)
  }

  return {
    data: filteredData as BeehiveRequest[],
    isLoading,
    isPaused, // Built-in offline state detection
    addRequest: addItem,
    deleteRequest: deleteItem,
    isAdding: isAdding || isDeleting, // Combined pending state
    error,
    refetch,
  }
}
