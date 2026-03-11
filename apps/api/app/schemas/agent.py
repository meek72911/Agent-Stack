"""Agent schemas -- CRUD request/response models."""

from datetime import datetime
from pydantic import BaseModel, Field


class AgentCreate(BaseModel):
    """Request body to create a new agent."""
    name: str = Field(..., min_length=1, max_length=200)
    description: str | None = Field(None, max_length=2000)
    system_prompt: str = Field(default="You are a helpful assistant.")
    model: str = Field(default="gpt-4o-mini", description="LiteLLM model identifier")
    temperature: float = Field(default=0.7, ge=0.0, le=2.0)
    max_tokens: int = Field(default=4096, ge=1, le=128000)
    tools: list[str] = Field(default_factory=list, description="List of tool slugs to attach")
    workspace_id: str | None = None
    metadata: dict | None = None


class AgentUpdate(BaseModel):
    """Partial update for an agent. All fields optional."""
    name: str | None = Field(None, min_length=1, max_length=200)
    description: str | None = None
    system_prompt: str | None = None
    model: str | None = None
    temperature: float | None = Field(None, ge=0.0, le=2.0)
    max_tokens: int | None = Field(None, ge=1, le=128000)
    tools: list[str] | None = None
    is_active: bool | None = None
    metadata: dict | None = None


class AgentResponse(BaseModel):
    """Single agent detail response."""
    id: str
    tenant_id: str
    workspace_id: str | None = None
    name: str
    description: str | None = None
    system_prompt: str
    model: str
    temperature: float
    max_tokens: int
    tools: list[str]
    is_active: bool
    total_executions: int = 0
    total_tokens: int = 0
    total_cost_cents: int = 0
    metadata: dict | None = None
    created_at: datetime
    updated_at: datetime


class AgentListResponse(BaseModel):
    """Paginated list of agents."""
    items: list[AgentResponse]
    total: int
    limit: int
    offset: int
    has_more: bool
