"""Application configuration via pydantic-settings.

Loads from environment variables and .env file.
All env vars are documented in the root .env.example.
"""

from functools import lru_cache

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """AgentStack API settings -- single source of truth for all configuration."""

    # -- App --
    node_env: str = "development"
    app_name: str = "AgentStack"
    app_url: str = "https://your-app-name.vercel.app"
    api_url: str = "https://your-api-name.onrender.com"
    debug: bool = False
    log_level: str = "info"
    cors_origins: str = "https://your-app-name.vercel.app,http://localhost:3000,http://localhost:3002"

    # -- Database (Supabase Postgres) --
    database_url: str = ""
    database_pool_size: int = 10
    database_max_overflow: int = 20

    # -- Supabase --
    supabase_url: str = ""
    supabase_anon_key: str = ""
    supabase_service_role_key: str = ""
    supabase_jwt_secret: str = ""

    # -- Redis / Upstash --
    redis_url: str = "redis://localhost:6379"
    upstash_redis_rest_url: str = ""
    upstash_redis_rest_token: str = ""

    # -- Stripe --
    stripe_secret_key: str = ""
    stripe_webhook_secret: str = ""
    stripe_price_pro_monthly: str = ""
    stripe_price_pro_annual: str = ""
    stripe_price_team_monthly: str = ""
    stripe_price_team_annual: str = ""

    # -- Storage (R2/S3) --
    r2_account_id: str = ""
    r2_access_key_id: str = ""
    r2_secret_access_key: str = ""
    r2_bucket_name: str = "agentstack-uploads"

    # -- LiteLLM --
    litellm_master_key: str = ""

    # -- OAuth --
    google_client_id: str = ""
    google_client_secret: str = ""
    github_client_id: str = ""
    github_client_secret: str = ""

    # -- Observability --
    sentry_dsn: str = ""
    posthog_api_key: str = ""
    posthog_host: str = "https://app.posthog.com"

    # -- Auth/Encryption --
    jwt_secret: str = ""
    encryption_key: str = ""

    # -- Email --
    resend_api_key: str = ""
    email_from: str = "noreply@agentstack.dev"

    # -- Server --
    api_host: str = "0.0.0.0"
    api_port: int = 8000

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False


@lru_cache
def get_settings() -> Settings:
    """Return cached settings instance."""
    return Settings()
