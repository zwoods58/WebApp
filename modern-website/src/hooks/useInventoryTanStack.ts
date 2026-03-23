import { useIndustryDataNew } from './useIndustryDataNew'

export interface Inventory {
  id: string;
  business_id: string;
  industry: string;
  item_name: string; // Changed from product_name to match database
  sku?: string; // Note: does not exist in database
  description?: string; // Note: does not exist in database
  category?: string; // Note: does not exist in database
  quantity: number; // Changed from current_stock to match database
  threshold: number; // Changed from minimum_stock to match database
  maximum_stock?: number; // Note: does not exist in database
  cost_price?: number; // Cost price of the item
  selling_price?: number; // Selling price of the item
  currency?: string; // Note: does not exist in database
  supplier_name?: string; // Note: does not exist in database
  supplier_phone?: string; // Note: does not exist in database
  last_restocked?: string; // Note: does not exist in database
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface UseInventoryOptions {
  businessId?: string;
  industry?: string;
  country?: string;
  category?: string;
  supplierName?: string;
  lowStock?: boolean; // Filter for items below minimum stock
  outOfStock?: boolean; // Filter for items with zero stock
  select?: string;
  filters?: Record<string, any>;
  orderBy?: { column: string; ascending?: boolean };
  limit?: number;
}

export function useInventoryTanStack(options: UseInventoryOptions = {}) {
  // Default to Kenya and retail if not specified
  const industry = options.industry || 'retail'
  const country = options.country || 'ke'
  
  // Use the new TanStack Query hook with updated API
  const { 
    data, 
    isLoading, 
    create,
    createAsync,
    delete: deleteItem, 
    update,
    updateAsync,
    isCreating,
    error,
    refetch
  } = useIndustryDataNew({
    industry,
    country,
    table: 'inventory',
    select: options.select,
    businessId: options.businessId,
  })

  // Filter data based on options (basic implementation)
  let filteredData = data || []
  
  if (options.category) {
    filteredData = filteredData.filter((i: any) => i.category === options.category)
  }
  
  if (options.supplierName) {
    filteredData = filteredData.filter((i: any) => 
      i.supplier_name?.toLowerCase().includes(options.supplierName!.toLowerCase())
    )
  }
  
  if (options.lowStock) {
    filteredData = filteredData.filter((i: any) => i.quantity <= i.threshold)
  }
  
  if (options.outOfStock) {
    filteredData = filteredData.filter((i: any) => i.quantity === 0)
  }

  return {
    data: filteredData as Inventory[],
    isLoading,
    isOffline: !isLoading && data.length === 0,
    addInventory: create,
    addInventoryAsync: createAsync,
    deleteInventory: deleteItem,
    updateInventory: update,
    updateInventoryAsync: updateAsync,
    isPending: isCreating,
    error,
    refetch
  }
}
