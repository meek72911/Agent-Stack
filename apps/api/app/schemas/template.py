"""Template schemas -- marketplace templates and installation."""

from datetime import datetime
from pydantic import BaseModel, Field


class TemplateCreate(BaseModel):
    """Request body to create a new template (admin only)."""
    name: str = Field(..., min_length=1, max_length=200)
    slug: str = Field(..., min_length=1, max_length=100)
    description: str = Field(..., max_length=2000)
    category: str = Field(..., description="e.g. customer-support, sales, marketing, dev-tools")
    icon: str | None = Field(None, description="Icon identifier or URL")
    system_prompt: str
    model: str = "gpt-4o-mini"
    temperature: float = 0.7
    tools: list[str] = Field(default_factory=list)
    sample_inputs: list[dict] = Field(default_factory=list, description="Example inputs for the template")
    is_featured: bool = False
    is_premium: bool = False


class TemplateResponse(BaseModel):
    """Template detail response."""
    id: str
    name: str
    slug: str
    description: str
    category: str
    icon: str | None = None
    system_prompt: str
    model: str
    temperature: float
    tools: list[str]
    sample_inputs: list[dict]
    is_featured: bool
    is_premium: bool
    install_count: int = 0
    created_at: datetime
    updated_at: datetime


class TemplateInstall(BaseModel):
    """Request body to install a template as a new agent."""
    template_id: str
    agent_name: str | None = Field(None, description="Override default template name")
    workspace_id: str | None = None
    customizations: dict = Field(default_factory=dict, description="Override template defaults")
