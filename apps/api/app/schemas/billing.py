"""Billing schemas -- Stripe checkout, subscriptions, usage metering."""

from datetime import datetime
from enum import Enum
from pydantic import BaseModel, Field


class PlanTier(str, Enum):
    """Available subscription plans."""
    FREE = "free"
    PRO = "pro"
    TEAM = "team"
    ENTERPRISE = "enterprise"


class BillingInterval(str, Enum):
    """Billing period options."""
    MONTHLY = "monthly"
    ANNUAL = "annual"


class PlanLimits(BaseModel):
    """Plan-specific resource limits."""
    plan: PlanTier
    max_agents: int
    max_active_agents: int
    max_workflows: int
    max_executions_per_month: int
    max_workspaces: int
    max_team_members: int
    custom_tools: bool = False
    white_label: bool = False
    api_access: bool = False
    priority_support: bool = False


class CheckoutCreate(BaseModel):
    """Request body to create a Stripe checkout session."""
    plan: PlanTier
    interval: BillingInterval = BillingInterval.MONTHLY
    success_url: str = Field(..., description="Redirect URL on successful payment")
    cancel_url: str = Field(..., description="Redirect URL on cancelled payment")


class SubscriptionResponse(BaseModel):
    """Current subscription state."""
    id: str
    tenant_id: str
    stripe_subscription_id: str | None = None
    stripe_customer_id: str | None = None
    plan: PlanTier
    interval: BillingInterval | None = None
    status: str = Field(default="active", description="active | past_due | cancelled | trialing")
    current_period_start: datetime | None = None
    current_period_end: datetime | None = None
    cancel_at_period_end: bool = False
    limits: PlanLimits | None = None
    created_at: datetime


class UsageResponse(BaseModel):
    """Current billing period usage summary."""
    tenant_id: str
    plan: PlanTier
    period_start: datetime
    period_end: datetime
    executions_used: int = 0
    executions_limit: int = 0
    tokens_used: int = 0
    cost_cents: int = 0
    agents_active: int = 0
    agents_limit: int = 0
    storage_bytes: int = 0
