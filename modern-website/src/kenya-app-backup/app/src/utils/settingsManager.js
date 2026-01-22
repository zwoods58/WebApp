import { supabase } from './supabase';
import { getCurrentCountry } from './currency';
import { recoveryPhrase } from './recoveryPhrase';

/**
 * Comprehensive Settings Management System
 * Handles all user preferences, security settings, and app configuration
 */

export class SettingsManager {
  constructor() {
    this.storageKey = 'beezee_settings';
    this.defaultSettings = this.getDefaultSettings();
  }

  /**
   * Get default settings
   */
  getDefaultSettings() {
    const country = getCurrentCountry();
    
    return {
      // General Settings
      language: country.defaultLanguage || 'en',
      theme: 'light',
      notifications: {
        email: true,
        push: true,
        sms: false,
        transactionAlerts: true,
        lowStockAlerts: true,
        paymentReminders: true,
        subscriptionRenewal: true,
        securityAlerts: true
      },
      
      // Security Settings
      security: {
        pinEnabled: true,
        biometricEnabled: false,
        autoLock: '5_minutes',
        requirePinFor: {
          transactions: true,
          settings: true,
          exports: true,
          sensitiveData: true
        },
        sessionTimeout: '30_minutes'
      },
      
      // Business Settings
      business: {
        businessName: '',
        businessType: '',
        businessSize: 'small',
        location: '',
        currency: country.currency,
        taxRate: country.taxRate || 0.16,
        fiscalYear: 'january',
        weekStartsOn: 'monday',
        dateFormat: country.dateFormat || 'DD/MM/YYYY',
        timeFormat: '24h'
      },
      
      // Payment Settings
      payments: {
        defaultPaymentMethod: 'cash',
        enabledMethods: ['cash', 'mpesa', 'bank'],
        autoRecordPayments: true,
        requireReceipt: false,
        paymentTerms: 'immediate',
        lateFeeEnabled: false,
        lateFeeAmount: 0,
        lateFeeType: 'percentage'
      },
      
      // Inventory Settings
      inventory: {
        lowStockThreshold: 5,
        autoReorderEnabled: false,
        barcodeEnabled: false,
        trackCost: true,
        trackProfit: true,
        categories: [],
        suppliers: []
      },
      
      // Reports Settings
      reports: {
        defaultPeriod: 'thisMonth',
        includeCharts: true,
        exportFormat: 'pdf',
        autoBackup: true,
        backupFrequency: 'weekly',
        emailReports: false,
        reportRecipients: []
      },
      
      // Data & Privacy
      privacy: {
        dataCollection: true,
        analytics: true,
        crashReporting: true,
        shareData: false,
        retentionPeriod: '2_years',
        autoDeleteOld: false
      },
      
      // Accessibility
      accessibility: {
        fontSize: 'medium',
        highContrast: false,
        reducedMotion: false,
        screenReader: false,
        keyboardNavigation: true
      },
      
      // Advanced Settings
      advanced: {
        debugMode: false,
        betaFeatures: false,
        offlineMode: true,
        syncFrequency: 'real_time',
        cacheSize: '100mb',
        logLevel: 'error'
      }
    };
  }

