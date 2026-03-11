"""Workspace service -- client workspace CRUD, isolation, branding.

Interface boundary: WorkspaceService
Consumers: workspaces router
Dependencies: DbSession

Manages white-label client workspaces with tenant isolation,
branding configuration, and resource scoping.
"""

from abc import ABC, abstractmethod


class WorkspaceService(ABC):
    """Client workspace lifecycle management."""

    @abstractmethod
    async def list_workspaces(
        self,
        tenant_id: str,
        search: str | None = None,
        is_active: bool | None = None,
        limit: int = 25,
        offset: int = 0,
    ) -> dict:
        """List workspaces for a tenant with optional filtering."""
        ...

    @abstractmethod
    async def create_workspace(self, tenant_id: str, data: dict) -> dict:
        """Create a new client workspace.

        Validates slug uniqueness within the tenant.
        Checks plan limit for max workspaces.
        Initializes default branding config.
        """
        ...

    @abstractmethod
    async def get_workspace(self, tenant_id: str, workspace_id: str) -> dict:
        """Get workspace detail with agent/workflow counts.

        Raises NotFoundError if workspace does not exist or belongs to another tenant.
        """
        ...

    @abstractmethod
    async def update_workspace(self, tenant_id: str, workspace_id: str, data: dict) -> dict:
        """Update workspace fields including branding.

        Supports partial update. Validates custom domain uniqueness if changed.
        """
        ...

    @abstractmethod
    async def delete_workspace(self, tenant_id: str, workspace_id: str) -> None:
        """Soft-delete a workspace. Does NOT delete contained agents/workflows."""
        ...

    @abstractmethod
    async def get_branding(self, workspace_id: str) -> dict:
        """Get branding configuration for a workspace.

        Used by the branding middleware to inject white-label config.
        """
        ...

    @abstractmethod
    async def update_branding(self, tenant_id: str, workspace_id: str, branding: dict) -> dict:
        """Update branding configuration (logo, colors, domain).

        Validates custom domain DNS before accepting.
        """
        ...

    @abstractmethod
    async def resolve_by_domain(self, domain: str) -> dict | None:
        """Resolve a custom domain to a workspace.

        Returns workspace dict or None if no match.
        Used by the branding middleware for domain-based resolution.
        """
        ...
