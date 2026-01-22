// Auth Store - Zustand state management for authentication

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      loading: true,
      token: null,

      setUser: (user) => set({ user }),
      setLoading: (loading) => set({ loading }),
      setSession: (session) => set({ user: session.user, token: session.token }),

      clearAuth: () => {
        localStorage.removeItem('session_token');
        localStorage.removeItem('refresh_token');
        set({ user: null, token: null });
      },
    }),
    {
      name: 'beezee-ng-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);


