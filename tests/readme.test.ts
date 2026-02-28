import { readFile } from 'fs/promises';
import path from 'path';

describe('README', () => {
  it('uses port 3000 in the running instructions', async () => {
    const readmePath = path.resolve(__dirname, '..', 'README.md');
    const contents = await readFile(readmePath, 'utf8');

    expect(contents).toContain('http://localhost:3000');
    expect(contents).not.toContain('http://localhost:4000');
  });
});
