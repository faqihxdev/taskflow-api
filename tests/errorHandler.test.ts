import express from 'express';
import request from 'supertest';
import { errorHandler } from '../src/middleware/errorHandler';

const buildApp = () => {
  const testApp = express();

  testApp.get('/boom', () => {
    throw new Error('Boom');
  });

  testApp.use(errorHandler);

  return testApp;
};

const triggerError = () => request(buildApp()).get('/boom');

describe('Error handler', () => {
  const originalEnv = process.env.NODE_ENV;

  afterAll(() => {
    process.env.NODE_ENV = originalEnv;
  });

  it('includes details in non-production', async () => {
    process.env.NODE_ENV = 'test';
    const res = await triggerError();
    expect(res.status).toBe(500);
    expect(res.body.error).toBeDefined();
    expect(typeof res.body.details).toBe('string');
    expect(res.body.details.length).toBeGreaterThan(0);
  });

  it('omits details in production', async () => {
    process.env.NODE_ENV = 'production';
    const res = await triggerError();
    expect(res.status).toBe(500);
    expect(res.body.error).toBeDefined();
    expect(res.body.details).toBeUndefined();
  });
});
