import { User } from '../types';

const users: User[] = [];

export const getAllUsers = (): User[] => users;

export const getUserById = (id: string): User | undefined =>
  users.find(u => u.id === id);

export const getUserByEmail = (email: string): User | undefined =>
  users.find(u => u.email === email);

export const createUser = (user: User): User => {
  users.push(user);
  return user;
};

export const resetUsers = (): void => {
  users.length = 0;
};
