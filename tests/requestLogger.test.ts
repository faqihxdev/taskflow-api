import request from 'supertest';
import app from '../src/app';
import { logger } from '../src/utils/logger';

describe('requestLogger middleware', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('logs method, path, status code, and elapsed time in ms', async () => {
    const infoSpy = jest.spyOn(logger, 'info').mockImplementation(() => {});

    const res = await request(app).get('/health');

    expect(res.status).toBe(200);
    expect(infoSpy).toHaveBeenCalled();

    const [message] = infoSpy.mock.calls[infoSpy.mock.calls.length - 1];
    expect(typeof message).toBe('string');
    expect(message).toMatch(/^GET \/health 200 \d+\.\d{2}ms$/);
  });
});
