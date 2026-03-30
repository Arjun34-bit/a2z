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
  res.send('Drop Shipping API is running...');
});

// API Routes
app.use('/api/v1/auth', authRoutes);
import orderRoutes from './routes/order.routes';
import supplierRoutes from './routes/supplier.routes';
import poRoutes from './routes/po.routes';

app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/suppliers', supplierRoutes);
app.use('/api/v1/pos', poRoutes);

// Global Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

export default app;
