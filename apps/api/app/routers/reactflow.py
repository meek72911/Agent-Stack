"""ReactFlow Backend Router."""
from typing import Annotated
from fastapi import APIRouter, Depends
from app.deps import SupabaseDep, TenantId, get_current_user

router = APIRouter(prefix="/reactflow", tags=["ReactFlow"])

@router.post("/save")
async def save_flow(
    flow_data: dict,
    current_user: Annotated[dict, Depends(get_current_user)],
    supabase: SupabaseDep,
    tenant_id: TenantId,
):
    """Save visual flow definition."""
    return {"status": "saved", "flow_id": "mock-id"}
