import { ArtistProfile } from '@artist/index';

// ── Banner Types ──
export interface BannerTargeting {
  user_type?: string | null;
  platform?: string | null;
  country?: string | null;
  state?: string | null;
  min_app_version?: string | null;
}

export interface BannerCreateData {
  title: string;
  image_id?: string | null;
  mobile_image_id?: string | null;
  redirect_url?: string | null;
  description?: string | null;
  position?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  is_active?: boolean;
  priority?: number;
  targeting?: BannerTargeting[];
}

export interface BannerUpdateData extends Partial<BannerCreateData> {}

export interface BannerRow {
  banner_id: string;
  title: string;
  image_url: string | null;
  mobile_image_url: string | null;
  redirect_url: string | null;
  description: string | null;
  position: string | null;
  start_time: string | null;
  end_time: string | null;
  is_active: boolean;
  is_deleted: boolean;
  priority: number;
  created_at: string;
  updated_at: string;
  targeting?: BannerTargeting[];
}

// ── Category Types ──
export interface CategoryCreateData {
  category_name: string;
  slug?: string | null;
  description?: string | null;
  icon_url_id?: string | null;
  is_featured?: boolean;
  sort_order?: number;
  is_active?: boolean;
}

export interface CategoryUpdateData extends Partial<CategoryCreateData> {}

export interface CategoryRow {
  id: string;
  category_name: string;
  slug: string | null;
  description: string | null;
  icon_url: string | null;
  is_featured: boolean;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ── Admin Login Types ──
export interface AdminLoginResult {
  user_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  password_hash: string;
  role_name: string;
}

export interface IAdminRepository {
  // ── Auth ──
  findAdminByEmail(email: string): Promise<AdminLoginResult | null>;

  // ── Artists ──
  findPendingArtists(): Promise<ArtistProfile[]>;
  approveArtist(artistId: string): Promise<boolean>;
  getDashboardStats(): Promise<{
    totalUsers: number;
    totalArtists: number;
    pendingApprovals: number;
  }>;

  // ── Banners ──
  createBanner(data: BannerCreateData): Promise<BannerRow>;
  findAllBanners(): Promise<BannerRow[]>;
  findBannerById(bannerId: string): Promise<BannerRow | null>;
  updateBanner(bannerId: string, data: BannerUpdateData): Promise<BannerRow | null>;
  deleteBanner(bannerId: string): Promise<boolean>;

  // ── Categories ──
  createCategory(data: CategoryCreateData): Promise<CategoryRow>;
  findAllCategories(): Promise<CategoryRow[]>;
  findCategoryById(categoryId: string): Promise<CategoryRow | null>;
  updateCategory(categoryId: string, data: CategoryUpdateData): Promise<CategoryRow | null>;
  deleteCategory(categoryId: string): Promise<boolean>;
}
