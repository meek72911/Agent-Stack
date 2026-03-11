"""Report schemas -- client reports, PDF generation, scheduling."""

from datetime import datetime
from enum import Enum
from pydantic import BaseModel, Field


class ReportFormat(str, Enum):
    """Supported report output formats."""
    PDF = "pdf"
    HTML = "html"
    JSON = "json"
    CSV = "csv"


class ReportFrequency(str, Enum):
    """Report scheduling frequencies."""
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"


class ReportCreate(BaseModel):
    """Request body to generate a one-off or scheduled report."""
    name: str = Field(..., min_length=1, max_length=200)
    workspace_id: str | None = None
    format: ReportFormat = ReportFormat.PDF
    period_start: datetime
    period_end: datetime
    include_sections: list[str] = Field(
        default_factory=lambda: ["summary", "executions", "costs", "agents"],
        description="Which report sections to include",
    )
    recipient_emails: list[str] = Field(default_factory=list)


class ReportSchedule(BaseModel):
    """Configuration for a recurring scheduled report."""
    id: str
    report_name: str
    workspace_id: str | None = None
    format: ReportFormat
    frequency: ReportFrequency
    include_sections: list[str]
    recipient_emails: list[str]
    is_active: bool = True
    next_run_at: datetime | None = None
    last_run_at: datetime | None = None
    created_at: datetime


class ReportResponse(BaseModel):
    """Generated report metadata and download URL."""
    id: str
    tenant_id: str
    name: str
    workspace_id: str | None = None
    format: ReportFormat
    period_start: datetime
    period_end: datetime
    status: str = Field(default="completed", description="pending | generating | completed | failed")
    download_url: str | None = None
    file_size_bytes: int | None = None
    page_count: int | None = None
    generated_at: datetime | None = None
    created_at: datetime
