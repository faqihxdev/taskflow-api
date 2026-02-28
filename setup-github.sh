#!/bin/bash
set -e

REPO_NAME="taskflow-api"

echo "=== Creating GitHub repository ==="
gh repo create "$REPO_NAME" --public --source=. --push --description "Task management REST API — demo repo for The Living Repo"

echo ""
echo "=== Creating labels ==="
gh label create "priority:critical" --color "B60205" --description "Critical priority" --force
gh label create "priority:high"     --color "D93F0B" --description "High priority"     --force
gh label create "priority:medium"   --color "FBCA04" --description "Medium priority"   --force
gh label create "priority:low"      --color "0E8A16" --description "Low priority"      --force
gh label create "security"          --color "EE0701" --description "Security issue"    --force
gh label create "feature"           --color "1D76DB" --description "New feature"       --force
gh label create "test"              --color "BFD4F2" --description "Testing"           --force
gh label create "chore"             --color "C5DEF5" --description "Maintenance"       --force
gh label create "docs"              --color "0075CA" --description "Documentation"     --force
gh label create "living-repo"       --color "7057FF" --description "Automated PR"      --force

echo ""
echo "=== Creating issues ==="

gh issue create \
  --title "Task status filter is case-sensitive" \
  --label "bug,priority:high" \
  --body "## Description
