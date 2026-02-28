import { Request, Response, NextFunction } from 'express';
import { createAppError } from '../utils/helpers';

const VALID_TOKENS = ['test-token-123', 'admin-token-456'];

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(createAppError('Missing Authorization header', 401));
  }

  const match = authHeader.match(/^Bearer (.+)$/);
  if (!match) {
    return next(createAppError('Invalid token', 401));
  }
  const token = match[1];

  if (!VALID_TOKENS.includes(token)) {
    return next(createAppError('Invalid token', 401));
  }

  next();
};
