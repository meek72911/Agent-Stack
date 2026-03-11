"""Usage schemas -- tracking, aggregation, time series."""

from datetime import datetime
from pydantic import BaseModel, Field


class UsageSummary(BaseModel):
    """Aggregated usage summary for the current billing period."""
    tenant_id: str
    period_start: datetime
    period_end: datetime
    total_executions: int = 0
    total_tokens: int = 0
    total_prompt_tokens: int = 0
    total_completion_tokens: int = 0
    total_cost_cents: int = 0
    total_latency_ms: int = 0
    avg_latency_ms: float = 0.0
    unique_agents_used: int = 0
    unique_workflows_used: int = 0


class UsageByAgent(BaseModel):
    """Per-agent usage breakdown."""
    agent_id: str
    agent_name: str
    execution_count: int = 0
    total_tokens: int = 0
    total_cost_cents: int = 0
    avg_latency_ms: float = 0.0
    error_rate: float = Field(default=0.0, ge=0.0, le=1.0)
    last_execution_at: datetime | None = None


class UsageTimeSeriesPoint(BaseModel):
    """Single data point in a usage time series."""
    timestamp: datetime
    executions: int = 0
    tokens: int = 0
    cost_cents: int = 0
    errors: int = 0


class UsageTimeSeries(BaseModel):
    """Time series usage data for charting."""
    tenant_id: str
    granularity: str = Field(default="day", description="hour | day | week | month")
    data_points: list[UsageTimeSeriesPoint] = Field(default_factory=list)
    period_start: datetime
    period_end: datetime
