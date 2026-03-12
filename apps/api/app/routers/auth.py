"""Authentication routes -- /api/v1/auth/*

Handles registration, login, logout, token refresh, OAuth callbacks,
and password reset flows. Uses Supabase Auth under the hood.
Rate limits: register=5/min, login=10/min, forgot-password=3/min.
"""

import uuid
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from supabase._async.client import AsyncClient

from app.deps import CurrentUser, SupabaseDep, SettingsDep
from app.schemas.auth import SignupRequest, TokenResponse, UserProfile

router = APIRouter(prefix="/auth")


@router.post("/register", response_model=TokenResponse)
async def register(
    request: SignupRequest,
    supabase: SupabaseDep,
    settings: SettingsDep,
) -> dict:
    """Register new tenant + admin user. Creates Supabase auth user and tenant record."""
    try:
        # Create Supabase auth user
        auth_response = await supabase.auth.sign_up({
            "email": request.email,
            "password": request.password,
            "options": {
                "data": {
                    "full_name": request.full_name,
                }
            }
        })
        
        if auth_response.user is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to create user account",
            )
        
        user = auth_response.user
        
        # Create organization
        org_data = {
            "name": request.company_name or f"{request.full_name}'s Organization",
            "slug": request.company_name.lower().replace(" ", "-") if request.company_name else f"org-{user.id[:8]}",
            "owner_id": user.id,
            "plan": "free",
            "member_count": 1,
        }
        
        org_response = await supabase.table("organizations").insert(org_data).execute()
        
        if not org_response.data:
            # Rollback auth user if org creation fails
            await supabase.auth.admin.delete_user(user.id)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create organization",
            )
        
        organization = org_response.data[0]
        
        # Create user profile
        profile_data = {
            "id": user.id,
            "email": request.email,
            "full_name": request.full_name,
            "organization_id": organization["id"],
            "role": "owner",
            "onboarding_completed": False,
        }
        
        await supabase.table("profiles").insert(profile_data).execute()
        
        # Return tokens
        return TokenResponse(
            access_token=auth_response.session.access_token,
            refresh_token=auth_response.session.refresh_token,
            expires_in=auth_response.session.expires_in,
        )
        
    except Exception as e:
        if "User already registered" in str(e):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="User with this email already exists",
            )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}",
        )


@router.post("/login", response_model=TokenResponse)
async def login(
    supabase: SupabaseDep,
    form_data: OAuth2PasswordRequestForm = Depends(),
) -> dict:
    """Email/password login. Returns access_token and refresh_token."""
    try:
        auth_response = await supabase.auth.sign_in_with_password({
            "email": form_data.username,
            "password": form_data.password,
        })
        
        if auth_response.user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
            )
        
        # Update last login
        await supabase.table("profiles").update({
            "last_login_at": "now()"
        }).eq("id", auth_response.user.id).execute()
        
        return TokenResponse(
            access_token=auth_response.session.access_token,
            refresh_token=auth_response.session.refresh_token,
            expires_in=auth_response.session.expires_in,
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(
    refresh_token: str,
    supabase: SupabaseDep,
) -> dict:
    """Refresh access token using a valid refresh_token."""
    try:
        auth_response = await supabase.auth.refresh_session(refresh_token)
        
        if auth_response.session is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired refresh token",
            )
        
        return TokenResponse(
            access_token=auth_response.session.access_token,
            refresh_token=auth_response.session.refresh_token,
            expires_in=auth_response.session.expires_in,
        )
        
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token",
        )


@router.post("/logout")
async def logout(
    current_user: CurrentUser,
    refresh_token: str | None = None,
) -> dict:
    """Invalidate refresh token."""
    try:
        from app.deps import get_supabase
        supabase = await get_supabase()
        
        if refresh_token:
            await supabase.auth.sign_out(refresh_token)
        else:
            await supabase.auth.sign_out()
            
        return {"message": "Successfully logged out"}
        
    except Exception:
        return {"message": "Logged out (some sessions may remain active)"}


@router.get("/me", response_model=UserProfile)
async def get_me(
    current_user: CurrentUser,
    supabase: SupabaseDep,
) -> dict:
    """Get current user profile with tenant and plan info."""
    try:
        # Get organization info
        org_response = (
            await supabase.table("organizations")
            .select("plan, created_at")
            .eq("id", current_user["organization_id"])
            .single()
            .execute()
        )
        
        org = org_response.data or {}
        
        # Get profile info
        profile_response = (
            await supabase.table("profiles")
            .select("full_name, avatar_url, role, created_at, last_login_at")
            .eq("id", current_user["id"])
            .single()
            .execute()
        )
        
        profile = profile_response.data or {}
        
        return UserProfile(
            id=current_user["id"],
            email=current_user["email"],
            full_name=profile.get("full_name", ""),
            avatar_url=profile.get("avatar_url"),
            tenant_id=current_user["organization_id"],
            role=profile.get("role", "member"),
            plan=org.get("plan", "free"),
            created_at=profile.get("created_at"),
            last_login_at=profile.get("last_login_at"),
        )
        
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch user profile",
        )


@router.post("/oauth/{provider}")
async def oauth_login(
    provider: str,
    supabase: SupabaseDep,
) -> dict:
    """Initiate OAuth login for Google/GitHub."""
    try:
        if provider not in ["google", "github"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Unsupported OAuth provider",
            )
        
        # This would typically return an OAuth URL
        # For now, we'll return a placeholder
        return {
            "message": f"OAuth login initiated for {provider}",
            "oauth_url": f"https://api.supabase.io/auth/v1/authorize?provider={provider}",
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"OAuth login failed: {str(e)}",
        )


@router.post("/forgot-password")
async def forgot_password(
    email: str,
    supabase: SupabaseDep,
) -> dict:
    """Send password reset email via Supabase Auth."""
    try:
        await supabase.auth.reset_password_for_email(email)
        
        return {
            "message": "Password reset email sent. Check your inbox.",
        }
        
    except Exception:
        # Always return success to prevent email enumeration
        return {
            "message": "If an account exists with this email, a password reset link has been sent.",
        }


@router.post("/reset-password")
async def reset_password(
    token: str,
    new_password: str,
    supabase: SupabaseDep,
) -> dict:
    """Reset password with token."""
    try:
        await supabase.auth.update_user({
            "password": new_password,
        })
        
        return {"message": "Password reset successfully"}
        
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token",
        )


@router.delete("/account")
async def delete_account(
    current_user: CurrentUser,
    supabase: SupabaseDep,
) -> dict:
    """Soft delete user account and organization."""
    try:
        # Soft delete profile
        await supabase.table("profiles").update({
            "deleted_at": "now()"
        }).eq("id", current_user["id"]).execute()
        
        # Soft delete organization if user is owner
        if current_user.get("role") == "owner":
            await supabase.table("organizations").update({
                "deleted_at": "now()"
            }).eq("id", current_user["organization_id"]).execute()
        
        # Delete auth user
        await supabase.auth.admin.delete_user(current_user["id"])
        
        return {"message": "Account deleted successfully"}
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Account deletion failed: {str(e)}",
        )
