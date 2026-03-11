"""Workspace resolution middleware.

Resolves the active workspace from the X-Workspace-Id header
or the user's active_workspace_id setting.
"""

from fastapi import HTTPException, status
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import Response

from app.deps import get_supabase


class WorkspaceMiddleware(BaseHTTPMiddleware):
    """Resolve current workspace context from header or user default."""

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        """Set request.state.workspace_id from header or user default."""
        # Get tenant_id from auth middleware
        tenant_id = getattr(request.state, "tenant_id", None)
        if not tenant_id:
            return await call_next(request)

        # Check X-Workspace-Id header first
        workspace_id = request.headers.get("X-Workspace-Id")
        
        if workspace_id:
            # Validate workspace belongs to tenant
            if await self._validate_workspace(workspace_id, tenant_id):
                request.state.workspace_id = workspace_id
            else:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Workspace does not belong to your organization",
                )
        else:
            # Fall back to user's default workspace (organization_id for now)
            # In a full implementation, this would check user.active_workspace_id
            # For now, we use the organization_id as the default workspace
            request.state.workspace_id = tenant_id

        return await call_next(request)

    async def _validate_workspace(self, workspace_id: str, tenant_id: str) -> bool:
        """Validate that workspace belongs to the tenant."""
        try:
            supabase = await get_supabase()
            
            # For now, since we don't have client_workspaces table,
            # we'll validate against organization_id
            # In a full implementation, this would query client_workspaces table
            
            # Check if workspace_id matches tenant_id (org-level workspace)
            if workspace_id == tenant_id:
                return True
                
            # When client_workspaces table exists, uncomment and use this:
            # workspace_resp = (
            #     await supabase.table("client_workspaces")
            #     .select("id")
            #     .eq("id", workspace_id)
            #     .eq("organization_id", tenant_id)
            #     .single()
            #     .execute()
            # )
            # return workspace_resp.data is not None
            
            return False
            
        except Exception:
            return False
