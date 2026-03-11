"""Community service -- posts, votes, trending, featured content.

Interface boundary: CommunityService
Consumers: community router
Dependencies: DbSession

Manages community contributions, voting, and content discovery.
Supports templates, workflows, tutorials, showcases, questions, and bounties.
"""

from abc import ABC, abstractmethod


class CommunityService(ABC):
    """Community hub for sharing templates, workflows, and knowledge."""

    @abstractmethod
    async def list_posts(
        self,
        category: str | None = None,
        tags: list[str] | None = None,
        sort_by: str = "score",
        search: str | None = None,
        limit: int = 25,
        offset: int = 0,
    ) -> dict:
        """List community posts with filtering and sorting.

        Sort options: score (default), newest, most_commented.
        """
        ...

    @abstractmethod
    async def create_post(self, user_id: str, tenant_id: str, data: dict) -> dict:
        """Create a new community post.

        Auto-links template or workflow if IDs provided.
        """
        ...

    @abstractmethod
    async def get_post(self, post_id: str, current_user_id: str | None = None) -> dict:
        """Get post detail with author info and current user's vote status."""
        ...

    @abstractmethod
    async def update_post(self, post_id: str, user_id: str, data: dict) -> dict:
        """Update a post. Only the author can edit."""
        ...

    @abstractmethod
    async def delete_post(self, post_id: str, user_id: str) -> None:
        """Delete a post. Only the author or admin can delete."""
        ...

    @abstractmethod
    async def vote(self, user_id: str, post_id: str, direction: int) -> dict:
        """Cast, change, or remove a vote on a post.

        Args:
            direction: -1 (downvote), 0 (remove vote), 1 (upvote)

        Returns updated vote counts.
        """
        ...

    @abstractmethod
    async def get_trending(self, limit: int = 10) -> list[dict]:
        """Return trending posts based on recent vote velocity."""
        ...

    @abstractmethod
    async def get_featured(self, limit: int = 5) -> list[dict]:
        """Return admin-curated featured posts."""
        ...
