import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { supabase } from '../utils/supabase';
import { useAuthStore } from '../store/authStore';

export default function NotificationBadge() {
  const { user } = useAuthStore();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    loadUnreadCount();

    // Real-time subscription for new notifications
    const channel = supabase
      .channel('notifications-badge')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          loadUnreadCount();
        }
      )
      .subscribe();

    // Also listen for updates (mark as read)
    const updateChannel = supabase
      .channel('notifications-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          loadUnreadCount();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
      updateChannel.unsubscribe();
    };
  }, [user]);

  async function loadUnreadCount() {
    if (!user) return;

    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('read', false)
        .eq('dismissed', false)
        .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`);

      if (error) throw error;

      setUnreadCount(count || 0);
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  }

  if (!user) return null;

  return (
    <Link to="/dashboard/notifications" className="relative">
      <Sparkles size={24} className="text-neutral-700 hover:text-powder-blue transition-colors" strokeWidth={2} />
      {unreadCount > 0 && (
        <span className="dashboard-notification-badge">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </Link>
  );
}


