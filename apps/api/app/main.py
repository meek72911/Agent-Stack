"""FastAPI application entry point.

Creates the app, registers middleware, mounts routers, and configures lifespan.
"""

from contextlib import asynccontextmanager
from typing import AsyncGenerator

import sentry_sdk
import stripe
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
import redis.asyncio as redis

from app.config import get_settings
from app.routers import (
    agents,
    api_keys,
    auth,
    billing,
    community,
    executions,
    health,
    onboarding,
    sharing,
    templates,
    usage,
    workflows,
    workspaces,
)

# Global instances for lifespan management
engine = None
redis_client = None


@asynccontextmanager
async def lifespan(_app: FastAPI) -> AsyncGenerator[None, None]:
    """Application lifespan -- startup and shutdown hooks."""
    global engine, redis_client
    settings = get_settings()
    
    # Startup: initialize DB pool, Redis connection, Stripe, Sentry
    # Initialize database engine
    engine = create_async_engine(
        settings.database_url,
        pool_size=settings.database_pool_size,
        max_overflow=settings.database_max_overflow,
        echo=settings.debug,
    )
    
    # Initialize Redis client
    redis_client = redis.from_url(settings.redis_url, decode_responses=True)
    
    # Initialize Sentry SDK
    if settings.sentry_dsn:
        sentry_sdk.init(
            dsn=settings.sentry_dsn,
            traces_sample_rate=1.0 if settings.debug else 0.1,
            environment="development" if settings.debug else "production",
        )
    
    # Initialize Stripe client
    if settings.stripe_secret_key:
        stripe.api_key = settings.stripe_secret_key
    
    yield
    
    # Shutdown: close connections
    # Close database engine
    if engine:
        await engine.dispose()
    
    # Close Redis connection
    if redis_client:
        await redis_client.close()


def create_app() -> FastAPI:
    """Factory function to create and configure the FastAPI application."""
    settings = get_settings()

    _app = FastAPI(
        title=settings.app_name,
        description="AI Agent Management Platform API",
        version="0.1.0",
        docs_url="/api/docs",
        redoc_url="/api/redoc",
        openapi_url="/api/openapi.json",
        lifespan=lifespan,
    )

    # -- CORS Middleware --
    _app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins.split(","),
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # -- Register Routers (all prefixed with /api/v1) --
    api_prefix = "/api/v1"
    _app.include_router(health.router, prefix=api_prefix, tags=["Health"])
    _app.include_router(auth.router, prefix=api_prefix, tags=["Auth"])
    _app.include_router(onboarding.router, prefix=api_prefix, tags=["Onboarding"])
    _app.include_router(agents.router, prefix=api_prefix, tags=["Agents"])
    _app.include_router(workflows.router, prefix=api_prefix, tags=["Workflows"])
    _app.include_router(executions.router, prefix=api_prefix, tags=["Executions"])
    _app.include_router(templates.router, prefix=api_prefix, tags=["Templates"])
    _app.include_router(workspaces.router, prefix=api_prefix, tags=["Workspaces"])
    _app.include_router(api_keys.router, prefix=api_prefix, tags=["API Keys"])
    _app.include_router(usage.router, prefix=api_prefix, tags=["Usage"])
    _app.include_router(sharing.router, prefix=api_prefix, tags=["Sharing"])
    _app.include_router(billing.router, prefix=api_prefix, tags=["Billing"])
    _app.include_router(community.router, prefix=api_prefix, tags=["Community"])

    return _app


app = create_app()
