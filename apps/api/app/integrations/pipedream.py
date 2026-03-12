"""Pipedream Integration."""
from typing import Annotated
from fastapi import APIRouter, Depends
from app.deps import SupabaseDep, TenantId, get_current_user

router = APIRouter(prefix="/integrations/pipedream", tags=["Integrations"])

@router.get("/apps")
async def list_pipedream_apps(
    current_user: Annotated[dict, Depends(get_current_user)],
    supabase: SupabaseDep,
    tenant_id: TenantId,
):
    """List available Pipedream apps (mock)."""
    return {"apps": [{"name": "Gmail"}, {"name": "Slack"}, {"name": "Notion"}]}
