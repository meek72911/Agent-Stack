export type SubscriptionStatus = 'active' | 'past_due' | 'cancelled' | 'trialing'

export interface Subscription {
  id: string
  plan: string
  status: SubscriptionStatus
  current_period_start: string
  current_period_end: string
  cancel_at_period_end: boolean
}

export interface UsageRecord {
  id: string
  organization_id: string
  metric: string
  value: number
  period_start: string
  period_end: string
}

export interface PlanLimits {
  agents: number
  workflows: number
  executions_per_month: number
  team_members: number
  storage_gb: number
  api_requests_per_day: number
}
