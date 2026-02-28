import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { getAllUsers, getUserById, createUser } from '../models/user';
import { User } from '../types';

const router = Router();

const createUserSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    role: z.enum(['admin', 'member']).optional(),
  })
  .strict();

const formatZodError = (error: z.ZodError): string =>
  error.errors
    .map(entry => {
      const path = entry.path.length > 0 ? entry.path.join('.') : 'body';
      return `${path}: ${entry.message}`;
    })
    .join('; ');

router.get('/', (req: Request, res: Response) => {
  res.json(getAllUsers());
});

router.get('/:id', (req: Request, res: Response) => {
  const user = getUserById(req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
});

router.post('/', (req: Request, res: Response) => {
  const parsed = createUserSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: 'Invalid request body',
      details: formatZodError(parsed.error),
    });
  }

  const { name, email, role } = parsed.data;

  const user: User = {
    id: uuidv4(),
    name,
    email,
    role: role ?? 'member',
  };

  createUser(user);
  res.status(201).json(user);
});

export default router;
