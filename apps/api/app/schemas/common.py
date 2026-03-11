"""Common response schemas used across all endpoints."""

from typing import Generic, TypeVar
from pydantic import BaseModel, Field

T = TypeVar("T")


class ErrorDetail(BaseModel):
    """Single error detail entry."""
    code: str = Field(..., description="Machine-readable error code")
    message: str = Field(..., description="Human-readable error message")
    details: list[dict] = Field(default_factory=list, description="Additional error context")


class ErrorResponse(BaseModel):
    """Standard error envelope returned by all endpoints."""
    error: ErrorDetail


class SuccessResponse(BaseModel):
    """Generic success response for delete/action endpoints."""
    success: bool = True
    message: str = Field(default="Operation completed successfully")


class PaginatedResponse(BaseModel, Generic[T]):
    """Paginated list response wrapper.

    All list endpoints return this envelope so the dashboard
    can render pagination controls consistently.
    """
    items: list[T] = Field(default_factory=list, description="Page of results")
    total: int = Field(..., description="Total count matching the query")
    limit: int = Field(..., description="Requested page size")
    offset: int = Field(..., description="Requested offset")
    has_more: bool = Field(..., description="True if more pages exist")
