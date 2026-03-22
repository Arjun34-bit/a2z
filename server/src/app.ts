import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config();

const app: Application = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

import authRoutes from './routes/auth.routes';

// Basic Route
app.get('/', (req: Request, res: Response) => {
  res.send('Drop Shipping API is running...');
});

// API Routes
app.use('/api/auth', authRoutes);
import orderRoutes from './routes/order.routes';
import supplierRoutes from './routes/supplier.routes';
import poRoutes from './routes/po.routes';

app.use('/api/orders', orderRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/pos', poRoutes);

// Global Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

export default app;
