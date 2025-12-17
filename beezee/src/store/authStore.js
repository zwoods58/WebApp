// Auth Store - Zustand state management for authentication

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      loading: true,
      
      setUser: (user) => set({ user }),
      setLoading: (loading) => set({ loading }),
      
      clearAuth: () => set({ user: null }),
    }),
    {
      name: 'beezee-auth',
      partialize: (state) => ({ user: state.user }),
    }
  )
);


