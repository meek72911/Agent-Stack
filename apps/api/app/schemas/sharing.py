"""Sharing schemas -- share links, public/private, forking."""

from datetime import datetime
from enum import Enum
from pydantic import BaseModel, Field


class ShareVisibility(str, Enum):
    """Share link visibility levels."""
    PUBLIC = "public"
    UNLISTED = "unlisted"
    PRIVATE = "private"


class ShareLinkCreate(BaseModel):
    """Request body to create a share link for a workflow or agent."""
    resource_type: str = Field(..., description="workflow | agent")
    resource_id: str
    visibility: ShareVisibility = ShareVisibility.UNLISTED
    allow_fork: bool = Field(default=True, description="Allow others to fork/clone")
    password: str | None = Field(None, description="Optional password protection")
    expires_at: datetime | None = Field(None, description="Optional expiration timestamp")


class ShareLinkResponse(BaseModel):
    """Share link detail."""
    id: str
    tenant_id: str
    resource_type: str
    resource_id: str
    share_slug: str = Field(..., description="Short unique slug for the share URL")
    share_url: str = Field(..., description="Full shareable URL")
    visibility: ShareVisibility
    allow_fork: bool
    has_password: bool = False
    expires_at: datetime | None = None
    view_count: int = 0
    fork_count: int = 0
    created_at: datetime


class SharedWorkflowResponse(BaseModel):
    """Public view of a shared workflow (no sensitive data)."""
    id: str
    name: str
    description: str | None = None
    workflow_type: str
    node_count: int = 0
    author_name: str
    author_avatar_url: str | None = None
    share_slug: str
    allow_fork: bool
    view_count: int = 0
    fork_count: int = 0
    created_at: datetime
