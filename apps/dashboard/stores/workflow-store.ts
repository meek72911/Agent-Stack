import { create } from 'zustand';
import type { WorkflowNode, WorkflowEdge } from '@/types/workflow';

interface WorkflowStoreState {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  selectedNodeId: string | null;
  isDirty: boolean;
  addNode: (node: WorkflowNode) => void;
  removeNode: (id: string) => void;
  updateNode: (id: string, data: Partial<WorkflowNode>) => void;
  addEdge: (edge: WorkflowEdge) => void;
  removeEdge: (id: string) => void;
  setSelectedNode: (id: string | null) => void;
  reset: () => void;
}

export const useWorkflowStore = create<WorkflowStoreState>((set) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  isDirty: false,
  addNode: (node) => set((s) => ({ nodes: [...s.nodes, node], isDirty: true })),
  removeNode: (id) => set((s) => ({
    nodes: s.nodes.filter((n) => n.id !== id),
    edges: s.edges.filter((e) => e.source !== id && e.target !== id),
    isDirty: true,
  })),
  updateNode: (id, data) => set((s) => ({
    nodes: s.nodes.map((n) => (n.id === id ? { ...n, ...data } : n)),
    isDirty: true,
  })),
  addEdge: (edge) => set((s) => ({ edges: [...s.edges, edge], isDirty: true })),
  removeEdge: (id) => set((s) => ({ edges: s.edges.filter((e) => e.id !== id), isDirty: true })),
  setSelectedNode: (selectedNodeId) => set({ selectedNodeId }),
  reset: () => set({ nodes: [], edges: [], selectedNodeId: null, isDirty: false }),
}));
