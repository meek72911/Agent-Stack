"""Workflow schemas -- nodes, edges, CRUD."""

from datetime import datetime
from enum import Enum
from pydantic import BaseModel, Field


class WorkflowType(str, Enum):
    """Supported workflow execution strategies."""
    SEQUENTIAL = "sequential"
    PARALLEL = "parallel"
    PIPELINE = "pipeline"
    SINGLE = "single"


class NodeSchema(BaseModel):
    """Single node in a workflow graph."""
    id: str = Field(..., description="Unique node identifier within the workflow")
    agent_id: str = Field(..., description="Agent to execute at this node")
    label: str | None = None
    position_x: float = 0.0
    position_y: float = 0.0
    config: dict = Field(default_factory=dict, description="Node-specific configuration overrides")


class EdgeSchema(BaseModel):
    """Directed edge connecting two nodes."""
    id: str
    source_node_id: str
    target_node_id: str
    condition: str | None = Field(None, description="Optional conditional expression for branching")


class WorkflowCreate(BaseModel):
    """Request body to create a workflow."""
    name: str = Field(..., min_length=1, max_length=200)
    description: str | None = Field(None, max_length=2000)
    workflow_type: WorkflowType = WorkflowType.SEQUENTIAL
    nodes: list[NodeSchema] = Field(default_factory=list)
    edges: list[EdgeSchema] = Field(default_factory=list)
    workspace_id: str | None = None


class WorkflowUpdate(BaseModel):
    """Partial update for a workflow."""
    name: str | None = Field(None, min_length=1, max_length=200)
    description: str | None = None
    workflow_type: WorkflowType | None = None
    nodes: list[NodeSchema] | None = None
    edges: list[EdgeSchema] | None = None
    is_active: bool | None = None


class WorkflowResponse(BaseModel):
    """Full workflow detail with graph data."""
    id: str
    tenant_id: str
    workspace_id: str | None = None
    name: str
    description: str | None = None
    workflow_type: WorkflowType
    nodes: list[NodeSchema]
    edges: list[EdgeSchema]
    is_active: bool
    total_executions: int = 0
    created_at: datetime
    updated_at: datetime
