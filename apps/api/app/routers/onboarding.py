"""Onboarding routes -- /api/v1/onboarding/*

Guides new users through welcome, agent creation, first workflow,
tool connection, and team invitation steps.
"""

from typing import Any, Dict

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from app.deps import CurrentUser, SupabaseDep

router = APIRouter(prefix="/onboarding")


class OrganizationUpdate(BaseModel):
    """Request body for organization update during onboarding."""
    name: str
    slug: str


class PreferencesUpdate(BaseModel):
    """Request body for user preferences during onboarding."""
    use_case: str | None = None
    team_size: str | None = None


@router.get("/status")
async def get_status(
    current_user: CurrentUser,
    supabase: SupabaseDep,
) -> dict:
    """Return profile.onboarding_completed."""
    try:
        profile_resp = (
            await supabase.table("profiles")
            .select("onboarding_completed, preferences")
            .eq("id", current_user["id"])
            .single()
            .execute()
        )
        
        profile = profile_resp.data or {}
        
        return {
            "onboarding_completed": profile.get("onboarding_completed", False),
            "preferences": profile.get("preferences", {}),
        }
        
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch onboarding status",
        )


@router.post("/organization")
async def update_organization(
    request: OrganizationUpdate,
    current_user: CurrentUser,
    supabase: SupabaseDep,
) -> dict:
    """Update org name + slug, validate slug is unique."""
    try:
        # Check if slug is unique
        slug_check = (
            await supabase.table("organizations")
            .select("id")
            .eq("slug", request.slug)
            .neq("id", current_user["organization_id"])
            .execute()
        )
        
        if slug_check.data:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Organization slug '{request.slug}' is already taken",
            )
        
        # Update organization
        await supabase.table("organizations").update({
            "name": request.name,
            "slug": request.slug,
        }).eq("id", current_user["organization_id"]).execute()
        
        return {"message": "Organization updated successfully"}
        
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update organization",
        )


@router.post("/preferences")
async def update_preferences(
    request: PreferencesUpdate,
    current_user: CurrentUser,
    supabase: SupabaseDep,
) -> dict:
    """Save use_case, team_size to profile.preferences JSONB."""
    try:
        # Get current preferences
        profile_resp = (
            await supabase.table("profiles")
            .select("preferences")
            .eq("id", current_user["id"])
            .single()
            .execute()
        )
        
        current_prefs = profile_resp.data.get("preferences", {}) if profile_resp.data else {}
        
        # Update preferences
        updated_prefs = {
            **current_prefs,
            "use_case": request.use_case,
            "team_size": request.team_size,
        }
        
        await supabase.table("profiles").update({
            "preferences": updated_prefs
        }).eq("id", current_user["id"]).execute()
        
        return {"message": "Preferences updated successfully"}
        
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update preferences",
        )


@router.post("/complete")
async def complete_onboarding(
    current_user: CurrentUser,
    supabase: SupabaseDep,
) -> dict:
    """Set profile.onboarding_completed = true."""
    try:
        await supabase.table("profiles").update({
            "onboarding_completed": True
        }).eq("id", current_user["id"]).execute()
        
        return {"message": "Onboarding completed successfully"}
        
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to complete onboarding",
        )
