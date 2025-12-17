import { Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useTranslation } from 'react-i18next';

/**
 * Dashboard Header Component
 * Shows greeting, date, and notification bell
 */
export default function DashboardHeader({ notificationCount = 0 }) {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('dashboard.morning', 'Good morning');
    if (hour < 18) return t('dashboard.afternoon', 'Good afternoon');
    return t('dashboard.evening', 'Good evening');
  };

  const getUserName = () => {
    if (user?.name) return user.name.split(' ')[0];
    return t('dashboard.friend', 'friend');
  };

  const today = format(new Date(), 'EEEE, d MMMM');

  return (
    <header className="dashboard-header">
      <div className="dashboard-header-left">
        <div className="dashboard-greeting">
          <Sparkles size={20} className="dashboard-greeting-icon" strokeWidth={2} />
          <span className="dashboard-greeting-text">
            {getGreeting()}, {getUserName()}
          </span>
        </div>
        <div className="dashboard-date">{today}</div>
      </div>

      <button
        className="dashboard-notification-button"
        onClick={() => navigate('/dashboard/notifications')}
        aria-label={t('dashboard.notifications', 'Notifications')}
      >
        <Sparkles size={24} className="dashboard-notification-icon" />
        {notificationCount > 0 && (
          <span className="dashboard-notification-badge" aria-hidden="true">
            {notificationCount > 9 ? '9+' : notificationCount}
          </span>
        )}
      </button>
    </header>
  );
}
