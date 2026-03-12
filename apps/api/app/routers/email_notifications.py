"""Email Notifications Router."""
from datetime import datetime
from typing import Optional, Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from app.deps import SupabaseDep, TenantId, get_current_user

router = APIRouter(prefix="/notifications/email", tags=["Notifications"])

class EmailSettings(BaseModel):
    execution_complete: bool = True
    daily_summary: bool = False
    weekly_report: bool = False

@router.get("/settings")
async def get_email_settings(
    current_user: Annotated[dict, Depends(get_current_user)],
    supabase: SupabaseDep,
    tenant_id: TenantId,
):
    """Get email notification settings."""
    result = await supabase.table("notification_settings").select("*").eq("user_id", current_user["id"]).single().execute()

    if result.data:
        return result.data
    return EmailSettings()

@router.put("/settings")
async def update_email_settings(
    settings: EmailSettings,
    current_user: Annotated[dict, Depends(get_current_user)],
    supabase: SupabaseDep,
    tenant_id: TenantId,
):
    """Update email notification settings."""
    await supabase.table("notification_settings").upsert({
        "user_id": current_user["id"],
        "organization_id": tenant_id,
        "execution_complete": settings.execution_complete,
        "daily_summary": settings.daily_summary,
        "weekly_report": settings.weekly_report,
    }).execute()
    return {"status": "updated"}
