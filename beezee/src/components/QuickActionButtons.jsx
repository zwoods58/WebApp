import { Mic, Camera, Calendar, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/**
 * Quick Action Buttons Component
 * 2x2 grid for common actions
 */
export default function QuickActionButtons({ onVoiceClick, onReceiptClick, onInventoryClick }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleVoiceClick = () => {
    if (onVoiceClick) {
      onVoiceClick();
    } else {
      navigate('/dashboard/transactions/add?method=voice');
    }
  };

  const handleReceiptClick = () => {
    if (onReceiptClick) {
      onReceiptClick();
    } else {
      navigate('/dashboard/transactions/add?method=receipt');
    }
  };

  const handleBookingsClick = () => {
    navigate('/dashboard/bookings');
  };

  const handleInventoryClick = () => {
    if (onInventoryClick) {
      onInventoryClick();
    } else {
      navigate('/dashboard/inventory');
    }
  };

  return (
    <div className="quick-action-buttons">
      <button
        className="quick-action-button"
        onClick={handleVoiceClick}
        aria-label={t('dashboard.record', 'Record')}
      >
        <div className="quick-action-icon-container">
          <Mic size={28} />
        </div>
        <div className="quick-action-text">
          {t('dashboard.record', 'Record')}
        </div>
      </button>

      <button
        className="quick-action-button"
        onClick={handleReceiptClick}
        aria-label={t('dashboard.scan', 'Scan Receipt')}
      >
        <div className="quick-action-icon-container">
          <Camera size={28} />
        </div>
        <div className="quick-action-text">
          {t('dashboard.scan', 'Scan Receipt')}
        </div>
      </button>

      <button
        className="quick-action-button"
        onClick={handleBookingsClick}
        aria-label={t('nav.bookings', 'Bookings')}
      >
        <div className="quick-action-icon-container">
          <Calendar size={28} />
        </div>
        <div className="quick-action-text">
          {t('nav.bookings', 'Bookings')}
        </div>
      </button>

      <button
        className="quick-action-button"
        onClick={handleInventoryClick}
        aria-label={t('nav.inventory', 'Inventory')}
      >
        <div className="quick-action-icon-container">
          <Package size={28} />
        </div>
        <div className="quick-action-text">
          {t('nav.inventory', 'Inventory')}
        </div>
      </button>
    </div>
  );
}
