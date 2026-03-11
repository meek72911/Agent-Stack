"""Workspace routes -- /api/v1/workspaces/*

Client workspace CRUD, workspace switching, and report generation.
Core differentiator: agency isolation per client workspace.
"""

from typing import Any, Dict

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel

from app.deps import CurrentUser, SupabaseDep, TenantId

router = APIRouter(prefix="/workspaces")


class WorkspaceCreate(BaseModel):
    """Request body to create a workspace."""
    name: str
    description: str | None = None
    branding: Dict[str, Any] = {}


class WorkspaceUpdate(BaseModel):
    """Request body to update a workspace."""
    name: str | None = None
    description: str | None = None
    branding: Dict[str, Any] = {}


@router.get("")
async def list_workspaces(
    supabase: SupabaseDep,
    tenant_id: TenantId,
    search: str | None = Query(None),
    limit: int = Query(25, ge=1, le=100),
    offset: int = Query(0, ge=0),
) -> dict:
    """List client workspaces for the current tenant."""
    try:
        # Since client_workspaces table doesn't exist, we'll return the organization as default workspace
        # In a full implementation, this would query client_workspaces table
        
        # Get organization info as default workspace
        org_resp = (
            await supabase.table("organizations")
            .select("id, name, slug, created_at, updated_at")
            .eq("id", tenant_id)
            .single()
            .execute()
        )
        
        if not org_resp.data:
            return {"workspaces": [], "total": 0, "limit": limit, "offset": offset, "has_more": False}
        
        org = org_resp.data
        
        # Get agent and workflow counts for this organization
        agents_resp = (
            await supabase.table("agents")
            .select("id")
            .eq("organization_id", tenant_id)
            .is_("deleted_at", None)
            .execute()
        )
        
        workflows_resp = (
            await supabase.table("workflows")
            .select("id")
            .eq("organization_id", tenant_id)
            .is_("deleted_at", None)
            .execute()
        )
        
        workspace = {
            "id": org["id"],
            "name": org["name"],
            "slug": org["slug"],
            "description": "Main organization workspace",
            "branding": {},
            "agent_count": len(agents_resp.data or []),
            "workflow_count": len(workflows_resp.data or []),
            "created_at": org["created_at"],
            "updated_at": org["updated_at"],
        }
        
        return {
            "workspaces": [workspace],
            "total": 1,
            "limit": limit,
            "offset": offset,
            "has_more": False,
        }
        
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to list workspaces",
        )


@router.post("")
async def create_workspace(
    request: WorkspaceCreate,
    current_user: CurrentUser,
    supabase: SupabaseDep,
    tenant_id: TenantId,
) -> dict:
    """Create a new client workspace. Checks plan workspace limit."""
    try:
        # Since client_workspaces table doesn't exist, we'll create a placeholder response
        # In a full implementation, this would insert into client_workspaces table
        
        # For now, we'll just return a success message with the org info
        org_resp = (
            await supabase.table("organizations")
            .select("id, name")
            .eq("id", tenant_id)
            .single()
            .execute()
        )
        
        if not org_resp.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Organization not found",
            )
        
        # In a real implementation, this would check plan limits and create workspace
        return {
            "message": "Workspace creation not yet implemented - using organization as default workspace",
            "organization": org_resp.data,
        }
        
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create workspace",
        )


@router.get("/{workspace_id}")
async def get_workspace(
    workspace_id: str,
    supabase: SupabaseDep,
    tenant_id: TenantId,
) -> dict:
    """Get workspace detail with agent/workflow counts and recent activity."""
    try:
        # Verify workspace belongs to tenant
        if workspace_id != tenant_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Workspace not found",
            )
        
        # Get organization info
        org_resp = (
            await supabase.table("organizations")
            .select("id, name, slug, created_at, updated_at")
            .eq("id", workspace_id)
            .single()
            .execute()
        )
        
        if not org_resp.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Workspace not found",
            )
        
        org = org_resp.data
        
        # Get counts
        agents_resp = (
            await supabase.table("agents")
            .select("id, name, created_at")
            .eq("organization_id", tenant_id)
            .is_("deleted_at", None)
            .order("created_at", desc=True)
            .limit(5)
            .execute()
        )
        
        workflows_resp = (
            await supabase.table("workflows")
            .select("id, name, created_at")
            .eq("organization_id", tenant_id)
            .is_("deleted_at", None)
            .order("created_at", desc=True)
            .limit(5)
            .execute()
        )
        
        # Get recent executions
        executions_resp = (
            await supabase.table("workflow_executions")
            .select("id, status, created_at")
            .eq("organization_id", tenant_id)
            .order("created_at", desc=True)
            .limit(10)
            .execute()
        )
        
        return {
            "id": org["id"],
            "name": org["name"],
            "slug": org["slug"],
            "description": "Main organization workspace",
            "branding": {},
            "agent_count": len(agents_resp.data or []),
            "workflow_count": len(workflows_resp.data or []),
            "recent_agents": agents_resp.data or [],
            "recent_workflows": workflows_resp.data or [],
            "recent_executions": executions_resp.data or [],
            "created_at": org["created_at"],
            "updated_at": org["updated_at"],
        }
        
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch workspace",
        )


