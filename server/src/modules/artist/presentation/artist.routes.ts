import { Router } from 'express';
import { ArtistController } from './ArtistController';
import { requireAuth, requireRole } from '@shared/index';

export const createArtistRoutes = (controller: ArtistController): Router => {
  const router = Router();

  // All routes require authentication and 'artist' role
  router.use(requireAuth, requireRole('artist'));

  router.get('/me', controller.getProfile);
  router.patch('/me', controller.updateProfile);

  return router;
};
