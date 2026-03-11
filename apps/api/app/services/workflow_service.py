"""Workflow service -- CRUD, execution, cancellation.

Interface boundary: WorkflowService
Consumers: workflows router
Dependencies: DbSession, OrchestrationEngine, AgentService
"""

from abc import ABC, abstractmethod


class WorkflowService(ABC):
    """Workflow lifecycle and execution management."""

    @abstractmethod
    async def list_workflows(self, tenant_id: str, **filters) -> dict:
        """List workflows with pagination."""
        ...

    @abstractmethod
    async def create_workflow(self, tenant_id: str, data: dict) -> dict:
        """Create workflow. Validates plan limits."""
        ...

    @abstractmethod
    async def get_workflow(self, tenant_id: str, workflow_id: str) -> dict:
        """Get workflow with DAG and execution stats."""
        ...

    @abstractmethod
    async def update_workflow(self, tenant_id: str, workflow_id: str, data: dict) -> dict:
        """Update workflow configuration."""
        ...

    @abstractmethod
    async def delete_workflow(self, tenant_id: str, workflow_id: str) -> None:
        """Soft-delete workflow."""
        ...

    @abstractmethod
    async def execute_workflow(self, tenant_id: str, workflow_id: str, input_data: dict) -> dict:
        """Trigger workflow execution. Checks monthly execution limit."""
        ...

    @abstractmethod
    async def cancel_execution(self, tenant_id: str, execution_id: str) -> dict:
        """Cancel a running execution."""
        ...
