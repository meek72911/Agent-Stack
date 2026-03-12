"""Whisper Integration."""
from typing import Annotated
from fastapi import APIRouter, Depends
from app.deps import SupabaseDep, TenantId, get_current_user

router = APIRouter(prefix="/integrations/whisper", tags=["Integrations"])

@router.post("/transcribe")
async def transcribe_audio(
    current_user: Annotated[dict, Depends(get_current_user)],
    supabase: SupabaseDep,
    tenant_id: TenantId,
):
    """Transcribe audio (mock)."""
    return {"transcription": "Mock transcription text"}
