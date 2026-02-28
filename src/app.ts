import express from 'express';
import taskRoutes from './routes/tasks';
import userRoutes from './routes/users';
import healthRoutes from './routes/health';
import { authMiddleware } from './middleware/auth';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';

const app = express();

app.use(requestLogger);
app.use(express.json());

app.use('/health', healthRoutes);

app.use('/tasks', authMiddleware, taskRoutes);
app.use('/users', authMiddleware, userRoutes);

app.use(errorHandler);

export default app;
