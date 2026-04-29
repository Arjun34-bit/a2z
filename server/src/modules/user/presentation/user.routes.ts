import { Router } from 'express';
import { UserController } from './UserController';
import { requireAuth } from '@shared/index';

export const createUserRoutes = (controller: UserController): Router => {
  const router = Router();

  // All routes require authentication
  router.use(requireAuth);

  router.get('/me', controller.getProfile);
  router.patch('/me', controller.updateProfile);
  
  router.get('/addresses', controller.getAddresses);
  router.post('/addresses', controller.addAddress);

  return router;
};
