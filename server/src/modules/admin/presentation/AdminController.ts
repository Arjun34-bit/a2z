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
    const validated = adminLoginSchema.parse(req.body);
    const result = await this.adminService.login(validated.email, validated.password);
    res.status(200).json(result);
  };

  // ────────────────────────────────────────────────
  // Artists
  // ────────────────────────────────────────────────

  getPendingArtists = async (req: Request, res: Response): Promise<void> => {
    const artists = await this.adminService.getPendingArtists();
    res.status(200).json({ success: true, data: artists.map(a => a.toPublicJSON()) });
  };

  approveArtist = async (req: Request, res: Response): Promise<void> => {
    const validated = approveArtistSchema.parse(req.params);
    const result = await this.adminService.approveArtist(validated.artistId);
    res.status(200).json(result);
  };

  getDashboard = async (req: Request, res: Response): Promise<void> => {
    const stats = await this.adminService.getDashboardStats();
    res.status(200).json({ success: true, data: stats });
  };

  // ────────────────────────────────────────────────
  // Banners
  // ────────────────────────────────────────────────

  createBanner = async (req: Request, res: Response): Promise<void> => {
    const validated = createBannerSchema.parse(req.body);
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    const imageBuffer = files?.['image']?.[0]?.buffer;
    const mobileImageBuffer = files?.['mobile_image']?.[0]?.buffer;
    
    const banner = await this.adminService.createBanner(validated, imageBuffer, mobileImageBuffer);
    res.status(201).json({ success: true, data: banner });
  };

  getAllBanners = async (req: Request, res: Response): Promise<void> => {
    const banners = await this.adminService.getAllBanners();
    res.status(200).json({ success: true, data: banners });
  };

  getBannerById = async (req: Request, res: Response): Promise<void> => {
    const { bannerId } = bannerIdParamSchema.parse(req.params);
    const banner = await this.adminService.getBannerById(bannerId);
    res.status(200).json({ success: true, data: banner });
  };

  updateBanner = async (req: Request, res: Response): Promise<void> => {
    const { bannerId } = bannerIdParamSchema.parse(req.params);
    const validated = updateBannerSchema.parse(req.body);
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    const imageBuffer = files?.['image']?.[0]?.buffer;
    const mobileImageBuffer = files?.['mobile_image']?.[0]?.buffer;
    
    const banner = await this.adminService.updateBanner(bannerId, validated, imageBuffer, mobileImageBuffer);
    res.status(200).json({ success: true, data: banner });
  };

  deleteBanner = async (req: Request, res: Response): Promise<void> => {
    const { bannerId } = bannerIdParamSchema.parse(req.params);
    const result = await this.adminService.deleteBanner(bannerId);
    res.status(200).json(result);
  };

  // ────────────────────────────────────────────────
  // Categories
  // ────────────────────────────────────────────────

  createCategory = async (req: Request, res: Response): Promise<void> => {
    const validated = createCategorySchema.parse(req.body);
    const category = await this.adminService.createCategory(validated, req.file?.buffer);
    res.status(201).json({ success: true, data: category });
  };

  getAllCategories = async (req: Request, res: Response): Promise<void> => {
    const categories = await this.adminService.getAllCategories();
    res.status(200).json({ success: true, data: categories });
  };

  getCategoryById = async (req: Request, res: Response): Promise<void> => {
    const { categoryId } = categoryIdParamSchema.parse(req.params);
    const category = await this.adminService.getCategoryById(categoryId);
    res.status(200).json({ success: true, data: category });
  };

  updateCategory = async (req: Request, res: Response): Promise<void> => {
    const { categoryId } = categoryIdParamSchema.parse(req.params);
    const validated = updateCategorySchema.parse(req.body);
    const category = await this.adminService.updateCategory(categoryId, validated, req.file?.buffer);
    res.status(200).json({ success: true, data: category });
  };

  deleteCategory = async (req: Request, res: Response): Promise<void> => {
    const { categoryId } = categoryIdParamSchema.parse(req.params);
    const result = await this.adminService.deleteCategory(categoryId);
    res.status(200).json(result);
  };
}
