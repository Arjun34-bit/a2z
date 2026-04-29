import { z } from 'zod';

export const approveArtistSchema = z.object({
  artistId: z.string().uuid('Invalid artist ID format'),
});
