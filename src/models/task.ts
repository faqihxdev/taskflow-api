import { Task } from '../types';

const tasks: Task[] = [];

export const getAllTasks = (): Task[] => tasks;

export const getTaskById = (id: string): Task | undefined =>
  tasks.find(t => t.id === id);

export const createTask = (task: Task): Task => {
  tasks.push(task);
  return task;
};

export const updateTask = (id: string, updates: Partial<Task>): Task | undefined => {
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) return undefined;
  tasks[index] = { ...tasks[index], ...updates };
  return tasks[index];
};

export const deleteTask = (id: string): boolean => {
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) return false;
  tasks.splice(index, 1);
  return true;
};

export const resetTasks = (): void => {
  tasks.length = 0;
};
