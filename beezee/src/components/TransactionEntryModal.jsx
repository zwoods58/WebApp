import { useState, useRef, useEffect } from 'react';
import { X, Mic, Camera } from 'lucide-react';
import { formatCurrency } from '../utils/i18n';
import { useTranslation } from 'react-i18next';

/**
 * Transaction Entry Modal Component
 * Bottom sheet modal for adding transactions (voice or manual)
 */
export default function TransactionEntryModal({ 
  isOpen, 
  onClose, 
  onSubmit,
  initialType = 'expense',
  onVoiceRecord,
  onReceiptScan
}) {
  const { t } = useTranslation();
  const [transactionType, setTransactionType] = useState(initialType);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const modalRef = useRef(null);
  const amountInputRef = useRef(null);

  const categories = ['Sales', 'Food', 'Transport', 'Other'];

  useEffect(() => {
    if (isOpen) {
      amountInputRef.current?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
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
      setIsRecording(true);
      try {
        await onVoiceRecord();
      } finally {
        setIsRecording(false);
      }
    }
  };

  const handleReceiptClick = async () => {
    if (onReceiptScan) {
      await onReceiptScan();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !description || !category) {
      return;
    }
    onSubmit({
      type: transactionType,
      amount: parseFloat(amount),
      description,
      category,
      date: new Date().toISOString().split('T')[0],
    });
    // Reset form
    setAmount('');
    setDescription('');
    setCategory('');
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
        className="transaction-entry-modal"
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
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
          <h2 id="modal-title" className="modal-title">{t('dashboard.record', 'Record')}</h2>
        </div>

        <div className="transaction-type-toggle">
          <button
            className={`type-toggle-btn income ${transactionType === 'income' ? 'active' : ''}`}
            onClick={() => setTransactionType('income')}
          >
            {t('dashboard.income', 'Money In')}
          </button>
          <button
            className={`type-toggle-btn expense ${transactionType === 'expense' ? 'active' : ''}`}
            onClick={() => setTransactionType('expense')}
          >
            {t('dashboard.expense', 'Money Out')}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="transaction-form">
          <div className="form-field">
            <button
              type="button"
              onClick={handleVoiceClick}
              className={`voice-prompt-button ${isRecording ? 'recording' : ''}`}
            >
              <Mic size={24} />
              <span>{t('transactions.useVoice', 'Use Voice to Record')}</span>
            </button>
          </div>

          <div className="amount-input-container">
            <span className="currency-symbol">R</span>
            <input
              ref={amountInputRef}
              type="number"
              pattern="[0-9]*"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="amount-input"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="description" className="form-label">{t('transactions.description', 'Description')}</label>
            <input
              id="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('transactions.descPlaceholder', 'What was this for?')}
              className="description-input"
              required
            />
          </div>

          <div className="form-field">
            <label className="form-label">{t('transactions.category', 'Category')}</label>
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

          <button
            type="submit"
            className="save-transaction-button"
            disabled={!amount || !description || !category}
          >
            {t('common.save', 'Save Transaction')}
          </button>
        </form>
      </div>
    </>
  );
}
