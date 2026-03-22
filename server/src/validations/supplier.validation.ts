import { z } from 'zod';

export const createSupplierSchema = z.object({
  name: z.string().min(1, 'Supplier name is required'),
  contact_info: z.string().optional(),
});

export type CreateSupplierInput = z.infer<typeof createSupplierSchema>;
