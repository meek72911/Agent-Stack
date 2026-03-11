"""Custom exception classes and global exception handlers.

All API errors use a consistent envelope format:
{ "error": { "code": "...", "message": "...", "details": [...] } }
"""

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse


class AppException(Exception):
    """Base application exception."""

    def __init__(self, code: str, message: str, status_code: int = 400, details: list | None = None):
        self.code = code
        self.message = message
        self.status_code = status_code
        self.details = details or []


class NotFoundError(AppException):
    """Resource not found."""

    def __init__(self, resource: str, resource_id: str):
        super().__init__(
            code="not_found",
            message=f"{resource} with id '{resource_id}' not found",
            status_code=404,
        )


class PlanLimitError(AppException):
    """Plan limit exceeded."""

    def __init__(self, limit_name: str, current_plan: str, limit_value: int):
        super().__init__(
            code="plan_limit_exceeded",
            message=f"Plan limit '{limit_name}' exceeded on {current_plan} plan (limit: {limit_value})",
            status_code=403,
            details=[{"limit": limit_name, "plan": current_plan, "max": limit_value}],
        )


class RateLimitError(AppException):
    """Rate limit exceeded."""

    def __init__(self, retry_after: int = 60):
        super().__init__(
            code="rate_limit_exceeded",
            message=f"Rate limit exceeded. Retry after {retry_after} seconds.",
            status_code=429,
        )


class EncryptionError(AppException):
    """Encryption/decryption failure."""

    def __init__(self, message: str = "Encryption operation failed"):
        super().__init__(code="encryption_error", message=message, status_code=500)


def register_exception_handlers(app: FastAPI) -> None:
    """Register global exception handlers on the FastAPI app."""

    @app.exception_handler(AppException)
    async def app_exception_handler(_request: Request, exc: AppException) -> JSONResponse:
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "error": {
                    "code": exc.code,
                    "message": exc.message,
                    "details": exc.details,
                }
            },
        )
