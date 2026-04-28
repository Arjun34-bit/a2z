import app from './app';
import { connectDB } from '@shared/db/index';
import { initializeDatabase } from '@shared/db/init';
import { connectRedis } from '@shared/redis/client';

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  await connectDB();
  await initializeDatabase();
  await connectRedis();
  
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
