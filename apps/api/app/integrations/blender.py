"""Blender Integration."""
from typing import Annotated
from fastapi import APIRouter, Depends
from app.deps import SupabaseDep, TenantId, get_current_user

router = APIRouter(prefix="/integrations/blender", tags=["Integrations"])

@router.post("/render")
async def trigger_blender_render(
    current_user: Annotated[dict, Depends(get_current_user)],
    supabase: SupabaseDep,
    tenant_id: TenantId,
):
    """Trigger Blender render (mock)."""
    return {"status": "render_queued"}
