"""Community schemas -- posts, votes, trending content."""

from datetime import datetime
from enum import Enum
from pydantic import BaseModel, Field


class PostCategory(str, Enum):
    """Community post categories."""
    TEMPLATE = "template"
    WORKFLOW = "workflow"
    TUTORIAL = "tutorial"
    SHOWCASE = "showcase"
    QUESTION = "question"
    BOUNTY = "bounty"


class CommunityPostCreate(BaseModel):
    """Request body to create a community post."""
    title: str = Field(..., min_length=1, max_length=300)
    body: str = Field(..., min_length=10, max_length=50000)
    category: PostCategory
    tags: list[str] = Field(default_factory=list, max_length=10)
    linked_template_id: str | None = None
    linked_workflow_id: str | None = None


class VoteCreate(BaseModel):
    """Request body to upvote or downvote a post."""
    post_id: str
    direction: int = Field(..., ge=-1, le=1, description="-1 (downvote), 0 (remove), 1 (upvote)")


class CommunityPostResponse(BaseModel):
    """Community post detail."""
    id: str
    author_id: str
    author_name: str
    author_avatar_url: str | None = None
    title: str
    body: str
    category: PostCategory
    tags: list[str]
    linked_template_id: str | None = None
    linked_workflow_id: str | None = None
    upvotes: int = 0
    downvotes: int = 0
    score: int = 0
    comment_count: int = 0
    is_featured: bool = False
    current_user_vote: int = 0
    created_at: datetime
    updated_at: datetime
