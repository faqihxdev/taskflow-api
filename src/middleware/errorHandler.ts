import { Request, Response, NextFunction } from 'express';
import { AppError, ErrorResponse } from '../types';

export const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
  const status = err.status ?? 500;
  const isProduction = process.env.NODE_ENV === 'production';

  const response: ErrorResponse = {
    error: err.message || 'Internal Server Error',
  };

  if (err.details) {
    response.details = err.details;
  } else if (!isProduction && status >= 500) {
    response.details = err.stack ?? err.message;
  }

  res.status(status).json(response);
};
