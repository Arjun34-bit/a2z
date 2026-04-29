import { z } from 'zod';

export const updateArtistSchema = z.object({
  displayName: z.string().min(2).optional(),
  bio: z.string().optional(),
  category: z.string().optional(),
  isAvailable: z.boolean().optional(),
});
