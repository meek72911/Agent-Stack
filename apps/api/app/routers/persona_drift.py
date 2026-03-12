"""Persona Drift Detector Router."""
from typing import Annotated
from fastapi import APIRouter, Depends
from app.deps import SupabaseDep, TenantId, get_current_user

router = APIRouter(prefix="/agents/persona-drift", tags=["Agents"])

@router.get("/detect")
async def detect_persona_drift(
    current_user: Annotated[dict, Depends(get_current_user)],
    supabase: SupabaseDep,
    tenant_id: TenantId,
):
    """Detect persona drift (mock)."""
    return {"drift_detected": False, "score": 0.0}
