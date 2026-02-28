import dotenv from 'dotenv';
import app from './app';

dotenv.config();

export const getPort = (): number => Number(process.env.PORT || 3000);

const startServer = (): void => {
  const port = getPort();
  app.listen(port, () => {
    console.log(`TaskFlow API running on port ${port}`);
  });
};

if (require.main === module) {
  startServer();
}
