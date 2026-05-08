import { Response } from 'express';
import { ArtistService } from '../application/ArtistService';
import { AuthRequest } from '@shared/index';
import {
  artistTypeSchema,
  basicInfoSchema,
  identityVerifySchema,
  portfolioImageSchema,
  addSubArtistSchema,
} from './artist.validation';

export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  // ── POST /onboarding/start ─────────────────────────────────────────────
  startOnboarding = async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user!.user_id;
    const result = await this.artistService.startOnboarding(userId);
    res.status(201).json({ success: true, data: result });
  };

  // ── PUT /onboarding/type ───────────────────────────────────────────────
  setArtistType = async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user!.user_id;
    const { org_type } = artistTypeSchema.parse(req.body);
    const org = await this.artistService.setArtistType(userId, org_type);
    res.status(200).json({ success: true, data: org });
  };

  // ── PUT /profile ───────────────────────────────────────────────────────
  updateBasicInfo = async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user!.user_id;
    const validated = basicInfoSchema.parse(req.body);
    const profile = await this.artistService.updateBasicInfo(userId, validated as any);
    res.status(200).json({ success: true, data: profile });
  };

  // ── POST /profile/image ────────────────────────────────────────────────
  uploadProfileImage = async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user!.user_id;
    if (!req.file?.buffer) {
      res.status(400).json({ success: false, message: 'No image file provided.' });
      return;
    }
    const imageMeta = await this.artistService.uploadProfileImage(userId, req.file.buffer);
    res.status(200).json({ success: true, data: imageMeta });
  };

  // ── POST /identity/verify ──────────────────────────────────────────────
  submitIdentityVerify = async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user!.user_id;
    const validated = identityVerifySchema.parse(req.body);
    const result = await this.artistService.submitIdentityVerification(
      userId,
      validated,
      req.file?.buffer
    );
    res.status(200).json({ success: true, data: result });
  };

  // ── POST /portfolio ────────────────────────────────────────────────────
  addPortfolioImage = async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user!.user_id;
    if (!req.file?.buffer) {
      res.status(400).json({ success: false, message: 'No image file provided.' });
      return;
    }
    const { category } = portfolioImageSchema.parse(req.body);
    const item = await this.artistService.addPortfolioImage(userId, req.file.buffer, category);
    res.status(201).json({ success: true, data: item });
  };

  // ── GET /portfolio ─────────────────────────────────────────────────────
  getPortfolio = async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user!.user_id;
    const portfolio = await this.artistService.getPortfolio(userId);
    res.status(200).json({ success: true, data: portfolio });
  };

  // ── POST /sub-artists ──────────────────────────────────────────────────
  addSubArtist = async (req: AuthRequest, res: Response): Promise<void> => {
    const ownerUserId = req.user!.user_id;
    const { user_id: targetUserId } = addSubArtistSchema.parse(req.body);
    const subArtist = await this.artistService.addSubArtist(ownerUserId, targetUserId);
    res.status(201).json({ success: true, data: subArtist });
  };

  // ── GET /sub-artists ───────────────────────────────────────────────────
  getSubArtists = async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user!.user_id;
    const members = await this.artistService.getSubArtists(userId);
    res.status(200).json({ success: true, data: members });
  };

  // ── POST /onboarding/submit ────────────────────────────────────────────
  submitOnboarding = async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user!.user_id;
    const result = await this.artistService.submitOnboarding(userId);
    res.status(200).json(result);
  };

  // ── GET /onboarding/status ─────────────────────────────────────────────
  getOnboardingStatus = async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user!.user_id;
    const status = await this.artistService.getOnboardingStatus(userId);
    res.status(200).json({ success: true, data: status });
  };
}
