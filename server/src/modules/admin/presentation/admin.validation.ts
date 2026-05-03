import { z } from 'zod';

// Helpers to handle multipart/form-data string payloads
const booleanFromForm = z.preprocess(
  (val) => {
    if (typeof val === 'string') return val === 'true';
    return val;
  },
  z.boolean()
);

const numberFromForm = z.preprocess(
  (val) => {
    if (typeof val === 'string' && val.trim() !== '') return Number(val);
    return val;
  },
  z.number().int()
);

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
const targetingSchema = z.object({
  user_type: z.string().optional().nullable(),
  platform: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  min_app_version: z.string().optional().nullable(),
});

const targetingFromForm = z.preprocess((val) => {
  if (typeof val === 'string') {
    try {
      return JSON.parse(val);
    } catch {
      return [];
    }
  }
  return val;
}, z.array(targetingSchema).optional());

export const createBannerSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  redirect_url: z.string().url('Invalid redirect URL').or(z.literal('')).optional().nullable(),
  description: z.string().optional().nullable(),
  position: z.string().optional().nullable(),
  is_active: booleanFromForm.optional(),
  priority: numberFromForm.pipe(z.number().min(0)).optional(),
  start_time: z.string().datetime().or(z.literal('')).optional().nullable(),
  end_time: z.string().datetime().or(z.literal('')).optional().nullable(),
  targeting: targetingFromForm,
});

export const updateBannerSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  redirect_url: z.string().url('Invalid redirect URL').or(z.literal('')).optional().nullable(),
  description: z.string().optional().nullable(),
  position: z.string().optional().nullable(),
  is_active: booleanFromForm.optional(),
  priority: numberFromForm.pipe(z.number().min(0)).optional(),
  start_time: z.string().datetime().or(z.literal('')).optional().nullable(),
  end_time: z.string().datetime().or(z.literal('')).optional().nullable(),
  targeting: targetingFromForm,
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
  is_featured: booleanFromForm.optional(),
  sort_order: numberFromForm.optional(),
  is_active: booleanFromForm.optional(),
});

export const updateCategorySchema = z.object({
  category_name: z.string().min(1).max(255).optional(),
  slug: z.string().max(255).optional().nullable(),
  description: z.string().max(1000).optional().nullable(),
  icon_url: z.string().url('Invalid icon URL').optional().nullable(),
  is_featured: booleanFromForm.optional(),
  sort_order: numberFromForm.optional(),
  is_active: booleanFromForm.optional(),
});

export const categoryIdParamSchema = z.object({
  categoryId: z.string().uuid('Invalid category ID format'),
});
