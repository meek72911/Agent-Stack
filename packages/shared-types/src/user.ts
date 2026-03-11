export type UserRole = 'owner' | 'admin' | 'member' | 'viewer'
export type PlanTier = 'free' | 'pro' | 'team' | 'enterprise'

export interface User {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: UserRole
  plan: PlanTier
  organization_id: string | null
  created_at: string
  updated_at: string
}

export interface Organization {
  id: string
  name: string
  slug: string
  plan: PlanTier
  owner_id: string
  member_count: number
  created_at: string
}
