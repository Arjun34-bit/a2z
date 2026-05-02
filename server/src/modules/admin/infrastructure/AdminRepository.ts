import { Sequelize, QueryTypes } from 'sequelize';
import {
  IAdminRepository,
  AdminLoginResult,
  BannerCreateData,
  BannerUpdateData,
  BannerRow,
  CategoryCreateData,
  CategoryUpdateData,
  CategoryRow,
} from '../application/interfaces/IAdminRepository';
import { ArtistProfile } from '@artist/index';

export class AdminRepository implements IAdminRepository {
  constructor(private readonly db: Sequelize) {}

  // ────────────────────────────────────────────────
  // Auth
  // ────────────────────────────────────────────────

  async findAdminByEmail(email: string): Promise<AdminLoginResult | null> {
    const results: any[] = await this.db.query(
      `SELECT u.user_id, u.email, u.first_name, u.last_name, u.password_hash,
              r.role_name
       FROM app.users u
       JOIN app.user_roles ur ON u.user_id = ur.user_id
       JOIN app.roles r ON ur.role_id = r.role_id
       WHERE u.email = :email AND r.role_name = 'admin'
       LIMIT 1`,
      { replacements: { email }, type: QueryTypes.SELECT }
    );
    return results.length > 0 ? results[0] : null;
  }

  // ────────────────────────────────────────────────
  // Artists
  // ────────────────────────────────────────────────

  async findPendingArtists(): Promise<ArtistProfile[]> {
    const results: any[] = await this.db.query(
      `SELECT * FROM app.artist_profiles WHERE is_verified = false ORDER BY created_at ASC`,
      { type: QueryTypes.SELECT }
    );
    return results.map(row => new ArtistProfile(row));
  }

  async approveArtist(artistId: string): Promise<boolean> {
    const [_, metadata] = await this.db.query(
      `UPDATE app.artist_profiles SET is_verified = true, updated_at = NOW() WHERE id = :artistId`,
      { replacements: { artistId }, type: QueryTypes.UPDATE }
    );
    return (metadata as any).rowCount > 0;
  }

  async getDashboardStats(): Promise<{
    totalUsers: number;
    totalArtists: number;
    pendingApprovals: number;
  }> {
    const results: any[] = await this.db.query(
      `SELECT 
        (SELECT COUNT(*) FROM app.users) as "totalUsers",
        (SELECT COUNT(*) FROM app.artist_profiles WHERE is_verified = true) as "totalArtists",
        (SELECT COUNT(*) FROM app.artist_profiles WHERE is_verified = false) as "pendingApprovals"
      `,
      { type: QueryTypes.SELECT }
    );

    const row = results[0];
    return {
      totalUsers: parseInt(row.totalUsers, 10),
      totalArtists: parseInt(row.totalArtists, 10),
      pendingApprovals: parseInt(row.pendingApprovals, 10),
    };
  }

  // ────────────────────────────────────────────────
  // Banners
  // ────────────────────────────────────────────────

  async createBanner(data: BannerCreateData): Promise<BannerRow> {
    const results: any[] = await this.db.query(
      `INSERT INTO app.banners (title, image_url, link_url, is_active, display_order, starts_at, ends_at, created_at, updated_at)
       VALUES (:title, :image_url, :link_url, :is_active, :display_order, :starts_at, :ends_at, NOW(), NOW())
       RETURNING *`,
      {
        replacements: {
          title: data.title,
          image_url: data.image_url,
          link_url: data.link_url || null,
          is_active: data.is_active ?? true,
          display_order: data.display_order ?? 0,
          starts_at: data.starts_at || null,
          ends_at: data.ends_at || null,
        },
        type: QueryTypes.INSERT,
      }
    );
    return (results as any)[0][0];
  }

  async findAllBanners(): Promise<BannerRow[]> {
    return this.db.query(
      `SELECT * FROM app.banners ORDER BY display_order ASC, created_at DESC`,
      { type: QueryTypes.SELECT }
    );
  }

  async findBannerById(bannerId: string): Promise<BannerRow | null> {
    const results: any[] = await this.db.query(
      `SELECT * FROM app.banners WHERE banner_id = :bannerId LIMIT 1`,
      { replacements: { bannerId }, type: QueryTypes.SELECT }
    );
    return results.length > 0 ? results[0] : null;
  }

