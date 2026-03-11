"""Onboarding schemas -- step tracking and completion."""

from datetime import datetime
from enum import Enum
from pydantic import BaseModel, Field


class OnboardingStepKey(str, Enum):
    """Onboarding step identifiers."""
    PROFILE_SETUP = "profile_setup"
    FIRST_AGENT = "first_agent"
    API_KEY_ADDED = "api_key_added"
    FIRST_EXECUTION = "first_execution"
    WORKSPACE_CREATED = "workspace_created"
    INVITE_TEAM = "invite_team"


class OnboardingStep(BaseModel):
    """Single onboarding step status."""
    key: OnboardingStepKey
    label: str
    description: str
    is_completed: bool = False
    completed_at: datetime | None = None
    order: int = 0


class OnboardingState(BaseModel):
    """Full onboarding state for the current user."""
    user_id: str
    tenant_id: str
    steps: list[OnboardingStep]
    total_steps: int
    completed_steps: int
    progress_pct: float = Field(..., ge=0.0, le=100.0, description="Completion percentage")
    is_complete: bool = False


class OnboardingComplete(BaseModel):
    """Request body to mark an onboarding step as completed."""
    step_key: OnboardingStepKey
