import { supabase } from './supabase';

/**
 * Create an expense transaction when inventory is purchased
 */
export async function createInventoryPurchaseTransaction(inventoryItem, userId) {
  if (!inventoryItem.cost_price || inventoryItem.cost_price <= 0) {
    console.log('[InventoryTransactions] No cost price, skipping transaction');
    return null; // No cost, no transaction
  }

  if (!userId) {
    console.error('[InventoryTransactions] No user ID provided');
    return null;
  }

  const totalCost = (inventoryItem.cost_price || 0) * (inventoryItem.quantity || 1);
  const today = new Date().toISOString().split('T')[0];

  console.log('[InventoryTransactions] Creating purchase transaction:', {
    userId,
    totalCost,
    date: today,
    item: inventoryItem.name,
  });

  try {
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        amount: totalCost,
        type: 'expense',
        category: 'Stock/Inventory',
        description: `Purchased ${inventoryItem.quantity || 1} ${inventoryItem.unit || 'units'} of ${inventoryItem.name}`,
        date: today,
        source: 'manual',
        synced: true,
        metadata: {
          inventory_item_id: inventoryItem.id,
          inventory_item_name: inventoryItem.name,
          quantity: inventoryItem.quantity,
          unit_price: inventoryItem.cost_price,
          total_cost: totalCost,
          transaction_type: 'inventory_purchase',
        },
      })
      .select()
      .single();

    if (error) {
      console.error('[InventoryTransactions] Error creating purchase transaction:', error);
      console.error('[InventoryTransactions] Error details:', JSON.stringify(error, null, 2));
      console.error('[InventoryTransactions] Failed transaction data:', {
        user_id: userId,
        amount: totalCost,
        type: 'expense',
        category: 'Stock/Inventory',
        date: today,
      });
      // Show error to user
      if (typeof window !== 'undefined' && window.toast) {
        window.toast.error(`Failed to create expense transaction: ${error.message || 'Unknown error'}`);
      }
      return null;
    }

    console.log('[InventoryTransactions] Successfully created purchase transaction:', data);
    return data;
  } catch (error) {
    console.error('[InventoryTransactions] Exception creating purchase transaction:', error);
    return null;
  }
}

/**
 * Create an income transaction when inventory is sold
 */
export async function createInventorySaleTransaction(inventoryItem, quantitySold, userId) {
  if (!inventoryItem.selling_price || inventoryItem.selling_price <= 0) {
    console.log('[InventoryTransactions] No selling price, skipping sale transaction');
    return null; // No selling price, no transaction
  }

  if (!userId) {
    console.error('[InventoryTransactions] No user ID provided for sale');
    return null;
  }

  const totalRevenue = (inventoryItem.selling_price || 0) * quantitySold;
  const today = new Date().toISOString().split('T')[0];

  console.log('[InventoryTransactions] Creating sale transaction:', {
    userId,
    totalRevenue,
    date: today,
    item: inventoryItem.name,
    quantitySold,
  });

  try {
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        amount: totalRevenue,
        type: 'income',
        category: 'Sales',
        description: `Sold ${quantitySold} ${inventoryItem.unit || 'units'} of ${inventoryItem.name}`,
        date: today,
        source: 'manual',
        synced: true,
        metadata: {
          inventory_item_id: inventoryItem.id,
          inventory_item_name: inventoryItem.name,
          quantity_sold: quantitySold,
          unit_price: inventoryItem.selling_price,
          total_revenue: totalRevenue,
          transaction_type: 'inventory_sale',
        },
      })
      .select()
      .single();

    if (error) {
      console.error('[InventoryTransactions] Error creating sale transaction:', error);
      console.error('[InventoryTransactions] Error details:', JSON.stringify(error, null, 2));
      return null;
    }

    console.log('[InventoryTransactions] Successfully created sale transaction:', data);
    return data;
  } catch (error) {
    console.error('[InventoryTransactions] Exception creating sale transaction:', error);
    return null;
  }
}

/**
 * Create expense transaction when inventory quantity increases (new purchase)
 */
export async function handleInventoryQuantityIncrease(oldItem, newItem, userId) {
  if (!oldItem) {
    // New item - create purchase transaction if cost_price exists
    return await createInventoryPurchaseTransaction(newItem, userId);
  }

  // Existing item - check if quantity increased
  const quantityIncrease = (newItem.quantity || 0) - (oldItem.quantity || 0);
  
  if (quantityIncrease > 0 && newItem.cost_price > 0) {
    // Quantity increased - treat as new purchase
    const purchaseItem = {
      ...newItem,
      quantity: quantityIncrease,
    };
    return await createInventoryPurchaseTransaction(purchaseItem, userId);
  }

  return null;
}

