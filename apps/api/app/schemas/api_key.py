"""API Key schemas -- BYOK key management."""

from datetime import datetime
from pydantic import BaseModel, Field


class APIKeyCreate(BaseModel):
    """Request body to store a new BYOK API key."""
    provider: str = Field(..., description="Provider name: openai | anthropic | google | cohere | custom")
    api_key: str = Field(..., min_length=10, description="Raw API key (will be Fernet-encrypted)")
    label: str | None = Field(None, max_length=200, description="Human-friendly label")
    workspace_id: str | None = None


class APIKeyResponse(BaseModel):
    """API key detail (key is masked, never returned in full)."""
    id: str
    tenant_id: str
    workspace_id: str | None = None
    provider: str
    key_hint: str = Field(..., description="Masked key hint, e.g. sk-...7xQ2")
    label: str | None = None
    is_valid: bool = True
    last_validated_at: datetime | None = None
    total_tokens: int = 0
    total_cost_cents: int = 0
    created_at: datetime
    updated_at: datetime


class APIKeyRotate(BaseModel):
    """Request body to rotate an existing API key."""
    new_api_key: str = Field(..., min_length=10, description="Replacement API key")
