"""Sharing service -- share links, public/private, forking.

Interface boundary: SharingService
Consumers: sharing router
Dependencies: DbSession

Manages shareable links for workflows and agents with
visibility controls, optional passwords, and fork/clone.
"""

from abc import ABC, abstractmethod


class SharingService(ABC):
    """Share link creation, resolution, and fork management."""

    @abstractmethod
    async def create_share_link(self, tenant_id: str, data: dict) -> dict:
        """Create a share link for a workflow or agent.

        Generates a unique short slug. Optionally password-protects the link.
        """
        ...

    @abstractmethod
    async def get_share_link(self, tenant_id: str, share_id: str) -> dict:
        """Get share link detail (owner view with analytics)."""
        ...

    @abstractmethod
    async def list_share_links(
        self,
        tenant_id: str,
        resource_type: str | None = None,
        limit: int = 25,
        offset: int = 0,
    ) -> dict:
        """List all share links for a tenant."""
        ...

    @abstractmethod
    async def delete_share_link(self, tenant_id: str, share_id: str) -> None:
        """Revoke and delete a share link."""
        ...

    @abstractmethod
    async def resolve_share_slug(self, slug: str, password: str | None = None) -> dict:
        """Resolve a share slug to the shared resource.

        Public endpoint -- no authentication required.
        Checks visibility, expiration, and password if set.
        Increments view count.
        Returns sanitized resource data (no sensitive fields).
        """
        ...

    @abstractmethod
    async def fork_shared_resource(
        self,
        slug: str,
        tenant_id: str,
        workspace_id: str | None = None,
    ) -> dict:
        """Fork/clone a shared workflow or agent into the user's account.

        Requires allow_fork=True on the share link.
        Creates a deep copy with a new ID. Increments fork count.
        Returns the newly created resource dict.
        """
        ...

    @abstractmethod
    async def update_share_link(self, tenant_id: str, share_id: str, data: dict) -> dict:
        """Update share link settings (visibility, password, expiration)."""
        ...
