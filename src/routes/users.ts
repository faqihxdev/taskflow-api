import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getAllUsers, getUserById, createUser } from '../models/user';
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

router.post('/', (req: Request, res: Response) => {
  const { name, email, role } = req.body;

  const user: User = {
    id: uuidv4(),
    name,
    email,
    role: role || 'member',
  };

  createUser(user);
  res.status(201).json(user);
});

export default router;
