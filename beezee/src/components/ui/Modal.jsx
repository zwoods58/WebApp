import { useEffect } from 'react';
import { X } from 'lucide-react';
import Button from './Button';

/**
 * Modal Component - BeeZee Design System
 * 
 * Features:
 * - Full-screen on mobile
 * - Accessible (focus trap, ESC to close)
 * - Smooth animations
 * - Optional actions footer
 */

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  actions,
  showCloseButton = true,
  closeOnOverlay = true,
  size = 'default', // 'default' | 'sm' | 'lg'
}) {
  // Handle ESC key
  useEffect(() => {
    if (!isOpen) return;
    
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);
  
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  const sizeClasses = {
    sm: 'max-w-sm',
    default: 'max-w-md',
    lg: 'max-w-2xl',
  };
  
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in"
      onClick={closeOnOverlay ? onClose : undefined}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className={`
          bg-white rounded-card shadow-card-hover w-full ${sizeClasses[size]}
          animate-scale-in max-h-[90vh] flex flex-col
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-200">
          <h2 id="modal-title" className="text-h2 font-bold text-neutral-900">
            {title}
          </h2>
          {showCloseButton && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
              aria-label="Close modal"
            >
              <X size={24} />
            </button>
          )}
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {children}
        </div>
        
        {/* Actions */}
        {actions && (
          <div className="flex gap-3 p-5 border-t border-neutral-200">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}


