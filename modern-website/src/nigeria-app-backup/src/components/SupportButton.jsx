import { MessageCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { openWhatsApp, createSupportMessage } from '../utils/waMeLinks';

/**
 * Global Support Button Component
 * Opens WhatsApp with pre-filled support message
 */
export default function SupportButton({ context = 'general', className = '' }) {
  const { user } = useAuthStore();

  function handleClick() {
    const message = createSupportMessage(context, user?.id);
    openWhatsApp(message);
  }

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-2 text-info-600 hover:text-info-700 hover:underline transition-colors ${className}`}
    >
      <MessageCircle size={18} />
      <span>Need help? Chat with us</span>
    </button>
  );
}


