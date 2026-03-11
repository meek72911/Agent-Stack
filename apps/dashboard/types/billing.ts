export type PlanTier = "free" | "starter" | "pro" | "enterprise";

export interface PlanFeature {
  name: string;
  included: boolean;
  limit?: string;
}

export interface Plan {
  id: string;
  name: string;
  tier: PlanTier;
  description: string;
  priceMonthly: number;
  priceYearly: number;
  features: PlanFeature[];
  agentLimit: number;
  workflowLimit: number;
  executionsPerMonth: number;
  storageGb: number;
  highlighted?: boolean;
}

export interface Subscription {
  id: string;
  planId: string;
  plan: Plan;
  status: "active" | "past_due" | "canceled" | "trialing" | "paused";
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  trialEnd?: string;
  stripeSubscriptionId: string;
  stripeCustomerId: string;
}

export interface UsageBucket {
  date: string;
  executions: number;
  tokensUsed: number;
  cost: number;
  apiCalls: number;
}

export interface Usage {
  currentPeriod: {
    start: string;
    end: string;
  };
  executions: {
    used: number;
    limit: number;
    percentage: number;
  };
  tokens: {
    used: number;
    limit: number;
    percentage: number;
  };
  storage: {
    usedGb: number;
    limitGb: number;
    percentage: number;
  };
  agents: {
    active: number;
    limit: number;
    percentage: number;
  };
  dailyBuckets: UsageBucket[];
}

export interface Invoice {
  id: string;
  amount: number;
  currency: string;
  status: "paid" | "open" | "void" | "uncollectible";
  pdfUrl: string;
  createdAt: string;
  paidAt?: string;
}
