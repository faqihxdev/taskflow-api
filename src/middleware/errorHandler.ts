import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  const status = (err as any).status || 500;
  const isProduction = process.env.NODE_ENV === 'production';
  const response: { error: string; details?: string } = {
    error: err.message || 'Internal Server Error',
  };

  if (!isProduction && err.stack) {
    response.details = err.stack;
  }

  res.status(status).json(response);
};
