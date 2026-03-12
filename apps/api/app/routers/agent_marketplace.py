"""Agent Marketplace Router."""
from typing import Annotated
from fastapi import APIRouter, Depends
from app.deps import SupabaseDep, TenantId, get_current_user

router = APIRouter(prefix="/marketplace/agents", tags=["Marketplace"])

@router.get("")
async def list_agents(
    current_user: Annotated[dict, Depends(get_current_user)],
    supabase: SupabaseDep,
    tenant_id: TenantId,
):
    """List agents in marketplace (mock)."""
    return {"agents": []}
