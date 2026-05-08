import { Router } from 'express';
import multer from 'multer';
import { ArtistController } from './ArtistController';
import { requireAuth, requireRole } from '@shared/index';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 }, // 8 MB
});

export const createArtistRoutes = (controller: ArtistController): Router => {
  const router = Router();

  // All routes require a valid JWT with role 'artist'
  router.use(requireAuth, requireRole('artist'));

  // ── Onboarding Lifecycle ──────────────────────────────────────────────
  router.post('/onboarding/start',  controller.startOnboarding);
  router.put('/onboarding/type',    controller.setArtistType);
  router.post('/onboarding/submit', controller.submitOnboarding);
  router.get('/onboarding/status',  controller.getOnboardingStatus);

  // ── Profile ───────────────────────────────────────────────────────────
  router.put('/profile',                    controller.updateBasicInfo);
  router.post('/profile/image', upload.single('image'), controller.uploadProfileImage);

  // ── STEP 3 RESERVED ──────────────────────────────────────────────────
  // Service-adding routes will be registered here between basic_info (step 2)
  // and identity verification (step 4).
  // Example future routes:
  //   router.post('/services', ...)
  //   router.get('/services',  ...)

  // ── Identity Verification (Step 4) ───────────────────────────────────
  // Solo artists and parlor owners only; sub-artists are blocked at the service level.
  router.post('/identity/verify', upload.single('document'), controller.submitIdentityVerify);

  // ── Portfolio (Step 5) ────────────────────────────────────────────────
  router.post('/portfolio', upload.single('image'), controller.addPortfolioImage);
  router.get('/portfolio',                          controller.getPortfolio);

  // ── Sub-Artists (Parlor only) ─────────────────────────────────────────
  router.post('/sub-artists', controller.addSubArtist);
  router.get('/sub-artists',  controller.getSubArtists);

  return router;
};
