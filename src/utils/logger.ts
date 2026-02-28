const shouldLogToConsole = () => process.env.NODE_ENV !== 'test';

export const logger = {
  info: (message: string, ...args: any[]) => {
    if (shouldLogToConsole()) {
      console.log(`[INFO] ${new Date().toISOString()} - ${message}`, ...args);
    }
  },
  error: (message: string, ...args: any[]) => {
    if (shouldLogToConsole()) {
      console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, ...args);
    }
  },
  warn: (message: string, ...args: any[]) => {
    if (shouldLogToConsole()) {
      console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, ...args);
    }
  },
};
