export type NodeType =
  | "trigger"
  | "agent"
  | "condition"
  | "transform"
  | "output"
  | "delay"
  | "loop"
  | "webhook"
  | "api-call";

export interface Position {
  x: number;
  y: number;
}

export interface NodeData {
  label: string;
  description?: string;
  config: Record<string, unknown>;
  icon?: string;
}

export interface WorkflowNode {
  id: string;
  type: NodeType;
  position: Position;
  data: NodeData;
  selected?: boolean;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  label?: string;
  animated?: boolean;
  condition?: string;
}

export type ExecutionStatus =
  | "pending"
  | "running"
  | "completed"
  | "failed"
  | "cancelled"
  | "paused";

export interface ExecutionStep {
  nodeId: string;
  status: ExecutionStatus;
  input?: Record<string, unknown>;
  output?: Record<string, unknown>;
  error?: string;
  startedAt: string;
  completedAt?: string;
  durationMs?: number;
}

export interface Execution {
  id: string;
  workflowId: string;
  status: ExecutionStatus;
  steps: ExecutionStep[];
  triggeredBy: "manual" | "schedule" | "webhook" | "event";
  startedAt: string;
  completedAt?: string;
  durationMs?: number;
  error?: string;
}

export interface Workflow {
  id: string;
  name: string;
  slug: string;
  description: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  enabled: boolean;
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
  lastRunAt?: string;
  totalRuns: number;
  successRate: number;
  schedule?: {
    cron: string;
    timezone: string;
  };
}

export interface CreateWorkflowInput {
  name: string;
  description: string;
  nodes?: WorkflowNode[];
  edges?: WorkflowEdge[];
}