@router.patch("/{workspace_id}")
async def update_workspace(
    workspace_id: str,
    request: WorkspaceUpdate,
    current_user: CurrentUser,
    supabase: SupabaseDep,
    tenant_id: TenantId,
) -> dict:
    """Update workspace settings."""
    try:
        # Verify workspace belongs to tenant
        if workspace_id != tenant_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Workspace not found",
            )
        
        # Update organization (acting as workspace)
        update_data = {}
        
        if request.name is not None:
            update_data["name"] = request.name
        if request.description is not None:
            # Store description in settings
            org_resp = (
                await supabase.table("organizations")
                .select("settings")
                .eq("id", workspace_id)
                .single()
                .execute()
            )
            
            if org_resp.data:
                settings = org_resp.data.get("settings", {})
                settings["workspace_description"] = request.description
                update_data["settings"] = settings
        
        response = (
            await supabase.table("organizations")
            .update(update_data)
            .eq("id", workspace_id)
            .execute()
        )
        
        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Workspace not found",
            )
        
        return {"message": "Workspace updated successfully"}
        
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update workspace",
        )


@router.delete("/{workspace_id}")
async def archive_workspace(
    workspace_id: str,
    current_user: CurrentUser,
    supabase: SupabaseDep,
    tenant_id: TenantId,
) -> dict:
    """Soft-delete (archive) workspace."""
    try:
        # Verify workspace belongs to tenant
        if workspace_id != tenant_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Workspace not found",
            )
        
        # Since we can't delete the organization, we'll just return a message
        # In a full implementation with client_workspaces table, this would soft delete the workspace
        
        return {
            "message": "Workspace archiving not yet implemented - organization workspace cannot be archived",
        }
        
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to archive workspace",
        )


@router.get("/{workspace_id}/agents")
async def get_workspace_agents(
    workspace_id: str,
    supabase: SupabaseDep,
    tenant_id: TenantId,
    limit: int = Query(25, ge=1, le=100),
    offset: int = Query(0, ge=0),
) -> dict:
    """Get agents in this workspace."""
    try:
        # Verify workspace belongs to tenant
        if workspace_id != tenant_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Workspace not found",
            )
        
        # Get agents for organization
        response = (
            await supabase.table("agents")
            .select("*", count="exact")
            .eq("organization_id", tenant_id)
            .eq("workspace_id", workspace_id)
            .is_("deleted_at", None)
            .range(offset, offset + limit - 1)
            .order("created_at", desc=True)
            .execute()
        )
        
        agents = response.data or []
        total_count = response.count or 0
        
        return {
            "agents": agents,
            "total": total_count,
            "limit": limit,
            "offset": offset,
            "has_more": offset + limit < total_count,
        }
        
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch workspace agents",
        )


@router.post("/{workspace_id}/agents/{agent_id}")
async def assign_agent_to_workspace(
    workspace_id: str,
    agent_id: str,
    current_user: CurrentUser,
    supabase: SupabaseDep,
    tenant_id: TenantId,
) -> dict:
    """Assign agent to workspace."""
    try:
        # Verify workspace belongs to tenant
        if workspace_id != tenant_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Workspace not found",
            )
        
        # Update agent workspace_id
        response = (
            await supabase.table("agents")
            .update({"workspace_id": workspace_id})
            .eq("id", agent_id)
            .eq("organization_id", tenant_id)
            .execute()
        )
        
        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Agent not found",
            )
        
        return {"message": "Agent assigned to workspace successfully"}
        
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to assign agent to workspace",
        )


@router.delete("/{workspace_id}/agents/{agent_id}")
async def remove_agent_from_workspace(
    workspace_id: str,
    agent_id: str,
    current_user: CurrentUser,
    supabase: SupabaseDep,
    tenant_id: TenantId,
) -> dict:
    """Remove agent from workspace."""
    try:
        # Verify workspace belongs to tenant
        if workspace_id != tenant_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Workspace not found",
            )
        
        # Update agent to remove workspace_id
        response = (
            await supabase.table("agents")
            .update({"workspace_id": None})
            .eq("id", agent_id)
            .eq("organization_id", tenant_id)
            .execute()
        )
        
        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Agent not found",
            )
        
        return {"message": "Agent removed from workspace successfully"}
        
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to remove agent from workspace",
        )
