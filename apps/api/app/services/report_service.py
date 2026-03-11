"""Report service -- client reports, PDF generation, scheduling.

Interface boundary: ReportService
Consumers: reports router (to be created), scheduler
Dependencies: DbSession, UsageService, WorkspaceService

Generates white-label client reports with execution summaries,
cost breakdowns, and agent performance metrics. Supports PDF/HTML/CSV
output and recurring scheduled delivery via email.
"""

from abc import ABC, abstractmethod
from datetime import datetime


class ReportService(ABC):
    """Client report generation, scheduling, and delivery."""

    # ── Generation ────────────────────────────────────────────

    @abstractmethod
    async def generate_report(self, tenant_id: str, data: dict) -> dict:
        """Generate a one-off report for a billing period.

        Assembles data from usage_service and workspace_service.
        Renders into the requested format (PDF, HTML, JSON, CSV).
        Stores the generated file and returns metadata with download URL.
        """
        ...

    @abstractmethod
    async def get_report(self, tenant_id: str, report_id: str) -> dict:
        """Get report metadata and download URL.

        Raises NotFoundError if report does not exist or belongs to another tenant.
        """
        ...

    @abstractmethod
    async def list_reports(
        self,
        tenant_id: str,
        workspace_id: str | None = None,
        limit: int = 25,
        offset: int = 0,
    ) -> dict:
        """List generated reports for a tenant. Paginated."""
        ...

    @abstractmethod
    async def delete_report(self, tenant_id: str, report_id: str) -> None:
        """Delete a generated report and its stored file."""
        ...

    # ── Scheduling ────────────────────────────────────────────

    @abstractmethod
    async def create_schedule(self, tenant_id: str, data: dict) -> dict:
        """Create a recurring report schedule.

        Validates frequency and recipient emails.
        Calculates next_run_at based on frequency.
        """
        ...

    @abstractmethod
    async def list_schedules(self, tenant_id: str) -> list[dict]:
        """List all report schedules for a tenant."""
        ...

    @abstractmethod
    async def update_schedule(self, tenant_id: str, schedule_id: str, data: dict) -> dict:
        """Update a report schedule."""
        ...

    @abstractmethod
    async def delete_schedule(self, tenant_id: str, schedule_id: str) -> None:
        """Delete a report schedule."""
        ...

    @abstractmethod
    async def execute_scheduled_reports(self) -> int:
        """Execute all due scheduled reports.

        Called by the background scheduler. Generates reports and
        sends to recipient emails via the email service.
        Returns the number of reports generated.
        """
        ...

    # ── Rendering ─────────────────────────────────────────────

    @abstractmethod
    async def _render_pdf(self, report_data: dict, template_name: str) -> bytes:
        """Render report data into a PDF document.

        Uses a Jinja2 HTML template + WeasyPrint for PDF conversion.
        Applies workspace branding (logo, colors) if available.
        """
        ...

    @abstractmethod
    async def _render_html(self, report_data: dict, template_name: str) -> str:
        """Render report data into an HTML document."""
        ...

    @abstractmethod
    async def _render_csv(self, report_data: dict) -> str:
        """Render report data into CSV format."""
        ...
