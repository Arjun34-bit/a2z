import { z } from 'zod';

export const createOrderSchema = z.object({
  product_name: z.string().min(1, 'Product name is required'),
  quantity: z.number().int().positive('Quantity must be a positive integer'),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
