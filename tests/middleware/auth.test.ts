import request from 'supertest';
import app from '../../src/app';

describe('auth middleware', () => {
  test.each([
    { label: 'Bearer', header: 'Bearer' },
    { label: 'Bearer space', header: 'Bearer ' },
  ])('rejects empty token for $label', async ({ header }) => {
    const res = await request(app)
      .get('/tasks')
      .set('Authorization', header);

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: 'Invalid token' });
  });
});
