import request from 'supertest';
import app from '../src/app';

describe('GET /users auth', () => {
  it.each([
    ['missing header', undefined],
    ['empty bearer token', 'Bearer'],
    ['bearer token with trailing space only', 'Bearer '],
    ['wrong auth scheme', 'Basic test-token-123'],
  ])('should return 401 for %s', async (_, authorization) => {
    let req = request(app).get('/users');

    if (authorization !== undefined) {
      req = req.set('Authorization', authorization);
    }

    const res = await req;

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: 'Invalid token' });
  });
});