  /**
   * Get user settings
   */
  async getUserSettings(userId) {
    try {
      // Try to get from database first
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        // Merge with defaults to ensure all properties exist
        const settings = this.mergeWithDefaults(data.settings);
        return {
          success: true,
          settings,
          fromDatabase: true
        };
      }

      // Fallback to local storage
      const localSettings = this.getLocalSettings();
      if (localSettings) {
        return {
          success: true,
          settings: this.mergeWithDefaults(localSettings),
          fromDatabase: false
        };
      }

      // Return defaults
      return {
        success: true,
        settings: this.defaultSettings,
        fromDatabase: false
      };
    } catch (error) {
      console.error('Error getting user settings:', error);
      return {
        success: false,
        settings: this.defaultSettings,
        fromDatabase: false
      };
    }
  }

  /**
   * Update user settings
   */
  async updateUserSettings(userId, updates) {
    try {
      const currentSettings = await this.getUserSettings(userId);
      if (!currentSettings.success) {
        throw new Error('Failed to get current settings');
      }

      const newSettings = this.mergeSettings(currentSettings.settings, updates);

      // Validate settings
      const validation = this.validateSettings(newSettings);
      if (!validation.valid) {
        return {
          success: false,
          error: validation.error
        };
      }

      // Update in database
      const { data, error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: userId,
          settings: newSettings,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Update local storage
      this.setLocalSettings(newSettings);

      // Apply settings that affect the app immediately
      this.applyImmediateSettings(newSettings);

      return {
        success: true,
        settings: newSettings
      };
    } catch (error) {
      console.error('Error updating user settings:', error);
      return {
        success: false,
        error: 'Failed to update settings'
      };
    }
  }

  /**
   * Merge settings with defaults
   */
  mergeWithDefaults(settings) {
    return this.mergeSettings(this.defaultSettings, settings);
  }

  /**
   * Merge settings objects
   */
  mergeSettings(base, updates) {
    const merged = JSON.parse(JSON.stringify(base));
    
    function deepMerge(target, source) {
      for (const key in source) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
          if (!target[key]) target[key] = {};
          deepMerge(target[key], source[key]);
        } else {
          target[key] = source[key];
        }
      }
    }
    
    deepMerge(merged, updates);
    return merged;
  }

  /**
   * Validate settings
   */
  validateSettings(settings) {
    // Validate language
    const validLanguages = ['en', 'sw', 'af', 'zu', 'xh', 'ha', 'yo', 'ig'];
    if (!validLanguages.includes(settings.language)) {
      return { valid: false, error: 'Invalid language setting' };
    }

    // Validate theme
    const validThemes = ['light', 'dark', 'auto'];
    if (!validThemes.includes(settings.theme)) {
      return { valid: false, error: 'Invalid theme setting' };
    }

    // Validate auto lock time
    const validAutoLock = ['1_minute', '5_minutes', '15_minutes', '30_minutes', '1_hour', 'never'];
    if (!validAutoLock.includes(settings.security.autoLock)) {
      return { valid: false, error: 'Invalid auto lock setting' };
    }

    // Validate session timeout
    const validSessionTimeout = ['5_minutes', '15_minutes', '30_minutes', '1_hour', '4_hours', 'never'];
    if (!validSessionTimeout.includes(settings.security.sessionTimeout)) {
      return { valid: false, error: 'Invalid session timeout setting' };
    }

    // Validate business size
    const validBusinessSizes = ['micro', 'small', 'medium', 'large'];
    if (!validBusinessSizes.includes(settings.business.businessSize)) {
      return { valid: false, error: 'Invalid business size setting' };
    }

    return { valid: true };
  }

  /**
   * Apply immediate settings
   */
  applyImmediateSettings(settings) {
    // Apply theme
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (settings.theme === 'light') {
      document.documentElement.classList.remove('dark');
    }

    // Apply font size
    document.documentElement.style.fontSize = this.getFontSizeValue(settings.accessibility.fontSize);

    // Apply high contrast
    if (settings.accessibility.highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }

    // Apply reduced motion
    if (settings.accessibility.reducedMotion) {
      document.documentElement.classList.add('reduced-motion');
    } else {
      document.documentElement.classList.remove('reduced-motion');
    }
  }

  /**
   * Get font size value
   */
  getFontSizeValue(size) {
    const sizes = {
      small: '14px',
      medium: '16px',
      large: '18px',
      extra_large: '20px'
    };
    return sizes[size] || '16px';
  }

  /**
   * Reset settings to defaults
   */
  async resetSettings(userId) {
    try {
      const { error } = await supabase
        .from('user_settings')
        .delete()
        .eq('user_id', userId);

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      // Clear local storage
      localStorage.removeItem(this.storageKey);

      // Apply default settings
      this.applyImmediateSettings(this.defaultSettings);

      return {
        success: true,
        settings: this.defaultSettings
      };
    } catch (error) {
      console.error('Error resetting settings:', error);
      return {
        success: false,
        error: 'Failed to reset settings'
      };
    }
  }

  /**
   * Export settings
   */
  exportSettings(settings) {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `beezee_settings_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  }

  /**
   * Import settings
   */
  async importSettings(userId, file) {
    try {
      const text = await file.text();
      const importedSettings = JSON.parse(text);
      
      // Validate imported settings
      const validation = this.validateSettings(importedSettings);
      if (!validation.valid) {
        return {
          success: false,
          error: 'Invalid settings file: ' + validation.error
        };
      }

      // Merge with current settings
      const currentSettings = await this.getUserSettings(userId);
      const mergedSettings = this.mergeSettings(currentSettings.settings, importedSettings);

      // Save merged settings
      return await this.updateUserSettings(userId, mergedSettings);
    } catch (error) {
      console.error('Error importing settings:', error);
      return {
        success: false,
        error: 'Failed to import settings file'
      };
    }
  }

  /**
   * Get local settings
   */
  getLocalSettings() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error reading local settings:', error);
      return null;
    }
  }

  /**
   * Set local settings
   */
  setLocalSettings(settings) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving local settings:', error);
    }
  }

  /**
   * Clear local settings
   */
  clearLocalSettings() {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      console.error('Error clearing local settings:', error);
    }
  }

  /**
   * Get setting value
   */
  getSetting(path, defaultValue = null) {
    const settings = this.getLocalSettings() || this.defaultSettings;
    return this.getNestedValue(settings, path, defaultValue);
  }

  /**
   * Set setting value
   */
  setSetting(path, value) {
    const settings = this.getLocalSettings() || this.defaultSettings;
    this.setNestedValue(settings, path, value);
    this.setLocalSettings(settings);
    this.applyImmediateSettings(settings);
  }

  /**
   * Get nested value from object
   */
  getNestedValue(obj, path, defaultValue = null) {
    const keys = path.split('.');
    let current = obj;
    
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        return defaultValue;
      }
    }
    
    return current;
  }

  /**
   * Set nested value in object
   */
  setNestedValue(obj, path, value) {
    const keys = path.split('.');
    let current = obj;
    
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!current[key] || typeof current[key] !== 'object') {
        current[key] = {};
      }
      current = current[key];
    }
    
    current[keys[keys.length - 1]] = value;
  }

  /**
   * Get security settings
   */
  getSecuritySettings() {
    const settings = this.getLocalSettings() || this.defaultSettings;
    return settings.security;
  }

  /**
   * Update security settings
   */
  async updateSecuritySettings(userId, securitySettings) {
    return await this.updateUserSettings(userId, { security: securitySettings });
  }

  /**
   * Get notification settings
   */
  getNotificationSettings() {
    const settings = this.getLocalSettings() || this.defaultSettings;
    return settings.notifications;
  }

  /**
   * Update notification settings
   */
  async updateNotificationSettings(userId, notificationSettings) {
    return await this.updateUserSettings(userId, { notifications: notificationSettings });
  }

  /**
   * Get business settings
   */
  getBusinessSettings() {
    const settings = this.getLocalSettings() || this.defaultSettings;
    return settings.business;
  }

  /**
   * Update business settings
   */
  async updateBusinessSettings(userId, businessSettings) {
    return await this.updateUserSettings(userId, { business: businessSettings });
  }

  /**
   * Check if PIN is required for action
   */
  isPinRequired(action) {
    const securitySettings = this.getSecuritySettings();
    return securitySettings.requirePinFor[action] || false;
  }

  /**
   * Get auto lock timeout in milliseconds
   */
  getAutoLockTimeout() {
    const securitySettings = this.getSecuritySettings();
    const timeouts = {
      '1_minute': 60 * 1000,
      '5_minutes': 5 * 60 * 1000,
      '15_minutes': 15 * 60 * 1000,
      '30_minutes': 30 * 60 * 1000,
      '1_hour': 60 * 60 * 1000,
      'never': null
    };
    return timeouts[securitySettings.autoLock] || 5 * 60 * 1000;
  }

  /**
   * Get session timeout in milliseconds
   */
  getSessionTimeout() {
    const securitySettings = this.getSecuritySettings();
    const timeouts = {
      '5_minutes': 5 * 60 * 1000,
      '15_minutes': 15 * 60 * 1000,
      '30_minutes': 30 * 60 * 1000,
      '1_hour': 60 * 60 * 1000,
      '4_hours': 4 * 60 * 60 * 1000,
      'never': null
    };
    return timeouts[securitySettings.sessionTimeout] || 30 * 60 * 1000;
  }

  /**
   * Check if notifications are enabled for type
   */
  isNotificationEnabled(type) {
    const notificationSettings = this.getNotificationSettings();
    return notificationSettings[type] || false;
  }

  /**
   * Get app version and build info
   */
  getAppInfo() {
    return {
      version: process.env.REACT_APP_VERSION || '1.0.0',
      build: process.env.REACT_APP_BUILD || 'development',
      environment: process.env.NODE_ENV || 'development',
      country: getCurrentCountry().code,
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * Clear all user data (account deletion)
   */
  async clearAllUserData(userId) {
    try {
      // Clear settings
      await this.resetSettings(userId);
      
      // Clear recovery phrase
      await recoveryPhrase.clearPhrase();
      
      // Clear PIN vault
      localStorage.removeItem('beezee_vault_data');
      
      // Clear cached data
      localStorage.removeItem('beezee_transactions_cache');
      localStorage.removeItem('beezee_inventory_cache');
      localStorage.removeItem('beezee_reports_cache');
      
      return { success: true };
    } catch (error) {
      console.error('Error clearing user data:', error);
      return {
        success: false,
        error: 'Failed to clear all user data'
      };
    }
  }
}

// Create singleton instance
export const settingsManager = new SettingsManager();
