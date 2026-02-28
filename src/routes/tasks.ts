import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { getTaskById, createTask, updateTask, deleteTask, listTasks } from '../models/task';
import { validate } from '../middleware/validate';
import { Task, PaginatedResponse } from '../types';

const router = Router();

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

type TaskListQuery = {
  status?: string;
  page?: string;
  limit?: string;
};

const coerceSingleValue = (value: string | string[] | undefined): string | undefined =>
  Array.isArray(value) ? value[0] : value;

const parsePositiveInt = (value: string | undefined, fallback: number): number | undefined => {
  if (value === undefined) return fallback;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return undefined;
  }
  return parsed;
};

const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  assignee: z.string().optional(),
});

type CreateTaskBody = z.infer<typeof createTaskSchema>;

const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.enum(['todo', 'in_progress', 'done']).optional(),
  assignee: z.string().optional(),
});

type UpdateTaskBody = z.infer<typeof updateTaskSchema>;

router.get(
  '/',
  (req: Request<{}, PaginatedResponse<Task>, {}, TaskListQuery>, res: Response) => {
    const statusParam = coerceSingleValue(req.query.status);
    const status = statusParam ? statusParam.trim().toLowerCase() : undefined;

    const page = parsePositiveInt(coerceSingleValue(req.query.page), DEFAULT_PAGE);
    if (!page) {
      return res.status(400).json({
        error: 'Invalid pagination parameters',
        details: 'page must be a positive integer',
      });
    }

    const limit = parsePositiveInt(coerceSingleValue(req.query.limit), DEFAULT_LIMIT);
    if (!limit) {
      return res.status(400).json({
        error: 'Invalid pagination parameters',
        details: 'limit must be a positive integer',
      });
    }

    const offset = (page - 1) * limit;
    const { items, total } = listTasks({ status, offset, limit });
    const totalPages = total === 0 ? 0 : Math.ceil(total / limit);

    res.json({
      data: items,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  },
);

router.get('/:id', (req: Request, res: Response) => {
  const task = getTaskById(req.params.id);
  res.json({
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    assignee: task.assignee,
  });
});

router.post('/', validate(createTaskSchema), (req: Request<{}, Task, CreateTaskBody>, res: Response) => {
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
});

router.put('/:id', validate(updateTaskSchema), (req: Request<{ id: string }, Task, UpdateTaskBody>, res: Response) => {
  const updated = updateTask(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.json(updated);
});

router.delete('/:id', (req: Request, res: Response) => {
  const deleted = deleteTask(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.status(204).send();
});

export default router;

