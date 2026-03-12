"""CrewAI Integration."""
from typing import Annotated
from fastapi import APIRouter, Depends
from app.deps import SupabaseDep, TenantId, get_current_user

router = APIRouter(prefix="/integrations/crewai", tags=["Integrations"])

@router.post("/import")
async def import_crewai(
    current_user: Annotated[dict, Depends(get_current_user)],
    supabase: SupabaseDep,
    tenant_id: TenantId,
):
    """Import CrewAI workflow (mock)."""
    return {"status": "imported"}
