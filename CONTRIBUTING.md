# Contributing to AgentStack

Thank you for your interest in contributing to AgentStack! We're building the future of AI agent orchestration and we're excited to have you join us.

## How to Contribute

1. **Find an Issue**: Browse our [issue tracker](https://github.com/agentstack/agentstack/issues) for "good first issues."
2. **Fork and Clone**: Fork the repository and clone it locally.
3. **Branch**: Create a new branch for your feature or bugfix.
4. **Develop**: Make your changes. See the [local development](#local-development) section below.
5. **Test**: Ensure all tests pass.
6. **Pull Request**: Submit a PR to the `main` branch.

## Local Development

### Prerequisites

- Node.js 20+
- Python 3.12+
- Supabase CLI
- Docker

### Setup

1. **Monorepo install**:
   ```bash
   npm install
   ```

2. **Backend Setup**:
   ```bash
   cd apps/api
   python -m venv venv
   source venv/bin/activate # or venv\Scripts\activate on Windows
   pip install -r requirements.txt
   ```

3. **Frontend Setup**:
   ```bash
   cd apps/dashboard
   cp .env.example .env.local
   ```

4. **Run Dev**:
   ```bash
   npm run dev
   ```

## Development Standards

- **Python**: Follow PEP 8. Use type hints for everything.
- **TypeScript**: No `any`. Use strict typing and Functional Components with Hooks.
- **Tailwind**: Use Shadcn/UI primitives wherever possible.
- **Git**: Use semantic commit messages (e.g., `feat:`, `fix:`, `docs:`, `style:`).

## Questions?

Join our [Discord](https://discord.gg/agentstack) or open a Discussion on GitHub.

---

By contributing, you agree that your contributions will be licensed under the [AGPL-3.0 License](LICENSE).
