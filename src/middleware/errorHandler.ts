import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  const status = (err as any).status || 500;

  res.status(status).json({
    error: err.message || 'Internal Server Error',
    details: err.stack,
  });
};
