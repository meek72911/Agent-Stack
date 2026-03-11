"""Rate limiting middleware using Upstash Redis.

Applies per-endpoint rate limits based on the user plan tier.
Rate limits defined in the build spec per route group.
"""

import time
from typing import Dict

from fastapi import HTTPException, status
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import Response

from app.deps import get_redis

# Plan limits from the build spec
PLAN_LIMITS: Dict[str, Dict[str, int]] = {
    "free": {
        "rate_limit_rpm": 60,  # 60 requests per minute
        "max_activated_agents": 2,
        "max_workflows": 5,
        "max_executions_per_month": 100,
        "max_workspaces": 1,
    },
    "pro": {
        "rate_limit_rpm": 300,  # 300 requests per minute
        "max_activated_agents": 10,
        "max_workflows": 50,
        "max_executions_per_month": 1000,
        "max_workspaces": 5,
    },
    "team": {
        "rate_limit_rpm": 1000,  # 1000 requests per minute
        "max_activated_agents": 50,
        "max_workflows": 200,
        "max_executions_per_month": 10000,
        "max_workspaces": 20,
    },
    "enterprise": {
        "rate_limit_rpm": 5000,  # 5000 requests per minute
        "max_activated_agents": -1,  # unlimited
        "max_workflows": -1,  # unlimited
        "max_executions_per_month": -1,  # unlimited
        "max_workspaces": -1,  # unlimited
    },
}


class RateLimitMiddleware(BaseHTTPMiddleware):
    """Enforce per-user, per-endpoint rate limits via Redis sliding window."""

    # Paths that skip rate limiting
    SKIP_RATE_LIMIT_PATHS = {
        "/api/v1/health",
        "/api/docs",
        "/api/redoc",
        "/api/openapi.json",
    }

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        """Check rate limit before processing request."""
        # Skip rate limiting for certain paths
        if request.url.path in self.SKIP_RATE_LIMIT_PATHS:
            return await call_next(request)

        # Extract tenant_id and plan from request.state
        tenant_id = getattr(request.state, "tenant_id", None)
        user = getattr(request.state, "user", {})
        
        if not tenant_id:
            return await call_next(request)

        # Get user plan (default to free if not set)
        plan = user.get("plan", "free")
        
        # Determine rate limit for this plan
        rate_limit_rpm = PLAN_LIMITS.get(plan, {}).get("rate_limit_rpm", 60)
        
        # Check Redis sliding window counter
        if await self._is_rate_limited(tenant_id, request.url.path, rate_limit_rpm):
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Rate limit exceeded. Please try again later.",
                headers={"Retry-After": "60"},
            )

        return await call_next(request)

    async def _is_rate_limited(self, tenant_id: str, endpoint: str, limit: int) -> bool:
        """Check if tenant has exceeded rate limit using Redis sliding window."""
        try:
            redis = await get_redis()
            
            # Create key for this tenant and endpoint
            key = f"ratelimit:{tenant_id}:{endpoint}"
            
            # Current timestamp
            current_time = int(time.time())
            window_start = current_time - 60  # 1 minute sliding window
            
            # Use Redis pipeline for atomic operations
            pipe = redis.pipeline()
            
            # Remove old entries outside the window
            pipe.zremrangebyscore(key, 0, window_start)
            
            # Count current requests in window
            pipe.zcard(key)
            
            # Add current request
            pipe.zadd(key, {str(current_time): current_time})
            
            # Set expiration to clean up old keys
            pipe.expire(key, 120)  # 2 minutes
            
            # Execute pipeline
            results = await pipe.execute()
            
            # Get the count after removing old entries
            current_count = results[1]
            
            return current_count >= limit
            
        except Exception:
            # If Redis fails, allow the request (fail open)
            return False
