import { useEffect } from 'react';
import { CheckCircle2, Trash2, Loader2 } from 'lucide-react';
import { formatCurrency } from '../utils/i18n';

/**
 * Success Modal Component
 * Shows when transaction is saved successfully
 */
export function SuccessModal({ isOpen, onClose, transaction }) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-backdrop" onClick={onClose} aria-hidden="true" />
      <div className="confirmation-modal success-modal" role="dialog" aria-modal="true">
        <div className="success-icon-container">
          <CheckCircle2 size={72} />
        </div>
        <h2 className="confirmation-title">Success!</h2>
        <p className="confirmation-description">Transaction saved</p>
        {transaction && (
          <div className="transaction-preview">
            <div className={`transaction-preview-amount ${transaction.type}`}>
              {formatCurrency(transaction.amount)}
            </div>
            <div className="transaction-preview-description">
              {transaction.description}
            </div>
          </div>
        )}
        <button className="confirmation-button" onClick={onClose}>
          Done
        </button>
      </div>
    </>
  );
}

/**
 * Delete Confirmation Modal Component
 * Confirms before deleting a transaction
 */
export function DeleteModal({ isOpen, onClose, onConfirm, transaction }) {
  if (!isOpen) return null;

  return (
    <>
      <div className="modal-backdrop" onClick={onClose} aria-hidden="true" />
      <div className="confirmation-modal delete-modal" role="dialog" aria-modal="true">
        <div className="delete-icon-container">
          <Trash2 size={64} />
        </div>
        <h2 className="confirmation-title">Delete?</h2>
        <p className="confirmation-description">
          Are you sure you want to delete this transaction?
        </p>
        {transaction && (
          <div className="transaction-preview">
            <div className={`transaction-preview-amount ${transaction.type}`}>
              {formatCurrency(transaction.amount)}
            </div>
            <div className="transaction-preview-description">
              {transaction.description}
            </div>
          </div>
        )}
        <div className="confirmation-actions">
          <button className="confirmation-button delete-button" onClick={onConfirm}>
            Yes, Delete
          </button>
          <button className="confirmation-button cancel-button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}

/**
 * Loading Modal Component
 * Shows while processing transaction
 */
export function LoadingModal({ isOpen, message = 'Processing your transaction...' }) {
  if (!isOpen) return null;

  return (
    <>
      <div className="modal-backdrop" aria-hidden="true" />
      <div className="confirmation-modal loading-modal" role="dialog" aria-modal="true" aria-busy="true">
        <div className="loading-spinner-container">
          <Loader2 size={48} className="loading-spinner" />
        </div>
        <p className="loading-message">{message}</p>
      </div>
    </>
  );
}




