export type AgentStatus = "idle" | "running" | "error" | "paused" | "deploying";

export interface AgentTool {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  config?: Record<string, unknown>;
}

export interface AgentConfig {
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
  tools: AgentTool[];
  memory: {
    enabled: boolean;
    provider: "pinecone" | "weaviate" | "chroma" | "in-memory";
    maxMessages: number;
  };
  schedule?: {
    cron: string;
    timezone: string;
  };
}

export interface Agent {
  id: string;
  name: string;
  slug: string;
  description: string;
  avatar?: string;
  status: AgentStatus;
  config: AgentConfig;
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
  lastRunAt?: string;
  totalRuns: number;
  successRate: number;
  avgLatencyMs: number;
  tags: string[];
  is_active?: boolean;
  category?: string;
  role?: string;
}

export interface AgentRun {
  id: string;
  agentId: string;
  status: "pending" | "running" | "completed" | "failed" | "cancelled";
  input: Record<string, unknown>;
  output?: Record<string, unknown>;
  error?: string;
  startedAt: string;
  completedAt?: string;
  durationMs?: number;
  tokensUsed: number;
  cost: number;
}

export interface CreateAgentInput {
  name: string;
  description: string;
  config: Partial<AgentConfig>;
  tags?: string[];
}

export interface UpdateAgentInput {
  name?: string;
  description?: string;
  config?: Partial<AgentConfig>;
  status?: AgentStatus;
  tags?: string[];
}
