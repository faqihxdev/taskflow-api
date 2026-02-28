```markdown
---
name: taskflow-api
description: Work effectively in the TaskFlow API Node.js/TypeScript codebase. Use when adding or modifying Express routes, middleware, in-memory models, tests, or project configuration for the TaskFlow task management REST API.
---

# TaskFlow API Skill

## Project Snapshot
- Build and maintain a simple REST API with Express + TypeScript.
- Store data in in-memory arrays (no persistence).
- Use token-based auth via middleware.

## Conventions
- Keep routes per resource in `src/routes/`.
- Keep data access and CRUD helpers in `src/models/`.
- Keep middleware in `src/middleware/` and keep it reusable.
- Keep shared types in `src/types.ts`.
- Keep small helpers in `src/utils/`.

## File Naming Patterns
- Route modules: `src/routes/<resource>.ts`
- Model modules: `src/models/<resource>.ts`
- Middleware modules: `src/middleware/<name>.ts`
- Tests: `tests/**/*.test.ts`

## Imports
- Prefer local relative imports within `src/` to match existing style.
- Centralize shared types in `src/types.ts` and import from there instead of redefining.

## Error Handling
- Always call `next(err)` from handlers and middleware instead of sending ad-hoc error responses.
- Use the central error handler middleware for consistent API error shape.
- When touching auth, handle missing/invalid `Authorization: Bearer <token>` safely and avoid dereferencing a null match.

## Validation
- Prefer `zod` for request validation.
- Use the existing `validate` middleware helper if adding new routes or strengthening validation.
- If you add validation, keep schema definitions near the route or in a dedicated schema module.

## Key Abstractions
- Express app wiring in `src/app.ts`, entrypoint in `src/index.ts`.
- Routers mounted in `src/app.ts`.
- In-memory stores and CRUD helpers in `src/models/*`.
- Auth middleware in `src/middleware/auth.ts`.
- Central error middleware in `src/middleware/errorHandler.ts` (or equivalent).

## Tests
- Use Jest + Supertest against the Express app directly.
- Test files live under `tests/` and end with `.test.ts`.
- Run tests with:
```bash
npm test
```

## Build and Run
- Build:
```bash
npm run build
```
- Start:
```bash
npm start
```
- Dev:
```bash
npm run dev
```
- Note the current server listens on port `3000` in `src/index.ts`, but README mentions `4000`.

## Known Technical Debt to Keep in Mind
- Port mismatch between README and runtime.
- `DELETE /tasks` test expects `204`, but route returns `200` with JSON.
- Auth middleware assumes a valid Bearer token format and can throw on invalid headers.
- Validation middleware exists but is not used in routes.
- `tsconfig.json` sets `strict: false`.

## Recommended Workflow When Changing Routes
1. Update route handler and model functions together.
2. Add or update Supertest tests to cover the change.
3. Ensure error paths use `next(err)` and hit the central error handler.
4. Run `npm test` before finalizing.
```

If you want me to write this into a `SKILL.md` file in the repo, tell me where to place it.