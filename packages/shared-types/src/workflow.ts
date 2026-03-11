export type WorkflowStatus = 'draft' | 'active' | 'paused' | 'archived'
export type NodeType = 'trigger' | 'action' | 'condition' | 'transform' | 'output'
export type ExecutionStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled'

export interface Workflow {
  id: string
  name: string
  description: string | null
  status: WorkflowStatus
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  organization_id: string
  created_by: string
  execution_count: number
  last_executed_at: string | null
  created_at: string
  updated_at: string
}

export interface WorkflowNode {
  id: string
  type: NodeType
  position: { x: number; y: number }
  data: {
    label: string
    description?: string
    config: Record<string, unknown>
    agent_id?: string
  }
}

export interface WorkflowEdge {
  id: string
  source: string
  target: string
  label?: string
  condition?: string
}

export interface WorkflowExecution {
  id: string
  workflow_id: string
  status: ExecutionStatus
  started_at: string
  completed_at: string | null
  duration_ms: number | null
  error: string | null
  node_results: Record<string, NodeResult>
}

export interface NodeResult {
  node_id: string
  status: ExecutionStatus
  output: unknown
  error: string | null
  started_at: string
  completed_at: string | null
}
