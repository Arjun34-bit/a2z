import { z } from 'zod';

// ── Admin Login ──
export const adminLoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

// ── Artist Approval ──
export const approveArtistSchema = z.object({
  artistId: z.string().uuid('Invalid artist ID format'),
});

// ── Banner Schemas ──
export const createBannerSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  image_url: z.string().url('Invalid image URL'),
  link_url: z.string().url('Invalid link URL').optional(),
  is_active: z.boolean().optional(),
  display_order: z.number().int().min(0).optional(),
  starts_at: z.string().datetime().optional(),
  ends_at: z.string().datetime().optional(),
});

export const updateBannerSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  image_url: z.string().url('Invalid image URL').optional(),
  link_url: z.string().url('Invalid link URL').optional(),
  is_active: z.boolean().optional(),
  display_order: z.number().int().min(0).optional(),
  starts_at: z.string().datetime().optional(),
  ends_at: z.string().datetime().optional(),
});

export const bannerIdParamSchema = z.object({
  bannerId: z.string().uuid('Invalid banner ID format'),
});

// ── Category Schemas ──
export const createCategorySchema = z.object({
  category_name: z.string().min(1, 'Category name is required').max(255),
  slug: z.string().max(255).optional().nullable(),
  description: z.string().max(1000).optional().nullable(),
  icon_url: z.string().url('Invalid icon URL').optional().nullable(),
  is_featured: z.boolean().optional(),
  sort_order: z.number().int().optional(),
  is_active: z.boolean().optional(),
});

export const updateCategorySchema = z.object({
  category_name: z.string().min(1).max(255).optional(),
  slug: z.string().max(255).optional().nullable(),
  description: z.string().max(1000).optional().nullable(),
  icon_url: z.string().url('Invalid icon URL').optional().nullable(),
  is_featured: z.boolean().optional(),
  sort_order: z.number().int().optional(),
  is_active: z.boolean().optional(),
});

export const categoryIdParamSchema = z.object({
  categoryId: z.string().uuid('Invalid category ID format'),
});
