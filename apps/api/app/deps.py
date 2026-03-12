"""Dependency injection providers for FastAPI.

Provides Supabase client, Redis client, and current user extraction.
All route handlers should use these deps -- never instantiate directly.
"""

from typing import Annotated, AsyncGenerator

import redis.asyncio as aioredis
from fastapi import Depends, Header, HTTPException, status
from supabase._async.client import AsyncClient, create_client

from app.config import Settings, get_settings

# ---------------------------------------------------------------------------
# Module-level singletons (initialized on first call, reused across requests)
# ---------------------------------------------------------------------------
_supabase_client: AsyncClient | None = None
_redis_client: aioredis.Redis | None = None


async def get_supabase(
    settings: Settings = Depends(get_settings),
) -> AsyncClient:
    """Return async Supabase client (singleton).

    Uses the service-role key so backend can bypass RLS when needed.
    Individual queries should still scope by tenant_id for safety.
    """
    global _supabase_client
    if _supabase_client is None:
        _supabase_client = await create_client(
            settings.supabase_url,
            settings.supabase_service_role_key,
        )
    return _supabase_client


async def get_redis(
    settings: Settings = Depends(get_settings),
) -> aioredis.Redis:
    """Return async Redis client (singleton).

    Used for caching, rate limiting, and pub/sub.
    """
    global _redis_client
    if _redis_client is None:
        _redis_client = aioredis.from_url(
            settings.redis_url,
            encoding="utf-8",
            decode_responses=True,
        )
    return _redis_client


async def get_current_user(
    authorization: Annotated[str | None, Header()] = None,
    settings: Settings = Depends(get_settings),
    supabase: AsyncClient = Depends(get_supabase),
) -> dict:
    """Extract and validate current user from Supabase JWT Bearer token.

    Returns dict with: id, email, organization_id, role.
    Raises 401 if token is missing or invalid.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid authorization header",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = authorization.removeprefix("Bearer ").strip()

    try:
        # Validate JWT and get user from Supabase Auth
        user_response = await supabase.auth.get_user(token)
        if user_response is None or user_response.user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token",
            )
        user = user_response.user
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Token validation failed: {exc}",
        ) from exc

    # Fetch profile from profiles table for org/role info
    profile_resp = (
        await supabase.table("profiles")
        .select("organization_id, role")
        .eq("id", user.id)
        .single()
        .execute()
    )
    profile = profile_resp.data or {}

    return {
        "id": user.id,
        "email": user.email,
        "organization_id": profile.get("organization_id"),
        "role": profile.get("role", "member"),
    }


async def get_current_tenant_id(
    current_user: dict = Depends(get_current_user),
) -> str:
    """Extract organization_id from the authenticated user."""
    tenant_id = current_user.get("organization_id")
    if not tenant_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No organization associated with user. Complete onboarding first.",
        )
    return tenant_id


# ---------------------------------------------------------------------------
# Type aliases for cleaner route signatures
# ---------------------------------------------------------------------------
SupabaseDep = Annotated[AsyncClient, Depends(get_supabase)]
RedisDep = Annotated[aioredis.Redis, Depends(get_redis)]
CurrentUser = Annotated[dict, Depends(get_current_user)]
TenantId = Annotated[str, Depends(get_current_tenant_id)]
SettingsDep = Annotated[Settings, Depends(get_settings)]

# Legacy alias -- routes that used DbSession now use SupabaseDep
DbSession = SupabaseDep
