// Admin Authentication Utilities

export interface AdminSession {
  email: string;
  loginTime: string;
  expiresAt: string;
}

export class AdminAuth {
  private static readonly SESSION_KEY = 'admin_session';

  // Check if admin is authenticated
  static isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    
    try {
      const sessionData = localStorage.getItem(this.SESSION_KEY);
      if (!sessionData) return false;

      const session: AdminSession = JSON.parse(sessionData);
      
      // Check if session has expired
      const now = new Date();
      const expiresAt = new Date(session.expiresAt);
      
      if (now > expiresAt) {
        this.logout(); // Clean up expired session
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error checking admin authentication:', error);
      return false;
    }
  }

  // Get current admin session
  static getSession(): AdminSession | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const sessionData = localStorage.getItem(this.SESSION_KEY);
      return sessionData ? JSON.parse(sessionData) : null;
    } catch (error) {
      console.error('Error getting admin session:', error);
      return null;
    }
  }

  // Logout admin
  static logout(): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(this.SESSION_KEY);
    } catch (error) {
      console.error('Error during admin logout:', error);
    }
  }

  // Extend session (for activity-based renewal)
  static extendSession(): boolean {
    if (!this.isAuthenticated()) return false;
    
    try {
      const session = this.getSession();
      if (!session) return false;
      
      // Extend session by 24 hours from now
      const newExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
      session.expiresAt = newExpiresAt.toISOString();
      
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
      return true;
    } catch (error) {
      console.error('Error extending admin session:', error);
      return false;
    }
  }

  // Check if session is about to expire (within 1 hour)
  static isSessionExpiringSoon(): boolean {
    const session = this.getSession();
    if (!session) return false;
    
    const now = new Date();
    const expiresAt = new Date(session.expiresAt);
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
    
    return expiresAt <= oneHourFromNow;
  }
}
