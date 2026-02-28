import { User } from '../types';

const users: User[] = [];

const normalizeEmail = (email: string): string => email.trim().toLowerCase();

export class DuplicateEmailError extends Error {
  status: number;

  constructor() {
    super('User with this email already exists');
    this.name = 'DuplicateEmailError';
    this.status = 409;
  }
}

export const getAllUsers = (): User[] => users;

export const getUserById = (id: string): User | undefined =>
  users.find(u => u.id === id);

export const getUserByEmail = (email: string): User | undefined => {
  const normalizedEmail = normalizeEmail(email);
  return users.find(u => normalizeEmail(u.email) === normalizedEmail);
};

export const createUser = (user: User): User => {
  if (getUserByEmail(user.email)) {
    throw new DuplicateEmailError();
  }

  users.push(user);
  return user;
};

export const resetUsers = (): void => {
  users.length = 0;
};
