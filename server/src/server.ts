import app from './app';
import { connectDB } from './db/index';
import { initializeDatabase } from './db/init';
import { connectRedis } from './redis/client';

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
