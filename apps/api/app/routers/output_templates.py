"""Output Templates Router for structured workflow outputs."""

from datetime import datetime
from typing import List, Optional, Dict, Any, Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field

from app.deps import SupabaseDep, TenantId, get_current_user

router = APIRouter(prefix="/output-templates", tags=["Output Templates"])

class TemplateField(BaseModel):
    name: str
    type: str  # text, number, boolean, list, json
    required: bool = False
    description: Optional[str] = None
    default: Optional[Any] = None

class OutputTemplateCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    workflow_id: str
    fields: List[TemplateField]

class OutputTemplateResponse(BaseModel):
    id: str
    name: str
    workflow_id: str
    fields: List[TemplateField]
    created_at: datetime

class OutputTemplateListResponse(BaseModel):
    templates: List[OutputTemplateResponse]
    count: int

@router.post("", response_model=OutputTemplateResponse, status_code=status.HTTP_201_CREATED)
async def create_template(
    template_data: OutputTemplateCreate,
    current_user: Annotated[dict, Depends(get_current_user)],
    supabase: SupabaseDep,
    tenant_id: TenantId,
):
    """Create a new output template for a workflow."""
    result = await supabase.table("output_templates").insert({
        "user_id": current_user["id"],
        "organization_id": tenant_id,
        "name": template_data.name,
        "workflow_id": template_data.workflow_id,
        "fields": [f.model_dump() for f in template_data.fields],
    }).execute()

    return OutputTemplateResponse(
        id=result.data[0]["id"],
        name=template_data.name,
        workflow_id=template_data.workflow_id,
        fields=template_data.fields,
        created_at=datetime.fromisoformat(result.data[0]["created_at"]),
    )

@router.get("", response_model=OutputTemplateListResponse)
async def list_templates(
    current_user: Annotated[dict, Depends(get_current_user)],
    supabase: SupabaseDep,
    tenant_id: TenantId,
    workflow_id: Optional[str] = None,
):
    """List output templates, optionally filtered by workflow."""
    query = supabase.table("output_templates").select("*").eq("organization_id", tenant_id)

    if workflow_id:
        query = query.eq("workflow_id", workflow_id)

    result = await query.execute()

    templates = [
        OutputTemplateResponse(
            id=t["id"],
            name=t["name"],
            workflow_id=t["workflow_id"],
            fields=[TemplateField(**f) for f in t["fields"]],
            created_at=datetime.fromisoformat(t["created_at"]),
        )
        for t in result.data
    ]

    return OutputTemplateListResponse(templates=templates, count=len(templates))

@router.get("/{template_id}", response_model=OutputTemplateResponse)
async def get_template(
    template_id: str,
    current_user: Annotated[dict, Depends(get_current_user)],
    supabase: SupabaseDep,
    tenant_id: TenantId,
):
    """Get a specific output template."""
    result = await supabase.table("output_templates").select("*").eq("id", template_id).eq("organization_id", tenant_id).single().execute()

    if not result.data:
        raise HTTPException(status_code=404, detail="Template not found")

    t = result.data
    return OutputTemplateResponse(
        id=t["id"],
        name=t["name"],
        workflow_id=t["workflow_id"],
        fields=[TemplateField(**f) for f in t["fields"]],
        created_at=datetime.fromisoformat(t["created_at"]),
    )

@router.delete("/{template_id}")
async def delete_template(
    template_id: str,
    current_user: Annotated[dict, Depends(get_current_user)],
    supabase: SupabaseDep,
    tenant_id: TenantId,
):
    """Delete an output template."""
    await supabase.table("output_templates").delete().eq("id", template_id).eq("organization_id", tenant_id).execute()
    return {"status": "deleted"}
