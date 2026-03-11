"""JWT and API key authentication middleware.

Extracts user identity from Authorization header (Bearer JWT)
or X-API-Key header for programmatic access.
Sets request.state.user and request.state.tenant_id.
"""

import hashlib
import secrets
from typing import Any, Dict

from fastapi import HTTPException, status
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import Response

from app.config import get_settings


class AuthMiddleware(BaseHTTPMiddleware):
    """Authenticate requests via JWT or API key."""

    # Public paths that skip authentication
    PUBLIC_PATHS: set[str] = {
        "/api/v1/health",
        "/api/v1/auth/register",
        "/api/v1/auth/login",
        "/api/v1/auth/refresh",
        "/api/v1/auth/forgot-password",
        "/api/v1/auth/reset-password",
        "/api/docs",
        "/api/redoc",
        "/api/openapi.json",
    }

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        """Validate auth token and attach user context to request."""
        # Skip auth for public paths
        if request.url.path in self.PUBLIC_PATHS:
            return await call_next(request)

        # Try Bearer token first
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            user = await self._validate_jwt_token(auth_header)
            if user:
                request.state.user = user
                request.state.tenant_id = user["organization_id"]
                return await call_next(request)

        # Try API key
        api_key = request.headers.get("X-API-Key")
        if api_key:
            user = await self._validate_api_key(api_key)
            if user:
                request.state.user = user
                request.state.tenant_id = user["organization_id"]
                return await call_next(request)

        # No valid auth found
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required. Use Bearer token or X-API-Key header.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    async def _validate_jwt_token(self, auth_header: str) -> Dict[str, Any] | None:
        """Validate JWT token via Supabase."""
        try:
            from app.deps import get_supabase
            
            token = auth_header.removeprefix("Bearer ").strip()
            settings = get_settings()
            supabase = await get_supabase()
            
            # Validate JWT and get user from Supabase Auth
            user_response = await supabase.auth.get_user(token)
            user = user_response.user
            if user is None:
                return None

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
        except Exception:
            return None

    async def _validate_api_key(self, api_key: str) -> Dict[str, Any] | None:
        """Validate API key by hashing and looking up in api_keys table."""
        try:
            from app.deps import get_supabase
            
            settings = get_settings()
            supabase = await get_supabase()
            
            # Hash the provided key
            key_hash = hashlib.sha256(api_key.encode()).hexdigest()
            
            # Look up in api_keys table
            key_resp = (
                await supabase.table("api_keys")
                .select("organization_id, created_by, name, scopes, is_active, expires_at")
                .eq("key_hash", key_hash)
                .eq("is_active", True)
                .single()
                .execute()
            )
            
            if not key_resp.data:
                return None
                
            api_key_data = key_resp.data
            
            # Check expiration
            if api_key_data.get("expires_at"):
                from datetime import datetime, timezone
                if datetime.now(timezone.utc) > api_key_data["expires_at"]:
                    return None
            
            # Get user info for the API key creator
            profile_resp = (
                await supabase.table("profiles")
                .select("email, role")
                .eq("id", api_key_data["created_by"])
                .single()
                .execute()
            )
            profile = profile_resp.data or {}

            # Update last_used_at
            await supabase.table("api_keys").update({
                "last_used_at": "now()"
            }).eq("key_hash", key_hash).execute()

            return {
                "id": api_key_data["created_by"],
                "email": profile.get("email"),
                "organization_id": api_key_data["organization_id"],
                "role": profile.get("role", "member"),
                "api_key": {
                    "name": api_key_data["name"],
                    "scopes": api_key_data.get("scopes", []),
                },
            }
        except Exception:
            return None
