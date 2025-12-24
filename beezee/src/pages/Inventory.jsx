import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { useAuthStore } from '../store/authStore';
import { Plus, Package, Search, AlertTriangle, ChevronLeft, Edit, Trash2, X, PlusCircle, MinusCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import SwipeToRefresh from '../components/SwipeToRefresh';
import FloatingNavBar from '../components/FloatingNavBar';
import AddInventoryModal from '../components/AddInventoryModal';
import { useTranslation } from 'react-i18next';
import BeeZeeLogo from '../components/BeeZeeLogo';
import EmptyState from '../components/EmptyState';
import { createInventoryPurchaseTransaction, createInventorySaleTransaction, handleInventoryQuantityIncrease } from '../utils/inventoryTransactions';
import { useOfflineStore } from '../store/offlineStore';

export default function Inventory() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { syncCompleted } = useOfflineStore();
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all'); // all, low_stock, out_of_stock
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    if (user) loadInventory();
  }, [user]);

  // Refresh when sync completes (syncCompleted is a counter that increments)
  useEffect(() => {
    if (syncCompleted > 0) {
      console.log('Sync completed - refreshing Inventory...');
      loadInventory();
    }
  }, [syncCompleted]);

  const loadInventory = async () => {
    let finalUserId = user?.id || localStorage.getItem('beezee_user_id');
    if (!finalUserId) {
      const { data: { session } } = await supabase.auth.getSession();
      finalUserId = session?.user?.id;
    }

    if (!finalUserId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .eq('user_id', finalUserId)
        .order('name', { ascending: true });

      if (error) throw error;
      setInventory(data || []);
    } catch (error) {
      console.error('Error loading inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (item) => {
    if (!confirm(t('inventory.confirmDelete', `Are you sure you want to delete "${item.name}"?`))) {
      return;
    }

    let finalUserId = user?.id || localStorage.getItem('beezee_user_id');
    if (!finalUserId) {
      const { data: { session } } = await supabase.auth.getSession();
      finalUserId = session?.user?.id;
    }

    if (!finalUserId) return;

    try {
      const { error } = await supabase
        .from('inventory')
        .delete()
        .eq('id', item.id);

      if (error) throw error;
      
      setInventory(inventory.filter(i => i.id !== item.id));
      toast.success(t('inventory.deleted', 'Item deleted successfully'));
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error(t('inventory.deleteFailed', 'Failed to delete item'));
    }
  };

  const handleUpdateQuantity = async (item, change) => {
    const oldQuantity = Number(item.quantity);
    const newQuantity = Math.max(0, oldQuantity + change);
    
    let finalUserId = user?.id || localStorage.getItem('beezee_user_id');
    if (!finalUserId) {
      const { data: { session } } = await supabase.auth.getSession();
      finalUserId = session?.user?.id;
    }

    if (!finalUserId) return;

    try {
      const { data, error } = await supabase
        .from('inventory')
        .update({ quantity: newQuantity, updated_at: new Date().toISOString() })
        .eq('id', item.id)
        .select()
        .single();

      if (error) throw error;
      
      // If quantity decreased (sale), create income transaction
      if (change < 0 && item.selling_price > 0) {
        const quantitySold = Math.abs(change);
        const transaction = await createInventorySaleTransaction(item, quantitySold, finalUserId);
        if (!transaction) {
          console.warn('[Inventory] Failed to create sale transaction');
          toast.error('Quantity updated, but failed to create sale transaction.');
        } else {
          console.log('[Inventory] Sale transaction created:', transaction);
        }
      }
      // If quantity increased (purchase), create expense transaction
      else if (change > 0 && item.cost_price > 0) {
        const purchaseItem = { ...item, quantity: change };
        const transaction = await createInventoryPurchaseTransaction(purchaseItem, finalUserId);
        if (!transaction) {
          console.warn('[Inventory] Failed to create purchase transaction');
          toast.error('Quantity updated, but failed to create purchase transaction.');
        } else {
          console.log('[Inventory] Purchase transaction created:', transaction);
        }
      }
      
      setInventory(inventory.map(i => i.id === item.id ? data : i));
      toast.success(t('inventory.quantityUpdated', 'Updated'));
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error(t('inventory.updateFailed', 'Failed'));
    }
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (item.description?.toLowerCase().includes(searchQuery.toLowerCase()));
    if (filter === 'low_stock') return matchesSearch && Number(item.quantity) <= Number(item.min_stock_level) && Number(item.quantity) > 0;
    if (filter === 'out_of_stock') return matchesSearch && Number(item.quantity) === 0;
    return matchesSearch;
  });

  const lowStockCount = inventory.filter(item => Number(item.quantity) <= Number(item.min_stock_level) && Number(item.quantity) > 0).length;
  const outOfStockCount = inventory.filter(item => Number(item.quantity) === 0).length;

  return (
    <SwipeToRefresh onRefresh={loadInventory}>
      <div className="inventory-container pb-24">
        {/* Modern Header */}
        <div className="reports-header-section pt-4">
          <div className="reports-title-row">
            <div className="px-4">
              <BeeZeeLogo />
            </div>
            <div className="flex items-center gap-2">
              {!isSearchOpen ? (
                <h1 className="reports-title">{t('nav.inventory', 'Stock')}</h1>
              ) : (
                <div className="flex-1 flex items-center bg-gray-50 rounded-2xl px-3 py-1 animate-slide-right">
                  <Search size={18} className="text-gray-400 mr-2" />
                  <input
                    autoFocus
                    type="text"
                    placeholder={t('common.search', 'Search...')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent border-none focus:ring-0 text-sm font-bold flex-1 py-2"
                  />
                  <button onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}>
                    <X size={18} className="text-gray-400" />
                  </button>
                </div>
              )}
            </div>
            {!isSearchOpen && (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsSearchOpen(true)}
                  className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 active:scale-95 transition-transform"
                >
                  <Search size={20} />
                </button>
                <button
                  onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
                  className="px-4 py-2 bg-primary-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-primary-200 hover:bg-primary-700 active:scale-95 transition-transform flex items-center gap-2"
                  title={t('inventory.addItem', 'Add Item')}
                >
                  <Plus size={18} strokeWidth={3} />
                  <span>{t('inventory.addItem', 'Add Item')}</span>
                </button>
              </div>
            )}
          </div>

          {/* Premium Tabs */}
          <div className="reports-tabs-container">
            <button
              onClick={() => setFilter('all')}
              className={`reports-tab-button ${filter === 'all' ? 'active' : ''}`}
            >
              {t('common.all', 'All')} ({inventory.length})
            </button>
            <button
              onClick={() => setFilter('low_stock')}
              className={`reports-tab-button ${filter === 'low_stock' ? 'active' : ''}`}
            >
              <div className="w-2 h-2 rounded-full bg-orange-400 mr-2" />
              {t('inventory.lowStock', 'Low')} ({lowStockCount})
            </button>
            <button
              onClick={() => setFilter('out_of_stock')}
              className={`reports-tab-button ${filter === 'out_of_stock' ? 'active' : ''}`}
            >
              <div className="w-2 h-2 rounded-full bg-red-400 mr-2" />
              {t('inventory.outOfStock', 'Out')} ({outOfStockCount})
            </button>
          </div>
        </div>

        {/* List Content */}
        <div className="px-4 mt-6 pb-32">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 opacity-20">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin mb-4" />
            </div>
          ) : inventory.length > 0 ? (
            <div className="mb-8 space-y-4 animate-slide-up">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-5 rounded-[28px] border border-blue-100 shadow-sm">
                  <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest block mb-1">Stock Value</span>
                  <span className="text-xl font-black text-gray-900">R{inventory.reduce((sum, item) => sum + (Number(item.cost_price) * Number(item.quantity)), 0).toLocaleString()}</span>
                </div>
                <div className="bg-orange-50 p-5 rounded-[28px] border border-orange-100 shadow-sm">
                  <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest block mb-1">Low Stock</span>
                  <span className="text-xl font-black text-gray-900">{lowStockCount + outOfStockCount} Items</span>
                </div>
              </div>
            </div>
          ) : null}


          {loading ? null : filteredInventory.length === 0 ? (
            <EmptyState
              type="inventory"
              title={t('inventory.noItems', 'No Stock Found')}
              description={t('inventory.noItemsDesc', 'Add items to track your stock.')}
              actionLabel={t('common.add', 'Add Item')}
              onAction={() => setIsModalOpen(true)}
            />
          ) : (
            <div className="space-y-4 pb-10">
              {filteredInventory.map(item => {
                const isLow = Number(item.quantity) <= Number(item.min_stock_level) && Number(item.quantity) > 0;
                const isOut = Number(item.quantity) === 0;
                
                return (
                  <div key={item.id} className="bg-white p-5 rounded-[28px] border border-gray-50 shadow-sm animate-slide-up">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isOut ? 'bg-red-50 text-red-500' : isLow ? 'bg-orange-50 text-orange-500' : 'bg-blue-50 text-blue-500'}`}>
                          <Package size={20} strokeWidth={2.5} />
                        </div>
                        <div>
                          <h3 className="text-sm font-black text-gray-900 mb-0.5">{item.name}</h3>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.category || 'General'}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => { setEditingItem(item); setIsModalOpen(true); }}
                          className="p-2 text-gray-300 hover:text-gray-900 active:scale-95 transition-transform"
                          title={t('common.edit', 'Edit')}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item)}
                          className="p-2 text-gray-300 hover:text-red-500 active:scale-95 transition-transform"
                          title={t('common.delete', 'Delete')}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-4">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t('inventory.quantity', 'Stock')}</span>
                        <div className="flex items-center gap-2">
                          <span className={`text-lg font-black ${isOut ? 'text-red-500' : isLow ? 'text-orange-500' : 'text-gray-900'}`}>
                            {item.quantity} <span className="text-xs opacity-50">{item.unit}</span>
                          </span>
                          {(isLow || isOut) && <AlertTriangle size={14} className={isOut ? 'text-red-500' : 'text-orange-500'} />}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleUpdateQuantity(item, -1)}
                          className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 active:scale-90 transition-transform shadow-sm"
                        >
                          <MinusCircle size={20} />
                        </button>
                        <button
                          onClick={() => handleUpdateQuantity(item, 1)}
                          className="w-10 h-10 rounded-full bg-[#2C2C2E] flex items-center justify-center text-white active:scale-90 transition-transform shadow-sm"
                        >
                          <PlusCircle size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <FloatingNavBar />
        <AddInventoryModal
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); setEditingItem(null); }}
          onSubmit={async (data) => {
            try {
              // Get user ID from auth store or localStorage (custom auth system)
              let finalUserId = user?.id || localStorage.getItem('beezee_user_id');
              
              // Try to get Supabase session if available
              if (!finalUserId) {
                const { data: { session } } = await supabase.auth.getSession();
                finalUserId = session?.user?.id;
              }
              
              if (!finalUserId) {
                throw new Error('Authentication required. Please log in again.');
              }
              
              console.log('[Inventory] Using user ID:', finalUserId);
              console.log('[Inventory] Submitting inventory data:', data);

              if (editingItem) {
                const { data: updated, error } = await supabase
                  .from('inventory')
                  .update(data)
                  .eq('id', editingItem.id)
                  .select()
                  .single();
                
                if (error) {
                  console.error('[Inventory] Update error:', error);
                  throw new Error(error.message || 'Failed to update item');
                }
                
                // Create transaction if quantity increased (new purchase)
                const transaction = await handleInventoryQuantityIncrease(editingItem, updated, finalUserId);
                if (transaction) {
                  console.log('[Inventory] Purchase transaction created on update:', transaction);
                }
                
                setInventory(inventory.map(i => i.id === editingItem.id ? updated : i));
                toast.success(t('inventory.updated', 'Item updated successfully'));
              } else {
                // Insert with user_id - RLS will check auth.uid() matches user_id
                const { data: newItem, error } = await supabase
                  .from('inventory')
                  .insert({ ...data, user_id: finalUserId })
                  .select()
                  .single();
                
                if (error) {
                  console.error('[Inventory] Insert error:', error);
                  console.error('[Inventory] Error details:', JSON.stringify(error, null, 2));
                  
                  // If RLS error, provide helpful message
                  if (error.message?.includes('row-level security') || error.code === '42501') {
                    throw new Error('Permission denied. Please ensure you are logged in with a valid session.');
                  }
                  
                  throw new Error(error.message || 'Failed to add item');
                }
                
                // Create expense transaction for new inventory purchase
                if (newItem.cost_price > 0) {
                  console.log('[Inventory] Attempting to create purchase transaction for:', {
                    item: newItem.name,
                    cost_price: newItem.cost_price,
                    quantity: newItem.quantity,
                    userId: finalUserId,
                  });
                  
                  const transaction = await createInventoryPurchaseTransaction(newItem, finalUserId);
                  if (!transaction) {
                    console.error('[Inventory] Failed to create purchase transaction, but inventory was saved');
                    toast.error('Inventory saved, but failed to create expense transaction. Check console for details.', { duration: 5000 });
                  } else {
                    console.log('[Inventory] ✅ Purchase transaction created successfully:', transaction);
                    toast.success(`Expense transaction created: R${(newItem.cost_price * newItem.quantity).toFixed(2)}`);
                  }
                } else {
                  console.log('[Inventory] No cost price, skipping transaction creation');
                }
                
                setInventory([newItem, ...inventory]);
                toast.success(t('inventory.added', 'Item added successfully'));
              }
              
              setIsModalOpen(false);
              setEditingItem(null);
            } catch (error) {
              console.error('[Inventory] Submit error:', error);
              // Re-throw so AddInventoryModal can handle it
              throw error;
            }
          }}
          initialData={editingItem}
        />
      </div>
    </SwipeToRefresh>
  );
}
