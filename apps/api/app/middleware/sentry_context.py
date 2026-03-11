"""Sentry user/tenant context enrichment middleware."""

from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import Response

from app.deps import get_supabase


class SentryContextMiddleware(BaseHTTPMiddleware):
    """Enrich Sentry events with user and tenant context."""

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        """Attach user_id, tenant_id, plan to Sentry scope."""
        try:
            # Import sentry_sdk (it's initialized in main.py lifespan)
            import sentry_sdk
            
            tenant_id = getattr(request.state, "tenant_id", None)
            user = getattr(request.state, "user", {})
            
            if tenant_id and user:
                # Set user context for Sentry
                sentry_sdk.set_user({
                    "id": user.get("id"),
                    "email": user.get("email"),
                    "tenant_id": tenant_id,
                })
                
                # Get plan information
                plan = await self._get_tenant_plan(tenant_id)
                
                # Set tags for better filtering in Sentry
                sentry_sdk.set_tag("tenant_id", tenant_id)
                sentry_sdk.set_tag("plan", plan or "unknown")
                sentry_sdk.set_tag("user_role", user.get("role", "unknown"))
                
        except Exception:
            # If Sentry context setting fails, continue without it
            pass
            
        response = await call_next(request)
        return response

    async def _get_tenant_plan(self, tenant_id: str) -> str | None:
        """Get the plan for a tenant from organizations table."""
        try:
            supabase = await get_supabase()
            
            org_resp = (
                await supabase.table("organizations")
                .select("plan")
                .eq("id", tenant_id)
                .single()
                .execute()
            )
            
            return org_resp.data.get("plan") if org_resp.data else None
            
        except Exception:
            return None
