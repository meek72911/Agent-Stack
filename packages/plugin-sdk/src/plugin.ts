import type { Agent, AgentTool } from '@agentstack/shared-types'

export interface PluginManifest {
  name: string
  version: string
  description: string
  author: string
  homepage?: string
  icon?: string
  categories: string[]
  permissions: PluginPermission[]
}

export type PluginPermission = 
  | 'agent:read'
  | 'agent:write'
  | 'workflow:read'
  | 'workflow:write'
  | 'storage:read'
  | 'storage:write'
  | 'network'

export interface Plugin {
  manifest: PluginManifest
  tools?: AgentTool[]
  onInstall?: (context: PluginContext) => Promise<void>
  onUninstall?: (context: PluginContext) => Promise<void>
  onAgentStart?: (agent: Agent, context: PluginContext) => Promise<void>
  onAgentStop?: (agent: Agent, context: PluginContext) => Promise<void>
}

export interface PluginContext {
  pluginId: string
  organizationId: string
  storage: PluginStorage
  logger: PluginLogger
}

export interface PluginStorage {
  get(key: string): Promise<string | null>
  set(key: string, value: string): Promise<void>
  delete(key: string): Promise<void>
}

export interface PluginLogger {
  info(message: string, meta?: Record<string, unknown>): void
  warn(message: string, meta?: Record<string, unknown>): void
  error(message: string, meta?: Record<string, unknown>): void
}