The \`GET /tasks?status=\` filter uses strict equality (\`===\`) instead of case-insensitive comparison.

## Steps to Reproduce
1. Create a task (status defaults to \`todo\`)
2. \`GET /tasks?status=TODO\` — returns empty array
3. \`GET /tasks?status=todo\` — returns the task

## Expected Behavior
The status filter should be case-insensitive. \`?status=TODO\`, \`?status=Todo\`, and \`?status=todo\` should all return the same results.

## Location
\`src/routes/tasks.ts\` — GET \`/\` handler"

gh issue create \
  --title "DELETE /tasks returns 200 instead of 204" \
  --label "bug,priority:medium" \
  --body "## Description
The DELETE endpoint for tasks returns \`200 OK\` with a JSON body instead of \`204 No Content\`.

## Expected Behavior
A successful DELETE should return status \`204\` with no response body, following REST conventions.

## Current Behavior
Returns \`200\` with \`{ message: 'Task deleted' }\`.

## Location
\`src/routes/tasks.ts\` — DELETE \`/:id\` handler"

gh issue create \
  --title "Error handler leaks stack traces in production" \
  --label "bug,security,priority:high" \
  --body "## Description
The global error handler always includes \`error.stack\` in the JSON response, regardless of the environment. This leaks internal implementation details in production.

## Expected Behavior
Stack traces should only be included when \`NODE_ENV !== 'production'\`. In production, the \`details\` field should be omitted or show a generic message.

## Security Impact
Attackers can use stack traces to understand internal code structure, file paths, and dependencies.

## Location
\`src/middleware/errorHandler.ts\`"

gh issue create \
  --title "POST /tasks has no input validation" \
  --label "bug,priority:high" \
  --body "## Description
The \`POST /tasks\` endpoint accepts any request body without validation. You can create a task with no title, with \`title: 123\`, or with completely invalid data.

## Expected Behavior
Request body should be validated using zod:
- \`title\` — required string, non-empty
- \`description\` — optional string
- \`assignee\` — optional string

Invalid requests should return \`400\` with a structured error response.

## Notes
A \`validate\` middleware already exists at \`src/middleware/validate.ts\` but is not used on this route.

## Location
\`src/routes/tasks.ts\` — POST \`/\` handler"

gh issue create \
  --title "Duplicate user emails allowed" \
  --label "bug,priority:medium" \
  --body "## Description
\`POST /users\` allows creating multiple users with the same email address. There is no uniqueness check.

## Steps to Reproduce
1. \`POST /users\` with \`{ name: 'Alice', email: 'alice@test.com', role: 'member' }\`
2. \`POST /users\` again with \`{ name: 'Bob', email: 'alice@test.com', role: 'member' }\`
3. Both succeed with \`201\`

## Expected Behavior
The second request should return \`409 Conflict\` with an error message indicating the email is already in use.

## Location
\`src/routes/users.ts\` — POST \`/\` handler, \`src/models/user.ts\`"

gh issue create \
  --title "GET /tasks/:id returns 500 for non-existent task" \
  --label "bug,priority:high" \
  --body "## Description
When requesting a task by ID that doesn't exist, the server returns \`500 Internal Server Error\` instead of \`404 Not Found\`.

## Steps to Reproduce
\`GET /tasks/nonexistent-id\` with a valid auth token.

## Expected Behavior
Should return \`404\` with \`{ error: 'Task not found' }\`.

## Current Behavior
Returns \`500\` because the code tries to access properties on an undefined task object.

## Location
\`src/routes/tasks.ts\` — GET \`/:id\` handler"

gh issue create \
  --title "Auth middleware crashes on empty Bearer token" \
  --label "bug,security,priority:critical" \
  --body "## Description
If the \`Authorization\` header is \`\"Bearer \"\` (with an empty token) or \`\"Bearer\"\` (no space), the auth middleware throws an unhandled \`TypeError\` instead of returning \`401\`.

## Steps to Reproduce
Send a request with header \`Authorization: Bearer \` (note the trailing space, empty token).

## Expected Behavior
Should return \`401 Unauthorized\` with \`{ error: 'Invalid token' }\`.

## Current Behavior
Crashes with \`TypeError: Cannot read properties of null (reading '1')\` because the regex match fails and returns \`null\`.

## Security Impact
This allows attackers to crash route handlers by sending malformed auth headers.

## Location
\`src/middleware/auth.ts\`"

gh issue create \
  --title "Add PATCH /tasks/:id/status endpoint" \
  --label "feature,priority:medium" \
  --body "## Description
There's currently no way to update just the status of a task. A dedicated endpoint would be cleaner than using PUT to update the entire task.

## Requirements
- \`PATCH /tasks/:id/status\`
- Request body: \`{ status: \"todo\" | \"in_progress\" | \"done\" }\`
- Validate the status value using zod
- Return the updated task
- Return \`404\` if task not found
- Return \`400\` if status is invalid

## Location
\`src/routes/tasks.ts\`"

gh issue create \
  --title "Add pagination to GET /tasks" \
  --label "feature,priority:medium" \
  --body "## Description
\`GET /tasks\` currently returns all tasks with no pagination. As the task list grows, this will become a performance issue.

## Requirements
- Add \`?page=1&limit=10\` query parameters
- Default: \`page=1\`, \`limit=10\`
- Response should include pagination metadata:
\`\`\`json
{
  \"data\": [...],
  \"pagination\": {
    \"page\": 1,
    \"limit\": 10,
    \"total\": 42,
    \"totalPages\": 5
  }
}
\`\`\`
- Should work alongside existing \`?status=\` filter

## Location
\`src/routes/tasks.ts\` — GET \`/\` handler"

gh issue create \
  --title "Add created_at and updated_at timestamps to tasks" \
  --label "feature,priority:low" \
  --body "## Description
Tasks currently have no timestamps. Adding \`created_at\` and \`updated_at\` fields would enable sorting by recency and tracking when tasks were last modified.

## Requirements
- Add \`created_at: string\` (ISO 8601) — set when task is created
- Add \`updated_at: string\` (ISO 8601) — set on creation and updated on every modification
- Update the \`Task\` interface in \`src/types.ts\`
- Update \`POST /tasks\` to set both timestamps
- Update \`PUT /tasks/:id\` to update \`updated_at\`

## Location
\`src/types.ts\`, \`src/routes/tasks.ts\`, \`src/models/task.ts\`"

gh issue create \
  --title "Add search/filter by task title" \
  --label "feature,priority:low" \
  --body "## Description
There's no way to search for tasks by title. Adding a search parameter would help users find specific tasks.

## Requirements
- \`GET /tasks?search=keyword\` — filter tasks where title contains the keyword
- Search should be case-insensitive
- Should work alongside existing \`?status=\` filter
- Empty search string should return all tasks

## Location
\`src/routes/tasks.ts\` — GET \`/\` handler"

gh issue create \
  --title "Add request logging middleware" \
  --label "feature,priority:medium" \
  --body "## Description
There is no request logging in the application. Adding logging middleware would help with debugging and monitoring.

## Requirements
- Log format: \`METHOD /path STATUS TIME_MS\` (e.g., \`GET /tasks 200 12ms\`)
- Log all requests, not just errors
- Use the existing logger utility at \`src/utils/logger.ts\`
- Add as middleware in \`src/app.ts\`

## Location
New file: \`src/middleware/requestLogger.ts\`, update \`src/app.ts\`"

gh issue create \
  --title "No tests for user routes" \
  --label "test,priority:medium" \
  --body "## Description
\`tests/users.test.ts\` exists but only contains placeholder \`test.todo(...)\` entries. No actual tests exist for the user endpoints.

## Requirements
Add tests for:
- \`GET /users\` — returns empty array initially
- \`POST /users\` — creates a user and returns 201
- \`GET /users/:id\` — returns user by ID
- \`GET /users/:id\` — returns 404 for non-existent user

## Location
\`tests/users.test.ts\`"

gh issue create \
  --title "Task creation test doesn't validate response shape" \
  --label "test,priority:low" \
  --body "## Description
The POST /tasks test only asserts \`status 201\` but doesn't verify the response body structure.

## Current Test
\`\`\`typescript
it('should create a task', async () => {
  const res = await request(app)
    .post('/tasks')
    .set(AUTH_HEADER)
    .send({ title: 'Test task', description: 'A test' });
  expect(res.status).toBe(201);
});
\`\`\`

## Expected
The test should also verify:
- \`res.body.id\` is defined (string)
- \`res.body.title\` equals \`'Test task'\`
- \`res.body.status\` equals \`'todo'\`
- \`res.body.description\` equals \`'A test'\`

## Location
\`tests/tasks.test.ts\`"

gh issue create \
  --title "No test for 404 on missing task" \
  --label "test,priority:medium" \
  --body "## Description
There is no test that verifies \`GET /tasks/:id\` returns 404 when the task doesn't exist. This is currently a bug (returns 500), and a test should be added to verify correct behavior after the fix.

## Requirements
Add a test:
\`\`\`typescript
it('should return 404 for non-existent task', async () => {
  const res = await request(app)
    .get('/tasks/nonexistent-id')
    .set(AUTH_HEADER);
  expect(res.status).toBe(404);
  expect(res.body.error).toBe('Task not found');
});
\`\`\`

## Location
\`tests/tasks.test.ts\`"

gh issue create \
  --title "README shows wrong port number" \
  --label "docs,priority:low" \
  --body "## Description
The README states the server runs on \`http://localhost:4000\` but it actually runs on port \`3000\`.

## Location
\`README.md\`"

gh issue create \
  --title "README missing API endpoint documentation" \
  --label "docs,priority:low" \
  --body "## Description
The README has no API documentation. Users have to read the source code to understand the available endpoints.

## Requirements
Add a section documenting all endpoints:
- \`GET /health\` — Health check
- \`GET /tasks\` — List tasks (with query params)
- \`GET /tasks/:id\` — Get task by ID
- \`POST /tasks\` — Create task
- \`PUT /tasks/:id\` — Update task
- \`DELETE /tasks/:id\` — Delete task
- \`GET /users\` — List users
- \`GET /users/:id\` — Get user by ID
- \`POST /users\` — Create user

Include request/response examples.

## Location
\`README.md\`"

gh issue create \
  --title "Remove debug console.log statements from tasks route" \
  --label "chore,priority:low" \
  --body "## Description
\`src/routes/tasks.ts\` contains leftover \`console.log(\"debug:\", ...)\` statements that should be removed before production.

## Locations
- Line with \`console.log(\"debug:\", tasks)\` in GET /tasks handler
- Line with \`console.log(\"debug: creating task\", req.body)\` in POST /tasks handler

## Location
\`src/routes/tasks.ts\`"

gh issue create \
  --title "Add .env support for configurable PORT" \
  --label "chore,priority:medium" \
  --body "## Description
The server port is hardcoded to \`3000\` in \`src/index.ts\`. It should read from \`process.env.PORT\` with a fallback to \`3000\`.

## Requirements
- Install \`dotenv\` package
- Add \`import 'dotenv/config'\` or \`dotenv.config()\` at the top of \`src/index.ts\`
- Use \`process.env.PORT || 3000\`
- Add a \`.env.example\` file with \`PORT=3000\`

## Location
\`src/index.ts\`"

gh issue create \
  --title "Add TypeScript strict mode to tsconfig" \
  --label "chore,priority:low" \
  --body "## Description
The TypeScript configuration has \`strict: false\`. Enabling strict mode would catch potential bugs at compile time.

## Requirements
- Set \`\"strict\": true\` in \`tsconfig.json\`
- Fix any resulting type errors across the codebase

## Location
\`tsconfig.json\` and any files with type errors"

echo ""
echo "=== Done! ==="
echo "Created repository, labels, and 20 issues."
echo ""
gh repo view --web
