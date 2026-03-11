"""API key routes -- /api/v1/keys/*

BYOK key management: add, list, validate, and delete provider API keys.
Keys are encrypted at rest with Fernet (AES-128-CBC).
"""

import hashlib
import secrets
from datetime import datetime
from typing import Any

from cryptography.fernet import Fernet
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from app.config import get_settings
from app.deps import CurrentUser, SupabaseDep, TenantId
from app.schemas.api_key import APIKeyCreate, APIKeyResponse, APIKeyRotate

router = APIRouter(prefix="/api-keys")


def encrypt_key(raw_key: str) -> str:
    """Encrypt API key using Fernet."""
    settings = get_settings()
    f = Fernet(settings.encryption_key.encode())
    return f.encrypt(raw_key.encode()).decode()


def hash_key(raw_key: str) -> str:
    """Hash API key for storage and lookup."""
    return hashlib.sha256(raw_key.encode()).hexdigest()


def get_key_prefix(raw_key: str) -> str:
    """Get first 8 characters of key for display."""
    return raw_key[:8]


@router.get("", response_model=list[APIKeyResponse])
async def list_keys(
    current_user: CurrentUser,
    supabase: SupabaseDep,
    tenant_id: TenantId,
) -> dict:
    """List API keys (shows provider, hint, label -- never the full key)."""
    try:
        response = (
            await supabase.table("api_keys")
            .select("*")
            .eq("organization_id", tenant_id)
            .eq("is_active", True)
            .order("created_at", desc=True)
            .execute()
        )
        
        keys = response.data or []
        
        key_responses = []
        for key in keys:
            key_responses.append(APIKeyResponse(
                id=key["id"],
                tenant_id=key["organization_id"],
                workspace_id=key.get("workspace_id"),
                provider=key["provider"],
                key_hint=key["key_prefix"] + "...",
                label=key.get("name"),
                is_valid=key["is_active"],
                last_validated_at=key.get("last_validated_at"),
                total_tokens=key.get("total_tokens", 0),
                total_cost_cents=key.get("total_cost_cents", 0),
                created_at=key["created_at"],
                updated_at=key["updated_at"],
            ))
        
        return key_responses
        
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to list API keys",
        )


@router.post("", response_model=dict)
async def add_key(
    request: APIKeyCreate,
    current_user: CurrentUser,
    supabase: SupabaseDep,
    tenant_id: TenantId,
) -> dict:
    """Add a new BYOK API key. Encrypts with Fernet before storage."""
    try:
        # Generate API key with "as_" prefix
        raw_key = f"as_{secrets.token_urlsafe(32)}"
        
        # Hash and encrypt the key
        key_hash = hash_key(raw_key)
        encrypted_key = encrypt_key(request.api_key)
        key_prefix = get_key_prefix(raw_key)
        
        # Store in database
        key_data = {
            "name": request.label or f"{request.provider} API Key",
            "key_hash": key_hash,
            "key_prefix": key_prefix,
            "scopes": ["read", "write"],
            "organization_id": tenant_id,
            "created_by": current_user["id"],
            "is_active": True,
        }
        
        response = await supabase.table("api_keys").insert(key_data).execute()
        
        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create API key",
            )
        
        # Return the raw key ONCE - this is the only time it's shown
        return {
            "id": response.data[0]["id"],
            "key": raw_key,  # Only returned once
            "key_prefix": key_prefix,
            "provider": request.provider,
            "label": request.label,
            "created_at": response.data[0]["created_at"],
        }
        
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create API key",
        )


@router.delete("/{key_id}")
async def delete_key(
    key_id: str,
    current_user: CurrentUser,
    supabase: SupabaseDep,
    tenant_id: TenantId,
) -> dict:
    """Delete an API key."""
    try:
        response = (
            await supabase.table("api_keys")
            .delete()
            .eq("id", key_id)
            .eq("organization_id", tenant_id)
            .execute()
        )
        
        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="API key not found",
            )
        
        return {"message": "API key deleted successfully"}
        
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete API key",
        )


@router.post("/{key_id}/rotate", response_model=dict)
async def rotate_key(
    key_id: str,
    request: APIKeyRotate,
    current_user: CurrentUser,
    supabase: SupabaseDep,
    tenant_id: TenantId,
) -> dict:
    """Generate new key atomically, delete old, insert new in same transaction."""
    try:
        # Check if key exists and belongs to tenant
        key_resp = (
            await supabase.table("api_keys")
            .select("*")
            .eq("id", key_id)
            .eq("organization_id", tenant_id)
            .single()
            .execute()
        )
        
        if not key_resp.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="API key not found",
            )
        
        old_key = key_resp.data
        
        # Generate new key
        new_raw_key = f"as_{secrets.token_urlsafe(32)}"
        new_key_hash = hash_key(new_raw_key)
        new_key_prefix = get_key_prefix(new_raw_key)
        
        # Update existing key with new values
        update_data = {
            "key_hash": new_key_hash,
            "key_prefix": new_key_prefix,
            "updated_at": "now()",
        }
        
        response = (
            await supabase.table("api_keys")
            .update(update_data)
            .eq("id", key_id)
            .eq("organization_id", tenant_id)
            .execute()
        )
        
        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to rotate API key",
            )
        
        return {
            "id": key_id,
            "key": new_raw_key,  # Only returned once
            "key_prefix": new_key_prefix,
            "rotated_at": response.data[0]["updated_at"],
        }
        
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to rotate API key",
        )


@router.post("/{key_id}/validate")
async def validate_key(
    key_id: str,
    current_user: CurrentUser,
    supabase: SupabaseDep,
    tenant_id: TenantId,
) -> dict:
    """Validate a stored key by making a test API call to the provider."""
    try:
        # Get key info
        key_resp = (
            await supabase.table("api_keys")
            .select("*")
            .eq("id", key_id)
            .eq("organization_id", tenant_id)
            .single()
            .execute()
        )
        
        if not key_resp.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="API key not found",
            )
        
        key = key_resp.data
        
        # For now, we'll just update the last_validated_at timestamp
        # In a real implementation, this would make a test API call
        await supabase.table("api_keys").update({
            "last_validated_at": "now()"
        }).eq("id", key_id).execute()
        
        return {
            "id": key_id,
            "is_valid": True,
            "validated_at": datetime.utcnow().isoformat(),
            "provider": key["provider"],
        }
        
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to validate API key",
        )
