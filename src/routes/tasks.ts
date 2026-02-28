import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getAllTasks, getTaskById, createTask, updateTask, deleteTask } from '../models/task';
import { Task } from '../types';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  let tasks = getAllTasks();

  const status = typeof req.query.status === 'string' ? req.query.status.trim() : '';
  if (status) {
    const normalizedStatus = status.toLowerCase();
    tasks = tasks.filter(t => t.status.toLowerCase() === normalizedStatus);
  }

  console.log("debug:", tasks);

  res.json(tasks);
});

router.get('/:id', (req: Request, res: Response) => {
  const task = getTaskById(req.params.id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.json({
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    assignee: task.assignee,
  });
});

router.post('/', (req: Request, res: Response) => {
  const { title, description, assignee } = req.body;

  console.log("debug: creating task", req.body);

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

router.put('/:id', (req: Request, res: Response) => {
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

