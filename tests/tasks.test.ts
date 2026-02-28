import request from 'supertest';
import app from '../src/app';
import { resetTasks } from '../src/models/task';

const AUTH_HEADER = { Authorization: 'Bearer test-token-123' };

beforeEach(() => {
  resetTasks();
});

describe('GET /tasks', () => {
  it('should return empty paginated list initially', async () => {
    const res = await request(app)
      .get('/tasks')
      .set(AUTH_HEADER);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      data: [],
      pagination: {
        page: 1,
        limit: 10,
        totalItems: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    });
  });

  it('should filter tasks by status case-insensitively', async () => {
    const todoRes = await request(app)
      .post('/tasks')
      .set(AUTH_HEADER)
      .send({ title: 'Todo task', description: 'Todo' });

    const doneRes = await request(app)
      .post('/tasks')
      .set(AUTH_HEADER)
      .send({ title: 'Done task', description: 'Done' });

    await request(app)
      .put(`/tasks/${doneRes.body.id}`)
      .set(AUTH_HEADER)
      .send({ status: 'done' });

    const res = await request(app)
      .get('/tasks')
      .query({ status: 'DoNe' })
      .set(AUTH_HEADER);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].id).toBe(doneRes.body.id);
    expect(res.body.data[0].status).toBe('done');

    const todoFilterRes = await request(app)
      .get('/tasks')
      .query({ status: 'ToDo' })
      .set(AUTH_HEADER);

    expect(todoFilterRes.status).toBe(200);
    expect(todoFilterRes.body.data).toHaveLength(1);
    expect(todoFilterRes.body.data[0].id).toBe(todoRes.body.id);
    expect(todoFilterRes.body.data[0].status).toBe('todo');
  });

  it('should paginate results with custom page and limit', async () => {
    const createdIds: string[] = [];
    for (let i = 1; i <= 5; i += 1) {
      const res = await request(app)
        .post('/tasks')
        .set(AUTH_HEADER)
        .send({ title: `Task ${i}`, description: `Task ${i}` });
      createdIds.push(res.body.id);
    }

    const pageRes = await request(app)
      .get('/tasks')
      .query({ page: 2, limit: 2 })
      .set(AUTH_HEADER);

    expect(pageRes.status).toBe(200);
    expect(pageRes.body.data).toHaveLength(2);
    expect(pageRes.body.data[0].id).toBe(createdIds[2]);
    expect(pageRes.body.data[1].id).toBe(createdIds[3]);
    expect(pageRes.body.pagination).toEqual({
      page: 2,
      limit: 2,
      totalItems: 5,
      totalPages: 3,
      hasNextPage: true,
      hasPreviousPage: true,
    });
  });

  it('should apply status filtering before pagination', async () => {
    await request(app)
      .post('/tasks')
      .set(AUTH_HEADER)
      .send({ title: 'First', description: 'First' });
    const second = await request(app)
      .post('/tasks')
      .set(AUTH_HEADER)
      .send({ title: 'Second', description: 'Second' });
    const third = await request(app)
      .post('/tasks')
      .set(AUTH_HEADER)
      .send({ title: 'Third', description: 'Third' });
    const fourth = await request(app)
      .post('/tasks')
      .set(AUTH_HEADER)
      .send({ title: 'Fourth', description: 'Fourth' });

    await request(app)
      .put(`/tasks/${second.body.id}`)
      .set(AUTH_HEADER)
      .send({ status: 'done' });
    await request(app)
      .put(`/tasks/${third.body.id}`)
      .set(AUTH_HEADER)
      .send({ status: 'done' });
    await request(app)
      .put(`/tasks/${fourth.body.id}`)
      .set(AUTH_HEADER)
      .send({ status: 'done' });

    const filteredRes = await request(app)
      .get('/tasks')
      .query({ status: 'DONE', page: 2, limit: 2 })
      .set(AUTH_HEADER);

    expect(filteredRes.status).toBe(200);
    expect(filteredRes.body.data).toHaveLength(1);
    expect(filteredRes.body.data[0].id).toBe(fourth.body.id);
    expect(filteredRes.body.pagination).toEqual({
      page: 2,
      limit: 2,
      totalItems: 3,
      totalPages: 2,
      hasNextPage: false,
      hasPreviousPage: true,
    });
  });
});

describe('GET /tasks/:id', () => {
  it('should return 404 when task is missing', async () => {
    const res = await request(app)
      .get('/tasks/missing-task')
      .set(AUTH_HEADER);

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Task not found');
  });
});

describe('POST /tasks', () => {
  it('should create a task', async () => {
    const res = await request(app)
      .post('/tasks')
      .set(AUTH_HEADER)
      .send({ title: 'Test task', description: 'A test' });
    expect(res.status).toBe(201);
    expect(res.body.id).toEqual(expect.any(String));
    expect(res.body.title).toBe('Test task');
    expect(res.body.description).toBe('A test');
    expect(res.body.status).toBe('todo');
  });

  it("should not log debug output when creating a task", async () => {
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    await request(app).get("/tasks").set(AUTH_HEADER);
    const res = await request(app)
      .post("/tasks")
      .set(AUTH_HEADER)
      .send({ title: "No logs", description: "Check logging" });
    expect(res.status).toBe(201);
    const debugCalls = logSpy.mock.calls.flat().filter(arg => typeof arg === "string" && arg.includes("debug:"));
    expect(debugCalls).toHaveLength(0);
    logSpy.mockRestore();
  });
});

describe('PATCH /tasks/:id/status', () => {
  it('should update task status', async () => {
    const createRes = await request(app)
      .post('/tasks')
      .set(AUTH_HEADER)
      .send({ title: 'Patch me', description: 'Status update' });

    const taskId = createRes.body.id;

    const patchRes = await request(app)
      .patch(`/tasks/${taskId}/status`)
      .set(AUTH_HEADER)
      .send({ status: 'done' });

    expect(patchRes.status).toBe(200);
    expect(patchRes.body.id).toBe(taskId);
    expect(patchRes.body.status).toBe('done');
  });

  it('should return 400 for invalid status', async () => {
    const createRes = await request(app)
      .post('/tasks')
      .set(AUTH_HEADER)
      .send({ title: 'Invalid status', description: 'Bad input' });

    const taskId = createRes.body.id;

    const res = await request(app)
      .patch(`/tasks/${taskId}/status`)
      .set(AUTH_HEADER)
      .send({ status: 'invalid-status' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation failed');
    expect(res.body.details).toContain('Expected');
  });

  it('should return 404 for missing task', async () => {
    const res = await request(app)
      .patch('/tasks/missing-id/status')
      .set(AUTH_HEADER)
      .send({ status: 'done' });

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Task not found');
  });
});

describe('DELETE /tasks', () => {
  it('should delete an existing task', async () => {
    const createRes = await request(app)
      .post('/tasks')
      .set(AUTH_HEADER)
      .send({ title: 'To delete', description: 'Will be deleted' });

    const taskId = createRes.body.id;

    const deleteRes = await request(app)
      .delete(`/tasks/${taskId}`)
      .set(AUTH_HEADER);

    expect(deleteRes.status).toBe(204);
  });
});
