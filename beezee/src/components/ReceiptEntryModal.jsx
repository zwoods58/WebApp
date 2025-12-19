import { useState, useRef, useEffect } from 'react';
import { X, Camera, Upload } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * Receipt Entry Modal Component
 * Bottom sheet modal for scanning receipts
 */
export default function ReceiptEntryModal({ 
  isOpen, 
  onClose, 
  onTakePhoto,
  onUploadImage
}) {
  const { t } = useTranslation();
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const modalRef = useRef(null);

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

  const handleTakePhoto = () => {
    if (onTakePhoto) {
      onTakePhoto();
    }
  };

  const handleUploadClick = () => {
    if (onUploadImage) {
      // Create a temporary file input
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e) => {
        const file = e.target.files?.[0];
        if (file && onUploadImage) {
          onUploadImage(file);
        }
      };
      input.click();
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
        className="transaction-entry-modal"
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="receipt-modal-title"
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
          <h2 id="receipt-modal-title" className="modal-title flex-1 text-center">{t('dashboard.scan', 'Scan Receipt')}</h2>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>

        <div className="transaction-form">
          <div className="space-y-3">
            <button
              onClick={handleTakePhoto}
              className="w-full flex items-center justify-between p-5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-2xl border-2 border-blue-100 hover:border-blue-200 hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 group shadow-sm hover:shadow-md active:scale-[0.98]"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                  <Camera size={24} className="text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="font-black text-base">{t('receipts.takePhoto', 'Take Photo')}</p>
                  <p className="text-xs text-blue-600 opacity-80 font-semibold">{t('receipts.takePhotoDesc', 'Capture a new receipt')}</p>
                </div>
              </div>
            </button>

            <button
              onClick={handleUploadClick}
              className="w-full flex items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-slate-50 text-gray-700 rounded-2xl border-2 border-gray-100 hover:border-gray-200 hover:from-gray-100 hover:to-slate-100 transition-all duration-200 group shadow-sm hover:shadow-md active:scale-[0.98]"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                  <Upload size={24} className="text-gray-600" />
                </div>
                <div className="text-left">
                  <p className="font-black text-base">{t('receipts.upload', 'Upload from Gallery')}</p>
                  <p className="text-xs text-gray-500 font-semibold">{t('receipts.uploadDesc', 'Select an image file')}</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