  async updateBanner(bannerId: string, data: BannerUpdateData): Promise<BannerRow | null> {
    // Build dynamic SET clause from provided fields
    const fields: string[] = [];
    const replacements: Record<string, any> = { bannerId };

    if (data.title !== undefined) { fields.push('title = :title'); replacements.title = data.title; }
    if (data.image_url !== undefined) { fields.push('image_url = :image_url'); replacements.image_url = data.image_url; }
    if (data.link_url !== undefined) { fields.push('link_url = :link_url'); replacements.link_url = data.link_url; }
    if (data.is_active !== undefined) { fields.push('is_active = :is_active'); replacements.is_active = data.is_active; }
    if (data.display_order !== undefined) { fields.push('display_order = :display_order'); replacements.display_order = data.display_order; }
    if (data.starts_at !== undefined) { fields.push('starts_at = :starts_at'); replacements.starts_at = data.starts_at; }
    if (data.ends_at !== undefined) { fields.push('ends_at = :ends_at'); replacements.ends_at = data.ends_at; }

    if (fields.length === 0) return this.findBannerById(bannerId);

    fields.push('updated_at = NOW()');

    const results: any[] = await this.db.query(
      `UPDATE app.banners SET ${fields.join(', ')} WHERE banner_id = :bannerId RETURNING *`,
      { replacements, type: QueryTypes.UPDATE }
    );

    const rows = (results as any)[0];
    return rows && rows.length > 0 ? rows[0] : null;
  }

  async deleteBanner(bannerId: string): Promise<boolean> {
    const result: any = await this.db.query(
      `DELETE FROM app.banners WHERE banner_id = :bannerId`,
      { replacements: { bannerId }, type: QueryTypes.DELETE }
    );
    return (result as any)?.rowCount > 0 || (Array.isArray(result) && (result[1] as any)?.rowCount > 0);
  }

  // ────────────────────────────────────────────────
  // Categories
  // ────────────────────────────────────────────────

  async createCategory(data: CategoryCreateData): Promise<CategoryRow> {
    const results: any[] = await this.db.query(
      `INSERT INTO app.categories (category_name, slug, description, icon_url_id, is_featured, sort_order, is_active, created_at, updated_at)
       VALUES (:category_name, :slug, :description, :icon_url_id, :is_featured, :sort_order, :is_active, NOW(), NOW())
       RETURNING *`,
      {
        replacements: {
          category_name: data.category_name,
          slug: data.slug || null,
          description: data.description || null,
          icon_url_id: data.icon_url_id || null,
          is_featured: data.is_featured ?? false,
          sort_order: data.sort_order ?? 0,
          is_active: data.is_active ?? true,
        },
        type: QueryTypes.INSERT,
      }
    );
    return (results as any)[0][0];
  }

  async findAllCategories(): Promise<CategoryRow[]> {
    return this.db.query(
      `SELECT c.id, c.category_name, c.slug, c.description, i.url AS icon_url, c.is_featured, c.sort_order, c.is_active, c.created_at, c.updated_at 
       FROM app.categories c
       LEFT JOIN app.images i ON c.icon_url_id = i.id
       ORDER BY c.sort_order ASC, c.category_name ASC`,
      { type: QueryTypes.SELECT }
    );
  }

  async findCategoryById(categoryId: string): Promise<CategoryRow | null> {
    const results: any[] = await this.db.query(
      `SELECT c.id, c.category_name, c.slug, c.description, i.url AS icon_url, c.is_featured, c.sort_order, c.is_active, c.created_at, c.updated_at 
       FROM app.categories c
       LEFT JOIN app.images i ON c.icon_url_id = i.id
       WHERE c.id = :categoryId LIMIT 1`,
      { replacements: { categoryId }, type: QueryTypes.SELECT }
    );
    return results.length > 0 ? results[0] : null;
  }

  async updateCategory(categoryId: string, data: CategoryUpdateData): Promise<CategoryRow | null> {
    const fields: string[] = [];
    const replacements: Record<string, any> = { categoryId };

    if (data.category_name !== undefined) { fields.push('category_name = :category_name'); replacements.category_name = data.category_name; }
    if (data.slug !== undefined) { fields.push('slug = :slug'); replacements.slug = data.slug; }
    if (data.description !== undefined) { fields.push('description = :description'); replacements.description = data.description; }
    if (data.icon_url_id !== undefined) { fields.push('icon_url_id = :icon_url_id'); replacements.icon_url_id = data.icon_url_id; }
    if (data.is_featured !== undefined) { fields.push('is_featured = :is_featured'); replacements.is_featured = data.is_featured; }
    if (data.sort_order !== undefined) { fields.push('sort_order = :sort_order'); replacements.sort_order = data.sort_order; }
    if (data.is_active !== undefined) { fields.push('is_active = :is_active'); replacements.is_active = data.is_active; }

    if (fields.length === 0) return this.findCategoryById(categoryId);

    fields.push('updated_at = NOW()');

    const results: any[] = await this.db.query(
      `UPDATE app.categories SET ${fields.join(', ')} WHERE id = :categoryId RETURNING *`,
      { replacements, type: QueryTypes.UPDATE }
    );

    const rows = (results as any)[0];
    return rows && rows.length > 0 ? rows[0] : null;
  }

  async deleteCategory(categoryId: string): Promise<boolean> {
    const result: any = await this.db.query(
      `DELETE FROM app.categories WHERE id = :categoryId`,
      { replacements: { categoryId }, type: QueryTypes.DELETE }
    );
    return (result as any)?.rowCount > 0 || (Array.isArray(result) && (result[1] as any)?.rowCount > 0);
  }
}
