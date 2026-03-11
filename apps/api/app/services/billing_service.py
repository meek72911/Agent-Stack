"""Billing service -- Stripe integration.

Interface boundary: BillingService
Consumers: billing router, webhook handler
Dependencies: Stripe SDK, DbSession, Settings

Handles checkout session creation, subscription lifecycle,
customer portal, webhook event processing, and usage metering.
"""

from abc import ABC, abstractmethod
from typing import Any


class BillingService(ABC):
    """Stripe billing integration for subscriptions, checkout, and metering."""

    # ── Checkout ──────────────────────────────────────────────

    @abstractmethod
    async def create_checkout_session(
        self,
        tenant_id: str,
        plan: str,
        interval: str,
        success_url: str,
        cancel_url: str,
    ) -> dict:
        """Create a Stripe Checkout Session for subscription or one-time purchase.

        Returns dict with 'checkout_url' for redirect.
        Creates Stripe customer if one does not exist for the tenant.
        """
        ...

    @abstractmethod
    async def create_portal_session(self, tenant_id: str, return_url: str) -> dict:
        """Create a Stripe Customer Portal session.

        Returns dict with 'portal_url' for redirect.
        Allows customers to manage payment methods, view invoices, cancel.
        """
        ...

    # ── Subscriptions ─────────────────────────────────────────

    @abstractmethod
    async def get_subscription(self, tenant_id: str) -> dict:
        """Get current subscription details for a tenant.

        Returns subscription status, plan, period, and computed plan limits.
        """
        ...

    @abstractmethod
    async def cancel_subscription(self, tenant_id: str, at_period_end: bool = True) -> dict:
        """Cancel a subscription, optionally at period end.

        Args:
            tenant_id: Tenant identifier.
            at_period_end: If True, cancel at end of current billing period.
        """
        ...

    @abstractmethod
    async def reactivate_subscription(self, tenant_id: str) -> dict:
        """Reactivate a subscription that was scheduled for cancellation."""
        ...

    # ── Webhooks ──────────────────────────────────────────────

    @abstractmethod
    async def handle_webhook_event(self, payload: bytes, sig_header: str) -> dict:
        """Process an incoming Stripe webhook event.

        Verifies signature, then dispatches to the appropriate handler:
        - checkout.session.completed -> provision subscription
        - invoice.paid -> extend period
        - invoice.payment_failed -> mark past_due
        - customer.subscription.updated -> sync plan changes
        - customer.subscription.deleted -> downgrade to free
        """
        ...

    # ── Usage Metering ────────────────────────────────────────

    @abstractmethod
    async def report_usage(self, tenant_id: str, quantity: int, idempotency_key: str) -> None:
        """Report metered usage to Stripe for usage-based billing.

        Args:
            tenant_id: Tenant identifier.
            quantity: Number of units consumed (e.g., execution count).
            idempotency_key: Unique key to prevent double-counting.
        """
        ...

    @abstractmethod
    async def get_plan_limits(self, plan: str) -> dict:
        """Return resource limits for a given plan tier.

        Returns dict with max_agents, max_executions, max_workspaces, etc.
        """
        ...

    # ── Internal Helpers ──────────────────────────────────────

    @abstractmethod
    async def _get_or_create_stripe_customer(self, tenant_id: str) -> str:
        """Get existing Stripe customer ID or create a new one.

        Returns the Stripe customer ID string.
        """
        ...
