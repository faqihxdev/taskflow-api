import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { getAllUsers, getUserById, getUserByEmail, createUser } from '../models/user';
import { validate } from '../middleware/validate';
import { User } from '../types';

const router = Router();

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

const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Email must be valid'),
  role: z.enum(['admin', 'member']).optional(),
});

type CreateUserBody = z.infer<typeof createUserSchema>;

router.post('/', validate(createUserSchema), async (req: Request<{}, {}, CreateUserBody>, res: Response) => {
  const { name, email, role } = req.body;

  const existingUser = getUserByEmail(email);
  if (existingUser) {
    return res.status(409).json({ error: 'User with this email already exists' });
  }

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
