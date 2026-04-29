import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { AuthController } from '@auth/index';
import { createAuthRoutes } from '@auth/index';

import { UserController } from '@user/index';
import { createUserRoutes } from '@user/index';

import { ArtistController } from '@artist/index';
import { createArtistRoutes } from '@artist/index';

import { AdminController } from '@admin/index';
import { createAdminRoutes } from '@admin/index';

export interface AppControllers {
  authController: AuthController;
  userController: UserController;
  artistController: ArtistController;
  adminController: AdminController;
}

/**
 * Creates and configures the Express application.
 * Accepts injected controllers — NO internal instantiation.
 */
export const createApp = (controllers: AppControllers): Application => {
  const app: Application = express();

  // Middlewares
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(morgan('dev'));

  // Health Check
  app.get('/', (req: Request, res: Response) => {
    res.send('A2Z Modular Monolith is running...');
  });

  // API Routes
  app.use('/api/v1/auth', createAuthRoutes(controllers.authController));
  app.use('/api/v1/users', createUserRoutes(controllers.userController));
  app.use('/api/v1/artists', createArtistRoutes(controllers.artistController));
  app.use('/api/v1/admin', createAdminRoutes(controllers.adminController));

  // Global Error Handler
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  });

  return app;
};
