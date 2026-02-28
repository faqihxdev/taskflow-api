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
    expect(res.body).toEqual({
      data: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
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

  it('should paginate tasks with page and limit', async () => {
    for (let i = 1; i <= 12; i += 1) {
      await request(app)
        .post('/tasks')
        .set(AUTH_HEADER)
        .send({ title: `Task ${i}`, description: `Task ${i} description` });
    }

    const res = await request(app)
      .get('/tasks?page=2&limit=5')
      .set(AUTH_HEADER);

    expect(res.status).toBe(200);
    expect(res.body.pagination).toEqual({
      page: 2,
      limit: 5,
      total: 12,
      totalPages: 3,
    });
    expect(res.body.data).toHaveLength(5);
    expect(res.body.data.map((task: { title: string }) => task.title)).toEqual([
      'Task 6',
      'Task 7',
      'Task 8',
      'Task 9',
      'Task 10',
    ]);
  });

  it('should apply status filter before paginating', async () => {
    const createdTasks: Array<{ id: string; title: string }> = [];
    for (const title of ['A', 'B', 'C', 'D']) {
      const createRes = await request(app)
        .post('/tasks')
        .set(AUTH_HEADER)
        .send({ title, description: `${title} description` });
      createdTasks.push(createRes.body);
    }

    await request(app)
      .put(`/tasks/${createdTasks[0].id}`)
      .set(AUTH_HEADER)
      .send({ status: 'done' });
    await request(app)
      .put(`/tasks/${createdTasks[1].id}`)
      .set(AUTH_HEADER)
      .send({ status: 'done' });
    await request(app)
      .put(`/tasks/${createdTasks[2].id}`)
      .set(AUTH_HEADER)
      .send({ status: 'in_progress' });
    await request(app)
      .put(`/tasks/${createdTasks[3].id}`)
      .set(AUTH_HEADER)
      .send({ status: 'done' });

    const res = await request(app)
      .get('/tasks?status=done&page=2&limit=2')
      .set(AUTH_HEADER);

    expect(res.status).toBe(200);
    expect(res.body.pagination).toEqual({
      page: 2,
      limit: 2,
      total: 3,
      totalPages: 2,
    });
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].title).toBe('D');
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
