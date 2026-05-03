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
import { generateTokens, UnauthorizedError, NotFoundError } from '@shared/index';
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
      throw new UnauthorizedError('Invalid email or password.');
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password.');
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
      throw new NotFoundError('Artist not found or already approved.');
    }
    return { success: true, message: 'Artist approved successfully.' };
  }

  async getDashboardStats() {
    return this.adminRepo.getDashboardStats();
  }

  // ────────────────────────────────────────────────
  // Banners
  // ────────────────────────────────────────────────

  async createBanner(data: BannerCreateData, imageBuffer?: Buffer, mobileImageBuffer?: Buffer): Promise<BannerRow> {
    if (imageBuffer) {
      const imageMeta = await this.imageService.upload(imageBuffer, 'a2z_banners');
      data.image_id = imageMeta.id;
    }
    if (mobileImageBuffer) {
      const mobileImageMeta = await this.imageService.upload(mobileImageBuffer, 'a2z_banners');
      data.mobile_image_id = mobileImageMeta.id;
    }
    return this.adminRepo.createBanner(data);
  }

  async getAllBanners(): Promise<BannerRow[]> {
    return this.adminRepo.findAllBanners();
  }

  async getBannerById(bannerId: string): Promise<BannerRow> {
    const banner = await this.adminRepo.findBannerById(bannerId);
    if (!banner) {
      throw new NotFoundError('Banner not found.');
    }
    return banner;
  }

  async updateBanner(bannerId: string, data: BannerUpdateData, imageBuffer?: Buffer, mobileImageBuffer?: Buffer): Promise<BannerRow> {
    if (imageBuffer) {
      const imageMeta = await this.imageService.upload(imageBuffer, 'a2z_banners');
      data.image_id = imageMeta.id;
    }
    if (mobileImageBuffer) {
      const mobileImageMeta = await this.imageService.upload(mobileImageBuffer, 'a2z_banners');
      data.mobile_image_id = mobileImageMeta.id;
    }
    const banner = await this.adminRepo.updateBanner(bannerId, data);
    if (!banner) {
      throw new NotFoundError('Banner not found.');
    }
    return banner;
  }

  async deleteBanner(bannerId: string): Promise<{ success: boolean; message: string }> {
    const deleted = await this.adminRepo.deleteBanner(bannerId);
    if (!deleted) {
      throw new NotFoundError('Banner not found.');
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
      throw new NotFoundError('Category not found.');
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
      throw new NotFoundError('Category not found.');
    }
    return category;
  }

  async deleteCategory(categoryId: string): Promise<{ success: boolean; message: string }> {
    const deleted = await this.adminRepo.deleteCategory(categoryId);
    if (!deleted) {
      throw new NotFoundError('Category not found.');
    }
    return { success: true, message: 'Category deleted successfully.' };
  }
}
