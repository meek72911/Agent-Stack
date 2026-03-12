"""A2A Protocol Router."""
from typing import Annotated
from fastapi import APIRouter, Depends
from app.deps import SupabaseDep, TenantId, get_current_user

router = APIRouter(prefix="/protocols/a2a", tags=["Protocols"])

@router.post("/connect")
async def connect_a2a(
    current_user: Annotated[dict, Depends(get_current_user)],
    supabase: SupabaseDep,
    tenant_id: TenantId,
):
    """Connect via A2A protocol (mock)."""
    return {"status": "connected"}
