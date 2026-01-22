import { useState, useEffect } from 'react';
import { X, Save, Package, Tag, Hash, TrendingUp, Info, Mic, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import VoiceBookingRecorder from './VoiceBookingRecorder';

export default function AddInventoryModal({ isOpen, onClose, onSubmit, initialData = null }) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('units');
  const [costPrice, setCostPrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [category, setCategory] = useState('');
  const [minStock, setMinStock] = useState('0');
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setDescription(initialData.description || '');
      setQuantity(initialData.quantity?.toString() || '');
      setUnit(initialData.unit || 'units');
      setCostPrice(initialData.cost_price?.toString() || '');
      setSellingPrice(initialData.selling_price?.toString() || '');
      setCategory(initialData.category || '');
      setMinStock(initialData.min_stock_level?.toString() || '0');
    } else {
      resetForm();
    }
  }, [initialData, isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  const resetForm = () => {
    setName('');
    setDescription('');
    setQuantity('');
    setUnit('units');
    setCostPrice('');
    setSellingPrice('');
    setCategory('');
    setMinStock('0');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isSubmitting) return; // Prevent double submission

    // Validation
    if (!name || !name.trim()) {
      toast.error(t('inventory.nameRequired', 'Item name is required'));
      return;
    }

    if (!quantity || isNaN(parseFloat(quantity)) || parseFloat(quantity) < 0) {
      toast.error(t('inventory.quantityRequired', 'Valid quantity is required'));
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare data with proper number conversion
      const submitData = {
        name: name.trim(),
        description: description.trim() || null,
        quantity: parseFloat(quantity),
        unit: unit || 'units',
        cost_price: costPrice ? parseFloat(costPrice) : 0,
        selling_price: sellingPrice ? parseFloat(sellingPrice) : 0,
        category: category.trim() || null,
        min_stock_level: minStock ? parseFloat(minStock) : 0,
      };

      // Validate numeric fields
      if (isNaN(submitData.quantity) || submitData.quantity < 0) {
        throw new Error('Invalid quantity. Please enter a valid number.');
      }
      if (submitData.cost_price < 0 || submitData.selling_price < 0 || submitData.min_stock_level < 0) {
        throw new Error('Prices and stock levels cannot be negative.');
      }

      console.log('[AddInventoryModal] Submitting data:', submitData);

      await onSubmit(submitData);

      // Only reset if onSubmit succeeds (doesn't throw)
      resetForm();
      onClose(); // Close the modal on success
    } catch (error) {
      console.error('[AddInventoryModal] Error submitting inventory:', error);
      const errorMessage = error?.message || error?.error?.message || 'Failed to save item. Please try again.';
      toast.error(errorMessage, { duration: 5000 });
      // Don't close the modal on error so user can fix and retry
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 flex items-end justify-center sm:items-center p-0 sm:p-4" style={{ zIndex: 1001 }}>
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />

        {/* Modal Content */}
        <div
          className="relative bg-white w-full max-w-md rounded-t-[32px] sm:rounded-3xl shadow-2xl overflow-hidden animate-slide-up sm:animate-fade-in"
          style={{
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header - Fixed */}
          <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-100" style={{ flexShrink: 0, minHeight: '100px' }}>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {initialData ? t('inventory.editItem', 'Edit Item') : t('inventory.addItem', 'Add Item')}
              </h2>
              <p className="text-gray-500 text-sm">{t('inventory.itemDetails', 'Manage your stock details')}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} className="text-gray-400" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div
            className="flex-1 overflow-y-auto"
            style={{
              WebkitOverflowScrolling: 'touch',
              touchAction: 'pan-y',
              overscrollBehavior: 'contain',
              minHeight: 0,
              maxHeight: 'calc(90vh - 100px)'
            }}
          >
            <div className="p-6 pt-4" style={{ paddingBottom: '120px' }}>
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {/* Voice Input Trigger */}
                {!initialData && (
                  <div className="bg-primary/10 rounded-2xl p-4 flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary-dark">
                        <Mic size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{t('common.voiceEntry', 'Voice Entry')}</p>
                        <p className="text-xs text-gray-700">{t('inventory.voiceHelp', 'Try: "Add 10 cans of Coke costing 10 rand selling for 15"')}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('[AddInventoryModal] Voice entry button clicked');
                        setIsVoiceRecording(true);
                      }}
                      className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md active:scale-95 transition-all"
                    >
                      {t('common.start', 'Start')}
                    </button>
                  </div>
                )}

                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Package size={16} />
                    {t('inventory.name', 'Item Name')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Coca Cola 330ml"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  />
                </div>

                {/* Quantity & Unit */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Hash size={16} />
                      {t('inventory.quantity', 'Quantity')} *
                    </label>
                    <input
                      type="number"
                      required
                      step="any"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="0"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Info size={16} />
                      {t('inventory.unit', 'Unit')}
                    </label>
                    <select
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all appearance-none"
                    >
                      <option value="units">Units</option>
                      <option value="kg">kg</option>
                      <option value="liters">Liters</option>
                      <option value="boxes">Boxes</option>
                      <option value="packs">Packs</option>
                    </select>
                  </div>
                </div>

                {/* Prices */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Tag size={16} />
                      {t('inventory.costPrice', 'Cost Price')} (R)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={costPrice}
                      onChange={(e) => setCostPrice(e.target.value)}
                      placeholder="0.00"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <TrendingUp size={16} />
                      {t('inventory.sellingPrice', 'Selling Price')} (R)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={sellingPrice}
                      onChange={(e) => setSellingPrice(e.target.value)}
                      placeholder="0.00"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-bold text-primary-dark"
                    />
                  </div>
                </div>

                {/* Category & Min Stock */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Tag size={16} />
                      {t('common.category', 'Category')}
                    </label>
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="e.g., Drinks"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 text-orange-600">
                      <AlertTriangle size={16} />
                      {t('inventory.minStock', 'Min Stock Level')}
                    </label>
                    <input
                      type="number"
                      value={minStock}
                      onChange={(e) => setMinStock(e.target.value)}
                      placeholder="5"
                      className="w-full px-4 py-3 bg-gray-50 border border-orange-100 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Info size={16} />
                    {t('common.notes', 'Notes')}
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Any additional details..."
                    rows="2"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!name || !quantity || isSubmitting}
                  className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-primary/20 hover:bg-primary-dark active:scale-[0.98] transition-all disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed mt-4 mb-4 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {t('common.saving', 'Saving...')}
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      {initialData ? t('common.update', 'Update Item') : t('inventory.addItem', 'Add to Inventory')}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Voice Recorder Overlay */}
      {isVoiceRecording && (
        <VoiceBookingRecorder
          type="inventory"
          onClose={() => {
            console.log('[AddInventoryModal] Voice recorder closed');
            setIsVoiceRecording(false);
          }}
          onCancel={() => {
            console.log('[AddInventoryModal] Voice recorder cancelled');
            setIsVoiceRecording(false);
          }}
          onSuccess={(data) => {
            console.log('[AddInventoryModal] Voice data received:', data);
            if (!data) {
              console.warn('[AddInventoryModal] No data received from voice recorder');
              return;
            }
            setName(data.name || '');
            setQuantity(data.quantity?.toString() || '');
            setCostPrice(data.cost_price?.toString() || '');
            setSellingPrice(data.selling_price?.toString() || '');
            setCategory(data.category || '');
            setIsVoiceRecording(false);
            toast.success(t('inventory.voiceSuccess', 'Voice data applied! Please review and save.'));
          }}
        />
      )}
    </>
  );
}

