import { Router } from 'express';
import multer from 'multer';
import { UploadController } from './UploadController';
import { requireAuth, requireRole } from '@shared/index';

export const createUploadRoutes = (controller: UploadController): Router => {
  const router = Router();

  // Configure multer for memory storage (buffer)
  // Max file size: 5MB
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed.'));
      }
    },
  });

  // Protected routes (example: only admin or artist can upload)
  router.use(requireAuth);

  // POST /api/v1/uploads/image
  router.post('/image', upload.single('image'), controller.uploadImage);

  // DELETE /api/v1/uploads/image/:id
  router.delete('/image/:id', requireRole('admin'), controller.deleteImage);

  return router;
};
