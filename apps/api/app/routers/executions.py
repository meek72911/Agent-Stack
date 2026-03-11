"""Execution routes -- /api/v1/executions/*

Cross-workflow execution listing, detail, and streaming.
Used for the global activity feed and execution analytics.
"""

import json
from datetime import datetime
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.responses import StreamingResponse

from app.deps import RedisDep, SupabaseDep, TenantId

router = APIRouter(prefix="/executions")


@router.get("")
async def list_all_executions(
    supabase: SupabaseDep,
    tenant_id: TenantId,
    workspace_id: str | None = Query(None),
    status: str | None = Query(None),
    date_from: str | None = Query(None),
    date_to: str | None = Query(None),
    limit: int = Query(25, ge=1, le=100),
    offset: int = Query(0, ge=0),
) -> dict:
    """List all executions across workflows. Supports workspace filtering."""
    try:
        # Build query
        query = (
            supabase.table("workflow_executions")
            .select("*, workflows!inner(name, workspace_id)", count="exact")
            .eq("organization_id", tenant_id)
        )
        
        # Apply filters
        if workspace_id:
            query = query.eq("workflows.workspace_id", workspace_id)
        if status:
            query = query.eq("status", status)
        if date_from:
            query = query.gte("created_at", date_from)
        if date_to:
            query = query.lte("created_at", date_to)
        
        # Apply pagination
        query = query.range(offset, offset + limit - 1).order("created_at", desc=True)
        
        response = await query.execute()
        
        executions = response.data or []
        total_count = response.count or 0
        
        return {
            "executions": executions,
            "total": total_count,
            "limit": limit,
            "offset": offset,
            "has_more": offset + limit < total_count,
        }
        
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to list executions",
        )


@router.get("/{execution_id}")
async def get_execution(
    execution_id: str,
    supabase: SupabaseDep,
    tenant_id: TenantId,
) -> dict:
    """Get execution detail with all step results and tool calls."""
    try:
        # Get execution
        execution_resp = (
            await supabase.table("workflow_executions")
            .select("*, workflows!inner(name, nodes, edges)")
            .eq("id", execution_id)
            .eq("organization_id", tenant_id)
            .single()
            .execute()
        )
        
        if not execution_resp.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Execution not found",
            )
        
        execution = execution_resp.data
        
        # Get execution steps
        steps_resp = (
            await supabase.table("workflow_execution_steps")
            .select("*")
            .eq("execution_id", execution_id)
            .order("created_at", asc=True)
            .execute()
        )
        
        # Get tool calls for all steps
        tool_calls_resp = (
            await supabase.table("tool_calls")
            .select("*")
            .in_("step_id", [step["id"] for step in steps_resp.data or []])
            .order("created_at", asc=True)
            .execute()
        )
        
        return {
            "execution": execution,
            "steps": steps_resp.data or [],
            "tool_calls": tool_calls_resp.data or [],
        }
        
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch execution",
        )


@router.get("/{execution_id}/stream")
async def stream_execution(
    execution_id: str,
    supabase: SupabaseDep,
    redis: RedisDep,
    tenant_id: TenantId,
) -> StreamingResponse:
    """SSE stream for any execution by ID."""
    try:
        # Verify execution belongs to tenant
        execution_resp = (
            await supabase.table("workflow_executions")
            .select("id, status")
            .eq("id", execution_id)
            .eq("organization_id", tenant_id)
            .single()
            .execute()
        )
        
        if not execution_resp.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Execution not found",
            )
        
        execution = execution_resp.data
        
        # If execution is already complete, return status
        if execution["status"] in ["completed", "failed", "cancelled"]:
            async def final_status_generator():
                yield f"data: {json.dumps({'event': 'status', 'status': execution['status']})}\n\n"
                yield "data: [DONE]\n\n"
            
            return StreamingResponse(
                final_status_generator(),
                media_type="text/event-stream",
                headers={"Cache-Control": "no-cache"}
            )
        
        # Subscribe to Redis pub/sub for live updates
        async def event_generator():
            try:
                # Subscribe to execution channel
                pubsub = redis.pubsub()
                await pubsub.subscribe(f"execution:{execution_id}:stream")
                
                # Send initial status
                yield f"data: {json.dumps({'event': 'status', 'status': execution['status']})}\n\n"
                
                # Listen for events
                async for message in pubsub.listen():
                    if message["type"] == "message":
                        data = message["data"].decode()
                        
                        # Check if it's a completion signal
                        if data == "[DONE]":
                            yield "data: [DONE]\n\n"
                            break
                        else:
                            yield f"data: {data}\n\n"
                
                await pubsub.unsubscribe(f"execution:{execution_id}:stream")
                
            except Exception as e:
                yield f"data: {json.dumps({'event': 'error', 'message': str(e)})}\n\n"
                yield "data: [DONE]\n\n"
        
        return StreamingResponse(
            event_generator(),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "X-Accel-Buffering": "no"
            }
        )
        
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to stream execution",
        )


@router.post("/{execution_id}/cancel")
async def cancel_execution(
    execution_id: str,
    supabase: SupabaseDep,
    redis: RedisDep,
    tenant_id: TenantId,
) -> dict:
    """Cancel a running execution."""
    try:
        # Get execution
        execution_resp = (
            await supabase.table("workflow_executions")
            .select("id, status")
            .eq("id", execution_id)
            .eq("organization_id", tenant_id)
            .single()
            .execute()
        )
        
        if not execution_resp.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Execution not found",
            )
        
        execution = execution_resp.data
        
        # Only cancel if execution is running
        if execution["status"] not in ["pending", "running"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Cannot cancel execution in status: {execution['status']}",
            )
        
        # Update execution status
        await supabase.table("workflow_executions").update({
            "status": "cancelled",
            "completed_at": "now()"
        }).eq("id", execution_id).execute()
        
        # Publish cancellation to Redis channel
        await redis.publish(
            f"execution:{execution_id}:stream",
            json.dumps({"event": "cancelled", "timestamp": datetime.utcnow().isoformat()})
        )
        
        return {"message": "Execution cancelled successfully"}
        
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to cancel execution",
        )
