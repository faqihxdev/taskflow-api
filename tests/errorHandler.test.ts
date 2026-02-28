import request from 'supertest';
import app from '../src/app';

const AUTH_HEADER = { Authorization: 'Bearer test-token-123' };

const triggerError = () => request(app).get('/tasks/non-existent').set(AUTH_HEADER);

describe('Error handler', () => {
  const originalEnv = process.env.NODE_ENV;

  afterAll(() => {
    process.env.NODE_ENV = originalEnv;
  });

  it('includes details in non-production', async () => {
    process.env.NODE_ENV = 'test';
    const res = await triggerError();
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Task not found');
    expect(typeof res.body.details).toBe('string');
    expect(res.body.details.length).toBeGreaterThan(0);
  });

  it('omits details in production', async () => {
    process.env.NODE_ENV = 'production';
    const res = await triggerError();
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Task not found');
    expect(res.body.details).toBeUndefined();
  });
});
