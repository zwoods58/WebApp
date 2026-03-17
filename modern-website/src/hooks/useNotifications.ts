import { useState, useEffect } from 'react';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { useBusiness } from '@/contexts/BusinessContext';

export type NotificationType = 
  | 'money_in' 
  | 'money_out' 
  | 'low_inventory' 
  | 'credit_due' 
  | 'target_achieved' 
  | 'business_setup';

export interface Notification {
  id: string;
  business_id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  metadata?: Record<string, any>;
}

export function useNotifications() {
  const { business } = useBusiness();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = async () => {
    if (!business?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error: fetchError } = await supabaseAdmin
        .from('notifications')
        .select('*')
        .eq('business_id', business.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setNotifications(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error: updateError } = await supabaseAdmin
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (updateError) throw updateError;

      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
      throw err;
    }
  };

  const markAllAsRead = async () => {
    if (!business?.id) return;

    try {
      const { error: updateError } = await supabaseAdmin
        .from('notifications')
        .update({ read: true })
        .eq('business_id', business.id)
        .eq('read', false);

      if (updateError) throw updateError;

      setNotifications(prev =>
        prev.map(notif => ({ ...notif, read: true }))
      );
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      throw err;
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const { error: deleteError } = await supabaseAdmin
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (deleteError) throw deleteError;

      setNotifications(prev =>
        prev.filter(notif => notif.id !== notificationId)
      );
    } catch (err) {
      console.error('Error deleting notification:', err);
      throw err;
    }
  };

  const clearAll = async () => {
    if (!business?.id) return;

    try {
      const { error: deleteError } = await supabaseAdmin
        .from('notifications')
        .delete()
        .eq('business_id', business.id);

      if (deleteError) throw deleteError;

      setNotifications([]);
    } catch (err) {
      console.error('Error clearing all notifications:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [business?.id]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    loading,
    error,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    refresh: fetchNotifications
  };
}
