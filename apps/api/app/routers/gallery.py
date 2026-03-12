"""Public Gallery Router."""
from typing import Annotated
from fastapi import APIRouter, Depends
from app.deps import SupabaseDep, TenantId, get_current_user

router = APIRouter(prefix="/gallery", tags=["Gallery"])

@router.get("")
async def list_public_galleries(
    current_user: Annotated[dict, Depends(get_current_user)],
    supabase: SupabaseDep,
    tenant_id: TenantId,
):
    """List public workflow galleries."""
    return {"galleries": []}
