**CODEBASE_CONTEXT.md**

**Project Purpose**  
TaskFlow API is a simple task management REST API built with Node.js, TypeScript, and Express. It exposes `/health`, `/tasks`, and `/users` endpoints with basic in-memory storage and token-based auth.

**Tech Stack**  
- Language: TypeScript (Node.js runtime)  
- Framework: Express  
- Key dependencies: `express`, `uuid`, `zod`  
- Dev/test: `jest`, `ts-jest`, `supertest`, `ts-node`, `ts-node-dev`, `typescript`

**Directory Structure Overview**  
- `src/` application code  
- `src/app.ts` Express app setup and middleware wiring  
- `src/index.ts` server entrypoint (listens on port 3000)  
- `src/routes/` HTTP routes (`health`, `tasks`, `users`)  
- `src/models/` in-memory data stores and CRUD helpers  
- `src/middleware/` auth, error handler, and validation helpers  
- `src/utils/` small helpers and logger  
- `tests/` Jest + Supertest integration tests  
- `jest.config.js` Jest configuration  
- `tsconfig.json` TypeScript config  
- `package.json` scripts and dependencies  
- CI config: none found (no `.github/`, `.gitlab/`, `.circleci/`, or `.azure-pipelines/`)

**How to Run Tests**  
- `npm test` (runs Jest with `ts-jest` on `tests/**/*.test.ts`)

**How to Build/Start**  
- Build: `npm run build` (TypeScript compile to `dist/`)  
- Start: `npm start` (runs `ts-node src/index.ts`)  
- Dev: `npm run dev` (ts-node-dev with respawn)  
- Note: The server listens on port `3000` (see `src/index.ts`).

**Key Patterns and Conventions**  
- Express routers per resource, mounted in `src/app.ts`  
- In-memory arrays in `src/models/*` with simple CRUD functions  
- Lightweight token auth via `authMiddleware`  
- Central error handler middleware  
- Tests use Supertest against the Express app directly  
- Types centralized in `src/types.ts`

**Areas of Complexity or Technical Debt**  
- Test mismatch: `DELETE /tasks` test expects `204`, but route returns `200` with a JSON body.  
- Auth middleware assumes `Authorization` header matches `Bearer ...` and dereferences `match[1]` without null check (can throw).  
- Validation middleware exists (`validate`) but is not used in routes; payloads are not validated.  
- In-memory storage means data is lost on restart; no persistence layer.  
- `tsconfig.json` has `strict: false`, reducing type safety.  
- Debug `console.log` statements in task routes.
