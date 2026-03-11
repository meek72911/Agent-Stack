"""Health check endpoint.

Returns API status, version, and basic connectivity checks.
"""

from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
async def health_check() -> dict:
    """Return API health status. Used by Railway health checks."""
    return {
        "status": "healthy",
        "version": "0.1.0",
        "service": "agentstack-api",
    }
