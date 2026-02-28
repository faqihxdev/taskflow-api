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

## License

MIT
