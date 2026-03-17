// Utility to handle authentication retries and session management
// This helps with the "Failed to fetch" auth errors

export class AuthRetryManager {
  private static instance: AuthRetryManager;
  private retryCount = 0;
  private maxRetries = 3;
  private retryDelay = 1000; // 1 second
  private isRetrying = false;

  static getInstance(): AuthRetryManager {
    if (!AuthRetryManager.instance) {
      AuthRetryManager.instance = new AuthRetryManager();
    }
    return AuthRetryManager.instance;
  }

  async retryWithBackoff<T>(
    operation: () => Promise<T>,
    operationName: string
  ): Promise<T> {
    if (this.isRetrying) {
      console.log(`⏳ Already retrying ${operationName}, waiting...`);
      await new Promise(resolve => setTimeout(resolve, this.retryDelay));
      return this.retryWithBackoff(operation, operationName);
    }

    this.isRetrying = true;
    
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        console.log(`🔄 Attempt ${attempt + 1}/${this.maxRetries + 1} for ${operationName}`);
        
        const result = await operation();
        
        if (attempt > 0) {
          console.log(`✅ ${operationName} succeeded on attempt ${attempt + 1}`);
        }
        
        this.retryCount = 0;
        this.isRetrying = false;
        return result;
        
      } catch (error) {
        console.error(`❌ Attempt ${attempt + 1} failed for ${operationName}:`, error);
        
        if (attempt === this.maxRetries) {
          console.error(`🚨 Max retries reached for ${operationName}`);
          this.retryCount = 0;
          this.isRetrying = false;
          throw error;
        }
        
        // Exponential backoff
        const delay = this.retryDelay * Math.pow(2, attempt);
        console.log(`⏳ Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    this.isRetrying = false;
    throw new Error(`Failed after ${this.maxRetries + 1} attempts for ${operationName}`);
  }

  async refreshSessionWithRetry(supabase: any): Promise<any> {
    return this.retryWithBackoff(
      async () => {
        const { data, error } = await supabase.auth.refreshSession();
        
        if (error) {
          // Don't retry on authentication errors, only network errors
          if (error.message.includes('fetch') || error.message.includes('network')) {
            throw error;
          } else {
            // Authentication error, don't retry
            console.error('Authentication error (not retrying):', error);
            throw new Error(`Authentication failed: ${error.message}`);
          }
        }
        
        return data;
      },
      'session refresh'
    );
  }

  async executeWithAuth<T>(
    supabase: any,
    operation: () => Promise<T>,
    operationName: string
  ): Promise<T> {
    try {
      return await operation();
    } catch (error: any) {
      // If it's a network or auth error, try refreshing the session first
      if (error.message?.includes('fetch') || error.message?.includes('auth')) {
        console.log(`🔄 Auth/network error detected for ${operationName}, refreshing session...`);
        
        try {
          await this.refreshSessionWithRetry(supabase);
          console.log(`✅ Session refreshed, retrying ${operationName}...`);
          return await operation();
        } catch (refreshError) {
          console.error(`❌ Session refresh failed for ${operationName}:`, refreshError);
          throw refreshError;
        }
      }
      
      throw error;
    }
  }
}

// Export singleton instance
export const authRetryManager = AuthRetryManager.getInstance();

// Utility function to clear problematic auth data
export function clearProblematicAuthData() {
  console.log('🧹 Clearing problematic auth data...');
  
  const keysToRemove = [
    'sessionData',
    'userProfile', 
    'beezee-auth',
    'beezee-business-profile',
    'beezee-user-data',
    'supabase.auth.token'
  ];
  
  keysToRemove.forEach(key => {
    try {
      localStorage.removeItem(key);
      console.log(`✅ Removed ${key} from localStorage`);
    } catch (error) {
      console.error(`❌ Failed to remove ${key}:`, error);
    }
  });
  
  // Also clear sessionStorage
  try {
    sessionStorage.clear();
    console.log('✅ Cleared sessionStorage');
  } catch (error) {
    console.error('❌ Failed to clear sessionStorage:', error);
  }
}

// Utility to check if we're online
export function isOnline(): boolean {
  if (typeof navigator === 'undefined') return true;
  return navigator.onLine;
}

// Utility to wait for network connection
export function waitForConnection(timeout = 5000): Promise<void> {
  return new Promise((resolve, reject) => {
    if (isOnline()) {
      resolve();
      return;
    }
    
    const checkInterval = setInterval(() => {
      if (isOnline()) {
        clearInterval(checkInterval);
        resolve();
      }
    }, 1000);
    
    setTimeout(() => {
      clearInterval(checkInterval);
      reject(new Error('Network connection timeout'));
    }, timeout);
  });
}
