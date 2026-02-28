import request from 'supertest';
import app from '../src/app';
import { resetUsers } from '../src/models/user';

const AUTH_HEADER = { Authorization: 'Bearer test-token-123' };

beforeEach(() => {
  resetUsers();
});

describe('User routes', () => {
  it('should list users', async () => {
    await request(app)
      .post('/users')
      .set(AUTH_HEADER)
      .send({ name: 'Jane Doe', email: 'jane@example.com' });

    await request(app)
      .post('/users')
      .set(AUTH_HEADER)
      .send({ name: 'John Doe', email: 'john@example.com', role: 'admin' });

    const res = await request(app)
      .get('/users')
      .set(AUTH_HEADER);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  it('should create a user with default role', async () => {
    const res = await request(app)
      .post('/users')
      .set(AUTH_HEADER)
      .send({ name: 'Mia', email: 'mia@example.com' });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Mia');
    expect(res.body.email).toBe('mia@example.com');
    expect(res.body.role).toBe('member');
    expect(typeof res.body.id).toBe('string');
  });

  it('should get user by id', async () => {
    const createRes = await request(app)
      .post('/users')
      .set(AUTH_HEADER)
      .send({ name: 'Zoe', email: 'zoe@example.com' });

    const userId = createRes.body.id;

    const res = await request(app)
      .get(`/users/${userId}`)
      .set(AUTH_HEADER);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(userId);
  });

  it('should return 404 for non-existent user', async () => {
    const res = await request(app)
      .get('/users/non-existent')
      .set(AUTH_HEADER);

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('User not found');
  });
});
