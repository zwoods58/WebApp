"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Bell, Check, X, Search, Filter, DollarSign, TrendingDown, Package, Clock, Star, Settings, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { useLanguage } from '@/hooks/LanguageContext';
import { useNotifications, NotificationType, type Notification as AppNotification } from '@/hooks';
import { useToastContext } from '@/providers/ToastProvider';
import Header from '@/components/universal/Header';
import BottomNav from '@/components/universal/BottomNav';
import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext';

const notificationIcons = {
  money_in: DollarSign,
  money_out: TrendingDown,
  low_inventory: Package,
  credit_due: Clock,
  target_achieved: Star,
  business_setup: Settings
};

const notificationColors = {
  money_in: 'text-green-600 bg-green-50 border-green-200',
  money_out: 'text-red-600 bg-red-50 border-red-200',
  low_inventory: 'text-orange-600 bg-orange-50 border-orange-200',
  credit_due: 'text-purple-600 bg-purple-50 border-purple-200',
  target_achieved: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  business_setup: 'text-blue-600 bg-blue-50 border-blue-200'
};

const typeLabels = {
  money_in: 'Money In',
  money_out: 'Money Out',
  low_inventory: 'Low Inventory',
  credit_due: 'Credit Due',
  target_achieved: 'Target Achieved',
  business_setup: 'Business Setup'
};

export default function NotificationsPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const { business } = useUnifiedAuth();
  const { 
    notifications, 
    loading, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification,
    unreadCount 
  } = useNotifications();
  const { showInfo, showSuccess, showError } = useToastContext();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<NotificationType | 'all'>('all');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);

  const filteredNotifications = notifications.filter((notification: AppNotification) => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || notification.type === filterType;
    const matchesReadStatus = !showUnreadOnly || !notification.read;
    return matchesSearch && matchesType && matchesReadStatus;
  });

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id);
    } catch (error) {
      showError('Failed to mark as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) return;
    
    try {
      await markAllAsRead();
      showSuccess(`Marked ${unreadCount} notifications as read`);
    } catch (error) {
      showError('Failed to mark all as read');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNotification(id);
      showSuccess('Notification deleted');
    } catch (error) {
      showError('Failed to delete notification');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedNotifications.length === 0) return;
    
    try {
      await Promise.all(selectedNotifications.map(id => deleteNotification(id)));
      showSuccess(`Deleted ${selectedNotifications.length} notifications`);
      setSelectedNotifications([]);
    } catch (error) {
      showError('Failed to delete notifications');
    }
  };

  const handleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map((n: AppNotification) => n.id));
    }
  };

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return 'Unknown time';
    }
  };

  const types: Array<NotificationType | 'all'> = ['all', ...Object.keys(typeLabels) as NotificationType[]];

  if (!business?.id) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <Header industry="retail" country="ke" />
        <div className="p-4 max-w-md mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <h3 className="text-sm font-medium text-yellow-800">Business Setup Required</h3>
            <p className="text-xs text-yellow-700 mt-1">Please set up your business profile to view notifications.</p>
          </div>
        </div>
        <BottomNav industry="retail" country="ke" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header industry="retail" country="ke" />

      <div className="p-4 max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-gray-500">{unreadCount} unread</p>
            )}
          </div>
          <Bell size={24} className="text-gray-600" />
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 mb-4">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="px-3 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
            >
              Mark All Read ({unreadCount})
            </button>
          )}
          
          {selectedNotifications.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="px-3 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors flex items-center gap-1"
            >
              <Trash2 size={16} />
              Delete ({selectedNotifications.length})
            </button>
          )}
        </div>

        {/* Search and Filter */}
        <div className="space-y-3 mb-6">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto">
            {types.map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  filterType === type
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 border border-gray-200'
                }`}
              >
                {type === 'all' ? 'All' : typeLabels[type as NotificationType]}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showUnreadOnly}
              onChange={(e) => setShowUnreadOnly(e.target.checked)}
              className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
            />
            <span className="text-gray-700">Unread only</span>
          </label>
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">
              <Bell size={48} className="mx-auto animate-pulse" />
            </div>
            <p className="text-gray-600">Loading notifications...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">
              <Bell size={48} className="mx-auto" />
            </div>
            <p className="text-gray-600">No notifications found</p>
            <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Select All */}
            {filteredNotifications.length > 1 && (
              <label className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  checked={selectedNotifications.length === filteredNotifications.length}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Select All</span>
              </label>
            )}

            {filteredNotifications.map((notification: AppNotification) => {
              const Icon = notificationIcons[notification.type as NotificationType];
              const colorClass = notificationColors[notification.type as NotificationType];
              const isSelected = selectedNotifications.includes(notification.id);
              
              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-xl border transition-all ${
                    !notification.read ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
                  } ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedNotifications(prev => [...prev, notification.id]);
                        } else {
                          setSelectedNotifications(prev => prev.filter(id => id !== notification.id));
                        }
                      }}
                      className="mt-1 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                    />
                    
                    <div className={`p-2 rounded-lg ${colorClass} flex-shrink-0`}>
                      <Icon size={16} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className={`text-sm font-medium text-gray-900 ${!notification.read ? 'font-semibold' : ''}`}>
                            {notification.title}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1 break-words">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {formatTime(notification.created_at)}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-1 ml-2">
                          {!notification.read && (
                            <button
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                              title="Mark as read"
                            >
                              <Check size={14} />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(notification.id)}
                            className="p-1 text-gray-400 hover:bg-gray-100 rounded"
                            title="Delete"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <BottomNav industry="retail" country="ke" />
    </div>
  );
}
