// Auth Store - Zustand state management for V2 Authentication
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      loading: true,

      // In V2, Access Token is kept in memory (or sessionStorage) for security
      // while Refresh Token is in localStorage via AuthService
      setUser: (user) => set({ user }),

      setLoading: (loading) => set({ loading }),

      setSession: ({ user, accessToken, refreshToken }) => {
        if (accessToken) sessionStorage.setItem('beezee_access_token', accessToken);
        if (refreshToken) localStorage.setItem('beezee_refresh_token', refreshToken);
        set({ user });
      },

      clearAuth: () => {
        sessionStorage.removeItem('beezee_access_token');
        localStorage.removeItem('beezee_refresh_token');
        localStorage.removeItem('beezee_user_id');
        set({ user: null });
      },
    }),
    {
      name: 'beezee-ke-auth-v2',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user }), // Only persist user info
    }
  )
);
