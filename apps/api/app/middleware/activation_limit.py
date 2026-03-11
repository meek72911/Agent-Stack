"""Agent activation limit enforcement middleware."""

from fastapi import HTTPException, status
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import Response

from app.deps import get_supabase
from app.middleware.plan_enforcement import PLAN_LIMITS


class ActivationLimitMiddleware(BaseHTTPMiddleware):
    """Check agent activation count against plan limits on activate endpoints."""

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        """Pass through unless activating an agent -- then enforce limit."""
        path = request.url.path
        method = request.method
        
        # Only intercept POST /api/v1/agents/{id}/activate
        if method == "POST" and path.endswith("/activate") and "/api/v1/agents/" in path:
            tenant_id = getattr(request.state, "tenant_id", None)
            if tenant_id:
                await self._check_activation_limit(tenant_id)

        response = await call_next(request)
        return response

    async def _check_activation_limit(self, tenant_id: str) -> None:
        """Check if tenant has reached agent activation limit."""
        try:
            # Get tenant plan
            supabase = await get_supabase()
            
            org_resp = (
                await supabase.table("organizations")
                .select("plan")
                .eq("id", tenant_id)
                .single()
                .execute()
            )
            
            plan = org_resp.data.get("plan") if org_resp.data else "free"
            limit = PLAN_LIMITS.get(plan, {}).get("max_activated_agents", 2)
            
            if limit == -1:  # unlimited
                return

            # Count currently active agents for tenant
            agents_resp = (
                await supabase.table("agents")
                .select("id")
                .eq("organization_id", tenant_id)
                .eq("status", "active")
                .execute()
            )
            
            current_count = len(agents_resp.data) if agents_resp.data else 0
            
            if current_count >= limit:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Agent activation limit ({limit}) reached for {plan} plan. Deactivate existing agents or upgrade your plan.",
                )
                
        except HTTPException:
            raise
        except Exception:
            # If check fails, allow the request (fail open)
            pass
