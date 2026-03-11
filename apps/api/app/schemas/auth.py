"""Auth schemas -- token responses, user profiles, signup."""

from datetime import datetime
from pydantic import BaseModel, EmailStr, Field


class SignupRequest(BaseModel):
    """Request body for email/password signup."""
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)
    full_name: str = Field(..., min_length=1, max_length=200)
    company_name: str | None = Field(None, max_length=200)


class TokenResponse(BaseModel):
    """JWT token pair returned after login or token refresh."""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int = Field(..., description="Access token TTL in seconds")


class UserProfile(BaseModel):
    """Authenticated user profile."""
    id: str
    email: str
    full_name: str
    avatar_url: str | None = None
    tenant_id: str
    role: str = Field(default="owner", description="owner | admin | member | viewer")
    plan: str = Field(default="free")
    created_at: datetime
    last_login_at: datetime | None = None
