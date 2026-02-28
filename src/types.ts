export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done';
  assignee?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
}

export interface ErrorResponse {
  error: string;
  details?: string;
}

export interface AppError extends Error {
  status?: number;
  details?: string;
}
