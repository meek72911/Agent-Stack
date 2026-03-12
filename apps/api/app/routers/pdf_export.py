"""PDF Export Router."""

from datetime import datetime
from typing import Optional, Annotated
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import io

from app.deps import SupabaseDep, TenantId, get_current_user

router = APIRouter(prefix="/export/pdf", tags=["Export"])

class ExportRequest(BaseModel):
    execution_id: str
    format: str = "pdf"

class ExportResponse(BaseModel):
    export_id: str
    status: str
    download_url: Optional[str] = None

def generate_pdf(content: str) -> bytes:
    """Generate PDF from content (mock implementation)."""
    # In production, use reportlab or weasyprint
    pdf_content = f"%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n/Contents 4 0 R\n>>\nendobj\n4 0 obj\n<<\n/Length 44\n>>\nstream\nBT\n/F1 12 Tf\n100 700 Td\n({content}) Tj\nET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000226 00000 n \ntrailer\n<<\n/Size 5\n/Root 1 0 R\n>>\nstartxref\n310\n%%EOF".encode()
    return pdf_content

@router.post("", response_model=ExportResponse)
async def export_to_pdf(
    export_data: ExportRequest,
    background_tasks: BackgroundTasks,
    current_user: Annotated[dict, Depends(get_current_user)],
    supabase: SupabaseDep,
    tenant_id: TenantId,
):
    """Export execution output to PDF."""
    # Get execution
    exec_result = await supabase.table("workflow_executions").select("*").eq("id", export_data.execution_id).single().execute()

    if not exec_result.data:
        raise HTTPException(status_code=404, detail="Execution not found")

    execution = exec_result.data

    # Generate PDF in background
    pdf_bytes = generate_pdf(execution.get("output", "No output"))

    # Store export record
    result = await supabase.table("exports").insert({
        "execution_id": export_data.execution_id,
        "organization_id": tenant_id,
        "format": "pdf",
        "status": "completed",
    }).execute()

    return ExportResponse(
        export_id=result.data[0]["id"],
        status="completed",
        download_url=f"/api/v1/export/pdf/download/{result.data[0]['id']}",
    )

@router.get("/download/{export_id}")
async def download_pdf(
    export_id: str,
    current_user: Annotated[dict, Depends(get_current_user)],
    supabase: SupabaseDep,
    tenant_id: TenantId,
):
    """Download exported PDF."""
    result = await supabase.table("exports").select("*").eq("id", export_id).eq("organization_id", tenant_id).single().execute()

    if not result.data:
        raise HTTPException(status_code=404, detail="Export not found")

    # Generate PDF on the fly (in production, fetch from storage)
    execution_id = result.data["execution_id"]
    exec_result = await supabase.table("workflow_executions").select("*").eq("id", execution_id).single().execute()

    content = exec_result.data.get("output", "No content") if exec_result.data else "No content"
    pdf_bytes = generate_pdf(content)

    return StreamingResponse(
        io.BytesIO(pdf_bytes),
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=export_{export_id}.pdf"}
    )
