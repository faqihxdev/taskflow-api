import { Router, Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { getPaginatedTasks, getTaskById, createTask, updateTask, deleteTask } from '../models/task';
import { validate } from '../middleware/validate';
import { PaginatedResponse, Task } from '../types';

const router = Router();

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const parsePositiveInt = (value: unknown, fallback: number): number => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value > 0 ? Math.floor(value) : fallback;
  }
  if (typeof value !== 'string') {
    return fallback;
  }
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }
  return parsed;
};

router.get('/', async (req: Request, res: Response) => {
  const status = typeof req.query.status === 'string' ? req.query.status.trim() : '';
  const normalizedStatus = status ? status.toLowerCase() : undefined;
  const page = parsePositiveInt(req.query.page, DEFAULT_PAGE);
  const limit = parsePositiveInt(req.query.limit, DEFAULT_LIMIT);

  const { tasks, total } = getPaginatedTasks({ status: normalizedStatus, page, limit });
  const totalPages = total === 0 ? 0 : Math.ceil(total / limit);
  const response: PaginatedResponse<Task> = {
    data: tasks,
    pagination: {
      page,
      limit,
      totalItems: total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1 && totalPages > 0,
    },
  };

  res.json(response);
});

router.get('/:id', async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  const task = getTaskById(req.params.id);
  if (!task) {
    const error = new Error('Task not found') as Error & { status?: number };
    error.status = 404;
    return next(error);
  }
  res.json(task);
});

const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  assignee: z.string().optional(),
});

type CreateTaskBody = z.infer<typeof createTaskSchema>;

router.post(
  '/',
  validate(createTaskSchema),
  async (req: Request<{}, {}, CreateTaskBody>, res: Response) => {
    const { title, description, assignee } = req.body;

    const task: Task = {
      id: uuidv4(),
      title,
      description: description || '',
      status: 'todo',
      assignee,
    };

    createTask(task);
    res.status(201).json(task);
  },
);

const updateTaskSchema = z
  .object({
    title: z.string().min(1, 'Title is required').optional(),
    description: z.string().optional(),
    status: z.enum(['todo', 'in_progress', 'done']).optional(),
    assignee: z.string().optional(),
  })
  .refine(data => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  });

type UpdateTaskBody = z.infer<typeof updateTaskSchema>;

const updateTaskStatusSchema = z.object({
  status: z.enum(['todo', 'in_progress', 'done']),
});

type UpdateTaskStatusBody = z.infer<typeof updateTaskStatusSchema>;

router.patch(
  '/:id/status',
  validate(updateTaskStatusSchema),
  async (req: Request<{ id: string }, {}, UpdateTaskStatusBody>, res: Response) => {
    const updated = updateTask(req.params.id, { status: req.body.status });
    if (!updated) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(updated);
  },
);

router.put(
  '/:id',
  validate(updateTaskSchema),
  async (req: Request<{ id: string }, {}, UpdateTaskBody>, res: Response) => {
    const updated = updateTask(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(updated);
  },
);

router.delete('/:id', async (req: Request<{ id: string }>, res: Response) => {
  const deleted = deleteTask(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.status(204).send();
});

export default router;
