import request from 'supertest';
import app from '../src/app';
import { resetUsers } from '../src/models/user';

const AUTH_HEADER = { Authorization: 'Bearer test-token-123' };

beforeEach(() => {
  resetUsers();
});

describe('GET /users', () => {
  it('should return empty array initially', async () => {
    const res = await request(app)
      .get('/users')
      .set(AUTH_HEADER);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});

describe('POST /users', () => {
  it('should create a user', async () => {
    const res = await request(app)
      .post('/users')
      .set(AUTH_HEADER)
      .send({ name: 'Jane Doe', email: 'jane@example.com' });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      name: 'Jane Doe',
      email: 'jane@example.com',
      role: 'member',
    });
    expect(res.body.id).toBeDefined();
  });
});

describe('GET /users/:id', () => {
  it('should get user by id', async () => {
    const createRes = await request(app)
      .post('/users')
      .set(AUTH_HEADER)
      .send({ name: 'Alice', email: 'alice@example.com', role: 'admin' });

    const userId = createRes.body.id;

    const getRes = await request(app)
      .get(`/users/${userId}`)
      .set(AUTH_HEADER);

    expect(getRes.status).toBe(200);
    expect(getRes.body).toEqual(createRes.body);
  });

  it('should return 404 for non-existent user', async () => {
    const res = await request(app)
      .get('/users/non-existent-id')
      .set(AUTH_HEADER);

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'User not found' });
  });
});
