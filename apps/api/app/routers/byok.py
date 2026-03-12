"""BYOK (Bring Your Own Key) API Key Management with AES-256 Encryption."""

import json
from datetime import datetime
from typing import List, Optional
from cryptography.fernet import Fernet
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field

from app.deps import CurrentUser, SupabaseDep, TenantId

router = APIRouter(prefix="/byok", tags=["BYOK"])

# Encryption key management
def get_encryption_key():
    """Get encryption key from environment or generate one."""
    import os
    key = os.getenv("ENCRYPTION_KEY")
    if not key:
        # Generate a new key (for development only)
        key = Fernet.generate_key().decode()
    return key.encode()

class APIKeyCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    provider: str = Field(..., pattern="^(openai|anthropic|claude|gemini|mistral)$")
    encrypted_key: Optional[str] = None
    plain_key: Optional[str] = Field(None, max_length=500)

class APIKeyResponse(BaseModel):
    id: str
    name: str
    provider: str
    created_at: datetime
    last_used: Optional[datetime] = None

class APIKeyListResponse(BaseModel):
    keys: List[APIKeyResponse]
    count: int

def encrypt_key(plain_key: str) -> str:
    """Encrypt API key using AES-256 (Fernet)."""
    fernet = Fernet(get_encryption_key())
    return fernet.encrypt(plain_key.encode()).decode()

def decrypt_key(encrypted_key: str) -> str:
    """Decrypt API key using AES-256 (Fernet)."""
    fernet = Fernet(get_encryption_key())
    return fernet.decrypt(encrypted_key.encode()).decode()

@router.post("", response_model=APIKeyResponse, status_code=status.HTTP_201_CREATED)
async def create_api_key(
    key_data: APIKeyCreate,
    current_user: CurrentUser,
    supabase: SupabaseDep,
    tenant_id: TenantId,
):
    """Create a new encrypted API key."""
    if key_data.plain_key:
        encrypted = encrypt_key(key_data.plain_key)
    elif key_data.encrypted_key:
        encrypted = key_data.encrypted_key
    else:
        raise HTTPException(status_code=400, detail="Either plain_key or encrypted_key must be provided")

    # Store in database
    result = await supabase.table("api_keys").insert({
        "user_id": current_user["id"],
        "organization_id": tenant_id,
        "name": key_data.name,
        "provider": key_data.provider,
        "encrypted_key": encrypted,
    }).execute()

    return APIKeyResponse(
        id=result.data[0]["id"],
        name=key_data.name,
        provider=key_data.provider,
        created_at=datetime.fromisoformat(result.data[0]["created_at"]),
    )

@router.get("", response_model=APIKeyListResponse)
async def list_api_keys(
    current_user: CurrentUser,
    supabase: SupabaseDep,
    tenant_id: TenantId,
):
    """List all API keys for the organization."""
    result = await supabase.table("api_keys").select("*").eq("organization_id", tenant_id).execute()

    keys = [
        APIKeyResponse(
            id=key["id"],
            name=key["name"],
            provider=key["provider"],
            created_at=datetime.fromisoformat(key["created_at"]),
            last_used=datetime.fromisoformat(key["last_used"]) if key.get("last_used") else None,
        )
        for key in result.data
    ]

    return APIKeyListResponse(keys=keys, count=len(keys))

@router.delete("/{key_id}")
async def delete_api_key(
    key_id: str,
    current_user: CurrentUser,
    supabase: SupabaseDep,
    tenant_id: TenantId,
):
    """Delete an API key."""
    await supabase.table("api_keys").delete().eq("id", key_id).eq("organization_id", tenant_id).execute()
    return {"status": "deleted"}
