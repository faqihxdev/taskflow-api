import request from 'supertest';
import app from '../src/app';
import { resetUsers } from '../src/models/user';

const AUTH_HEADER = { Authorization: 'Bearer test-token-123' };

beforeEach(() => {
  resetUsers();
});

describe('User routes', () => {
  it('should create a user', async () => {
    const res = await request(app)
      .post('/users')
      .set(AUTH_HEADER)
      .send({ name: 'Ada Lovelace', email: 'ada@example.com', role: 'admin' });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      role: 'admin',
    });
    expect(res.body.id).toBeDefined();
  });

  it('should reject duplicate emails', async () => {
    await request(app)
      .post('/users')
      .set(AUTH_HEADER)
      .send({ name: 'User One', email: 'dup@example.com' });

    const res = await request(app)
      .post('/users')
      .set(AUTH_HEADER)
      .send({ name: 'User Two', email: 'DUP@example.com' });

    expect(res.status).toBe(409);
    expect(res.body).toMatchObject({ error: 'User with this email already exists' });
  });
});
