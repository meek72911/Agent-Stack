"""Execution schemas -- create, response, log entries."""

from datetime import datetime
from enum import Enum
from pydantic import BaseModel, Field


class ExecutionStatus(str, Enum):
    """Execution lifecycle states."""
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"


class ExecutionCreate(BaseModel):
    """Request body to trigger a new execution."""
    workflow_id: str | None = None
    agent_id: str | None = None
    input: dict = Field(..., description="Input payload for the execution")
    stream: bool = Field(default=False, description="If true, return SSE stream")
    workspace_id: str | None = None


class ExecutionLog(BaseModel):
    """Single step log entry within an execution trace."""
    step_id: str
    agent_id: str
    step_order: int
    status: ExecutionStatus
    input: dict | None = None
    output: dict | None = None
    error: str | None = None
    prompt_tokens: int = 0
    completion_tokens: int = 0
    cost_cents: int = 0
    latency_ms: int = 0
    llm_model: str | None = None
    started_at: datetime | None = None
    completed_at: datetime | None = None


class ToolCallLog(BaseModel):
    """Record of a single tool invocation within a step."""
    id: str
    tool_name: str
    input: dict | None = None
    output: dict | None = None
    error: str | None = None
    latency_ms: int = 0
    created_at: datetime


class ExecutionResponse(BaseModel):
    """Full execution detail with steps and tool calls."""
    id: str
    tenant_id: str
    workspace_id: str | None = None
    workflow_id: str | None = None
    agent_id: str | None = None
    status: ExecutionStatus
    input: dict
    output: dict | None = None
    error: str | None = None
    total_tokens: int = 0
    total_cost_cents: int = 0
    total_latency_ms: int = 0
    steps: list[ExecutionLog] = Field(default_factory=list)
    started_at: datetime | None = None
    completed_at: datetime | None = None
    created_at: datetime
