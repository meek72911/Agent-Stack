"""RAG Layer Router."""
from typing import Annotated
from fastapi import APIRouter, Depends
from app.deps import SupabaseDep, TenantId, get_current_user

router = APIRouter(prefix="/rag", tags=["RAG"])

@router.get("/search")
async def search_rag(
    query: str,
    current_user: Annotated[dict, Depends(get_current_user)],
    supabase: SupabaseDep,
    tenant_id: TenantId,
):
    """Search RAG layer (mock)."""
    return {"results": [], "query": query}
