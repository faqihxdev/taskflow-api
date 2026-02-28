# CODEBASE_CONTEXT.md

## 1) Project purpose
TaskFlow API is a simple task management REST API built with Node.js, TypeScript, and Express. It exposes health, user, and task endpoints with a basic Bearer-token authentication requirement (except `/health`).

## 2) Tech stack
- **Runtime:** Node.js 18+
- **Language:** TypeScript
- **Web framework:** Express 4
- **Validation:** Zod
- **IDs:** uuid
- **Testing:** Jest + Supertest
- **Dev tooling:** ts-node, ts-node-dev, ts-jest

## 3) Directory structure overview
- `src/`
  - `index.ts`: likely server entrypoint (bootstraps app + listens on port)
  - `app.ts`: likely Express app configuration (middleware + routes)
  - `routes/`
    - `health.ts`: `/health` endpoint (no auth)
    - `users.ts`: user-related endpoints
    - `tasks.ts`: task-related endpoints
    - `types.ts`: shared route/request typing helpers
  - `middleware/`
    - `auth.ts`: Bearer token auth (README indicates `test-token-123`)
    - `validate.ts`: request validation (likely Zod-based)
    - `errorHandler.ts`: centralized error handling middleware
  - `models/`
    - `user.ts`, `task.ts`: domain models (likely in-memory or simple structures)
  - `utils/`
    - `logger.ts`: logging utility
    - `helpers.ts`: shared helper functions
- `tests/`
  - `health.test.ts`, `users.test.ts`, `tasks.test.ts`: integration-style tests via Supertest
- Root config/docs
  - `README.md`, `jest.config.js`, `tsconfig.json`, `DIRECTIVES.md`

## 4) How to run tests and build
- **Install**
  ```bash
  npm install
  ```
- **Run (dev)**
  ```bash
  npm start
  # or
  npm run dev
  ```
- **Build**
  ```bash
  npm run build
  ```
- **Test**
  ```bash
  npm test
  ```

## 5) Key patterns and conventions
- **Express app composition:** `app.ts` likely wires middleware (auth/validation/error handling) and mounts route modules; `index.ts` likely starts the HTTP listener.
- **Middleware-driven concerns:**
  - Auth enforced globally except `/health`.
  - Validation middleware likely wraps Zod schemas for body/query/params.
  - Central `errorHandler` for consistent error responses.
- **Route modularization:** each resource has its own route module under `src/routes`.
- **Testing style:** Supertest-based endpoint tests; Jest configured to force exit and detect open handles (suggests potential lingering server handles if not managed carefully).
- **TypeScript configuration:** `strict: false` (looser typing), CommonJS output, build emits declarations.

## 6) Areas of complexity or technical debt
- **Authentication is simplistic/static:** a hardcoded Bearer token (`test-token-123`) is suitable for demos/tests but not production; no user/session management.
- **Type safety is reduced:** `strict: false` increases risk of runtime errors and weakens refactoring guarantees.
- **Potential in-memory persistence:** presence of `models/` without any DB dependencies suggests data may be stored in memory; this can cause test coupling, non-determinism, and no durability.
- **Test runner flags indicate lifecycle issues:** `--forceExit` often masks open handles (e.g., server not closed, timers, lingering connections). This can hide real resource-management problems.
- **Error/validation consistency risk:** if validation and error handling aren’t uniformly applied across routes, response shapes and status codes may drift (worth verifying across `users`/`tasks` routes).