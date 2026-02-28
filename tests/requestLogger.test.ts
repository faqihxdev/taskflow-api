import request from 'supertest';
import app from '../src/app';
import { logger } from '../src/utils/logger';

afterEach(() => {
  jest.restoreAllMocks();
});

describe('requestLogger middleware', () => {
  it('logs METHOD path status duration', async () => {
    const infoSpy = jest.spyOn(logger, 'info').mockImplementation(() => {});

    const res = await request(app).get('/health');

    expect(res.status).toBe(200);
    expect(infoSpy).toHaveBeenCalled();

    const [message] = infoSpy.mock.calls[infoSpy.mock.calls.length - 1];
    expect(message).toMatch(/^GET \/health 200 \d+$/);
  });
});
