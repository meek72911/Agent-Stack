"""Health check endpoint.

Returns API status, version, and basic connectivity checks.
"""

from fastapi import APIRouter, Depends
from app.deps import get_supabase, get_redis, SupabaseDep, RedisDep

router = APIRouter()


@router.get("/health")
async def health_check(
    supabase: SupabaseDep = Depends(get_supabase),
    redis: RedisDep = Depends(get_redis),
) -> dict:
    """Return API health status with dependency checks."""
    health = {
        "status": "healthy",
        "version": "0.1.0",
        "service": "agentstack-api",
        "checks": {
            "supabase": "unknown",
            "redis": "unknown",
        }
    }
    
    # Check Supabase
    try:
        await supabase.table("profiles").select("id", count="exact").limit(1).execute()
        health["checks"]["supabase"] = "up"
    except Exception:
        health["checks"]["supabase"] = "down"
        health["status"] = "degraded"
        
    # Check Redis
    try:
        await redis.ping()
        health["checks"]["redis"] = "up"
    except Exception:
        health["checks"]["redis"] = "down"
        health["status"] = "degraded"
        
    return health
