import { Response } from 'express';
import { ArtistService } from '../application/ArtistService';
import { AuthRequest } from '@shared/index';
import { updateArtistSchema } from './artist.validation';

export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user!.user_id;
      const profile = await this.artistService.getProfile(userId);
      res.status(200).json({ success: true, data: profile?.toPublicJSON() || {} });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user!.user_id;
      const validated = updateArtistSchema.parse(req.body);
      const profile = await this.artistService.updateProfile(userId, validated);
      res.status(200).json({ success: true, data: profile.toPublicJSON() });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        res.status(400).json({ success: false, errors: error.errors });
      } else {
        res.status(500).json({ success: false, message: error.message });
      }
    }
  };
}
