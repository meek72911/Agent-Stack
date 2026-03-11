export type AgentStatus = 'active' | 'inactive' | 'error' | 'deploying'
export type AgentRuntime = 'python' | 'nodejs' | 'docker'

export interface Agent {
  id: string
  name: string
  description: string | null
  status: AgentStatus
  runtime: AgentRuntime
  model: string
  system_prompt: string | null
  tools: AgentTool[]
  environment_variables: Record<string, string>
  organization_id: string
  created_by: string
  last_active_at: string | null
  created_at: string
  updated_at: string
}

export interface AgentTool {
  id: string
  name: string
  description: string
  parameters: Record<string, unknown>
  enabled: boolean
}

export interface AgentTemplate {
  id: string
  name: string
  description: string
  category: string
  runtime: AgentRuntime
  model: string
  system_prompt: string
  tools: AgentTool[]
  icon: string | null
  is_featured: boolean
}
