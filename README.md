# AgentStack

> **Workflows first. Agents underneath.**  
> The open-source AI orchestrator for agencies and developers. Build, debug, and deploy multi-agent workflows in minutes.

AgentStack lets you build production-ready AI workflows by bringing your own API keys (BYOK). Choose from 82 specialist agents or build your own specialist teams.

## 🚀 Key Features

- **Workflow-First Design**: Users interact with goal-oriented workflows; AgentStack handles the complex multi-agent orchestration internally.
- **BYOK (Bring Your Own Key)**: Support for OpenAI, Anthropic, Gemini, Groq, and more via LiteLLM.
- **SSE Streaming**: Real-time token-by-token streaming for a snappy UI experience.
- **RAG & File Support**: Upload PDFs, Docx, or text files to ground your agents in custom data.
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
│   └── seeds/         # Seed data (plans, 82 agent templates)
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
| Infra | Docker, Railway, Render, Turborepo |

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm 8+
- Python 3.12+
- Docker (for local Supabase/Redis)

### Local Setup

```bash
# Install dependencies
pnpm install

# Setup Backend Environment
cd apps/api
cp .env.example .env

# Setup Frontend Environment
cd ../dashboard
cp .env.example .env.local

# Start development servers (from root)
cd ../..
pnpm dev
```

This starts:
- Dashboard: http://localhost:3000
- API: http://localhost:8000
- Supabase Studio: http://localhost:54323

### Deployment

AgentStack is designed to be deployed on **Vercel** (Frontend), **Render/Railway** (Backend), and **Supabase** (Database).

1. **Database**: Push migrations to Supabase using `npx supabase db push`.
2. **Backend**: Deploy `apps/api` to Render. Ensure `DATABASE_URL` and `SUPABASE_SECRET_KEY` are set.
3. **Frontend**: Deploy `apps/dashboard` to Vercel.

## Project Structure

### API (`apps/api/`)

- `app/routers/` -- FastAPI route handlers (Auth, Agents, Workflows, Executions, Files)
- `app/services/` -- Business logic layer (Orchestration Engine, R2 Service, File Extractor)
- `app/schemas/` -- Pydantic request/response models
- `app/middleware/` -- Auth, rate limiting, plan enforcement

### Dashboard (`apps/dashboard/`)

- `app/` -- Next.js App Router pages
- `components/` -- React components (Workflows UI, Agent Builder, Command Palette)
- `stores/` -- Zustand state management
- `hooks/` -- Custom React hooks for data fetching (SWR)
- `lib/` -- Utilities and API client (Supabase SSR)

## License

GNU Affero General Public License v3.0 (AGPL-3.0). See [LICENSE](LICENSE) for more information.
Copyright (c) 2026 AgentStack LLC.
