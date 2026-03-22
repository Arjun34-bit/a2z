import { z } from 'zod';

export const createPOSchema = z.object({
  description: z.string().min(1, 'PO description is required'),
  supplier_ids: z.array(z.number().int().positive()).nonempty('At least one supplier must be selected'),
});

export type CreatePOInput = z.infer<typeof createPOSchema>;
