"""White-label brand resolution middleware (Phase 2 stub)."""

from typing import Dict, Optional

from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import Response

from app.deps import get_supabase


class BrandingMiddleware(BaseHTTPMiddleware):
    """Phase 2: Resolve tenant branding from custom domain or subdomain."""

    # Default AgentStack branding
    DEFAULT_BRANDING: Dict[str, str] = {
        "logo_url": "/logo.png",
        "primary_color": "#3B82F6",
        "name": "AgentStack",
        "favicon": "/favicon.ico",
    }

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        """Resolve custom domain -> tenant_id mapping and inject branding."""
        try:
            # Get host header from request
            host = request.headers.get("host", "").split(":")[0]  # Remove port if present
            
            # Skip branding resolution for default domains and localhost
            if self._is_default_domain(host):
                request.state.branding = self.DEFAULT_BRANDING
            else:
                # Look up custom domain in organizations table
                branding = await self._resolve_custom_branding(host)
                request.state.branding = branding or self.DEFAULT_BRANDING
                
        except Exception:
            # If branding resolution fails, use default
            request.state.branding = self.DEFAULT_BRANDING
            
        response = await call_next(request)
        return response

    def _is_default_domain(self, host: str) -> bool:
        """Check if host is a default AgentStack domain."""
        default_domains = [
            "localhost",
            "127.0.0.1",
            "agentstack.dev",
            "api.agentstack.dev",
            "app.agentstack.dev",
        ]
        return any(host == domain or host.endswith(f".{domain}") for domain in default_domains)

    async def _resolve_custom_branding(self, host: str) -> Optional[Dict[str, str]]:
        """Resolve custom domain to tenant branding configuration."""
        try:
            supabase = await get_supabase()
            
            # Look up organization by custom_domain
            org_resp = (
                await supabase.table("organizations")
                .select("id, name, settings")
                .eq("custom_domain", host)
                .single()
                .execute()
            )
            
            if not org_resp.data:
                return None
                
            org = org_resp.data
            settings = org.get("settings", {})
            
            # Extract branding from organization settings
            branding = {
                "logo_url": settings.get("branding", {}).get("logo_url", self.DEFAULT_BRANDING["logo_url"]),
                "primary_color": settings.get("branding", {}).get("primary_color", self.DEFAULT_BRANDING["primary_color"]),
                "name": org.get("name", self.DEFAULT_BRANDING["name"]),
                "favicon": settings.get("branding", {}).get("favicon", self.DEFAULT_BRANDING["favicon"]),
                "custom_domain": host,
                "tenant_id": org["id"],
            }
            
            return branding
            
        except Exception:
            return None
