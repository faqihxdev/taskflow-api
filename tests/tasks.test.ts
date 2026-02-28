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

  it('should filter tasks by search keyword case-insensitively', async () => {
    const firstRes = await request(app)
      .post('/tasks')
      .set(AUTH_HEADER)
      .send({ title: 'Write Docs', description: 'Documentation' });

    await request(app)
      .post('/tasks')
      .set(AUTH_HEADER)
      .send({ title: 'Fix bug', description: 'Bug fix' });

    const res = await request(app)
      .get('/tasks')
      .query({ search: '  doCs  ' })
      .set(AUTH_HEADER);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].id).toBe(firstRes.body.id);
  });

  it('should combine status and search filters', async () => {
    const buildRes = await request(app)
      .post('/tasks')
      .set(AUTH_HEADER)
      .send({ title: 'Build report', description: 'Build it' });

    const reportRes = await request(app)
      .post('/tasks')
      .set(AUTH_HEADER)
      .send({ title: 'Review report', description: 'Review it' });

    await request(app)
      .put(`/tasks/${reportRes.body.id}`)
      .set(AUTH_HEADER)
      .send({ status: 'done' });

    const res = await request(app)
      .get('/tasks')
      .query({ status: 'DONE', search: 'report' })
      .set(AUTH_HEADER);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].id).toBe(reportRes.body.id);
    expect(res.body[0].status).toBe('done');
  });

  it('should return all tasks when search is empty', async () => {
    await request(app)
      .post('/tasks')
      .set(AUTH_HEADER)
      .send({ title: 'First task', description: 'First' });

    await request(app)
      .post('/tasks')
      .set(AUTH_HEADER)
      .send({ title: 'Second task', description: 'Second' });

    const res = await request(app)
      .get('/tasks')
      .query({ search: '   ' })
      .set(AUTH_HEADER);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
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
    expect(res.body).toHaveLength(1);
    expect(res.body[0].id).toBe(doneRes.body.id);
    expect(res.body[0].status).toBe('done');

    const todoFilterRes = await request(app)
      .get('/tasks')
      .query({ status: 'ToDo' })
      .set(AUTH_HEADER);

    expect(todoFilterRes.status).toBe(200);
    expect(todoFilterRes.body).toHaveLength(1);
    expect(todoFilterRes.body[0].id).toBe(todoRes.body.id);
    expect(todoFilterRes.body[0].status).toBe('todo');
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
