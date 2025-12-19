import { useTranslation } from 'react-i18next';

/**
 * BeeZee Logo Component
 * Displays the BeeZee logo with bee emoji and app name
 */
export default function BeeZeeLogo({ className = '' }) {
  const { t } = useTranslation();
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="text-2xl">🐝</div>
      <span className="text-xl font-black text-gray-900">BeeZee</span>
    </div>
  );
}

