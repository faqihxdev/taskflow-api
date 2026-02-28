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

  it('should filter tasks by title search (case-insensitive)', async () => {
    await request(app)
      .post('/tasks')
      .set(AUTH_HEADER)
      .send({ title: 'Fix Login', description: 'Auth fix' });

    await request(app)
      .post('/tasks')
      .set(AUTH_HEADER)
      .send({ title: 'Write Docs', description: 'Docs' });

    await request(app)
      .post('/tasks')
      .set(AUTH_HEADER)
      .send({ title: 'fix bug', description: 'Bug fix' });

    const res = await request(app)
      .get('/tasks?search=fix')
      .set(AUTH_HEADER);

    expect(res.status).toBe(200);
    const titles = res.body.map((task: { title: string }) => task.title).sort();
    expect(titles).toEqual(['Fix Login', 'fix bug'].sort());
  });

  it('should combine status and search filters', async () => {
    await request(app)
      .post('/tasks')
      .set(AUTH_HEADER)
      .send({ title: 'Refactor Auth', description: 'Auth' });

    const doneRes = await request(app)
      .post('/tasks')
      .set(AUTH_HEADER)
      .send({ title: 'Refactor Search', description: 'Search' });

    await request(app)
      .put(`/tasks/${doneRes.body.id}`)
      .set(AUTH_HEADER)
      .send({ status: 'done' });

    await request(app)
      .post('/tasks')
      .set(AUTH_HEADER)
      .send({ title: 'Add Tests', description: 'Tests' });

    const res = await request(app)
      .get('/tasks?status=done&search=refactor')
      .set(AUTH_HEADER);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].id).toBe(doneRes.body.id);
  });

  it('should treat empty search as no filter', async () => {
    await request(app)
      .post('/tasks')
      .set(AUTH_HEADER)
      .send({ title: 'One', description: 'First' });

    await request(app)
      .post('/tasks')
      .set(AUTH_HEADER)
      .send({ title: 'Two', description: 'Second' });

    const res = await request(app)
      .get('/tasks?search=')
      .set(AUTH_HEADER);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });
});

describe('POST /tasks', () => {
  it('should create a task', async () => {
    const res = await request(app)
      .post('/tasks')
      .set(AUTH_HEADER)
      .send({ title: 'Test task', description: 'A test' });
    expect(res.status).toBe(201);
    expect(typeof res.body.id).toBe('string');
    expect(res.body.title).toBe('Test task');
    expect(res.body.description).toBe('A test');
    expect(res.body.status).toBe('todo');
    expect(res.body.assignee).toBeUndefined();
    expect(typeof res.body.created_at).toBe('string');
    expect(typeof res.body.updated_at).toBe('string');
    expect(res.body.created_at).toBe(res.body.updated_at);
    expect(Number.isNaN(Date.parse(res.body.created_at))).toBe(false);
  });
});

describe('PUT /tasks', () => {
  it('should refresh updated_at on update', async () => {
    const createRes = await request(app)
      .post('/tasks')
      .set(AUTH_HEADER)
      .send({ title: 'Update me', description: 'Original' });

    const taskId = createRes.body.id;
    const originalUpdatedAt = createRes.body.updated_at;

    await new Promise(resolve => setTimeout(resolve, 5));

    const updateRes = await request(app)
      .put(`/tasks/${taskId}`)
      .set(AUTH_HEADER)
      .send({ status: 'done' });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.updated_at).not.toBe(originalUpdatedAt);
    expect(Date.parse(updateRes.body.updated_at)).toBeGreaterThan(
      Date.parse(originalUpdatedAt)
    );
    expect(updateRes.body.created_at).toBe(createRes.body.created_at);
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
    expect(deleteRes.text).toBe('');
  });
});
