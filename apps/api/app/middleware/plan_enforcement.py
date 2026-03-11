"""Plan enforcement middleware.

Checks resource limits (agents, workflows, executions, workspaces)
before allowing create/execute operations.
"""

from datetime import datetime
from typing import Dict

from fastapi import HTTPException, status
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import Response

from app.deps import get_redis, get_supabase

# Canonical plan limits -- single source of truth
PLAN_LIMITS: Dict[str, Dict] = {
    "free": {
        "max_activated_agents": 2,
        "max_workflows": 5,
        "max_workspaces": 1,
        "max_executions_per_month": 100,
        "rate_limit_rpm": 60,
        "can_share_workflows": False,
        "can_export_reports": False,
        "can_white_label": False,
    },
    "pro": {
        "max_activated_agents": 10,
        "max_workflows": 50,
        "max_workspaces": 5,
        "max_executions_per_month": 1000,
        "rate_limit_rpm": 300,
        "can_share_workflows": True,
        "can_export_reports": True,
        "can_white_label": False,
    },
    "team": {
        "max_activated_agents": 50,
        "max_workflows": 200,
        "max_workspaces": 20,
        "max_executions_per_month": 10000,
        "rate_limit_rpm": 1000,
        "can_share_workflows": True,
        "can_export_reports": True,
        "can_white_label": True,
    },
    "enterprise": {
        "max_activated_agents": -1,  # unlimited
        "max_workflows": -1,         # unlimited
        "max_workspaces": -1,        # unlimited
        "max_executions_per_month": -1,  # unlimited
        "rate_limit_rpm": 5000,
        "can_share_workflows": True,
        "can_export_reports": True,
        "can_white_label": True,
    },
}


class PlanEnforcementMiddleware(BaseHTTPMiddleware):
    """Enforce plan-based resource limits on create and execute operations."""

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        """Check plan limits before resource creation or execution."""
        tenant_id = getattr(request.state, "tenant_id", None)
        if not tenant_id:
            return await call_next(request)

        # Get user plan from organization
        plan = await self._get_tenant_plan(tenant_id)
        if not plan:
            return await call_next(request)

        path = request.url.path
        method = request.method

        # Check specific endpoints for plan limits
        if method == "POST":
            if path == "/api/v1/agents":
                await self._check_agent_limit(tenant_id, plan)
            elif path == "/api/v1/workflows":
                await self._check_workflow_limit(tenant_id, plan)
            elif path.startswith("/api/v1/workflows/") and path.endswith("/execute"):
                await self._check_execution_limit(tenant_id, plan)
            elif path == "/api/v1/workspaces":
                await self._check_workspace_limit(tenant_id, plan)

        return await call_next(request)

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

    async def _check_agent_limit(self, tenant_id: str, plan: str) -> None:
        """Check if tenant has reached max activated agents limit."""
        limit = PLAN_LIMITS.get(plan, {}).get("max_activated_agents", 2)
        if limit == -1:  # unlimited
            return

        try:
            supabase = await get_supabase()
            
            # Count active agents for tenant
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
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail=f"Agent limit ({limit}) reached for {plan} plan. Upgrade to add more agents.",
                )
                
        except HTTPException:
            raise
        except Exception:
            # If check fails, allow the request (fail open)
            pass

    async def _check_workflow_limit(self, tenant_id: str, plan: str) -> None:
        """Check if tenant has reached max workflows limit."""
        limit = PLAN_LIMITS.get(plan, {}).get("max_workflows", 5)
        if limit == -1:  # unlimited
            return

        try:
            supabase = await get_supabase()
            
            # Count workflows for tenant
            workflows_resp = (
                await supabase.table("workflows")
                .select("id")
                .eq("organization_id", tenant_id)
                .execute()
            )
            
            current_count = len(workflows_resp.data) if workflows_resp.data else 0
            
            if current_count >= limit:
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail=f"Workflow limit ({limit}) reached for {plan} plan. Upgrade to create more workflows.",
                )
                
        except HTTPException:
            raise
        except Exception:
            # If check fails, allow the request (fail open)
            pass

    async def _check_execution_limit(self, tenant_id: str, plan: str) -> None:
        """Check if tenant has reached max executions per month limit."""
        limit = PLAN_LIMITS.get(plan, {}).get("max_executions_per_month", 100)
        if limit == -1:  # unlimited
            return

        try:
            redis = await get_redis()
            
            # Get current month execution count from Redis
            now = datetime.utcnow()
            key = f"executions:{tenant_id}:{now.year}:{now.month}"
            
            current_count = int(await redis.get(key) or 0)
            
            if current_count >= limit:
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail=f"Monthly execution limit ({limit}) reached for {plan} plan. Upgrade or wait until next month.",
                )
                
        except HTTPException:
            raise
        except Exception:
            # If check fails, allow the request (fail open)
            pass

    async def _check_workspace_limit(self, tenant_id: str, plan: str) -> None:
        """Check if tenant has reached max workspaces limit."""
        limit = PLAN_LIMITS.get(plan, {}).get("max_workspaces", 1)
        if limit == -1:  # unlimited
            return

        try:
            # For now, since client_workspaces table doesn't exist,
            # we'll skip this check. In a full implementation,
            # this would count client_workspaces for the tenant
            pass
            
        except HTTPException:
            raise
        except Exception:
            # If check fails, allow the request (fail open)
            pass
