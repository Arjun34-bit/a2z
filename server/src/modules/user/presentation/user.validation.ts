import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  avatarUrl: z.string().url().optional(),
});

export const createAddressSchema = z.object({
  label: z.string().optional(),
  line1: z.string().min(5),
  line2: z.string().optional(),
  city: z.string().min(2),
  state: z.string().min(2),
  pincode: z.string().min(4),
  isDefault: z.boolean().optional(),
});
