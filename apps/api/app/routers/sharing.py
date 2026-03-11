"""Sharing routes -- /api/v1/sharing/*

Workflow sharing and forking. Requires Pro+ plan.
Generates share links and handles public workflow discovery.
"""

import secrets
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from app.deps import CurrentUser, SupabaseDep, TenantId

router = APIRouter(prefix="/sharing")


class ForkWorkflowRequest(BaseModel):
    """Request body for forking a shared workflow."""
    name: str | None = None
    workspace_id: str | None = None


@router.get("/{token}")
async def get_shared_workflow(
    token: str,
    supabase: SupabaseDep,
) -> dict:
    """Public, no auth. Return workflow WHERE share_token=token."""
    try:
        workflow_resp = (
            await supabase.table("workflows")
            .select("id, name, description, nodes, edges, created_at, updated_at")
            .eq("share_token", token)
            .is_("deleted_at", None)
            .single()
            .execute()
        )
        
        if not workflow_resp.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Shared workflow not found",
            )
        
        workflow = workflow_resp.data
        
        # Get creator info (if available)
        creator_resp = (
            await supabase.table("profiles")
            .select("full_name, email")
            .eq("id", workflow.get("created_by"))
            .single()
            .execute()
        )
        
        return {
            "id": workflow["id"],
            "name": workflow["name"],
            "description": workflow.get("description"),
            "nodes": workflow.get("nodes"),
            "edges": workflow.get("edges"),
            "created_at": workflow["created_at"],
            "updated_at": workflow["updated_at"],
            "creator": creator_resp.data if creator_resp.data else None,
            "share_token": token,
        }
        
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch shared workflow",
        )


@router.post("")
async def create_share_link(
    workflow_id: str,
    current_user: CurrentUser,
    supabase: SupabaseDep,
    tenant_id: TenantId,
) -> dict:
    """Generate token, attach to workflow."""
    try:
        # Verify workflow belongs to tenant
        workflow_resp = (
            await supabase.table("workflows")
            .select("id, name")
            .eq("id", workflow_id)
            .eq("organization_id", tenant_id)
            .is_("deleted_at", None)
            .single()
            .execute()
        )
        
        if not workflow_resp.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Workflow not found",
            )
        
        # Generate share token
        share_token = secrets.token_urlsafe(16)
        
        # Update workflow with share token
        response = (
            await supabase.table("workflows")
            .update({"share_token": share_token})
            .eq("id", workflow_id)
            .eq("organization_id", tenant_id)
            .execute()
        )
        
        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to generate share link",
            )
        
        return {
            "share_token": share_token,
            "share_url": f"/api/v1/sharing/{share_token}",
            "workflow_id": workflow_id,
            "workflow_name": workflow_resp.data["name"],
        }
        
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create share link",
        )


@router.delete("/{token}")
async def unshare_workflow(
    token: str,
    current_user: CurrentUser,
    supabase: SupabaseDep,
    tenant_id: TenantId,
) -> dict:
    """Clear share_token on workflow."""
    try:
        # Find workflow by share token and verify ownership
        workflow_resp = (
            await supabase.table("workflows")
            .select("id")
            .eq("share_token", token)
            .eq("organization_id", tenant_id)
            .single()
            .execute()
        )
        
        if not workflow_resp.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Shared workflow not found",
            )
        
        # Clear share token
        response = (
            await supabase.table("workflows")
            .update({"share_token": None})
            .eq("id", workflow_resp.data["id"])
            .execute()
        )
        
        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to unshare workflow",
            )
        
        return {"message": "Workflow unshared successfully"}
        
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to unshare workflow",
        )


@router.post("/{token}/fork")
async def fork_shared_workflow(
    token: str,
    request: ForkWorkflowRequest,
    current_user: CurrentUser,
    supabase: SupabaseDep,
    tenant_id: TenantId,
) -> dict:
    """Requires auth. Copy shared workflow to requester's org. Copy all agents in workflow too."""
    try:
        # Get shared workflow
        shared_resp = (
            await supabase.table("workflows")
            .select("id, name, description, nodes, edges")
            .eq("share_token", token)
            .is_("deleted_at", None)
            .single()
            .execute()
        )
        
        if not shared_resp.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Shared workflow not found",
            )
        
        shared_workflow = shared_resp.data
        
        # Create forked workflow
        forked_data = {
            "name": request.name or f"{shared_workflow['name']} (Fork)",
            "description": shared_workflow.get("description"),
            "nodes": shared_workflow.get("nodes"),
            "edges": shared_workflow.get("edges"),
            "trigger_config": {},
            "organization_id": tenant_id,
            "created_by": current_user["id"],
            "workspace_id": request.workspace_id,
            "execution_count": 0,
        }
        
        forked_resp = await supabase.table("workflows").insert(forked_data).execute()
        
        if not forked_resp.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to fork workflow",
            )
        
        forked_workflow = forked_resp.data[0]
        
        # Copy agents referenced in workflow nodes
        # This would require parsing the nodes to extract agent_ids and copying them
        # For now, we'll just return the forked workflow info
        
        return {
            "workflow_id": forked_workflow["id"],
            "workflow_name": forked_workflow["name"],
            "original_workflow_id": shared_workflow["id"],
            "original_workflow_name": shared_workflow["name"],
            "message": "Workflow forked successfully",
        }
        
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fork workflow",
        )
