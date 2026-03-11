"""Usage service -- tracking, aggregation, limit enforcement.

Interface boundary: UsageService
Consumers: usage router, execution service, billing service
Dependencies: DbSession, Redis

Tracks execution usage per tenant, aggregates for billing periods,
provides time-series data for analytics dashboards, and enforces
plan limits before allowing new executions.
"""

from abc import ABC, abstractmethod
from datetime import datetime


class UsageService(ABC):
    """Usage tracking, aggregation, and limit enforcement."""

    # ── Recording ─────────────────────────────────────────────

    @abstractmethod
    async def record_execution(
        self,
        tenant_id: str,
        execution_id: str,
        agent_id: str,
        tokens: int,
        cost_cents: int,
        latency_ms: int,
        status: str,
    ) -> None:
        """Record a completed execution for usage tracking.

        Increments counters in Redis for real-time limits and
        writes to PostgreSQL for historical aggregation.
        """
        ...

    # ── Queries ───────────────────────────────────────────────

    @abstractmethod
    async def get_summary(self, tenant_id: str, period_start: datetime, period_end: datetime) -> dict:
        """Get aggregated usage summary for a billing period.

        Returns total executions, tokens, cost, unique agents, etc.
        """
        ...

    @abstractmethod
    async def get_by_agent(
        self,
        tenant_id: str,
        period_start: datetime,
        period_end: datetime,
        limit: int = 25,
        offset: int = 0,
    ) -> dict:
        """Get per-agent usage breakdown. Sorted by execution count desc."""
        ...

    @abstractmethod
    async def get_time_series(
        self,
        tenant_id: str,
        period_start: datetime,
        period_end: datetime,
        granularity: str = "day",
    ) -> dict:
        """Get time-series usage data for charting.

        Granularity: hour | day | week | month.
        Returns list of data points with timestamp, executions, tokens, cost.
        """
        ...

    # ── Limits ────────────────────────────────────────────────

    @abstractmethod
    async def check_execution_limit(self, tenant_id: str) -> bool:
        """Check if tenant is within their plan's execution limit.

        Uses Redis counter for fast real-time checking.
        Returns True if execution is allowed, False if limit reached.
        """
        ...

    @abstractmethod
    async def get_current_usage_count(self, tenant_id: str) -> int:
        """Get current period execution count from Redis.

        Fast path for plan enforcement middleware.
        """
        ...

    @abstractmethod
    async def reset_period_counters(self, tenant_id: str) -> None:
        """Reset Redis usage counters for a new billing period.

        Called by the billing webhook when a new period starts.
        """
        ...
