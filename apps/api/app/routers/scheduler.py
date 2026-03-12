"""Workflow Scheduler Router for cron jobs."""

from datetime import datetime
from typing import List, Optional, Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field

from app.deps import SupabaseDep, TenantId, get_current_user

router = APIRouter(prefix="/scheduler", tags=["Scheduler"])

class ScheduleCreate(BaseModel):
    workflow_id: str
    cron_expression: str = Field(..., description="Cron expression (e.g., '0 9 * * 1-5' for 9 AM weekdays)")
    timezone: str = "UTC"
    enabled: bool = True

class ScheduleResponse(BaseModel):
    id: str
    workflow_id: str
    cron_expression: str
    timezone: str
    enabled: bool
    next_run: Optional[datetime] = None
    created_at: datetime

class ScheduleListResponse(BaseModel):
    schedules: List[ScheduleResponse]
    count: int

@router.post("", response_model=ScheduleResponse, status_code=status.HTTP_201_CREATED)
async def create_schedule(
    schedule_data: ScheduleCreate,
    current_user: Annotated[dict, Depends(get_current_user)],
    supabase: SupabaseDep,
    tenant_id: TenantId,
):
    """Create a new scheduled workflow execution."""
    result = await supabase.table("schedules").insert({
        "user_id": current_user["id"],
        "organization_id": tenant_id,
        "workflow_id": schedule_data.workflow_id,
        "cron_expression": schedule_data.cron_expression,
        "timezone": schedule_data.timezone,
        "enabled": schedule_data.enabled,
    }).execute()

    # Calculate next run (mock)
    next_run = datetime.utcnow()  # In production, use cron library to calculate

    return ScheduleResponse(
        id=result.data[0]["id"],
        workflow_id=schedule_data.workflow_id,
        cron_expression=schedule_data.cron_expression,
        timezone=schedule_data.timezone,
        enabled=schedule_data.enabled,
        next_run=next_run,
        created_at=datetime.fromisoformat(result.data[0]["created_at"]),
    )

@router.get("", response_model=ScheduleListResponse)
async def list_schedules(
    current_user: Annotated[dict, Depends(get_current_user)],
    supabase: SupabaseDep,
    tenant_id: TenantId,
    workflow_id: Optional[str] = None,
):
    """List all schedules for the organization."""
    query = supabase.table("schedules").select("*").eq("organization_id", tenant_id)

    if workflow_id:
        query = query.eq("workflow_id", workflow_id)

    result = await query.execute()

    schedules = [
        ScheduleResponse(
            id=s["id"],
            workflow_id=s["workflow_id"],
            cron_expression=s["cron_expression"],
            timezone=s["timezone"],
            enabled=s["enabled"],
            next_run=datetime.fromisoformat(s["next_run"]) if s.get("next_run") else None,
            created_at=datetime.fromisoformat(s["created_at"]),
        )
        for s in result.data
    ]

    return ScheduleListResponse(schedules=schedules, count=len(schedules))

@router.put("/{schedule_id}/enable")
async def enable_schedule(
    schedule_id: str,
    enabled: bool,
    current_user: Annotated[dict, Depends(get_current_user)],
    supabase: SupabaseDep,
    tenant_id: TenantId,
):
    """Enable or disable a schedule."""
    await supabase.table("schedules").update({"enabled": enabled}).eq("id", schedule_id).eq("organization_id", tenant_id).execute()
    return {"status": "updated", "enabled": enabled}

@router.delete("/{schedule_id}")
async def delete_schedule(
    schedule_id: str,
    current_user: Annotated[dict, Depends(get_current_user)],
    supabase: SupabaseDep,
    tenant_id: TenantId,
):
    """Delete a schedule."""
    await supabase.table("schedules").delete().eq("id", schedule_id).eq("organization_id", tenant_id).execute()
    return {"status": "deleted"}
