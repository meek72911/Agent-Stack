"""PRD Bridge Router."""
from typing import Annotated
from fastapi import APIRouter, Depends
from app.deps import SupabaseDep, TenantId, get_current_user

router = APIRouter(prefix="/agents/prd-bridge", tags=["Agents"])

@router.post("/generate")
async def generate_prd(
    current_user: Annotated[dict, Depends(get_current_user)],
    supabase: SupabaseDep,
    tenant_id: TenantId,
):
    """Generate PRD from research (mock)."""
    return {"prd": "Mock PRD content"}
