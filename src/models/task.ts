import { Task } from '../types';

const tasks: Task[] = [];

export const getAllTasks = (): Task[] => tasks;

export const getTasksByStatus = (status?: string): Task[] => {
  if (!status) {
    return tasks;
  }
  const normalized = status.toLowerCase();
  return tasks.filter(t => t.status.toLowerCase() === normalized);
};

export const getPaginatedTasks = (options: {
  status?: string;
  page: number;
  limit: number;
}): { tasks: Task[]; total: number } => {
  const filtered = getTasksByStatus(options.status);
  const start = (options.page - 1) * options.limit;
  const end = start + options.limit;
  return { tasks: filtered.slice(start, end), total: filtered.length };
};

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
