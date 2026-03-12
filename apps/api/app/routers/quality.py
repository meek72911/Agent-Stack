"""Quality Output System Router."""

from datetime import datetime
from typing import List, Optional, Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field

from app.deps import SupabaseDep, TenantId, get_current_user

router = APIRouter(prefix="/quality", tags=["Quality"])

class ValidationResult(BaseModel):
    field: str
    status: str  # valid, invalid, warning
    message: Optional[str] = None

class QualityCheck(BaseModel):
    execution_id: str
    validations: List[ValidationResult]
    confidence_score: float = Field(0.0, ge=0.0, le=1.0)
    status: str  # passed, failed, needs_review

class QualityCheckResponse(BaseModel):
    id: str
    execution_id: str
    confidence_score: float
    status: str
    created_at: datetime

@router.post("/validate", response_model=QualityCheckResponse)
async def validate_execution(
    execution_id: str,
    current_user: Annotated[dict, Depends(get_current_user)],
    supabase: SupabaseDep,
    tenant_id: TenantId,
):
    """Validate execution output against template standards."""
    # Get execution details
    exec_result = await supabase.table("workflow_executions").select("*").eq("id", execution_id).single().execute()

    if not exec_result.data:
        raise HTTPException(status_code=404, detail="Execution not found")

    execution = exec_result.data

    # Get workflow template for validation rules
    workflow_result = await supabase.table("workflows").select("*").eq("id", execution["workflow_id"]).single().execute()
    workflow = workflow_result.data

    # Mock validation logic (replace with actual validation)
    validations = [
        ValidationResult(field="output", status="valid", message="Output structure is correct"),
        ValidationResult(field="content", status="valid", message="Content meets standards"),
    ]

    confidence_score = 0.95  # Mock score

    # Store quality check
    result = await supabase.table("quality_checks").insert({
        "execution_id": execution_id,
        "organization_id": tenant_id,
        "validations": [v.model_dump() for v in validations],
        "confidence_score": confidence_score,
        "status": "passed" if confidence_score > 0.8 else "needs_review",
    }).execute()

    return QualityCheckResponse(
        id=result.data[0]["id"],
        execution_id=execution_id,
        confidence_score=confidence_score,
        status="passed" if confidence_score > 0.8 else "needs_review",
        created_at=datetime.fromisoformat(result.data[0]["created_at"]),
    )

@router.get("/checks/{execution_id}", response_model=QualityCheckResponse)
async def get_quality_checks(
    execution_id: str,
    current_user: Annotated[dict, Depends(get_current_user)],
    supabase: SupabaseDep,
    tenant_id: TenantId,
):
    """Get quality checks for an execution."""
    result = await supabase.table("quality_checks").select("*").eq("execution_id", execution_id).order("created_at", desc=True).limit(1).execute()

    if not result.data:
        raise HTTPException(status_code=404, detail="No quality checks found")

    check = result.data[0]
    return QualityCheckResponse(
        id=check["id"],
        execution_id=check["execution_id"],
        confidence_score=check["confidence_score"],
        status=check["status"],
        created_at=datetime.fromisoformat(check["created_at"]),
    )

@router.post("/review/{check_id}")
async def review_quality_check(
    check_id: str,
    status: str,
    current_user: Annotated[dict, Depends(get_current_user)],
    supabase: SupabaseDep,
    tenant_id: TenantId,
):
    """Review and update quality check status."""
    await supabase.table("quality_checks").update({"status": status}).eq("id", check_id).eq("organization_id", tenant_id).execute()
    return {"status": "updated"}
