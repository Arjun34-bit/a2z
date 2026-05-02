import bcrypt from 'bcrypt';
import {
  IAdminRepository,
  BannerCreateData,
  BannerUpdateData,
  BannerRow,
  CategoryCreateData,
  CategoryUpdateData,
  CategoryRow,
} from './interfaces/IAdminRepository';
import { ArtistProfile } from '@artist/index';
import { generateTokens } from '@shared/index';
import { ImageService } from '@upload/index';

export class AdminService {
  constructor(
    private readonly adminRepo: IAdminRepository,
    private readonly imageService: ImageService
  ) {}

  // ────────────────────────────────────────────────
  // Admin Login (email + password)
  // ────────────────────────────────────────────────

  async login(email: string, password: string): Promise<{
    success: boolean;
    data: {
      user: { user_id: string; email: string; first_name: string | null; last_name: string | null; role: string };
      tokens: { accessToken: string; refreshToken: string };
    };
  }> {
    const admin = await this.adminRepo.findAdminByEmail(email);

    if (!admin) {
      throw new Error('Invalid email or password.');
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password_hash);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password.');
    }

    const tokens = generateTokens({ user_id: admin.user_id, role: admin.role_name });

    return {
      success: true,
      data: {
        user: {
          user_id: admin.user_id,
          email: admin.email,
          first_name: admin.first_name,
          last_name: admin.last_name,
          role: admin.role_name,
        },
        tokens,
      },
    };
  }

  // ────────────────────────────────────────────────
  // Artists
  // ────────────────────────────────────────────────

  async getPendingArtists(): Promise<ArtistProfile[]> {
    return this.adminRepo.findPendingArtists();
  }

  async approveArtist(artistId: string): Promise<{ success: boolean; message: string }> {
    const approved = await this.adminRepo.approveArtist(artistId);
    if (!approved) {
      throw new Error('Artist not found or already approved.');
    }
    return { success: true, message: 'Artist approved successfully.' };
  }

  async getDashboardStats() {
    return this.adminRepo.getDashboardStats();
  }

  // ────────────────────────────────────────────────
  // Banners
  // ────────────────────────────────────────────────

  async createBanner(data: BannerCreateData): Promise<BannerRow> {
    return this.adminRepo.createBanner(data);
  }

  async getAllBanners(): Promise<BannerRow[]> {
    return this.adminRepo.findAllBanners();
  }

  async getBannerById(bannerId: string): Promise<BannerRow> {
    const banner = await this.adminRepo.findBannerById(bannerId);
    if (!banner) {
      throw new Error('Banner not found.');
    }
    return banner;
  }

  async updateBanner(bannerId: string, data: BannerUpdateData): Promise<BannerRow> {
    const banner = await this.adminRepo.updateBanner(bannerId, data);
    if (!banner) {
      throw new Error('Banner not found.');
    }
    return banner;
  }

  async deleteBanner(bannerId: string): Promise<{ success: boolean; message: string }> {
    const deleted = await this.adminRepo.deleteBanner(bannerId);
    if (!deleted) {
      throw new Error('Banner not found.');
    }
    return { success: true, message: 'Banner deleted successfully.' };
  }

  // ────────────────────────────────────────────────
  // Categories
  // ────────────────────────────────────────────────

  async createCategory(data: CategoryCreateData, fileBuffer?: Buffer): Promise<CategoryRow> {
    if (fileBuffer) {
      const imageMetadata = await this.imageService.upload(fileBuffer, 'a2z_categories');
      data.icon_url_id = imageMetadata.id;
    }
    return this.adminRepo.createCategory(data);
  }

  async getAllCategories(): Promise<CategoryRow[]> {
    return this.adminRepo.findAllCategories();
  }

  async getCategoryById(categoryId: string): Promise<CategoryRow> {
    const category = await this.adminRepo.findCategoryById(categoryId);
    if (!category) {
      throw new Error('Category not found.');
    }
    return category;
  }

  async updateCategory(categoryId: string, data: CategoryUpdateData, fileBuffer?: Buffer): Promise<CategoryRow> {
    if (fileBuffer) {
      const imageMetadata = await this.imageService.upload(fileBuffer, 'a2z_categories');
      data.icon_url_id = imageMetadata.id;
    }
    const category = await this.adminRepo.updateCategory(categoryId, data);
    if (!category) {
      throw new Error('Category not found.');
    }
    return category;
  }

  async deleteCategory(categoryId: string): Promise<{ success: boolean; message: string }> {
    const deleted = await this.adminRepo.deleteCategory(categoryId);
    if (!deleted) {
      throw new Error('Category not found.');
    }
    return { success: true, message: 'Category deleted successfully.' };
  }
}
