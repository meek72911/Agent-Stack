"""Upstash Redis cost checking middleware."""

from datetime import datetime
from fastapi import HTTPException, status
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import Response

from app.deps import get_redis


class UpstashBudgetMiddleware(BaseHTTPMiddleware):
    """Monitor Upstash Redis usage to prevent cost overruns."""

    # Daily Redis command limit (8000 commands/day as specified)
    DAILY_REDIS_LIMIT = 8000

    # Paths that trigger Redis usage tracking
    EXECUTION_PATHS = [
        "/api/v1/agents/",
        "/api/v1/workflows/",
        "/api/v1/executions/",
    ]

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        """Track Redis command count and check against daily budget."""
        path = request.url.path
        
        # Check if this is an execution-heavy path that uses Redis
        if any(exec_path in path for exec_path in self.EXECUTION_PATHS):
            tenant_id = getattr(request.state, "tenant_id", None)
            if tenant_id:
                await self._check_redis_budget(tenant_id)

        response = await call_next(request)
        return response

    async def _check_redis_budget(self, tenant_id: str) -> None:
        """Check if tenant is approaching Redis daily command limit."""
        try:
            redis = await get_redis()
            
            # Get current date
            now = datetime.utcnow()
            key = f"upstash:budget:{now.year}:{now.month}:{now.day}"
            
            # Get current Redis command count for today
            current_count = int(await redis.get(key) or 0)
            
            # If we're approaching the limit (90% threshold), warn the user
            if current_count >= (self.DAILY_REDIS_LIMIT * 0.9):
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail=f"Approaching daily Redis command limit ({current_count}/{self.DAILY_REDIS_LIMIT}). Please reduce API calls or upgrade your plan.",
                    headers={"Retry-After": "3600"},  # 1 hour retry
                )
                
        except HTTPException:
            raise
        except Exception:
            # If check fails, allow the request (fail open)
            pass

    @staticmethod
    async def increment_redis_command_count(tenant_id: str) -> int:
        """Increment Redis command count for budget tracking."""
        try:
            redis = await get_redis()
            
            # Get current date
            now = datetime.utcnow()
            key = f"upstash:budget:{now.year}:{now.month}:{now.day}"
            
            # Increment counter
            count = await redis.incr(key)
            
            # Set expiration to end of day (24 hours from now)
            await redis.expire(key, 86400)  # 24 hours
            
            return count
            
        except Exception:
            return 0
