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

The server will start on **http://localhost:3000**.

### Testing

```bash
npm test
```

## Authentication

All endpoints except `/health` require a Bearer token:

```
Authorization: Bearer test-token-123
```

## API Documentation

Base URL: `http://localhost:3000`

Error responses use:

```json
{ "error": "message", "details": "optional stack or details" }
```

### GET /health

Response `200`:

```json
{
  "status": "ok",
  "uptime": 123.45
}
```

### GET /tasks

Optional query: `status` (`todo`, `in_progress`, `done`)

Response `200`:

```json
[
  {
    "id": "3c0d8b60-6c3b-4eb0-9b89-5b7a3fe7b2b1",
    "title": "Write docs",
    "description": "Add API documentation",
    "status": "todo",
    "assignee": "sam"
  }
]
```

### GET /tasks/:id

Response `200`:

```json
{
  "id": "3c0d8b60-6c3b-4eb0-9b89-5b7a3fe7b2b1",
  "title": "Write docs",
  "description": "Add API documentation",
  "status": "todo",
  "assignee": "sam"
}
```

### POST /tasks

Request body:

```json
{
  "title": "Write docs",
  "description": "Add API documentation",
  "assignee": "sam"
}
```

Response `201`:

```json
{
  "id": "3c0d8b60-6c3b-4eb0-9b89-5b7a3fe7b2b1",
  "title": "Write docs",
  "description": "Add API documentation",
  "status": "todo",
  "assignee": "sam"
}
```

### PUT /tasks/:id

Request body (partial updates allowed):

```json
{
  "status": "in_progress",
  "assignee": "sam"
}
```

Response `200`:

```json
{
  "id": "3c0d8b60-6c3b-4eb0-9b89-5b7a3fe7b2b1",
  "title": "Write docs",
  "description": "Add API documentation",
  "status": "in_progress",
  "assignee": "sam"
}
```

### DELETE /tasks/:id

Response `200`:

```json
{ "message": "Task deleted" }
```

### GET /users

Response `200`:

```json
[
  {
    "id": "1b2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
    "name": "Alex Doe",
    "email": "alex@example.com",
    "role": "member"
  }
]
```

### GET /users/:id

Response `200`:

```json
{
  "id": "1b2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
  "name": "Alex Doe",
  "email": "alex@example.com",
  "role": "member"
}
```

### POST /users

Request body:

```json
{
  "name": "Alex Doe",
  "email": "alex@example.com",
  "role": "member"
}
```

Response `201`:

```json
{
  "id": "1b2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
  "name": "Alex Doe",
  "email": "alex@example.com",
  "role": "member"
}
```

## License

MIT
