# CODEBASE-CONTEXT.md

## 1. Project Overview
AgentStack is an AI agent orchestration platform that allows users to build, manage, and deploy AI workflows. It features a dashboard for visual workflow creation and a robust API for execution and management.

## 2. Tech Stack
- **Frontend**: Next.js 14 (App Router), React 18, Radix UI, Tailwind CSS, Framer Motion, GSAP, Zustand (State Management), SWR (Data Fetching).
- **Backend**: FastAPI (Python 3.10+), SQLAlchemy 2.0 (Async), Alembic (Migrations), Pydantic v2.
- **Database**: Supabase (PostgreSQL) with Row Level Security (RLS).
- **Infrastructure**: Turbo Repo (Monorepo), Redis (Caching/Queues), LiteLLM (LLM Abstraction), Stripe (Billing), Sentry (Monitoring), Posthog (Analytics).
- **DevOps**: Docker, Husky, Lint-staged, Prettier, ESLint.

## 3. Folder Structure Map
- `apps/api/`: FastAPI Backend
    - `app/main.py`: Entry point
    - `app/routers/`: API route handlers (REST endpoints)
    - `app/schemas/`: Pydantic models for validation
    - `app/models/`: SQLAlchemy database models
    - `app/services/`: Business logic layer
    - `app/deps.py`: Dependency injection (Auth, DB, Redis)
    - `app/integrations/`: Third-party service integrations (Stripe, LiteLLM, etc.)
- `apps/dashboard/`: Next.js Frontend
    - `app/`: Next.js App Router (pages and layouts)
    - `components/ui/`: Shared base UI components (Radix/CVA)
    - `components/shared/`: Application-wide shared components
    - `components/[feature]/`: Feature-specific components (agents, workflows, etc.)
    - `stores/`: Zustand state stores
    - `hooks/`: Custom React hooks
    - `lib/`: Utilities and API clients
- `supabase/`: Database migrations and seed scripts
- `packages/`: Shared internal packages (if any)

## 4. Naming Conventions
- **Backend (Python)**:
    - Files/Folders: `snake_case`
    - Functions/Variables: `snake_case`
    - Classes/Models/Schemas: `PascalCase`
    - Constants: `UPPER_SNAKE_CASE`
- **Frontend (TypeScript/React)**:
    - Components: `PascalCase` (.tsx)
    - Hooks: `camelCase` (starts with `use...`)
    - Utilities: `camelCase`
    - Folders: `kebab-case` (Route groups: `(group)`)
- **API Endpoints**: RESTful conventions, `kebab-case` paths.

## 5. Coding Patterns
- **Error Handling**: 
    - Backend: Custom exceptions in `app/exceptions.py`, handled via FastAPI exception handlers.
    - Frontend: Error boundaries and Sonner toasts for user feedback.
- **Data Fetching**: 
    - Backend: Async SQLAlchemy sessions via dependency injection.
    - Frontend: SWR for client-side fetching, Server Components for initial load.
- **Component Pattern**: Radix UI + CVA (Class Variance Authority) for styling consistency.
- **Auth**: Supabase Auth integrated with FastAPI via JWT validation in `deps.py` and `@supabase/ssr` on frontend.
- **Async**: Heavy use of `async/await` in both Python and TypeScript.

## 6. Key Dependencies & Versions
- `next`: 14.1.4
- `fastapi`: 0.110.0
- `sqlalchemy`: 2.0.28
- `pydantic`: 2.6.4
- `supabase-js`: 2.42.0 (Client) / 2.4.1 (API)
- `litellm`: 1.30.7
- `turbo`: 1.13.0

## 7. Linting & Formatting
- **Prettier**: Global config in root.
- **ESLint**: Configured for Next.js and TypeScript.
- **Tailwind**: `prettier-plugin-tailwindcss` used for class sorting.
- **Imports**: `@ianvs/prettier-plugin-sort-imports` for consistent import ordering.
