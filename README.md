# TaskFlow API

A simple task management REST API built with Node.js, TypeScript, and Express.

## Getting Started

### Prerequisites

- Node.js 18+

### Installation

```bash
npm install
```

### Running

```bash
npm start
```

The server will start on **http://localhost:4000**.

### Testing

```bash
npm test
```

## Authentication

All endpoints except `/health` require a Bearer token:

```
Authorization: Bearer test-token-123
```

## API

Base URL: `http://localhost:4000`

Error responses follow this shape (with `details` included outside production):

```json
{
  "error": "Message",
  "details": "Optional stack or details"
}
```

### GET /health

Health check with server uptime.

Auth: Not required.

Request:

```bash
curl http://localhost:4000/health
```

Response:

```json
{
  "status": "ok",
  "uptime": 123.456
}
```

### GET /tasks

List all tasks, optionally filtered by status.

Auth: Required.
Query params: `status` (optional, case-insensitive: `todo`, `in_progress`, `done`).

Request:

```bash
curl "http://localhost:4000/tasks?status=done" -H "Authorization: Bearer test-token-123"
```

Response:

```json
[
  {
    "id": "c1b5f4c1-2cf6-4a52-99d5-1c2f612d0e48",
    "title": "Ship API docs",
    "description": "Add README examples",
    "status": "done",
    "assignee": "ada@example.com"
  }
]
```

### GET /tasks/:id

Fetch a single task by id.

Auth: Required.

Request:

```bash
curl http://localhost:4000/tasks/3f2e8a2f-5c8a-4b23-8a4b-8b938f8f24a1 -H "Authorization: Bearer test-token-123"
```

Response:

```json
{
  "id": "3f2e8a2f-5c8a-4b23-8a4b-8b938f8f24a1",
  "title": "Draft release notes",
  "description": "Summarize changes",
  "status": "todo",
  "assignee": "ada@example.com"
}
```

### POST /tasks

Create a new task.

Auth: Required.
Request body: `title` (string, required), `description` (string, optional), `assignee` (string, optional).

Request:

```bash
curl http://localhost:4000/tasks \
  -H "Authorization: Bearer test-token-123" \
  -H "Content-Type: application/json" \
  -d '{"title":"Write API docs","description":"Add README examples","assignee":"ada@example.com"}'
```

Response:

```json
{
  "id": "8e9c0d5e-3b1c-4f73-b24b-3a18c8b7a2f0",
  "title": "Write API docs",
  "description": "Add README examples",
  "status": "todo",
  "assignee": "ada@example.com"
}
```

### PUT /tasks/:id

Update a task (partial updates are allowed).

Auth: Required.
Request body: any of `title`, `description`, `status`, `assignee`.

Request:

```bash
curl http://localhost:4000/tasks/8e9c0d5e-3b1c-4f73-b24b-3a18c8b7a2f0 \
  -X PUT \
  -H "Authorization: Bearer test-token-123" \
  -H "Content-Type: application/json" \
  -d '{"status":"in_progress"}'
```

Response:

```json
{
  "id": "8e9c0d5e-3b1c-4f73-b24b-3a18c8b7a2f0",
  "title": "Write API docs",
  "description": "Add README examples",
  "status": "in_progress",
  "assignee": "ada@example.com"
}
```

### DELETE /tasks/:id

Delete a task by id.

Auth: Required.

Request:

```bash
curl -X DELETE http://localhost:4000/tasks/8e9c0d5e-3b1c-4f73-b24b-3a18c8b7a2f0 \
  -H "Authorization: Bearer test-token-123"
```

Response (204 No Content): empty body.

Error example (404):

```json
{
  "error": "Task not found"
}
```

### GET /users

List all users.

Auth: Required.

Request:

```bash
curl http://localhost:4000/users -H "Authorization: Bearer test-token-123"
```

Response:

```json
[
  {
    "id": "a8b1d0af-7c1b-4c9a-a0db-9c5c0bb0c8c9",
    "name": "Ada Lovelace",
    "email": "ada@example.com",
    "role": "admin"
  }
]
```

### GET /users/:id

Fetch a single user by id.

Auth: Required.

Request:

```bash
curl http://localhost:4000/users/a8b1d0af-7c1b-4c9a-a0db-9c5c0bb0c8c9 -H "Authorization: Bearer test-token-123"
```

Response:

```json
{
  "id": "a8b1d0af-7c1b-4c9a-a0db-9c5c0bb0c8c9",
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "role": "admin"
}
```

### POST /users

Create a new user.

Auth: Required.
Request body: `name` (string, required), `email` (string, required, valid email), `role` (optional: `admin` or `member`).

Request:

```bash
curl http://localhost:4000/users \
  -H "Authorization: Bearer test-token-123" \
  -H "Content-Type: application/json" \
  -d '{"name":"Ada Lovelace","email":"ada@example.com","role":"admin"}'
```

Response:

```json
{
  "id": "a8b1d0af-7c1b-4c9a-a0db-9c5c0bb0c8c9",
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "role": "admin"
}
```

Error example (400):

```json
{
  "error": "Validation failed",
  "details": "Email must be valid"
}
```

## License

MIT
