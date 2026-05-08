import { z } from 'zod';

// ── GSTIN regex (Indian GST format, 15 chars) ──────────────────────────
const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

// ── Step 1: Artist Type ────────────────────────────────────────────────
export const artistTypeSchema = z.object({
  org_type: z.enum(['solo', 'parlor']).refine(val => ['solo', 'parlor'].includes(val), {
    message: "org_type must be 'solo' or 'parlor'",
  }),
});

// ── Step 2: Basic Info (fields vary by type; service enforces required) ─
export const basicInfoSchema = z.object({
  full_name:       z.string().min(2).max(255).optional(),
  display_name:    z.string().max(255).optional().nullable(),
  city:            z.string().min(1).max(100).optional(),
  locality:        z.string().min(1).max(100).optional(),
  bio:             z.string().max(2000).optional().nullable(),
  experience_years: z.number().int().min(0).max(60).optional().nullable(),
  // Parlor-specific — ignored for solo at the service level
  parlor_name: z.string().min(1).max(255).optional(),
  gstin:       z.string().regex(GSTIN_REGEX, 'Invalid GSTIN format').optional(),
  address:     z.string().min(1).optional().nullable(),
});

// ── Step 4: Identity Verification ──────────────────────────────────────
export const identityVerifySchema = z.object({
  document_type:   z.string().min(1, 'document_type is required'),
  document_number: z.string().min(1, 'document_number is required'),
});

// ── Step 5: Portfolio Image ─────────────────────────────────────────────
export const portfolioImageSchema = z.object({
  category: z.string().min(1, 'category is required').max(100),
});

// ── Sub-artist ──────────────────────────────────────────────────────────
export const addSubArtistSchema = z.object({
  user_id: z.string().uuid('user_id must be a valid UUID'),
});

// ── Admin: Artist ID param ──────────────────────────────────────────────
export const artistIdParamSchema = z.object({
  artistId: z.string().uuid('Invalid artist ID'),
});
