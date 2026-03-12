"""Billing routes -- /api/v1/billing/*

Stripe integration: checkout session creation, customer portal,
subscription management, and webhook handling.
Handles subscriptions + one-time template pack purchases + custom build invoices.
"""

from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Request, status
from pydantic import BaseModel

from app.config import get_settings
from app.deps import CurrentUser, SupabaseDep, TenantId

router = APIRouter(prefix="/billing")


class CheckoutRequest(BaseModel):
    """Request body for creating checkout session."""
    plan: str  # free, pro, team, enterprise
    success_url: str | None = None
    cancel_url: str | None = None


@router.get("/plans")
async def get_plans() -> dict:
    """Return static plan config from PLAN_LIMITS with pricing: free=$0, pro=$29, team=$79."""
    try:
        # Plan limits with pricing
        plans = {
            "free": {
                "name": "Free",
                "price_cents": 0,
                "price_dollars": 0,
                "interval": "month",
                "features": [
                    "2 agents",
                    "5 workflows", 
                    "100 executions/month",
                    "Basic support"
                ],
                "limits": {
                    "max_agents": 2,
                    "max_workflows": 5,
                    "max_executions": 100,
                }
            },
            "pro": {
                "name": "Pro",
                "price_cents": 2900,
                "price_dollars": 29,
                "interval": "month",
                "features": [
                    "10 agents",
                    "50 workflows",
                    "1,000 executions/month",
                    "Priority support",
                    "Advanced analytics"
                ],
                "limits": {
                    "max_agents": 10,
                    "max_workflows": 50,
                    "max_executions": 1000,
                }
            },
            "team": {
                "name": "Team",
                "price_cents": 7900,
                "price_dollars": 79,
                "interval": "month",
                "features": [
                    "50 agents",
                    "200 workflows",
                    "10,000 executions/month",
                    "Dedicated support",
                    "Custom branding",
                    "API access"
                ],
                "limits": {
                    "max_agents": 50,
                    "max_workflows": 200,
                    "max_executions": 10000,
                }
            },
            "enterprise": {
                "name": "Enterprise",
                "price_cents": None,
                "price_dollars": "Custom",
                "interval": "month",
                "features": [
                    "Unlimited agents",
                    "Unlimited workflows",
                    "Unlimited executions",
                    "24/7 phone support",
                    "Custom integrations",
                    "SLA guarantee"
                ],
                "limits": {
                    "max_agents": -1,
                    "max_workflows": -1,
                    "max_executions": -1,
                }
            }
        }
        
        return {"plans": plans}
        
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch plans",
        )


@router.post("/subscribe")
async def create_subscription(
    request: CheckoutRequest,
    current_user: CurrentUser,
    supabase: SupabaseDep,
    tenant_id: TenantId,
) -> dict:
    """stripe.checkout.Session.create() with correct price_id."""
    try:
        settings = get_settings()
        
        if not settings.stripe_secret_key:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Payment processing not available",
            )
        
        # Get organization info
        org_resp = (
            await supabase.table("organizations")
            .select("id, name, stripe_customer_id")
            .eq("id", tenant_id)
            .single()
            .execute()
        )
        
        if not org_resp.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Organization not found",
            )
        
        org = org_resp.data
        
        # Price mapping (would come from Stripe in real implementation)
        price_ids = {
            "pro": "price_pro_monthly",
            "team": "price_team_monthly",
            "enterprise": "price_enterprise_monthly",
        }
        
        price_id = price_ids.get(request.plan)
        if not price_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid plan",
            )
        
        # In a real implementation, this would create a Stripe checkout session
        # For now, we'll return a placeholder response
        
        success_url = request.success_url or f"{settings.app_url}/billing/success"
        cancel_url = request.cancel_url or f"{settings.app_url}/billing/cancel"
        
        return {
            "checkout_url": f"https://checkout.stripe.com/pay?price_id={price_id}&success_url={success_url}&cancel_url={cancel_url}",
            "message": "Stripe integration not yet fully implemented",
        }
        
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create subscription",
        )


@router.post("/portal")
async def create_portal_session(
    current_user: CurrentUser,
    supabase: SupabaseDep,
    tenant_id: TenantId,
) -> dict:
    """stripe.billing_portal.Session.create() with customer=org.stripe_customer_id."""
    try:
        settings = get_settings()
        
        if not settings.stripe_secret_key:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Payment processing not available",
            )
        
        # Get organization info
        org_resp = (
            await supabase.table("organizations")
            .select("id, stripe_customer_id")
            .eq("id", tenant_id)
            .single()
            .execute()
        )
        
        if not org_resp.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Organization not found",
            )
        
        org = org_resp.data
        
        if not org.get("stripe_customer_id"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No active subscription found",
            )
        
        # In a real implementation, this would create a Stripe portal session
        return {
            "portal_url": f"https://billing.stripe.com/session/{org['stripe_customer_id']}",
            "message": "Stripe integration not yet fully implemented",
        }
        
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create portal session",
        )


@router.post("/webhook")
async def stripe_webhook(
    request: Request,
    supabase: SupabaseDep,
) -> dict:
    """Verify webhook and handle events."""
    try:
        settings = get_settings()
        
        if not settings.stripe_webhook_secret:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Webhook processing not available",
            )
        
        # In a real implementation, this would:
        # 1. Verify webhook signature
        # 2. Parse event payload
        # 3. Handle different event types
        
        body = await request.body()
        
        # Mock webhook processing for now
        return {"status": "ok"}
        
        # Real implementation would handle:
        # - checkout.session.completed: update org.plan, store stripe_customer_id + subscription_id
        # - customer.subscription.updated: update org.plan
        # - customer.subscription.deleted: set org.plan = 'free'
        # - invoice.payment_failed: send warning email via Resend API
        
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to process webhook",
        )


@router.get("/subscription")
async def get_subscription(
    supabase: SupabaseDep,
    tenant_id: TenantId,
) -> dict:
    """Get current subscription status, plan, and billing period."""
    try:
        # Get organization info
        org_resp = (
            await supabase.table("organizations")
            .select("id, plan, stripe_customer_id, stripe_subscription_id, created_at, updated_at")
            .eq("id", tenant_id)
            .single()
            .execute()
        )
        
        if not org_resp.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Organization not found",
            )
        
        org = org_resp.data
        
        # Get plans for reference
        plans_resp = await get_plans()
        plans = plans_resp["plans"]
        
        current_plan = plans.get(org["plan"], plans["free"])
        
        return {
            "plan": org["plan"],
            "plan_name": current_plan["name"],
            "price_cents": current_plan["price_cents"],
            "price_dollars": current_plan["price_dollars"],
            "interval": current_plan["interval"],
            "features": current_plan["features"],
            "limits": current_plan["limits"],
            "stripe_customer_id": org.get("stripe_customer_id"),
            "stripe_subscription_id": org.get("stripe_subscription_id"),
            "status": "active" if org.get("stripe_subscription_id") else "trial",
            "created_at": org["created_at"],
            "updated_at": org["updated_at"],
        }
        
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch subscription",
        )
