"""Power BI Integration."""
from typing import Annotated
from fastapi import APIRouter, Depends
from app.deps import SupabaseDep, TenantId, get_current_user

router = APIRouter(prefix="/integrations/powerbi", tags=["Integrations"])

@router.post("/refresh")
async def refresh_powerbi_dataset(
    current_user: Annotated[dict, Depends(get_current_user)],
    supabase: SupabaseDep,
    tenant_id: TenantId,
):
    """Refresh Power BI dataset (mock)."""
    return {"status": "refreshed"}
