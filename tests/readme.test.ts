import { promises as fs } from 'fs';
import path from 'path';

describe('README API documentation', () => {
  it('documents all API endpoints', async () => {
    const readmePath = path.join(__dirname, '..', 'README.md');
    const readme = await fs.readFile(readmePath, 'utf8');

    const requiredSections = [
      '## API',
      'GET /health',
      'GET /tasks',
      'GET /tasks/:id',
      'POST /tasks',
      'PUT /tasks/:id',
      'DELETE /tasks/:id',
      'GET /users',
      'GET /users/:id',
      'POST /users',
    ];

    requiredSections.forEach(section => {
      expect(readme).toContain(section);
    });
  });
});
