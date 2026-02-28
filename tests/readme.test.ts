import { promises as fs } from 'fs';
import path from 'path';

describe('README', () => {
  it('should reference the correct default server port', async () => {
    const readmePath = path.resolve(__dirname, '..', 'README.md');
    const contents = await fs.readFile(readmePath, 'utf8');

    expect(contents).toContain('http://localhost:3000');
    expect(contents).not.toContain('localhost:4000');
  });
});
