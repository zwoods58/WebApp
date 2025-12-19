import { Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * Pending Badge Component
 * Shows a badge indicating an item is pending sync
 */
export default function PendingBadge({ className = '' }) {
  const { t } = useTranslation();
  
  return (
    <span 
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700 border border-amber-200 ${className}`}
      title={t('offline.pending', 'Pending sync')}
    >
      <Clock size={10} className="animate-pulse" />
      {t('offline.pending', 'Pending')}
    </span>
  );
}

