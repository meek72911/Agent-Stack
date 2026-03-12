"""Trend Signal Monitor Router."""
from typing import Annotated
from fastapi import APIRouter, Depends
from app.deps import SupabaseDep, TenantId, get_current_user

router = APIRouter(prefix="/agents/trend-signal", tags=["Agents"])

@router.get("/monitor")
async def monitor_trend_signals(
    current_user: Annotated[dict, Depends(get_current_user)],
    supabase: SupabaseDep,
    tenant_id: TenantId,
):
    """Monitor trend signals (mock)."""
    return {"trends": []}
