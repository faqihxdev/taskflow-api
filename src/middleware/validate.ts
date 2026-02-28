import { Request, Response, NextFunction } from 'express';
import { ZodTypeAny } from 'zod';
import { createAppError } from '../utils/helpers';

export const validate = <T extends ZodTypeAny>(schema: T) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const details = result.error.issues.map(issue => issue.message).join(', ');
      return next(createAppError('Validation failed', 400, details));
    }
    req.body = result.data;
    next();
  };
};
