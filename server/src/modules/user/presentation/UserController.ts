import { Response } from 'express';
import { UserProfileService } from '../application/UserProfileService';
import { AuthRequest } from '@shared/index';
import { updateProfileSchema, createAddressSchema } from './user.validation';

export class UserController {
  constructor(private readonly userService: UserProfileService) { }

  getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user!.user_id;
      console.log("userId---->", userId)
      const profile = await this.userService.getProfile(userId);
      res.status(200).json({ success: true, data: profile?.toPublicJSON() || {} });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user!.user_id;
      const validated = updateProfileSchema.parse(req.body);
      const profile = await this.userService.updateProfile(userId, validated);
      res.status(200).json({ success: true, data: profile.toPublicJSON() });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        res.status(400).json({ success: false, errors: error.errors });
      } else {
        res.status(500).json({ success: false, message: error.message });
      }
    }
  };

  getAddresses = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user!.user_id;
      const addresses = await this.userService.getAddresses(userId);
      res.status(200).json({ success: true, data: addresses });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  addAddress = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user!.user_id;
      const validated = createAddressSchema.parse(req.body);
      const address = await this.userService.addAddress(userId, validated as any);
      res.status(201).json({ success: true, data: address });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        res.status(400).json({ success: false, errors: error.errors });
      } else {
        res.status(500).json({ success: false, message: error.message });
      }
    }
  };
}
