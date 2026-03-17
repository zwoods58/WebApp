import { SignupData } from '@/types/signup';
import React from 'react';

// Performance-optimized localStorage operations
export const storage = {
  // Get signup data with performance optimization
  getSignupData: (): SignupData | null => {
    try {
      const data = localStorage.getItem('beezee_signup_data');
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.warn('Error reading signup data from localStorage:', error);
      return null;
    }
  },

  // Set signup data with performance optimization
  setSignupData: (data: SignupData): void => {
    try {
      localStorage.setItem('beezee_signup_data', JSON.stringify(data));
    } catch (error) {
      console.warn('Error saving signup data to localStorage:', error);
    }
  },

  // Clear signup data
  clearSignupData: (): void => {
    try {
      localStorage.removeItem('beezee_signup_data');
    } catch (error) {
      console.warn('Error clearing signup data from localStorage:', error);
    }
  },

  // Get user data (legacy support)
  getUserData: (): any => {
    try {
      const data = localStorage.getItem('beezee_user_data');
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.warn('Error reading user data from localStorage:', error);
      return null;
    }
  },

  // Set user data (legacy support)
  setUserData: (data: any): void => {
    try {
      localStorage.setItem('beezee_user_data', JSON.stringify(data));
    } catch (error) {
      console.warn('Error saving user data to localStorage:', error);
    }
  }
};

// Background sync manager
export class BackgroundSyncManager {
  private static instance: BackgroundSyncManager;
  private syncQueue: Array<() => Promise<void>> = [];
  private isSyncing = false;

  static getInstance(): BackgroundSyncManager {
    if (!BackgroundSyncManager.instance) {
      BackgroundSyncManager.instance = new BackgroundSyncManager();
    }
    return BackgroundSyncManager.instance;
  }

  // Add sync operation to queue
  addSyncOperation(operation: () => Promise<void>): void {
    this.syncQueue.push(operation);
    this.processQueue();
  }

  // Process sync queue in background
  private async processQueue(): Promise<void> {
    if (this.isSyncing || this.syncQueue.length === 0) return;

    this.isSyncing = true;
    
    // Process queue with delay to not block UI
    setTimeout(async () => {
      while (this.syncQueue.length > 0) {
        const operation = this.syncQueue.shift();
        if (operation) {
          try {
            await operation();
          } catch (error) {
            console.warn('Background sync operation failed:', error);
          }
        }
      }
      this.isSyncing = false;
    }, 100); // 100ms delay to ensure UI is responsive
  }

  // Force sync all pending operations
  async forceSync(): Promise<void> {
    while (this.syncQueue.length > 0) {
      const operation = this.syncQueue.shift();
      if (operation) {
        try {
          await operation();
        } catch (error) {
          console.warn('Force sync operation failed:', error);
        }
      }
    }
  }
}

// Route data optimization
export const optimizeRouteData = (signupData: SignupData) => {
  return {
    // Essential data for immediate dashboard load
    essential: {
      name: signupData.name,
      businessName: signupData.businessName,
      country: signupData.country,
      industry: signupData.industry,
      industrySector: signupData.industrySector,
      dailyTarget: signupData.dailyTarget,
      currency: signupData.currency
    },
    // Optional data for background processing
    optional: {
      phoneNumber: signupData.phoneNumber,
      inviteCode: signupData.inviteCode,
      isDataSynced: signupData.isDataSynced,
      lastSyncTime: signupData.lastSyncTime
    }
  };
};

// Performance monitoring
export const performanceMonitor = {
  // Measure dashboard load time
  measureDashboardLoad: (startTime: number): number => {
    const endTime = performance.now();
    const loadTime = endTime - startTime;
    
    // Log performance metrics
    console.log(`Dashboard load time: ${loadTime.toFixed(2)}ms`);
    
    // Store metrics for analysis
    const metrics = {
      loadTime,
      timestamp: Date.now(),
      userAgent: navigator.userAgent
    };
    
    try {
      localStorage.setItem('beezee_performance_metrics', JSON.stringify(metrics));
    } catch (error) {
      console.warn('Error storing performance metrics:', error);
    }
    
    return loadTime;
  },

  // Get performance metrics
  getMetrics: () => {
    try {
      const metrics = localStorage.getItem('beezee_performance_metrics');
      return metrics ? JSON.parse(metrics) : null;
    } catch (error) {
      console.warn('Error reading performance metrics:', error);
      return null;
    }
  }
};

// Component lazy loading helper
export const createLazyComponent = <T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
) => {
  return React.lazy(importFunc);
};
