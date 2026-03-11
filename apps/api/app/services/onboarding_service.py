"""Onboarding service -- state machine, step completion.

Interface boundary: OnboardingService
Consumers: onboarding router
Dependencies: DbSession

Tracks onboarding progress for new users through a defined
sequence of steps. Persists state per user and emits completion
events for analytics.
"""

from abc import ABC, abstractmethod


# Step definitions with default ordering
ONBOARDING_STEPS = [
    {
        "key": "profile_setup",
        "label": "Complete your profile",
        "description": "Add your name and company details",
        "order": 0,
    },
    {
        "key": "first_agent",
        "label": "Create your first agent",
        "description": "Build an AI agent from scratch or use a template",
        "order": 1,
    },
    {
        "key": "api_key_added",
        "label": "Add an API key",
        "description": "Connect your OpenAI, Anthropic, or other LLM provider key",
        "order": 2,
    },
    {
        "key": "first_execution",
        "label": "Run your first execution",
        "description": "Test your agent with a sample input",
        "order": 3,
    },
    {
        "key": "workspace_created",
        "label": "Create a client workspace",
        "description": "Set up a white-label workspace for your first client",
        "order": 4,
    },
    {
        "key": "invite_team",
        "label": "Invite a team member",
        "description": "Collaborate with your team on agent development",
        "order": 5,
    },
]


class OnboardingService(ABC):
    """Onboarding state machine for new user activation."""

    @abstractmethod
    async def get_state(self, user_id: str, tenant_id: str) -> dict:
        """Get the current onboarding state for a user.

        Returns all steps with completion status and overall progress.
        Initializes onboarding record if it does not exist.
        """
        ...

    @abstractmethod
    async def complete_step(self, user_id: str, tenant_id: str, step_key: str) -> dict:
        """Mark an onboarding step as completed.

        Validates step_key is a valid onboarding step.
        Idempotent -- completing an already-completed step is a no-op.
        Returns updated onboarding state.
        """
        ...

    @abstractmethod
    async def reset_onboarding(self, user_id: str, tenant_id: str) -> dict:
        """Reset all onboarding progress (admin/debug use).

        Returns fresh onboarding state with all steps incomplete.
        """
        ...

    @abstractmethod
    async def skip_onboarding(self, user_id: str, tenant_id: str) -> dict:
        """Mark onboarding as fully complete (skip remaining steps).

        Used when a user explicitly dismisses the onboarding flow.
        """
        ...

    @abstractmethod
    async def auto_complete_check(self, user_id: str, tenant_id: str) -> dict:
        """Check and auto-complete steps based on actual resource state.

        Queries agents, keys, executions, workspaces to determine
        which steps the user has implicitly completed.
        Returns updated onboarding state.
        """
        ...
