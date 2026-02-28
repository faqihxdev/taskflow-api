import { AppError } from '../types';

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const createAppError = (message: string, status: number, details?: string): AppError => {
  const error = new Error(message) as AppError;
  error.status = status;
  if (details) {
    error.details = details;
  }
  return error;
};
