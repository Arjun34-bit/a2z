import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { createOrderSchema } from '../validations/order.validation';
import { createOrderInDB, getOrdersFromDB } from '../services/order.service';

export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const validatedData = createOrderSchema.parse(req.body);
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { product_name, quantity } = validatedData;

    const newOrder = await createOrderInDB(userId, product_name, quantity);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: newOrder,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ success: false, errors: error.errors });
    } else {
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  }
};

export const getOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const role = req.user?.role;

    const orders = await getOrdersFromDB(role, userId);

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
