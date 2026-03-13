import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark' | 'system';
  activeModal: string | null;
  commandPaletteOpen: boolean;
  isAdminMode: boolean;
  setSidebarOpen: (open: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  openModal: (id: string) => void;
  closeModal: () => void;
  toggleCommandPalette: () => void;
  setIsAdminMode: (enabled: boolean) => void;
  toggleAdminMode: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      sidebarCollapsed: false,
      theme: 'dark',
      activeModal: null,
      commandPaletteOpen: false,
      isAdminMode: false,
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
      setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setTheme: (theme) => set({ theme }),
      openModal: (activeModal) => set({ activeModal }),
      closeModal: () => set({ activeModal: null }),
      toggleCommandPalette: () => set((s) => ({ commandPaletteOpen: !s.commandPaletteOpen })),
      setIsAdminMode: (isAdminMode) => set({ isAdminMode }),
      toggleAdminMode: () => set((s) => ({ isAdminMode: !s.isAdminMode })),
    }),
    { name: 'agentstack-ui', partialize: (s) => ({ sidebarOpen: s.sidebarOpen, sidebarCollapsed: s.sidebarCollapsed, theme: s.theme, isAdminMode: s.isAdminMode }) }
  )
);
