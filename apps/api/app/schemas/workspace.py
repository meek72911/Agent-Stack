"""Workspace schemas -- client workspace CRUD."""

from datetime import datetime
from pydantic import BaseModel, Field


class BrandingConfig(BaseModel):
    """White-label branding configuration for a client workspace."""
    logo_url: str | None = None
    favicon_url: str | None = None
    primary_color: str = Field(default="#6366f1", description="Hex color code")
    accent_color: str = Field(default="#8b5cf6")
    company_name: str | None = None
    custom_domain: str | None = None


class WorkspaceCreate(BaseModel):
    """Request body to create a client workspace."""
    name: str = Field(..., min_length=1, max_length=200)
    slug: str = Field(..., min_length=1, max_length=100, pattern="^[a-z0-9-]+$")
    description: str | None = Field(None, max_length=2000)
    branding: BrandingConfig = Field(default_factory=BrandingConfig)


class WorkspaceUpdate(BaseModel):
    """Partial update for a client workspace."""
    name: str | None = Field(None, min_length=1, max_length=200)
    description: str | None = None
    branding: BrandingConfig | None = None
    is_active: bool | None = None


class WorkspaceResponse(BaseModel):
    """Client workspace detail response."""
    id: str
    tenant_id: str
    name: str
    slug: str
    description: str | None = None
    branding: BrandingConfig
    is_active: bool
    agent_count: int = 0
    workflow_count: int = 0
    created_at: datetime
    updated_at: datetime
