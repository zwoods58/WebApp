import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      loading: true,

      setUser: (user) => set({ user }),
      setLoading: (loading) => set({ loading }),
      setSession: ({ user }) => set({ user }),

      clearAuth: () => {
        // Tokens are handled by AuthService.logout
        set({ user: null });
      },
    }),
    {
      name: 'beezee-za-auth-v2',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user }),
    }
  )
);
