import request from 'supertest';
import app from '../src/app';
import { resetUsers } from '../src/models/user';

const AUTH_HEADER = { Authorization: 'Bearer test-token-123' };

beforeEach(() => {
  resetUsers();
});

describe('User routes', () => {
  it('should return an empty list initially', async () => {
    const res = await request(app)
      .get('/users')
      .set(AUTH_HEADER);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

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

  it('should fetch a user by id', async () => {
    const createRes = await request(app)
      .post('/users')
      .set(AUTH_HEADER)
      .send({ name: 'Grace Hopper', email: 'grace@example.com' });

    const fetchRes = await request(app)
      .get(`/users/${createRes.body.id}`)
      .set(AUTH_HEADER);

    expect(fetchRes.status).toBe(200);
    expect(fetchRes.body).toEqual({
      id: createRes.body.id,
      name: 'Grace Hopper',
      email: 'grace@example.com',
      role: 'member',
    });
  });

  it('should return 404 for missing users', async () => {
    const res = await request(app)
      .get('/users/not-a-real-id')
      .set(AUTH_HEADER);

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'User not found' });
  });
});
