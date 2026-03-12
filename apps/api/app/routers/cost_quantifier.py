"""Cost Quantifier Router."""
from typing import Annotated
from fastapi import APIRouter, Depends
from app.deps import SupabaseDep, TenantId, get_current_user

router = APIRouter(prefix="/agents/cost-quantifier", tags=["Agents"])

@router.get("/quantify")
async def quantify_costs(
    current_user: Annotated[dict, Depends(get_current_user)],
    supabase: SupabaseDep,
    tenant_id: TenantId,
):
    """Quantify costs (mock)."""
    return {"total_cost": 0.0, "breakdown": {}}
