import { Request, Response } from 'express';
import { AdminService } from '../application/AdminService';
import { approveArtistSchema } from './admin.validation';

export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  getPendingArtists = async (req: Request, res: Response): Promise<void> => {
    try {
      const artists = await this.adminService.getPendingArtists();
      res.status(200).json({ success: true, data: artists.map(a => a.toPublicJSON()) });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  approveArtist = async (req: Request, res: Response): Promise<void> => {
    try {
      const validated = approveArtistSchema.parse(req.params);
      const result = await this.adminService.approveArtist(validated.artistId);
      res.status(200).json(result);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        res.status(400).json({ success: false, errors: error.errors });
      } else {
        res.status(404).json({ success: false, message: error.message });
      }
    }
  };

  getDashboard = async (req: Request, res: Response): Promise<void> => {
    try {
      const stats = await this.adminService.getDashboardStats();
      res.status(200).json({ success: true, data: stats });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
}
