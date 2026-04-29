import { Router } from 'express';
import { AuthController } from './AuthController';

export const createAuthRoutes = (authController: AuthController): Router => {
  const router = Router();

  router.post('/send-otp', authController.sendOtp);
  router.post('/verify-otp', authController.verifyOtp);
  router.post('/refresh', authController.refreshToken);

  return router;
};
