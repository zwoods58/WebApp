import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { supabase } from '../utils/supabase'; // Disabled for demo
import { useAuthStore } from '../store/authStore';
import { Plus, Package, Search, AlertTriangle, ChevronLeft, Edit, Trash2, X, PlusCircle, MinusCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import SwipeToRefresh from '../components/SwipeToRefresh';
import FloatingNavBar from '../components/FloatingNavBar';
import AddInventoryModal from '../components/AddInventoryModal';
import { useTranslation } from 'react-i18next';
import BeeZeeLogo from '../components/BeeZeeLogo';
import EmptyState from '../components/EmptyState';
// import { createInventoryPurchaseTransaction, createInventorySaleTransaction, handleInventoryQuantityIncrease } from '../utils/inventoryTransactions'; // Replaced by local logic
import { useOfflineStore } from '../store/offlineStore';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import { useDemoData } from '../hooks/useDemoData';

export default function Inventory() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { inventory, addInventory, updateInventory, deleteInventory, addTransaction, loading } = useDemoData();

  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all'); // all, low_stock, out_of_stock
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const handleDeleteItem = async (item) => {
    if (!confirm(t('inventory.confirmDelete', `Are you sure you want to delete "${item.name}"?`))) {
      return;
    }

    try {
      await deleteInventory(item.id);
      toast.success(t('inventory.deleted', 'Item deleted successfully'));
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error(t('inventory.deleteFailed', 'Failed to delete item'));
    }
  };

  const handleUpdateQuantity = async (item, change) => {
    const oldQuantity = Number(item.quantity || item.stock || 0);
    const newQuantity = Math.max(0, oldQuantity + change);

    try {
      await updateInventory(item.id, { quantity: newQuantity, stock: newQuantity });

      // If quantity decreased (sale), create income transaction
      if (change < 0 && (item.selling_price || item.price) > 0) {
        const quantitySold = Math.abs(change);
        const price = item.selling_price || item.price || 0;
        await addTransaction({
          type: 'income',
          amount: quantitySold * price,
          description: `Sale: ${item.name} (x${quantitySold})`,
          category: 'Sales',
          method: 'Cash'
        });
      }
      // If quantity increased (purchase), create expense transaction
      else if (change > 0 && (item.cost_price) > 0) {
        const quantityBought = change;
        const cost = item.cost_price || 0;
        await addTransaction({
          type: 'expense',
          amount: quantityBought * cost,
          description: `Purchase: ${item.name} (x${quantityBought})`,
          category: 'Inventory',
          method: 'Cash'
        });
      }

      toast.success(t('inventory.quantityUpdated', 'Updated'));
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error(t('inventory.updateFailed', 'Failed'));
    }
  };

  const filteredInventory = inventory.filter(item => {
    const itemName = item.name || '';
    const itemDesc = item.description || '';
    const matchesSearch = itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (itemDesc.toLowerCase().includes(searchQuery.toLowerCase()));

    const quantity = Number(item.quantity || item.stock || 0);
    const minStock = Number(item.min_stock_level || 10);

    if (filter === 'low_stock') return matchesSearch && quantity <= minStock && quantity > 0;
    if (filter === 'out_of_stock') return matchesSearch && quantity === 0;
    return matchesSearch;
  });

  const lowStockCount = inventory.filter(item => {
    const quantity = Number(item.quantity || item.stock || 0);
    const minStock = Number(item.min_stock_level || 10);
    return quantity <= minStock && quantity > 0;
  }).length;

  const outOfStockCount = inventory.filter(item => Number(item.quantity || item.stock || 0) === 0).length;

  const handleRefresh = async () => {
    // No-op for demo
    return Promise.resolve();
  };

  return (
    <SwipeToRefresh onRefresh={handleRefresh}>
      <div className="inventory-container page-inventory pb-24">
        <PageHeader
          title={t('nav.inventory', 'Stock')}
          showSearch={true}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          tabs={[
            { id: 'all', label: `${t('common.all', 'All')} (${inventory.length})` },
            { id: 'low_stock', label: `${t('inventory.lowStock', 'Low')} (${lowStockCount})`, icon: <div className="w-2 h-2 rounded-full bg-orange-400 mr-2" /> },
            { id: 'out_of_stock', label: `${t('inventory.outOfStock', 'Out')} (${outOfStockCount})`, icon: <div className="w-2 h-2 rounded-full bg-red-400 mr-2" /> },
          ]}
          activeTab={filter}
          onTabChange={setFilter}
          actionButtons={[
            {
              icon: <><Plus size={18} /> {t('common.add', 'Add')}</>,
              onClick: () => { setEditingItem(null); setIsModalOpen(true); },
              className: "px-4 py-2 bg-primary-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-primary-200 hover:bg-primary-700 active:scale-95 transition-transform flex items-center gap-2",
              title: t('inventory.addItem', 'Add Item')
            }
          ]}
        />

        {/* List Content */}
        <div className="px-4 mt-6 pb-32">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 opacity-20">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin mb-4" />
            </div>
          ) : inventory.length > 0 ? (
            <div className="mb-8 space-y-4 animate-slide-up">
              <div className="grid grid-cols-2 gap-4">
                <StatCard
                  label="Stock Value"
                  value={`R${inventory.reduce((sum, item) => sum + (Number(item.cost_price || 0) * Number(item.quantity || item.stock || 0)), 0).toLocaleString()}`}
                  color="blue"
                />
                <StatCard
                  label="Low Stock"
                  value={`${lowStockCount + outOfStockCount} Items`}
                  color="orange"
                  icon={AlertTriangle}
                />
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
                const quantity = Number(item.quantity || item.stock || 0);
                const minStock = Number(item.min_stock_level || 10);
                const isLow = quantity <= minStock && quantity > 0;
                const isOut = quantity === 0;

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
                            {quantity} <span className="text-xs opacity-50">{item.unit || 'units'}</span>
                          </span>
                          {(isLow || isOut) && <AlertTriangle size={14} className={isOut ? 'text-red-500' : 'text-orange-500'} />}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleUpdateQuantity(item, -1)}
                          className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 active:scale-95 transition-transform shadow-sm"
                        >
                          <MinusCircle size={20} />
                        </button>
                        <button
                          onClick={() => handleUpdateQuantity(item, 1)}
                          className="w-10 h-10 rounded-full bg-[#2C2C2E] flex items-center justify-center text-white active:scale-95 transition-transform shadow-sm"
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
          onSubmit={async (submitData) => {
            try {
              if (editingItem) {
                await updateInventory(editingItem.id, submitData);

                // If quantity increased, create transaction
                const oldQty = Number(editingItem.quantity || editingItem.stock || 0);
                const newQty = Number(submitData.quantity || submitData.stock || 0);
                if (newQty > oldQty && submitData.cost_price > 0) {
                  await addTransaction({
                    type: 'expense',
                    amount: (newQty - oldQty) * submitData.cost_price,
                    description: `Stock Increase: ${submitData.name}`,
                    category: 'Inventory',
                    method: 'Cash'
                  });
                }

                toast.success(t('inventory.updated', 'Item updated successfully'));
              } else {
                const newItem = await addInventory(submitData);

                // Create expense transaction for new inventory purchase
                const cost = Number(submitData.cost_price || 0);
                const qty = Number(submitData.quantity || submitData.stock || 0);
                if (cost > 0 && qty > 0) {
                  await addTransaction({
                    type: 'expense',
                    amount: cost * qty,
                    description: `New Stock: ${submitData.name} (x${qty})`,
                    category: 'Inventory',
                    method: 'Cash'
                  });
                  toast.success(`Expense transaction created: R${(cost * qty).toFixed(2)}`);
                }

                toast.success(t('inventory.added', 'Item added successfully'));
              }

              setIsModalOpen(false);
              setEditingItem(null);
            } catch (error) {
              console.error('[Inventory Demo] Submit error:', error);
              throw error;
            }
          }}
          initialData={editingItem}
        />
      </div>
    </SwipeToRefresh>
  );
}