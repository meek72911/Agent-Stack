import { create } from 'zustand';

interface AgentStoreState {
  selectedAgentId: string | null;
  viewMode: 'grid' | 'list';
  searchQuery: string;
  statusFilter: string | null;
  setSelectedAgent: (id: string | null) => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  setSearchQuery: (q: string) => void;
  setStatusFilter: (status: string | null) => void;
}

export const useAgentStore = create<AgentStoreState>((set) => ({
  selectedAgentId: null,
  viewMode: 'grid',
  searchQuery: '',
  statusFilter: null,
  setSelectedAgent: (id) => set({ selectedAgentId: id }),
  setViewMode: (viewMode) => set({ viewMode }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),
}));
