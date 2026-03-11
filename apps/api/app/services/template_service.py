"""Template service -- marketplace template CRUD, install, versioning.

Interface boundary: TemplateService
Consumers: templates router, agents router (from-template)
Dependencies: DbSession

Manages the 83+ pre-built agent templates, featured/premium filtering,
installation (clone into tenant), and version tracking.
"""

from abc import ABC, abstractmethod


class TemplateService(ABC):
    """Template marketplace and installation service."""

    @abstractmethod
    async def list_templates(
        self,
        category: str | None = None,
        search: str | None = None,
        is_featured: bool | None = None,
        is_premium: bool | None = None,
        limit: int = 25,
        offset: int = 0,
    ) -> dict:
        """List templates with optional filtering.

        Returns paginated list. Templates are globally readable.
        Premium templates require a Pro+ plan to install.
        """
        ...

    @abstractmethod
    async def get_template(self, template_id: str) -> dict:
        """Get template by ID with full configuration.

        Raises NotFoundError if template does not exist.
        """
        ...

    @abstractmethod
    async def create_template(self, data: dict) -> dict:
        """Create a new template (admin only).

        Validates slug uniqueness and required fields.
        """
        ...

    @abstractmethod
    async def update_template(self, template_id: str, data: dict) -> dict:
        """Update template fields (admin only).

        Supports partial update. Increments version if content changed.
        """
        ...

    @abstractmethod
    async def delete_template(self, template_id: str) -> None:
        """Soft-delete a template (admin only)."""
        ...

    @abstractmethod
    async def install_template(
        self,
        tenant_id: str,
        template_id: str,
        agent_name: str | None = None,
        workspace_id: str | None = None,
        customizations: dict | None = None,
    ) -> dict:
        """Install a template as a new agent in the tenant's account.

        Copies system_prompt, model, temperature, tools config.
        Applies any customization overrides. Increments install_count.
        Checks plan limits before creating the agent.
        Returns the newly created agent dict.
        """
        ...

    @abstractmethod
    async def get_categories(self) -> list[str]:
        """Return distinct template categories for filtering UI."""
        ...

    @abstractmethod
    async def get_featured(self, limit: int = 10) -> list[dict]:
        """Return featured templates for the marketplace hero section."""
        ...
