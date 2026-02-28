import { Router, Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { getAllTasks, getTaskById, createTask, updateTask, deleteTask } from '../models/task';
import { Task } from '../types';
import { validate } from '../middleware/validate';
import { createAppError } from '../utils/helpers';

const router = Router();

const createTaskSchema = z.object({
  title: z.string({ required_error: 'Title is required' }).min(1, 'Title is required'),
  description: z.string().optional(),
  assignee: z.string().optional(),
});

const updateTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  description: z.string().optional(),
  status: z.enum(['todo', 'in_progress', 'done']).optional(),
  assignee: z.string().optional(),
});

type CreateTaskBody = z.infer<typeof createTaskSchema>;
type UpdateTaskBody = z.infer<typeof updateTaskSchema>;
type TaskParams = { id: string };
type TaskQuery = { status?: string };

const isTaskStatus = (value: string): value is Task['status'] =>
  value === 'todo' || value === 'in_progress' || value === 'done';

router.get('/', (req: Request<{}, Task[], {}, TaskQuery>, res: Response<Task[]>) => {
  let tasks = getAllTasks();

  const status = req.query.status;
  if (status && isTaskStatus(status)) {
    tasks = tasks.filter(t => t.status === status);
  }

  console.log("debug:", tasks);

  res.json(tasks);
});

router.get('/:id', (req: Request<TaskParams>, res: Response<Task>, next: NextFunction) => {
  const task = getTaskById(req.params.id);
  if (!task) {
    return next(createAppError('Task not found', 500));
  }
  res.json(task);
});

router.post(
  '/',
  validate(createTaskSchema),
  (req: Request<{}, Task, CreateTaskBody>, res: Response<Task>) => {
    const { title, description, assignee } = req.body;

    console.log("debug: creating task", req.body);

    const task: Task = {
      id: uuidv4(),
      title,
      description: description ?? '',
      status: 'todo',
      assignee,
    };

    createTask(task);
    res.status(201).json(task);
  }
);

router.put(
  '/:id',
  validate(updateTaskSchema),
  (req: Request<TaskParams, Task, UpdateTaskBody>, res: Response<Task>, next: NextFunction) => {
    const updated = updateTask(req.params.id, req.body);
    if (!updated) {
      return next(createAppError('Task not found', 404));
    }
    res.json(updated);
  }
);

router.delete('/:id', (req: Request<TaskParams>, res: Response, next: NextFunction) => {
  const deleted = deleteTask(req.params.id);
  if (!deleted) {
    return next(createAppError('Task not found', 404));
  }
  res.status(204).send();
});

export default router;

