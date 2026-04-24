import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import morgan from 'morgan';

dotenv.config();

const app: Application = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

import authRoutes from './routes/auth.routes';

// Basic Route
app.get('/', (req: Request, res: Response) => {
  res.send('Auth Microservice is running...');
});

// API Routes
app.use('/api/v1/auth', authRoutes);

// Global Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

export default app;
