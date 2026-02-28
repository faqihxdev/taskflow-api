import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

type HttpError = Error & { status?: number };

export const errorHandler = (err: HttpError, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || 500;
  const isProduction = process.env.NODE_ENV === 'production';

  logger.error('Unhandled request error', {
    method: req.method,
    path: req.originalUrl,
    status,
    message: err.message,
    stack: err.stack,
  });

  const response: { error: string; details?: string } = {
    error: isProduction && status >= 500 ? 'Internal Server Error' : err.message || 'Internal Server Error',
  };

  if (!isProduction && err.stack) {
    response.details = err.stack;
  }

  res.status(status).json(response);
};
