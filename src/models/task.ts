import { Task } from '../types';

const tasks: Task[] = [];

export const getAllTasks = (): Task[] => tasks;

export const getTaskById = (id: string): Task | undefined =>
  tasks.find(t => t.id === id);

export const createTask = (task: Task): Task => {
  const now = new Date().toISOString();
  const created_at = task.created_at || now;
  const updated_at = task.updated_at || created_at;
  const newTask: Task = { ...task, created_at, updated_at };
  tasks.push(newTask);
  return newTask;
};

export const updateTask = (
  id: string,
  updates: Partial<Omit<Task, 'id' | 'created_at'>>
): Task | undefined => {
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) return undefined;
  const now = updates.updated_at || new Date().toISOString();
  const current = tasks[index];
  const updated: Task = {
    ...current,
    ...updates,
    id: current.id,
    created_at: current.created_at,
    updated_at: now,
  };
  tasks[index] = updated;
  return updated;
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
