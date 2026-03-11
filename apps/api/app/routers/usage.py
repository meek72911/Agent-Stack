"""Usage routes -- /api/v1/usage/*

Usage dashboard data: execution counts, token usage, cost tracking,
and time saved estimates. Aggregated per workspace and per agent.
"""

from datetime import datetime, timedelta
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.deps import RedisDep, SupabaseDep, TenantId

router = APIRouter(prefix="/usage")


@router.get("/current")
async def get_current_usage(
    supabase: SupabaseDep,
    redis: RedisDep,
    tenant_id: TenantId,
) -> dict:
    """Executions this month: read Redis counter, active agents, workflows, tokens, cost vs plan limits."""
    try:
        now = datetime.utcnow()
        
        # Get monthly execution count from Redis
        redis_key = f"exec_count:{tenant_id}:{now.year}:{now.month}"
        executions_this_month = int(await redis.get(redis_key) or 0)
        
        # Get active agents count
        agents_resp = (
            await supabase.table("agents")
            .select("id")
            .eq("organization_id", tenant_id)
            .eq("status", "active")
            .is_("deleted_at", None)
            .execute()
        )
        
        active_agents = len(agents_resp.data or [])
        
        # Get workflows count
        workflows_resp = (
            await supabase.table("workflows")
            .select("id")
            .eq("organization_id", tenant_id)
            .is_("deleted_at", None)
            .execute()
        )
        
        workflows_count = len(workflows_resp.data or [])
        
        # Get tokens and cost from executions (simplified)
        executions_resp = (
            await supabase.table("workflow_executions")
            .select("input_tokens, output_tokens, total_cost_cents")
            .eq("organization_id", tenant_id)
            .gte("created_at", now.replace(day=1).isoformat())
            .execute()
        )
        
        total_tokens = 0
        total_cost_cents = 0
        
        for execution in executions_resp.data or []:
            total_tokens += (execution.get("input_tokens", 0) + execution.get("output_tokens", 0))
            total_cost_cents += execution.get("total_cost_cents", 0)
        
        # Get organization plan
        org_resp = (
            await supabase.table("organizations")
            .select("plan")
            .eq("id", tenant_id)
            .single()
            .execute()
        )
        
        plan = org_resp.data.get("plan", "free") if org_resp.data else "free"
        
        # Plan limits (simplified)
        plan_limits = {
            "free": {"max_executions": 100, "max_agents": 2, "max_workflows": 5},
            "pro": {"max_executions": 1000, "max_agents": 10, "max_workflows": 50},
            "team": {"max_executions": 10000, "max_agents": 50, "max_workflows": 200},
            "enterprise": {"max_executions": -1, "max_agents": -1, "max_workflows": -1},
        }
        
        limits = plan_limits.get(plan, plan_limits["free"])
        
        return {
            "period": f"{now.year}-{now.month:02d}",
            "executions": {
                "current": executions_this_month,
                "limit": limits["max_executions"],
                "percentage": (executions_this_month / limits["max_executions"] * 100) if limits["max_executions"] > 0 else 0,
            },
            "agents": {
                "current": active_agents,
                "limit": limits["max_agents"],
                "percentage": (active_agents / limits["max_agents"] * 100) if limits["max_agents"] > 0 else 0,
            },
            "workflows": {
                "current": workflows_count,
                "limit": limits["max_workflows"],
                "percentage": (workflows_count / limits["max_workflows"] * 100) if limits["max_workflows"] > 0 else 0,
            },
            "tokens": {
                "current": total_tokens,
                "limit": None,  # No token limits in current plans
            },
            "cost": {
                "current_cents": total_cost_cents,
                "current_dollars": total_cost_cents / 100,
                "limit_cents": None,  # No cost limits in current plans
            },
            "plan": plan,
        }
        
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch current usage",
        )


