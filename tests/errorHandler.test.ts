import request from 'supertest';
import app from '../src/app';
import { resetTasks } from '../src/models/task';

const AUTH_HEADER = { Authorization: 'Bearer test-token-123' };

describe('Error handler', () => {
  const originalNodeEnv = process.env.NODE_ENV;

  beforeEach(() => {
    resetTasks();
  });

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
  });

  it('should include stack traces in non-production responses', async () => {
    process.env.NODE_ENV = 'test';

    const res = await request(app)
      .get('/tasks/nonexistent-task-id')
      .set(AUTH_HEADER);

    expect(res.status).toBe(500);
    expect(res.body.error).toBeDefined();
    expect(res.body.details).toEqual(expect.any(String));
  });

  it('should omit stack traces in production responses', async () => {
    process.env.NODE_ENV = 'production';

    const res = await request(app)
      .get('/tasks/nonexistent-task-id')
      .set(AUTH_HEADER);

    expect(res.status).toBe(500);
    expect(res.body.error).toBeDefined();
    expect(res.body.details).toBeUndefined();
  });
});
