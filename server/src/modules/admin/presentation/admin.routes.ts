import { Router } from 'express';
import { AdminController } from './AdminController';
import { requireAuth, requireRole } from '@shared/index';

export const createAdminRoutes = (controller: AdminController): Router => {
  const router = Router();

  // All routes require authentication and 'admin' role
  router.use(requireAuth, requireRole('admin'));

  router.get('/artists/pending', controller.getPendingArtists);
  router.patch('/artists/:artistId/approve', controller.approveArtist);
  
  router.get('/dashboard', controller.getDashboard);

  return router;
};
