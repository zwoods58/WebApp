import { useState, useRef, useEffect } from 'react';
import { X, Mic, Package, Tag, Hash } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

/**
 * Inventory Entry Modal Component
 * Bottom sheet modal for adding inventory items (voice or manual)
 */
export default function InventoryEntryModal({ 
  isOpen, 
  onClose, 
  onSubmit,
  onVoiceRecord
}) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [category, setCategory] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const modalRef = useRef(null);
  const nameInputRef = useRef(null);

  const categories = ['Drinks', 'Food', 'Stock', 'Supplies', 'Other'];

  useEffect(() => {
    if (isOpen) {
      nameInputRef.current?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      // Reset form when modal closes
      setName('');
      setQuantity('');
      setCostPrice('');
      setSellingPrice('');
      setCategory('');
      setIsSubmitting(false);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleDragStart = (e) => {
    setIsDragging(true);
    setDragStartY(e.touches ? e.touches[0].clientY : e.clientY);
  };

  const handleDrag = (e) => {
    if (!isDragging) return;
    const currentY = e.touches ? e.touches[0].clientY : e.clientY;
    const diff = currentY - dragStartY;
    if (diff > 100) {
      onClose();
      setIsDragging(false);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleVoiceClick = async () => {
    if (onVoiceRecord) {
      await onVoiceRecord();
    }
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
    
    if (!quantity || isNaN(parseFloat(quantity)) || parseFloat(quantity) <= 0) {
      toast.error(t('inventory.quantityRequired', 'Valid quantity is required'));
      return;
    }

    setIsSubmitting(true);

    try {
      const inventoryData = {
        name: name.trim(),
        quantity: parseFloat(quantity),
        cost_price: parseFloat(costPrice) || 0,
        selling_price: parseFloat(sellingPrice) || 0,
        category: category || 'Other',
        unit: 'units',
        min_stock_level: 0,
        description: ''
      };

      console.log('[InventoryEntryModal] Submitting inventory:', inventoryData);
      
      // Call onSubmit (which should be async)
      await onSubmit(inventoryData);
      
      // Reset form
      setName('');
      setQuantity('');
      setCostPrice('');
      setSellingPrice('');
      setCategory('');
      
      // Close modal on success
      onClose();
      
      // Success toast is handled by Dashboard's handleInventorySubmit
    } catch (error) {
      console.error('[InventoryEntryModal] Error submitting:', error);
      toast.error(error?.message || t('inventory.submitError', 'Failed to add item. Please try again.'));
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="modal-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />
      <div 
        className="transaction-entry-modal" // Reusing style for consistency
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="inventory-modal-title"
      >
        <div
          className="modal-drag-handle"
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
          onMouseMove={handleDrag}
          onTouchMove={handleDrag}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchEnd={handleDragEnd}
        />
        
        <div className="modal-header-section">
          <button
            className="modal-close-button"
            onClick={onClose}
            aria-label={t('common.cancel', 'Close modal')}
          >
            <X size={24} />
          </button>
          <h2 id="inventory-modal-title" className="modal-title flex-1 text-center">{t('nav.inventory', 'Inventory')}</h2>
          <button
            type="submit"
            form="inventory-form"
            disabled={!name || !quantity || !name.trim() || isNaN(parseFloat(quantity)) || parseFloat(quantity) <= 0 || isSubmitting}
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              t('inventory.addItem', 'Add')
            )}
          </button>
        </div>

        <div 
          className="flex-1 overflow-y-auto"
          style={{ 
            WebkitOverflowScrolling: 'touch', 
            touchAction: 'pan-y',
            paddingBottom: 'calc(24px + var(--safe-area-bottom, 0px) + 100px)',
            minHeight: 0
          }}
        >
          <form id="inventory-form" onSubmit={handleSubmit} className="transaction-form">
          <div className="form-field">
            <button
              type="button"
              onClick={handleVoiceClick}
              className="voice-prompt-button"
            >
              <Mic size={24} />
              <span>{t('inventory.useVoice', 'Use Voice to Add Item')}</span>
            </button>
          </div>

          <div className="form-field">
            <label htmlFor="inv-name" className="form-label">{t('inventory.name', 'Item Name')} *</label>
            <div className="relative">
              <Package size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="inv-name"
                ref={nameInputRef}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('inventory.namePlaceholder', 'e.g., Coke 330ml')}
                className="description-input pl-10"
                required
              />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="inv-qty" className="form-label">{t('inventory.quantity', 'Qty')} *</label>
            <div className="relative">
              <Hash size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="inv-qty"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="0"
                className="description-input pl-10"
                required
                min="1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-field">
              <label htmlFor="inv-cost" className="form-label">{t('inventory.cost', 'Cost')} (R)</label>
              <div className="relative">
                <Tag size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="inv-cost"
                  type="number"
                  step="0.01"
                  value={costPrice}
                  onChange={(e) => setCostPrice(e.target.value)}
                  placeholder="0.00"
                  className="description-input pl-10"
                  min="0"
                />
              </div>
            </div>
            <div className="form-field">
              <label htmlFor="inv-selling" className="form-label">{t('inventory.sellingPrice', 'Selling')} (R)</label>
              <div className="relative">
                <Tag size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="inv-selling"
                  type="number"
                  step="0.01"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(e.target.value)}
                  placeholder="0.00"
                  className="description-input pl-10"
                  min="0"
                />
              </div>
            </div>
          </div>

          <div className="form-field">
            <label className="form-label">{t('common.category', 'Category')}</label>
            <div className="category-pills">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`category-pill ${category === cat ? 'active' : ''}`}
                  onClick={() => setCategory(cat)}
                >
                  {t(`categories.${cat.toLowerCase()}`, cat)}
                </button>
              ))}
            </div>
          </div>
          </form>
        </div>
      </div>
    </>
  );
}




