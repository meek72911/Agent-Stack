"""Community routes -- /api/v1/community/*

Community contributions, bounties, and leaderboard.
Tracks GitHub PRs, template submissions, and bounty completions.
"""

from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel

from app.deps import CurrentUser, SupabaseDep, TenantId

router = APIRouter(prefix="/community")


class SubmitTemplateRequest(BaseModel):
    """Request body to submit workflow as template."""
    workflow_id: str
    name: str
    description: str
    category: str
    tags: list[str] = []


@router.get("/templates")
async def list_community_templates(
    supabase: SupabaseDep,
    category: str | None = Query(None),
    search: str | None = Query(None),
    limit: int = Query(25, ge=1, le=100),
    offset: int = Query(0, ge=0),
) -> dict:
    """List WHERE status='approved' AND is_public=true. Filter by category. Sort by use_count DESC."""
    try:
        query = (
            supabase.table("agent_templates")
            .select("*", count="exact")
            .eq("is_public", True)
            .eq("status", "approved")
        )
        
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
            detail="Failed to list community templates",
        )


@router.post("/templates")
async def submit_community_template(
    request: SubmitTemplateRequest,
    current_user: CurrentUser,
    supabase: SupabaseDep,
    tenant_id: TenantId,
) -> dict:
    """Submit workflow as template. Set status='pending' (needs admin review)."""
    try:
        # Verify workflow belongs to tenant
        workflow_resp = (
            await supabase.table("workflows")
            .select("id, name, description, nodes, edges")
            .eq("id", request.workflow_id)
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
        
        workflow = workflow_resp.data
        
        # Create template from workflow
        template_data = {
            "name": request.name,
            "description": request.description,
            "category": request.category,
            "tags": request.tags,
            "system_prompt": "",  # Would need to extract from workflow nodes
            "model": "gpt-4o-mini",  # Would need to extract from workflow
            "runtime": "python",
            "tools": [],
            "nodes": workflow.get("nodes"),
            "edges": workflow.get("edges"),
            "is_public": False,  # Will be set to true after approval
            "status": "pending",  # Needs admin review
            "use_count": 0,
            "created_by": current_user["id"],
            "organization_id": tenant_id,
        }
        
        response = await supabase.table("agent_templates").insert(template_data).execute()
        
        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to submit template",
            )
        
        template = response.data[0]
        
        return {
            "template_id": template["id"],
            "status": "pending",
            "message": "Template submitted for review",
        }
        
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to submit template",
        )


@router.post("/templates/{template_id}/fork")
async def fork_community_template(
    template_id: str,
    current_user: CurrentUser,
    supabase: SupabaseDep,
    tenant_id: TenantId,
) -> dict:
    """Deploy community template to user's workspace. Same as templates/{id}/deploy logic."""
    try:
        # Get template
        template_resp = (
            await supabase.table("agent_templates")
            .select("*")
            .eq("id", template_id)
            .eq("is_public", True)
            .eq("status", "approved")
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
            "name": template["name"],
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
            "message": "Community template deployed successfully",
        }
        
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to deploy community template",
        )


@router.get("/leaderboard")
async def get_leaderboard(
    supabase: SupabaseDep,
) -> dict:
    """Get community contributor leaderboard."""
    try:
        # Get top contributors by template submissions and use counts
        templates_resp = (
            await supabase.table("agent_templates")
            .select("created_by, use_count")
            .eq("status", "approved")
            .eq("is_public", True)
            .execute()
        )
        
        # Aggregate by creator
        contributor_stats = {}
        
        for template in templates_resp.data or []:
            creator_id = template["created_by"]
            use_count = template["use_count"]
            
            if creator_id not in contributor_stats:
                contributor_stats[creator_id] = {
                    "user_id": creator_id,
                    "templates_submitted": 0,
                    "total_uses": 0,
                }
            
            contributor_stats[creator_id]["templates_submitted"] += 1
            contributor_stats[creator_id]["total_uses"] += use_count
        
        # Get user profiles for top contributors
        top_contributors = sorted(
            contributor_stats.values(),
            key=lambda x: x["total_uses"],
            reverse=True
        )[:20]
        
        # Enrich with user profiles
        leaderboard = []
        for contributor in top_contributors:
            profile_resp = (
                await supabase.table("profiles")
                .select("full_name, email, avatar_url")
                .eq("id", contributor["user_id"])
                .single()
                .execute()
            )
            
            if profile_resp.data:
                leaderboard.append({
                    **contributor,
                    **profile_resp.data,
                    "score": contributor["total_uses"] * 10 + contributor["templates_submitted"] * 100,
                })
        
        # Sort by score
        leaderboard.sort(key=lambda x: x["score"], reverse=True)
        
        return {
            "leaderboard": leaderboard,
            "total_contributors": len(contributor_stats),
        }
        
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch leaderboard",
        )
