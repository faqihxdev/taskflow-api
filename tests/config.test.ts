import { getPort } from '../src/index';

describe('getPort', () => {
  const originalPort = process.env.PORT;

  afterEach(() => {
    if (originalPort === undefined) {
      delete process.env.PORT;
      return;
    }

    process.env.PORT = originalPort;
  });

  it('should return default port when PORT is not set', () => {
    delete process.env.PORT;
    expect(getPort()).toBe(3000);
  });

  it('should return configured port when PORT is set', () => {
    process.env.PORT = '4567';
    expect(getPort()).toBe(4567);
  });
});
