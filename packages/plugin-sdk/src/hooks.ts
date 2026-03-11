import type { Agent, Workflow, WorkflowExecution } from '@agentstack/shared-types'

export interface PluginHooks {
  beforeAgentRun?: (agent: Agent) => Promise<Agent>
  afterAgentRun?: (agent: Agent, result: unknown) => Promise<void>
  beforeWorkflowExecute?: (workflow: Workflow) => Promise<Workflow>
  afterWorkflowExecute?: (workflow: Workflow, execution: WorkflowExecution) => Promise<void>
  onError?: (error: Error, context: { agent?: Agent; workflow?: Workflow }) => Promise<void>
}
