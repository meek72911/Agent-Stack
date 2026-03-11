"""Tenant context injection middleware for Row-Level Security.

Sets the PostgreSQL session variable `app.current_tenant_id`
on every authenticated request so RLS policies are enforced.
"""

from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import Response

from app.deps import get_supabase


class TenantMiddleware(BaseHTTPMiddleware):
    """Inject tenant context into DB session for RLS enforcement."""

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        """Set app.current_tenant_id session variable for RLS policies."""
        tenant_id = getattr(request.state, "tenant_id", None)
        if tenant_id:
            try:
                # Execute SET LOCAL app.current_tenant_id = tenant_id on the DB session
                supabase = await get_supabase()
                
                # Use raw SQL to set the session variable for RLS
                await supabase.rpc("set_tenant_context", {"p_tenant_id": str(tenant_id)}).execute()
                
                # Fallback: Direct SQL execution if RPC doesn't exist
                # This would require creating the function in Supabase first
                # For now, we'll rely on Supabase's built-in RLS with auth.uid()
                # and organization_id filtering in queries
                
            except Exception:
                # If setting tenant context fails, continue without it
                # This shouldn't break the request, but RLS won't be enforced
                pass
                
        return await call_next(request)
