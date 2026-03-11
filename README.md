# AgentStack

> **Workflows first. Agents underneath.**  
> The open-source AI orchestrator for agencies and developers. Build, debug, and deploy multi-agent workflows in minutes.

AgentStack lets you build production-ready AI workflows by bringing your own API keys (BYOK). Choose from 82 specialist agents or build your own specialist teams.

## 🚀 Key Features

- **Workflow-First Design**: Users interact with goal-oriented workflows; AgentStack handles the complex multi-agent orchestration internally.
- **BYOK (Bring Your Own Key)**: Support for OpenAI, Anthropic, Gemini, Groq, and more via LiteLLM.
- **Observability**: Step-by-step execution timeline, token usage, and cost tracking.
- **Agency Ready**: Multitenant workspaces, usage reports, and workflow cloning.
- **Self-Hostable**: Single `docker-compose up` to run your own instances.

## Architecture

```
agentstack/
├── apps/
│   ├── api/           # FastAPI backend (Python 3.12+)
│   └── dashboard/     # Next.js 14 frontend (TypeScript)
├── packages/
│   ├── shared-types/  # TypeScript types shared across apps
│   ├── plugin-sdk/    # Agent plugin development kit
│   └── ui/            # Shared UI primitives
├── supabase/
│   ├── config.toml    # Local Supabase config
│   ├── migrations/    # Database schema migrations
│   └── seed.sql       # Seed data (plans, templates)
└── infrastructure/
    ├── docker-compose.yml
    └── Dockerfile.*
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion, Zustand |
| Backend | FastAPI, Python 3.12+, Pydantic v2, async/await |
| Database | Supabase (PostgreSQL 15), Row-Level Security |
| Cache | Redis (rate limiting, sessions, pub/sub via BullMQ) |
| Auth | Supabase Auth (JWT, OAuth: GitHub, Google) |
| Payments | Stripe (subscriptions, usage-based billing) |
| Storage | Cloudflare R2 (zero egress) |
| Infra | Docker, Railway, Turborepo |

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm 8+
- Python 3.12+
- Docker (for local Supabase)

### Setup

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env

# Start local Supabase
npx supabase start

# Run database migrations
npx supabase db reset

# Start development servers
pnpm dev
```

This starts:
- Dashboard: http://localhost:3000
- API: http://localhost:8000
- Supabase Studio: http://localhost:54323

### Development Commands

```bash
pnpm dev          # Start all services
pnpm build        # Build all packages and apps
pnpm lint         # Lint entire monorepo
pnpm typecheck    # TypeScript type checking
pnpm clean        # Clean all build artifacts
```

## Plans & Pricing

| Feature | Free | Pro ($49/mo) | Team ($149/mo) |
|---------|------|-------------|---------------|
| Agents | 3 | Unlimited | Unlimited |
| Workflows | 2 | 50 | Unlimited |
| Workspaces | 1 | 5 | Unlimited |
| White-label | No | No | Yes (v1.2) |
| Support | Community | Priority | 24/7 Dedicated |

## Project Structure

### API (`apps/api/`)

- `app/routers/` -- FastAPI route handlers
- `app/services/` -- Business logic layer (Orchestration Engine, R2 Service)
- `app/schemas/` -- Pydantic request/response models
- `app/middleware/` -- Auth, rate limiting, plan enforcement

### Dashboard (`apps/dashboard/`)

- `app/` -- Next.js App Router pages
- `components/` -- React components (Workflows, Agents, Billing)
- `stores/` -- Zustand state management
- `hooks/` -- Custom React hooks
- `lib/` -- Utilities and API client (Supabase SSR)

## License

GNU Affero General Public License v3.0 (AGPL-3.0). See [LICENSE](LICENSE) for more information.
Copyright (c) 2026 AgentStack LLC.
