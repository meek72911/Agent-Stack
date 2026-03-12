"""SSE Streaming Router for real-time execution updates."""

from typing import AsyncGenerator
import asyncio
import json
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
import redis.asyncio as redis

from app.deps import get_redis, SupabaseDep, TenantId

router = APIRouter()


@router.get("/stream/{execution_id}")
async def stream_execution(
    execution_id: str,
    redis_client: redis.Redis = Depends(get_redis)
) -> StreamingResponse:
    """Stream execution updates via Server-Sent Events (SSE)."""

    async def event_generator() -> AsyncGenerator[str, None]:
        """Generate SSE events from Redis channel."""
        channel = f"execution:{execution_id}:stream"

        # Subscribe to Redis channel
        pubsub = redis_client.pubsub()
        await pubsub.subscribe(channel)

        try:
            # Send initial connection event
            yield f"event: connected\ndata: {json.dumps({'status': 'connected', 'execution_id': execution_id})}\n\n"

            # Listen for messages
            async for message in pubsub.listen():
                if message["type"] == "message":
                    data = message["data"]
                    if isinstance(data, bytes):
                        data = data.decode("utf-8")

                    # Parse as JSON
                    try:
                        event_data = json.loads(data)
                        event_type = event_data.get("event", "update")

                        # Format as SSE
                        yield f"event: {event_type}\ndata: {json.dumps(event_data)}\n\n"
                    except json.JSONDecodeError:
                        # If not JSON, send as plain text
                        yield f"event: update\ndata: {json.dumps({'message': data})}\n\n"

        except asyncio.CancelledError:
            # Client disconnected
            pass
        finally:
            await pubsub.unsubscribe(channel)
            await pubsub.close()

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Access-Control-Allow-Origin": "*",
        }
    )


@router.get("/stream/{execution_id}/history")
async def get_execution_history(
    execution_id: str,
    redis_client: redis.Redis = Depends(get_redis)
):
    """Get historical execution events."""
    history_key = f"execution:{execution_id}:history"

    # Get all events from Redis list
    events = await redis_client.lrange(history_key, 0, -1)

    parsed_events = []
    for event in events:
        try:
            parsed_events.append(json.loads(event))
        except json.JSONDecodeError:
            continue

    return {"execution_id": execution_id, "events": parsed_events}


@router.post("/stream/{execution_id}/publish")
async def publish_event(
    execution_id: str,
    event_data: dict,
    supabase: SupabaseDep,
    tenant_id: TenantId,
    redis_client: redis.Redis = Depends(get_redis)
):
    """Publish an event to the execution stream. Verified for tenant ownership."""
    # Verify execution belongs to tenant
    exec_resp = await supabase.table("workflow_executions").select("id").eq("id", execution_id).eq("organization_id", tenant_id).single().execute()
    
    if not exec_resp.data:
        raise HTTPException(status_code=404, detail="Execution not found")

    channel = f"execution:{execution_id}:stream"
    history_key = f"execution:{execution_id}:history"

    # Add timestamp if not present
    if "timestamp" not in event_data:
        import datetime
        event_data["timestamp"] = datetime.datetime.utcnow().isoformat()

    # Publish to Redis channel
    await redis_client.publish(channel, json.dumps(event_data))

    # Store in history (keep last 100 events)
    await redis_client.lpush(history_key, json.dumps(event_data))
    await redis_client.ltrim(history_key, 0, 99)

    return {"status": "published", "execution_id": execution_id}
