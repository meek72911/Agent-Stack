"""Per-Run Pricing Router."""
from typing import Annotated
from fastapi import APIRouter, Depends
from app.deps import SupabaseDep, TenantId, get_current_user

router = APIRouter(prefix="/pricing/per-run", tags=["Pricing"])

@router.get("/cost")
async def calculate_run_cost(
    current_user: Annotated[dict, Depends(get_current_user)],
    supabase: SupabaseDep,
    tenant_id: TenantId,
):
    """Calculate cost for a run."""
    return {"cost": 0.10, "currency": "USD"}
