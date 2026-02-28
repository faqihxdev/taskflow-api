import { Request, Response, NextFunction } from 'express';

type ErrorResponse = {
  error: string;
  details?: string;
};

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  const status = (err as any).status || 500;
  const isProduction = process.env.NODE_ENV === 'production';

  const response: ErrorResponse = {
    error: err.message || 'Internal Server Error',
  };

  if (!isProduction) {
    response.details = err.stack ?? err.message;
  }

  res.status(status).json(response);
};
