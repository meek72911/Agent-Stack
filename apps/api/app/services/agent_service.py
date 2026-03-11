"""Agent service -- CRUD, activation, test execution.

Interface boundary: AgentService
Consumers: agents router
Dependencies: DbSession, KeyVaultService, LLMService
"""

from abc import ABC, abstractmethod


class AgentService(ABC):
    """Agent lifecycle management."""

    @abstractmethod
    async def list_agents(self, tenant_id: str, workspace_id: str | None = None, **filters) -> dict:
        """List agents with pagination and optional filters."""
        ...

    @abstractmethod
    async def create_agent(self, tenant_id: str, data: dict) -> dict:
        """Create a new agent. Validates plan limits."""
        ...

    @abstractmethod
    async def get_agent(self, tenant_id: str, agent_id: str) -> dict:
        """Get agent by ID with execution stats. Raises NotFoundError if absent."""
        ...

    @abstractmethod
    async def update_agent(self, tenant_id: str, agent_id: str, data: dict) -> dict:
        """Update agent fields. Partial update supported."""
        ...

    @abstractmethod
    async def delete_agent(self, tenant_id: str, agent_id: str) -> None:
        """Soft-delete agent. Sets deleted_at timestamp."""
        ...

    @abstractmethod
    async def activate_agent(self, tenant_id: str, agent_id: str) -> dict:
        """Activate agent. Enforces plan activation limit."""
        ...

    @abstractmethod
    async def deactivate_agent(self, tenant_id: str, agent_id: str) -> dict:
        """Deactivate agent. Frees activation slot."""
        ...

    @abstractmethod
    async def duplicate_agent(self, tenant_id: str, agent_id: str, new_name: str | None = None) -> dict:
        """Clone agent with all configuration."""
        ...

    @abstractmethod
    async def test_run(self, tenant_id: str, agent_id: str, input_text: str, stream: bool = False):
        """Execute agent with test input. Returns result or SSE stream."""
        ...
