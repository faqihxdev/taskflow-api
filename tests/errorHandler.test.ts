import express, { NextFunction, Request, Response } from 'express';
import request from 'supertest';
import { errorHandler } from '../src/middleware/errorHandler';
import { logger } from '../src/utils/logger';

const createTestApp = () => {
  const app = express();

  app.get('/throw', (req: Request, res: Response, next: NextFunction) => {
    next(new Error('boom'));
  });

  app.use(errorHandler);

  return app;
};

describe('errorHandler', () => {
  const originalNodeEnv = process.env.NODE_ENV;

  beforeEach(() => {
    jest.spyOn(logger, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
    jest.restoreAllMocks();
  });

  it('includes stack details outside production', async () => {
    process.env.NODE_ENV = 'test';
    const app = createTestApp();

    const res = await request(app).get('/throw');

    expect(res.status).toBe(500);
    expect(res.body.error).toBe('boom');
    expect(typeof res.body.details).toBe('string');
    expect(res.body.details).toContain('Error: boom');
    expect(logger.error).toHaveBeenCalledTimes(1);
  });

  it('hides stack details and sanitizes 500 errors in production', async () => {
    process.env.NODE_ENV = 'production';
    const app = createTestApp();

    const res = await request(app).get('/throw');

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: 'Internal Server Error' });
    expect(res.body.details).toBeUndefined();
    expect(logger.error).toHaveBeenCalledTimes(1);
  });
});
