"""Pydantic v2 request/response schemas for AgentStack API."""

from app.schemas.common import PaginatedResponse, ErrorResponse, SuccessResponse
from app.schemas.auth import TokenResponse, UserProfile, SignupRequest
from app.schemas.agent import AgentCreate, AgentUpdate, AgentResponse, AgentListResponse
from app.schemas.workflow import (
    WorkflowCreate, WorkflowUpdate, WorkflowResponse,
    NodeSchema, EdgeSchema, WorkflowType,
)
from app.schemas.execution import (
    ExecutionCreate, ExecutionResponse, ExecutionLog,
    ExecutionStatus, ToolCallLog,
)
from app.schemas.template import TemplateCreate, TemplateResponse, TemplateInstall
from app.schemas.workspace import WorkspaceCreate, WorkspaceUpdate, WorkspaceResponse, BrandingConfig
from app.schemas.billing import (
    CheckoutCreate, SubscriptionResponse, UsageResponse as BillingUsageResponse,
    PlanLimits, PlanTier, BillingInterval,
)
from app.schemas.community import CommunityPostCreate, CommunityPostResponse, VoteCreate, PostCategory
from app.schemas.sharing import ShareLinkCreate, ShareLinkResponse, SharedWorkflowResponse, ShareVisibility
from app.schemas.onboarding import OnboardingStep, OnboardingState, OnboardingComplete, OnboardingStepKey
from app.schemas.api_key import APIKeyCreate, APIKeyResponse, APIKeyRotate
from app.schemas.usage import UsageSummary, UsageByAgent, UsageTimeSeries
from app.schemas.report import ReportCreate, ReportResponse, ReportSchedule, ReportFormat, ReportFrequency

__all__ = [
    # Common
    "PaginatedResponse", "ErrorResponse", "SuccessResponse",
    # Auth
    "TokenResponse", "UserProfile", "SignupRequest",
    # Agent
    "AgentCreate", "AgentUpdate", "AgentResponse", "AgentListResponse",
    # Workflow
    "WorkflowCreate", "WorkflowUpdate", "WorkflowResponse",
    "NodeSchema", "EdgeSchema", "WorkflowType",
    # Execution
    "ExecutionCreate", "ExecutionResponse", "ExecutionLog",
    "ExecutionStatus", "ToolCallLog",
    # Template
    "TemplateCreate", "TemplateResponse", "TemplateInstall",
    # Workspace
    "WorkspaceCreate", "WorkspaceUpdate", "WorkspaceResponse", "BrandingConfig",
    # Billing
    "CheckoutCreate", "SubscriptionResponse", "BillingUsageResponse",
    "PlanLimits", "PlanTier", "BillingInterval",
    # Community
    "CommunityPostCreate", "CommunityPostResponse", "VoteCreate", "PostCategory",
    # Sharing
    "ShareLinkCreate", "ShareLinkResponse", "SharedWorkflowResponse", "ShareVisibility",
    # Onboarding
    "OnboardingStep", "OnboardingState", "OnboardingComplete", "OnboardingStepKey",
    # API Key
    "APIKeyCreate", "APIKeyResponse", "APIKeyRotate",
    # Usage
    "UsageSummary", "UsageByAgent", "UsageTimeSeries",
    # Report
    "ReportCreate", "ReportResponse", "ReportSchedule", "ReportFormat", "ReportFrequency",
]
