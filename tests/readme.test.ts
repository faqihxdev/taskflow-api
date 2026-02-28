import fs from 'fs';
import path from 'path';

describe('README API documentation', () => {
  it('lists core endpoints', () => {
    const readmePath = path.join(__dirname, '..', 'README.md');
    const readme = fs.readFileSync(readmePath, 'utf-8');

    expect(readme).toContain('## API Documentation');
    expect(readme).toContain('GET /health');
    expect(readme).toContain('GET /tasks');
    expect(readme).toContain('POST /tasks');
    expect(readme).toContain('GET /users');
    expect(readme).toContain('POST /users');
  });
});
