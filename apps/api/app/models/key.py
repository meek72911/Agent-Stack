"""API Key model -- BYOK encrypted keys."""
import uuid
from datetime import datetime
from sqlalchemy import Text, Boolean, BigInteger, ForeignKey, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin


class ApiKey(Base, TimestampMixin):
    """BYOK API key, Fernet-encrypted at rest."""
    __tablename__ = "api_keys"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=False)
    workspace_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("client_workspaces.id"), nullable=True)
    provider: Mapped[str] = mapped_column(Text, nullable=False)
    encrypted_key: Mapped[str] = mapped_column(Text, nullable=False)
    key_hint: Mapped[str] = mapped_column(Text, nullable=False)
    label: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_valid: Mapped[bool] = mapped_column(Boolean, default=True)
    last_validated_at: Mapped[datetime | None] = mapped_column(nullable=True)
    total_tokens: Mapped[int] = mapped_column(BigInteger, default=0)
    total_cost_cents: Mapped[int] = mapped_column(BigInteger, default=0)

    __table_args__ = (
        Index("idx_api_keys_tenant_provider", "tenant_id", "provider"),
        Index("idx_api_keys_workspace", "workspace_id"),
    )
