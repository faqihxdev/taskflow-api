import { Request, Response, NextFunction } from 'express';

const VALID_TOKENS = ['test-token-123', 'admin-token-456'];

const invalidTokenResponse = (res: Response): Response => {
  return res.status(401).json({ error: 'Invalid token' });
};

export const authMiddleware = (req: Request, res: Response, next: NextFunction): Response | void => {
  const authHeader = req.headers.authorization;

  if (typeof authHeader !== 'string') {
    return invalidTokenResponse(res);
  }

  const parts = authHeader.trim().split(/\s+/);

  if (parts.length !== 2) {
    return invalidTokenResponse(res);
  }

  const [scheme, token] = parts;

  if (scheme !== 'Bearer' || token.length === 0) {
    return invalidTokenResponse(res);
  }

  if (!VALID_TOKENS.includes(token)) {
    return invalidTokenResponse(res);
  }

  next();
};
