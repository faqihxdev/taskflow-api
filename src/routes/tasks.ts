import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { getAllTasks, getTaskById, createTask, updateTask, deleteTask } from '../models/task';
import { Task } from '../types';

const router = Router();

const createTaskSchema = z
  .object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    assignee: z.string().optional(),
  })
  .strict();

const updateTaskSchema = z
  .object({
    title: z.string().min(1, 'Title is required').optional(),
    description: z.string().optional(),
    status: z.enum(['todo', 'in_progress', 'done']).optional(),
    assignee: z.string().optional(),
  })
  .strict()
  .refine(data => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  });

const formatZodError = (error: z.ZodError): string =>
  error.errors
    .map(entry => {
      const path = entry.path.length > 0 ? entry.path.join('.') : 'body';
      return `${path}: ${entry.message}`;
    })
    .join('; ');

router.get('/', async (req: Request, res: Response) => {
  let tasks = getAllTasks();

  const status = typeof req.query.status === 'string' ? req.query.status : undefined;
  if (status) {
    tasks = tasks.filter(t => t.status === status);
  }

  const rawSearch = typeof req.query.search === 'string' ? req.query.search : undefined;
  const search = rawSearch?.trim();
  if (search) {
    const loweredSearch = search.toLowerCase();
    tasks = tasks.filter(t => t.title.toLowerCase().includes(loweredSearch));
  }

  res.json(tasks);
});

router.get('/:id', async (req: Request, res: Response) => {
  const task = getTaskById(req.params.id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.json(task);
});

router.post('/', async (req: Request, res: Response) => {
  const parsed = createTaskSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: 'Invalid request body',
      details: formatZodError(parsed.error),
    });
  }

  const { title, description, assignee } = parsed.data;
  const now = new Date().toISOString();
  const task: Task = {
    id: uuidv4(),
    title,
    description: description ?? '',
    status: 'todo',
    assignee,
    created_at: now,
    updated_at: now,
  };

  const created = createTask(task);
  res.status(201).json(created);
});

router.put('/:id', async (req: Request, res: Response) => {
  const parsed = updateTaskSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: 'Invalid request body',
      details: formatZodError(parsed.error),
    });
  }

  const now = new Date().toISOString();
  const updated = updateTask(req.params.id, { ...parsed.data, updated_at: now });
  if (!updated) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.json(updated);
});

router.delete('/:id', async (req: Request, res: Response) => {
  const deleted = deleteTask(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.status(204).send();
});

export default router;
