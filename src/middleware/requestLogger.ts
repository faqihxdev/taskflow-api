import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = process.hrtime.bigint();

  res.on('finish', () => {
    const end = process.hrtime.bigint();
    const elapsedMs = Number(end - start) / 1e6;
    const message = `${req.method} ${req.originalUrl} ${res.statusCode} ${elapsedMs.toFixed(2)}ms`;
    logger.info(message);
  });

  next();
};
