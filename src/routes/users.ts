import { Router, Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { getAllUsers, getUserById, getUserByEmail, createUser } from '../models/user';
import { validate } from '../middleware/validate';
import { User } from '../types';
import { createAppError } from '../utils/helpers';

const router = Router();

router.get('/', (req: Request, res: Response<User[]>) => {
  res.json(getAllUsers());
});

router.get('/:id', (req: Request<{ id: string }>, res: Response<User>, next: NextFunction) => {
  const user = getUserById(req.params.id);
  if (!user) {
    return next(createAppError('User not found', 404));
  }
  res.json(user);
});

const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Email must be valid'),
  role: z.enum(['admin', 'member']).optional(),
});

type CreateUserBody = z.infer<typeof createUserSchema>;

router.post(
  '/',
  validate(createUserSchema),
  async (req: Request<{}, User, CreateUserBody>, res: Response<User>, next: NextFunction) => {
    const { name, email, role } = req.body;

    const existingUser = getUserByEmail(email);
    if (existingUser) {
      return next(createAppError('User with this email already exists', 409));
    }

    const user: User = {
      id: uuidv4(),
      name,
      email,
      role: role ?? 'member',
    };

    createUser(user);
    res.status(201).json(user);
  }
);

export default router;
