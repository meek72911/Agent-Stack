"""Orchestration engine -- multi-agent workflow execution.

Interface boundary: OrchestrationEngine
Consumers: WorkflowService
Dependencies: AgentService, LLMService, Redis queue

Supports workflow types: sequential, parallel, pipeline, single.
Emits SSE events: step_start, token, step_complete, done, error.
"""

from abc import ABC, abstractmethod
from typing import AsyncGenerator


class OrchestrationEngine(ABC):
    """Execute multi-agent workflows with step tracking."""

    @abstractmethod
    async def execute(self, workflow_id: str, input_data: dict) -> dict:
        """Execute a workflow synchronously. Returns final result."""
        ...

    @abstractmethod
    async def execute_stream(self, workflow_id: str, input_data: dict) -> AsyncGenerator[dict, None]:
        """Execute a workflow with SSE streaming. Yields event dicts."""
        ...

    @abstractmethod
    async def cancel(self, execution_id: str) -> None:
        """Cancel a running execution. Sends cancel signal to queue."""
        ...
