"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { 
  User, 
  Bell, 
  Shield, 
  Globe, 
  CreditCard, 
  Database, 
  Smartphone,
  Moon,
  Sun,
  Volume2,
  Wifi,
  HelpCircle,
  ChevronRight,
  Check,
  X,
  AlertTriangle,
  Download,
  Trash2,
  Eye,
  EyeOff,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import Header from '@/components/universal/Header';
import BottomNav from '@/components/universal/BottomNav';
import { useLanguage } from '@/hooks/LanguageContext';
import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext';

export default function SettingsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const country = (params.country as string) || 'ke';
  const industry = (params.industry as string) || 'retail';
  const { t } = useLanguage();
  const { business } = useUnifiedAuth();
  
  // Check if accessed from More page
  const showProfileOnly = searchParams.get('from') === 'more';
  
  // Profile editing state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    businessName: '',
    email: '',
    phoneNumber: '',
    industry: '',
    country: ''
  });
  
  // Settings state
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoBackup, setAutoBackup] = useState(true);
  const [syncEnabled, setSyncEnabled] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [activeSection, setActiveSection] = useState('general');

  // Initialize edited profile when data loads
  useEffect(() => {
    // Only update when business data actually changes
    if (business) {
      setEditedProfile({
        businessName: business?.business_name || '',
        email: '',
        phoneNumber: business?.phone_number || '',
        industry: business?.industry || industry,
        country: business?.country || country.toUpperCase()
      });
    }
  }, [business?.id]); // Only depend on actual data changes, not all parameters

  // Profile editing functions
  const handleEditProfile = () => {
    setIsEditingProfile(true);
  };

  const handleSaveProfile = async () => {
    try {
      // Here you would save to your database/API
      console.log('Saving profile:', editedProfile);
      
      // Update local state (in real app, this would be handled by API response)
      // For now, just show success message
      alert('Profile updated successfully!');
      setIsEditingProfile(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error updating profile. Please try again.');
    }
  };

  const handleCancelEdit = () => {
    // Reset to original values
    if (business) {
      setEditedProfile({
        businessName: business?.business_name || '',
        email: '',
        phoneNumber: business?.phone_number || '',
        industry: business?.industry || industry,
        country: business?.country || country.toUpperCase()
      });
    }
    setIsEditingProfile(false);
  };

  const handleProfileChange = (field: string, value: string) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Define proper types for settings items
  type SettingsItem = {
    title: string;
    description: string;
    icon: any;
    action: 'toggle' | 'navigate' | 'button' | 'select' | 'modal';
    href?: string;
    value?: boolean;
    onChange?: (value: boolean) => void;
    onClick?: () => void;
    options?: string[];
  };

  type SettingsSection = {
    id: string;
    title: string;
    icon: any;
    items: SettingsItem[];
  };

  const settingsSections: SettingsSection[] = [
    {
      id: 'general',
      title: t('settings.general', 'General'),
      icon: User,
      items: [
        {
          title: t('settings.profile', 'Profile Information'),
          description: t('settings.profile_desc', 'Update your business details'),
          icon: User,
          action: 'navigate',
          href: '#profile'
        },
        {
          title: t('settings.language', 'Language'),
          description: t('settings.language_desc', 'Choose your preferred language'),
          icon: Globe,
          action: 'select',
          options: ['English', 'Swahili', 'Hausa', 'Yoruba', 'Igbo', 'Zulu', 'Xhosa', 'Afrikaans', 'Twi', 'Kinyarwanda', 'Luganda']
        },
        {
          title: t('settings.currency', 'Currency'),
          description: t('settings.currency_desc', 'Set your local currency'),
          icon: CreditCard,
          action: 'select',
          options: ['KES', 'NGN', 'GHS', 'ZAR', 'USD', 'EUR', 'GBP']
        }
      ]
    },
    {
      id: 'notifications',
      title: t('settings.notifications', 'Notifications'),
      icon: Bell,
      items: [
        {
          title: t('settings.push_notifications', 'Push Notifications'),
          description: t('settings.push_desc', 'Receive alerts on your device'),
          icon: Bell,
          action: 'toggle',
          value: notifications,
          onChange: setNotifications
        },
        {
          title: t('settings.sound_effects', 'Sound Effects'),
          description: t('settings.sound_desc', 'Play sounds for actions'),
          icon: Volume2,
          action: 'toggle',
          value: soundEnabled,
          onChange: setSoundEnabled
        },
        {
          title: t('settings.low_stock_alerts', 'Low Stock Alerts'),
          description: t('settings.stock_desc', 'Get notified when items are low'),
          icon: AlertTriangle,
          action: 'toggle',
          value: true,
          onChange: () => {}
        }
      ]
    },
    {
      id: 'appearance',
      title: t('settings.appearance', 'Appearance'),
      icon: Moon,
      items: [
        {
          title: t('settings.dark_mode', 'Dark Mode'),
          description: t('settings.dark_desc', 'Easier on the eyes at night'),
          icon: darkMode ? Moon : Sun,
          action: 'toggle',
          value: darkMode,
          onChange: setDarkMode
        },
        {
          title: t('settings.compact_view', 'Compact View'),
          description: t('settings.compact_desc', 'Show more content on screen'),
          icon: Smartphone,
          action: 'toggle',
          value: false,
          onChange: () => {}
        }
      ]
    },
    {
      id: 'data',
      title: t('settings.data_storage', 'Data & Storage'),
      icon: Database,
      items: [
        {
          title: t('settings.auto_backup', 'Auto Backup'),
          description: t('settings.backup_desc', 'Automatically backup your data'),
          icon: Database,
          action: 'toggle',
          value: autoBackup,
          onChange: setAutoBackup
        },
        {
          title: t('settings.sync_data', 'Sync Data'),
          description: t('settings.sync_desc', 'Keep data synced across devices'),
          icon: Wifi,
          action: 'toggle',
          value: syncEnabled,
          onChange: setSyncEnabled
        },
        {
          title: t('settings.export_data', 'Export Data'),
          description: t('settings.export_desc', 'Download your business data'),
          icon: Download,
          action: 'button',
          onClick: () => console.log('Export data')
        },
        {
          title: t('settings.clear_cache', 'Clear Cache'),
          description: t('settings.cache_desc', 'Free up storage space'),
          icon: Trash2,
          action: 'button',
          onClick: () => console.log('Clear cache')
        }
      ]
    },
    {
      id: 'security',
      title: t('settings.security', 'Security'),
      icon: Shield,
      items: [
        {
          title: t('settings.change_password', 'Change Password'),
          description: t('settings.password_desc', 'Update your account password'),
          icon: Shield,
          action: 'modal',
          onClick: () => setActiveSection('password')
        },
        {
          title: t('settings.two_factor', 'Two-Factor Auth'),
          description: t('settings.2fa_desc', 'Add an extra layer of security'),
          icon: Shield,
          action: 'toggle',
          value: false,
          onChange: () => {}
        },
        {
          title: t('settings.privacy', 'Privacy Settings'),
          description: t('settings.privacy_desc', 'Control your data privacy'),
          icon: Eye,
          action: 'navigate',
          href: '#privacy'
        }
      ]
    }
  ];

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    // Handle password change
    console.log('Password change:', { currentPassword, newPassword });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setActiveSection('general');
  };

  const currentSection = settingsSections.find(section => section.id === activeSection) || settingsSections[0];

  // Profile-only view component
  const ProfileOnlyView = () => (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header industry={industry} country={country} />

      <div className="p-4 max-w-md mx-auto">
        {/* Back Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <Link 
            href={`/Beezee-App/app/${country}/${industry}/more`}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>{t('common.back', 'Back to More')}</span>
          </Link>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-2xl font-bold text-gray-900 mb-6"
        >
          {t('settings.profile', 'Profile Information')}
        </motion.h1>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6"
        >
          <div className="flex items-start gap-4 mb-6">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-3xl">
              👤
            </div>
            <div className="flex-1">
              {isEditingProfile ? (
                <input
                  type="text"
                  value={editedProfile.businessName}
                  onChange={(e) => handleProfileChange('businessName', e.target.value)}
                  className="text-xl font-bold text-gray-900 mb-2 border-b-2 border-blue-300 focus:border-blue-500 outline-none bg-transparent"
                  placeholder="Business Name"
                />
              ) : (
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {editedProfile.businessName || 'Business Name'}
                </h2>
              )}
              {isEditingProfile ? (
                <input
                  type="email"
                  value={editedProfile.email}
                  onChange={(e) => handleProfileChange('email', e.target.value)}
                  className="text-gray-600 border-b-2 border-blue-300 focus:border-blue-500 outline-none bg-transparent mb-1 w-full"
                  placeholder="Email"
                />
              ) : (
                <p className="text-gray-600">{editedProfile.email || 'email@example.com'}</p>
              )}
              {isEditingProfile ? (
                <input
                  type="tel"
                  value={editedProfile.phoneNumber}
                  onChange={(e) => handleProfileChange('phoneNumber', e.target.value)}
                  className="text-gray-600 border-b-2 border-blue-300 focus:border-blue-500 outline-none bg-transparent"
                  placeholder="Phone Number"
                />
              ) : (
                <p className="text-gray-600">{editedProfile.phoneNumber || '+254 700 000 000'}</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600">{t('common.industry', 'Industry')}</span>
              {isEditingProfile ? (
                <select
                  value={editedProfile.industry}
                  onChange={(e) => handleProfileChange('industry', e.target.value)}
                  className="font-medium text-gray-900 border-b-2 border-blue-300 focus:border-blue-500 outline-none bg-transparent"
                >
                  <option value="retail">Retail</option>
                  <option value="food">Food</option>
                  <option value="services">Services</option>
                </select>
              ) : (
                <span className="font-medium text-gray-900">
                  {editedProfile.industry.charAt(0).toUpperCase() + editedProfile.industry.slice(1)}
                </span>
              )}
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600">{t('common.country', 'Country')}</span>
              {isEditingProfile ? (
                <select
                  value={editedProfile.country}
                  onChange={(e) => handleProfileChange('country', e.target.value)}
                  className="font-medium text-gray-900 border-b-2 border-blue-300 focus:border-blue-500 outline-none bg-transparent"
                >
                  <option value="KE">KE</option>
                  <option value="UG">UG</option>
                  <option value="TZ">TZ</option>
                </select>
              ) : (
                <span className="font-medium text-gray-900">
                  {editedProfile.country}
                </span>
              )}
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-gray-600">{t('more.member_since', 'Member since')}</span>
              <span className="font-medium text-gray-900">
                {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            {isEditingProfile ? (
              <>
                <button 
                  onClick={handleSaveProfile}
                  className="flex-1 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  {t('common.save', 'Save')}
                </button>
                <button 
                  onClick={handleCancelEdit}
                  className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  {t('common.cancel', 'Cancel')}
                </button>
              </>
            ) : (
              <button 
                onClick={handleEditProfile}
                className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                {t('settings.edit_profile', 'Edit Profile')}
              </button>
            )}
          </div>
        </motion.div>
      </div>

      <BottomNav industry={industry} country={country} />
    </div>
  );

  // Return profile-only view if accessed from More page
  if (showProfileOnly) {
    return <ProfileOnlyView />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header industry={industry} country={country} />

      <div className="p-4 max-w-md mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-gray-900 mb-6"
        >
          {t('settings.title', 'Settings')}
        </motion.h1>

        {/* Section Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 overflow-x-auto mb-6"
        >
          {settingsSections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeSection === section.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 border border-gray-200'
              }`}
            >
              <section.icon size={16} />
              {section.title}
            </button>
          ))}
        </motion.div>

        {/* Settings Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {activeSection === 'password' ? (
            /* Password Change Form */
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {t('settings.change_password', 'Change Password')}
              </h2>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('settings.current_password', 'Current Password')}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('settings.new_password', 'New Password')}
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('settings.confirm_password', 'Confirm New Password')}
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveSection('general')}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {t('settings.cancel', 'Cancel')}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    {t('settings.update_password', 'Update Password')}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* Settings Items */
            <div className="space-y-4">
              {currentSection.items.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="bg-white rounded-xl border border-gray-200 p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        item.action === 'toggle' && item.value 
                          ? 'bg-blue-100 text-blue-600' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        <item.icon size={20} />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{item.title}</h3>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </div>
                    </div>
                    
                    {item.action === 'toggle' && (
                      <button
                        onClick={() => item.onChange?.(!item.value!)}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          item.value ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          item.value ? 'translate-x-7' : 'translate-x-1'
                        }`} />
                      </button>
                    )}
                    
                    {item.action === 'navigate' && (
                      <ChevronRight size={20} className="text-gray-400" />
                    )}
                    
                    {item.action === 'button' && (
                      <button
                        onClick={item.onClick}
                        className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        {item.title.includes('Export') ? t('settings.export', 'Export') : t('settings.clear', 'Clear')}
                      </button>
                    )}
                    
                    {item.action === 'select' && (
                      <select className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg border border-gray-200">
                        <option value="">Select</option>
                        {item.options?.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Account Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 bg-white rounded-xl border border-gray-200 p-4"
        >
          <h3 className="font-medium text-gray-900 mb-3">
            {t('settings.account_info', 'Account Information')}
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">{t('settings.email', 'Email')}:</span>
              <span className="text-gray-900">{'user@example.com'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t('settings.phone', 'Phone')}:</span>
              <span className="text-gray-900">{business?.phone_number || '+254 700 000 000'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t('settings.business', 'Business')}:</span>
              <span className="text-gray-900">{business?.business_name || 'Business Name'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t('settings.industry', 'Industry')}:</span>
              <span className="text-gray-900">{business?.industry || industry}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t('settings.country', 'Country')}:</span>
              <span className="text-gray-900">{business?.country || country.toUpperCase()}</span>
            </div>
          </div>
        </motion.div>

        {/* App Version */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center text-sm text-gray-500"
        >
          <div className="mb-2">
            {t('app.name', 'BeeZee App')} v2.1.0
          </div>
          <div className="flex items-center justify-center gap-4">
            <Link href="/privacy" className="hover:text-blue-600 font-medium">
              {t('footer.privacy', 'Privacy')}
            </Link>
            <Link href="/terms" className="hover:text-blue-600 font-medium">
              {t('footer.terms', 'Terms')}
            </Link>
            <Link href="/help" className="hover:text-blue-600 font-medium">
              {t('footer.help', 'Help')}
            </Link>
          </div>
        </motion.div>
      </div>

      <BottomNav industry={industry} country={country} />
    </div>
  );
}
