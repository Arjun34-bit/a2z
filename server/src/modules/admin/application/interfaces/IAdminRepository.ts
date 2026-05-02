import { ArtistProfile } from '@artist/index';

// ── Banner Types ──
export interface BannerCreateData {
  title: string;
  image_url: string;
  link_url?: string;
  is_active?: boolean;
  display_order?: number;
  starts_at?: string;
  ends_at?: string;
}

export interface BannerUpdateData extends Partial<BannerCreateData> {}

export interface BannerRow {
  banner_id: string;
  title: string;
  image_url: string;
  link_url: string | null;
  is_active: boolean;
  display_order: number;
  starts_at: string | null;
  ends_at: string | null;
  created_at: string;
  updated_at: string;
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
