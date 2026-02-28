import request from 'supertest';
import app from '../src/app';
import { resetTasks } from '../src/models/task';

const AUTH_HEADER = { Authorization: 'Bearer test-token-123' };

beforeEach(() => {
  resetTasks();
});

describe('GET /tasks', () => {
  it('should return empty array initially', async () => {
    const res = await request(app)
      .get('/tasks')
      .set(AUTH_HEADER);
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});

describe('POST /tasks', () => {
  it('should create a task', async () => {
    const res = await request(app)
      .post('/tasks')
      .set(AUTH_HEADER)
      .send({ title: 'Test task', description: 'A test' });
    expect(res.status).toBe(201);
  });

  it('should reject invalid task payloads', async () => {
    const res = await request(app)
      .post('/tasks')
      .set(AUTH_HEADER)
      .send({ description: 'Missing title' });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: 'Validation failed',
      details: 'Title is required',
    });
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
