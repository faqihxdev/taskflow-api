import { Request, Response, NextFunction } from 'express';

const VALID_TOKENS = ['test-token-123', 'admin-token-456'];

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Missing Authorization header' });
  }

  const match = authHeader.match(/^Bearer (.+)$/);
  const token = match[1];

  if (!VALID_TOKENS.includes(token)) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  next();
};
