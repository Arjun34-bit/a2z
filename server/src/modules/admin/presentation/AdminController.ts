import { Request, Response } from 'express';
import { AdminService } from '../application/AdminService';
import {
  adminLoginSchema,
  approveArtistSchema,
  createBannerSchema,
  updateBannerSchema,
  bannerIdParamSchema,
  createCategorySchema,
  updateCategorySchema,
  categoryIdParamSchema,
} from './admin.validation';

export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ────────────────────────────────────────────────
  // Admin Login (POST /api/v1/admin/login)
  // ────────────────────────────────────────────────

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const validated = adminLoginSchema.parse(req.body);
      const result = await this.adminService.login(validated.email, validated.password);
      res.status(200).json(result);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        res.status(400).json({ success: false, errors: error.errors });
      } else {
        res.status(401).json({ success: false, message: error.message });
      }
    }
  };

  // ────────────────────────────────────────────────
  // Artists
  // ────────────────────────────────────────────────

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

  // ────────────────────────────────────────────────
  // Banners
  // ────────────────────────────────────────────────

  createBanner = async (req: Request, res: Response): Promise<void> => {
    try {
      const validated = createBannerSchema.parse(req.body);
      const banner = await this.adminService.createBanner(validated);
      res.status(201).json({ success: true, data: banner });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        res.status(400).json({ success: false, errors: error.errors });
      } else {
        res.status(500).json({ success: false, message: error.message });
      }
    }
  };

  getAllBanners = async (req: Request, res: Response): Promise<void> => {
    try {
      const banners = await this.adminService.getAllBanners();
      res.status(200).json({ success: true, data: banners });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  getBannerById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { bannerId } = bannerIdParamSchema.parse(req.params);
      const banner = await this.adminService.getBannerById(bannerId);
      res.status(200).json({ success: true, data: banner });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        res.status(400).json({ success: false, errors: error.errors });
      } else {
        res.status(404).json({ success: false, message: error.message });
      }
    }
  };

  updateBanner = async (req: Request, res: Response): Promise<void> => {
    try {
      const { bannerId } = bannerIdParamSchema.parse(req.params);
      const validated = updateBannerSchema.parse(req.body);
      const banner = await this.adminService.updateBanner(bannerId, validated);
      res.status(200).json({ success: true, data: banner });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        res.status(400).json({ success: false, errors: error.errors });
      } else {
        res.status(404).json({ success: false, message: error.message });
      }
    }
  };

  deleteBanner = async (req: Request, res: Response): Promise<void> => {
    try {
      const { bannerId } = bannerIdParamSchema.parse(req.params);
      const result = await this.adminService.deleteBanner(bannerId);
      res.status(200).json(result);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        res.status(400).json({ success: false, errors: error.errors });
      } else {
        res.status(404).json({ success: false, message: error.message });
      }
    }
  };

  // ────────────────────────────────────────────────
  // Categories
  // ────────────────────────────────────────────────

  createCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const validated = createCategorySchema.parse(req.body);
      const category = await this.adminService.createCategory(validated, req.file?.buffer);
      res.status(201).json({ success: true, data: category });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        res.status(400).json({ success: false, errors: error.errors });
      } else {
        res.status(500).json({ success: false, message: error.message });
      }
    }
  };

  getAllCategories = async (req: Request, res: Response): Promise<void> => {
    try {
      const categories = await this.adminService.getAllCategories();
      res.status(200).json({ success: true, data: categories });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  getCategoryById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { categoryId } = categoryIdParamSchema.parse(req.params);
      const category = await this.adminService.getCategoryById(categoryId);
      res.status(200).json({ success: true, data: category });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        res.status(400).json({ success: false, errors: error.errors });
      } else {
        res.status(404).json({ success: false, message: error.message });
      }
    }
  };

  updateCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const { categoryId } = categoryIdParamSchema.parse(req.params);
      const validated = updateCategorySchema.parse(req.body);
      const category = await this.adminService.updateCategory(categoryId, validated, req.file?.buffer);
      res.status(200).json({ success: true, data: category });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        res.status(400).json({ success: false, errors: error.errors });
      } else {
        res.status(404).json({ success: false, message: error.message });
      }
    }
  };

  deleteCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const { categoryId } = categoryIdParamSchema.parse(req.params);
      const result = await this.adminService.deleteCategory(categoryId);
      res.status(200).json(result);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        res.status(400).json({ success: false, errors: error.errors });
      } else {
        res.status(404).json({ success: false, message: error.message });
      }
    }
  };
}
