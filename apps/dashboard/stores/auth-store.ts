import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: any | null;
  session: any | null;
  isOnboarded: boolean;
  setUser: (user: any) => void;
  setSession: (session: any) => void;
  setOnboarded: (v: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      session: null,
      isOnboarded: false,
      setUser: (user) => set({ user }),
      setSession: (session) => set({ session }),
      setOnboarded: (isOnboarded) => set({ isOnboarded }),
      logout: () => set({ user: null, session: null, isOnboarded: false }),
    }),
    { name: 'agentstack-auth' }
  )
);
