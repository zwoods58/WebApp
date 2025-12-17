import { Mic, Camera, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/**
 * Quick Action Buttons Component
 * Three large buttons for voice recording, receipt scanning, and bookings
 */
export default function QuickActionButtons({ onVoiceClick, onReceiptClick }) {
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
    </div>
  );
}
