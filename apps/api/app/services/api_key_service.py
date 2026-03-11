"""API Key service -- BYOK key generation, rotation, Fernet encryption.

Interface boundary: APIKeyService
Consumers: api_keys router, execution service
Dependencies: DbSession, Settings (encryption_key)

Manages BYOK (Bring Your Own Key) API keys with Fernet symmetric
encryption at rest. Keys are never stored in plaintext.
"""

from abc import ABC, abstractmethod


class APIKeyService(ABC):
    """BYOK API key management with Fernet encryption."""

    @abstractmethod
    async def list_keys(
        self,
        tenant_id: str,
        workspace_id: str | None = None,
        provider: str | None = None,
        limit: int = 25,
        offset: int = 0,
    ) -> dict:
        """List API keys for a tenant. Keys are masked in response."""
        ...

    @abstractmethod
    async def store_key(self, tenant_id: str, data: dict) -> dict:
        """Store a new API key with Fernet encryption.

        Generates a key_hint (first 4 + last 4 chars with mask).
        Encrypts the full key using the app encryption_key.
        Optionally validates the key against the provider API.
        """
        ...

    @abstractmethod
    async def get_key(self, tenant_id: str, key_id: str) -> dict:
        """Get API key metadata (never the decrypted key).

        Raises NotFoundError if key does not exist or belongs to another tenant.
        """
        ...

    @abstractmethod
    async def rotate_key(self, tenant_id: str, key_id: str, new_api_key: str) -> dict:
        """Rotate an API key -- replace with a new encrypted value.

        Updates encrypted_key and key_hint. Resets validation timestamp.
        """
        ...

    @abstractmethod
    async def delete_key(self, tenant_id: str, key_id: str) -> None:
        """Permanently delete an API key. Hard delete -- not recoverable."""
        ...

    @abstractmethod
    async def decrypt_key(self, tenant_id: str, key_id: str) -> str:
        """Decrypt and return the raw API key.

        INTERNAL USE ONLY -- called by execution service when making LLM calls.
        Never exposed via API endpoints.
        """
        ...

    @abstractmethod
    async def validate_key(self, tenant_id: str, key_id: str) -> dict:
        """Validate an API key against the provider.

        Makes a minimal API call (e.g., list models) to confirm the key works.
        Updates last_validated_at and is_valid fields.
        Returns validation result dict.
        """
        ...

    @abstractmethod
    async def _encrypt(self, plaintext: str) -> str:
        """Encrypt a string using Fernet symmetric encryption.

        Uses the ENCRYPTION_KEY from settings.
        Returns base64-encoded ciphertext.
        """
        ...

    @abstractmethod
    async def _decrypt(self, ciphertext: str) -> str:
        """Decrypt a Fernet-encrypted string.

        Returns the original plaintext.
        Raises EncryptionError if decryption fails.
        """
        ...

    @staticmethod
    def _make_hint(key: str) -> str:
        """Generate a masked key hint: first 4 chars + '...' + last 4 chars.

        Example: 'sk-abc...xQ2z'
        """
        if len(key) <= 8:
            return key[:2] + "..." + key[-2:]
        return key[:4] + "..." + key[-4:]
