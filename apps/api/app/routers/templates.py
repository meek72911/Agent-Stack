"""Template routes -- /api/v1/templates/*

Browse template packs, individual agent templates, and deploy packs
to a tenant workspace. Handles both free and paid packs.
"""

from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel

from app.deps import CurrentUser, SupabaseDep, TenantId

router = APIRouter(prefix="/templates")


class DeployTemplateRequest(BaseModel):
    """Request body to deploy a template."""
    workspace_id: str | None = None
    name_override: str | None = None


@router.get("")
async def list_templates(
    supabase: SupabaseDep,
    category: str | None = Query(None),
    search: str | None = Query(None),
    limit: int = Query(25, ge=1, le=100),
    offset: int = Query(0, ge=0),
) -> dict:
    """List agent_templates WHERE is_public=true."""
    try:
        query = supabase.table("agent_templates").select("*", count="exact").eq("is_public", True)
        
        if category:
            query = query.eq("category", category)
        if search:
            query = query.ilike("name", f"%{search}%")
        
        query = query.range(offset, offset + limit - 1).order("use_count", desc=True)
        
        response = await query.execute()
        
        templates = response.data or []
        total_count = response.count or 0
        
        return {
            "templates": templates,
            "total": total_count,
            "limit": limit,
            "offset": offset,
            "has_more": offset + limit < total_count,
        }
        
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to list templates",
        )


@router.get("/{template_id}")
async def get_template(
    template_id: str,
    supabase: SupabaseDep,
) -> dict:
    """Full template detail."""
    try:
        response = (
            await supabase.table("agent_templates")
            .select("*")
            .eq("id", template_id)
            .eq("is_public", True)
            .single()
            .execute()
        )
        
        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Template not found",
            )
        
        return response.data
        
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch template",
        )


@router.post("/{template_id}/deploy")
async def deploy_template(
    template_id: str,
    request: DeployTemplateRequest,
    current_user: CurrentUser,
    supabase: SupabaseDep,
    tenant_id: TenantId,
) -> dict:
    """Create agents from template config, create workflow linking those agents."""
    try:
        # Get template
        template_resp = (
            await supabase.table("agent_templates")
            .select("*")
            .eq("id", template_id)
            .eq("is_public", True)
            .single()
            .execute()
        )
        
        if not template_resp.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Template not found",
            )
        
        template = template_resp.data
        
        # Create agent from template
        agent_data = {
            "name": request.name_override or template["name"],
            "description": template["description"],
            "system_prompt": template["system_prompt"],
            "model": template["model"],
            "status": "inactive",
            "runtime": template["runtime"],
            "tools": template["tools"],
            "environment_variables": {},
            "config": {
                "temperature": 0.7,
                "max_tokens": 4096,
            },
            "organization_id": tenant_id,
            "created_by": current_user["id"],
            "template_id": template["id"],
            "workspace_id": request.workspace_id,
        }
        
        agent_resp = await supabase.table("agents").insert(agent_data).execute()
        
        if not agent_resp.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create agent from template",
            )
        
        agent = agent_resp.data[0]
        
        # Create workflow if template has nodes/edges
        workflow_id = None
        if template.get("nodes") and template.get("edges"):
            workflow_data = {
                "name": f"{template['name']} Workflow",
                "description": f"Workflow created from {template['name']} template",
                "nodes": template["nodes"],
                "edges": template["edges"],
                "trigger_config": {},
                "organization_id": tenant_id,
                "created_by": current_user["id"],
                "workspace_id": request.workspace_id,
                "execution_count": 0,
            }
            
            workflow_resp = await supabase.table("workflows").insert(workflow_data).execute()
            
            if workflow_resp.data:
                workflow_id = workflow_resp.data[0]["id"]
        
        # Increment template use count
        await supabase.table("agent_templates").update({
            "use_count": template["use_count"] + 1
        }).eq("id", template_id).execute()
        
        return {
            "agent_id": agent["id"],
            "workflow_id": workflow_id,
            "template_id": template_id,
            "message": "Template deployed successfully",
        }
        
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to deploy template",
        )


@router.get("/categories")
async def get_categories(
    supabase: SupabaseDep,
) -> dict:
    """SELECT DISTINCT category, COUNT(*) from agent_templates."""
    try:
        response = (
            await supabase.table("agent_templates")
            .select("category", count="exact")
            .eq("is_public", True)
            .group("category")
            .order("count", desc=True)
            .execute()
        )
        
        categories = []
        for item in response.data or []:
            categories.append({
                "category": item["category"],
                "count": item["count"],
            })
        
        return {"categories": categories}
        
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch categories",
        )
