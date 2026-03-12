"""DOCX Export Router."""
from datetime import datetime
from typing import Optional, Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import io

from app.deps import SupabaseDep, TenantId, get_current_user

router = APIRouter(prefix="/export/docx", tags=["Export"])

class ExportRequest(BaseModel):
    execution_id: str

@router.post("")
async def export_to_docx(
    export_data: ExportRequest,
    current_user: Annotated[dict, Depends(get_current_user)],
    supabase: SupabaseDep,
    tenant_id: TenantId,
):
    """Export execution output to DOCX."""
    # Mock implementation
    docx_content = b"Mock DOCX content"

    result = await supabase.table("exports").insert({
        "execution_id": export_data.execution_id,
        "organization_id": tenant_id,
        "format": "docx",
        "status": "completed",
    }).execute()

    return {"export_id": result.data[0]["id"], "status": "completed", "download_url": f"/api/v1/export/docx/download/{result.data[0]['id']}"}

@router.get("/download/{export_id}")
async def download_docx(
    export_id: str,
    current_user: Annotated[dict, Depends(get_current_user)],
    supabase: SupabaseDep,
    tenant_id: TenantId,
):
    """Download DOCX."""
    return StreamingResponse(io.BytesIO(b"Mock DOCX content"), media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document")
