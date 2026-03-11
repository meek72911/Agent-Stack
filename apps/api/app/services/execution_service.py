"""Execution service -- execute workflows, log steps, SSE streaming.

Interface boundary: ExecutionService
Consumers: executions router, agents router (test-run)
Dependencies: DbSession, OrchestrationEngine, UsageService, Redis

Manages the execution lifecycle: creating runs, delegating to the
orchestration engine, recording results, and streaming progress via SSE.
"""

from abc import ABC, abstractmethod
from typing import AsyncGenerator


class ExecutionService(ABC):
    """Execution lifecycle management and streaming."""

    @abstractmethod
    async def create_execution(self, tenant_id: str, data: dict) -> dict:
        """Create a new execution record and enqueue for processing.

        Validates that the workflow/agent exists and belongs to the tenant.
        Checks usage limits before allowing execution.
        Returns the execution record with status='pending'.
        """
        ...

    @abstractmethod
    async def execute_sync(self, tenant_id: str, execution_id: str) -> dict:
        """Execute synchronously and return the final result.

        Delegates to OrchestrationEngine.execute().
        Records all steps, tool calls, token usage, and costs.
        Updates execution status to completed or failed.
        """
        ...

    @abstractmethod
    async def execute_stream(self, tenant_id: str, execution_id: str) -> AsyncGenerator[dict, None]:
        """Execute with SSE streaming.

        Yields event dicts: step_start, token, tool_call, step_complete, done, error.
        Each event is formatted as an SSE message for the client.
        """
        ...

    @abstractmethod
    async def get_execution(self, tenant_id: str, execution_id: str) -> dict:
        """Get execution detail with all steps and tool calls.

        Raises NotFoundError if execution does not exist or belongs to another tenant.
        """
        ...

    @abstractmethod
    async def list_executions(
        self,
        tenant_id: str,
        workspace_id: str | None = None,
        workflow_id: str | None = None,
        agent_id: str | None = None,
        status: str | None = None,
        limit: int = 25,
        offset: int = 0,
    ) -> dict:
        """List executions with optional filters. Paginated."""
        ...

    @abstractmethod
    async def cancel_execution(self, tenant_id: str, execution_id: str) -> dict:
        """Cancel a running execution.

        Sends cancel signal via Redis pub/sub to the worker.
        Updates status to 'cancelled'.
        """
        ...

    @abstractmethod
    async def get_execution_logs(self, tenant_id: str, execution_id: str) -> list[dict]:
        """Get step-by-step logs for an execution.

        Returns ordered list of step logs with tool call details.
        """
        ...

    @abstractmethod
    async def retry_execution(self, tenant_id: str, execution_id: str) -> dict:
        """Retry a failed execution with the same input.

        Creates a new execution record linked to the original.
        """
        ...
