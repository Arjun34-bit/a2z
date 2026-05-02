import { Router } from 'express';
import { AdminController } from './AdminController';
import { requireAuth, requireRole } from '@shared/index';
import multer from 'multer';

// Use memory storage for multer
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

export const createAdminRoutes = (controller: AdminController): Router => {
  const router = Router();

  // ── Public: Admin Login (no auth required) ──
  router.post('/login', controller.login);

  // ── Public: Get All Categories (no auth required) ──
  router.get('/categories', controller.getAllCategories);

  // ── Protected: All routes below require auth + admin role ──
  router.use(requireAuth, requireRole('admin'));

  // Artists
  router.get('/artists/pending', controller.getPendingArtists);
  router.patch('/artists/:artistId/approve', controller.approveArtist);

  // Dashboard
  router.get('/dashboard', controller.getDashboard);

  // Banners CRUD
  router.post('/banners', controller.createBanner);
  router.get('/banners', controller.getAllBanners);
  router.get('/banners/:bannerId', controller.getBannerById);
  router.put('/banners/:bannerId', controller.updateBanner);
  router.delete('/banners/:bannerId', controller.deleteBanner);

  // Categories CRUD
  router.post('/categories', upload.single('icon'), controller.createCategory);
  router.get('/categories/:categoryId', controller.getCategoryById);
  router.put('/categories/:categoryId', upload.single('icon'), controller.updateCategory);
  router.delete('/categories/:categoryId', controller.deleteCategory);

  return router;
};