@router.get("/history")
async def get_usage_history(
    supabase: SupabaseDep,
    tenant_id: TenantId,
    days: int = Query(30, ge=1, le=90),
) -> dict:
    """Daily breakdown last 30 days. GROUP BY date: executions, tokens, cost_cents."""
    try:
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=days)
        
        # Get daily execution data
        executions_resp = (
            await supabase.table("workflow_executions")
            .select("created_at, status, input_tokens, output_tokens, total_cost_cents")
            .eq("organization_id", tenant_id)
            .gte("created_at", start_date.isoformat())
            .lte("created_at", end_date.isoformat())
            .order("created_at", asc=True)
            .execute()
        )
        
        # Group by date
        daily_data = {}
        
        for execution in executions_resp.data or []:
            date_str = execution["created_at"][:10]  # YYYY-MM-DD
            
            if date_str not in daily_data:
                daily_data[date_str] = {
                    "date": date_str,
                    "executions": 0,
                    "tokens": 0,
                    "cost_cents": 0,
                    "successful": 0,
                    "failed": 0,
                }
            
            daily_data[date_str]["executions"] += 1
            daily_data[date_str]["tokens"] += (execution.get("input_tokens", 0) + execution.get("output_tokens", 0))
            daily_data[date_str]["cost_cents"] += execution.get("total_cost_cents", 0)
            
            if execution["status"] == "completed":
                daily_data[date_str]["successful"] += 1
            elif execution["status"] == "failed":
                daily_data[date_str]["failed"] += 1
        
        # Fill missing dates with zeros
        current_date = start_date
        while current_date <= end_date:
            date_str = current_date.strftime("%Y-%m-%d")
            if date_str not in daily_data:
                daily_data[date_str] = {
                    "date": date_str,
                    "executions": 0,
                    "tokens": 0,
                    "cost_cents": 0,
                    "successful": 0,
                    "failed": 0,
                }
            current_date += timedelta(days=1)
        
        # Sort by date and return as list
        history = sorted(daily_data.values(), key=lambda x: x["date"])
        
        return {
            "period": f"{start_date.strftime('%Y-%m-%d')} to {end_date.strftime('%Y-%m-%d')}",
            "daily_data": history,
        }
        
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch usage history",
        )


@router.get("/agents/{agent_id}")
async def get_agent_usage(
    agent_id: str,
    supabase: SupabaseDep,
    tenant_id: TenantId,
    days: int = Query(30, ge=1, le=90),
) -> dict:
    """Per-agent: total executions, tokens, cost. Last 30 days breakdown."""
    try:
        # Verify agent belongs to tenant
        agent_resp = (
            await supabase.table("agents")
            .select("id, name")
            .eq("id", agent_id)
            .eq("organization_id", tenant_id)
            .is_("deleted_at", None)
            .single()
            .execute()
        )
        
        if not agent_resp.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Agent not found",
            )
        
        agent = agent_resp.data
        
        # Get execution data for this agent
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=days)
        
        executions_resp = (
            await supabase.table("workflow_executions")
            .select("created_at, status, input_tokens, output_tokens, total_cost_cents")
            .eq("agent_id", agent_id)
            .eq("organization_id", tenant_id)
            .gte("created_at", start_date.isoformat())
            .lte("created_at", end_date.isoformat())
            .order("created_at", desc=True)
            .execute()
        )
        
        # Calculate totals
        total_executions = len(executions_resp.data or [])
        total_tokens = 0
        total_cost_cents = 0
        successful = 0
        failed = 0
        
        daily_breakdown = {}
        
        for execution in executions_resp.data or []:
            date_str = execution["created_at"][:10]
            
            total_tokens += (execution.get("input_tokens", 0) + execution.get("output_tokens", 0))
            total_cost_cents += execution.get("total_cost_cents", 0)
            
            if execution["status"] == "completed":
                successful += 1
            elif execution["status"] == "failed":
                failed += 1
            
            # Daily breakdown
            if date_str not in daily_breakdown:
                daily_breakdown[date_str] = {
                    "date": date_str,
                    "executions": 0,
                    "tokens": 0,
                    "cost_cents": 0,
                }
            
            daily_breakdown[date_str]["executions"] += 1
            daily_breakdown[date_str]["tokens"] += (execution.get("input_tokens", 0) + execution.get("output_tokens", 0))
            daily_breakdown[date_str]["cost_cents"] += execution.get("total_cost_cents", 0)
        
        # Sort daily breakdown
        daily_data = sorted(daily_breakdown.values(), key=lambda x: x["date"], reverse=True)
        
        return {
            "agent": {
                "id": agent["id"],
                "name": agent["name"],
            },
            "period": f"{start_date.strftime('%Y-%m-%d')} to {end_date.strftime('%Y-%m-%d')}",
            "summary": {
                "total_executions": total_executions,
                "total_tokens": total_tokens,
                "total_cost_cents": total_cost_cents,
                "total_cost_dollars": total_cost_cents / 100,
                "success_rate": (successful / total_executions * 100) if total_executions > 0 else 0,
                "successful": successful,
                "failed": failed,
            },
            "daily_breakdown": daily_data,
        }
        
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch agent usage",
        )
