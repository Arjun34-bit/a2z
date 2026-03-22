import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import sequelize from '../db/index';
import { createOrderSchema } from '../validations/order.validation';

export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const validatedData = createOrderSchema.parse(req.body);
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { product_name, quantity } = validatedData;

    const [newOrder]: any = await sequelize.query(
      `INSERT INTO "Orders" (user_id, product_name, quantity) 
       VALUES (:userId, :product_name, :quantity) RETURNING *`,
      { replacements: { userId, product_name, quantity } }
    );

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: newOrder[0],
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

    let query = `SELECT o.*, u.name as user_name, u.email as user_email 
                 FROM "Orders" o 
                 JOIN "Users" u ON o.user_id = u.id`;
    let replacements = {};

    if (role !== 'admin') {
      query += ` WHERE o.user_id = :userId`;
      replacements = { userId };
    }

    query += ` ORDER BY o.created_at DESC`;

    const [orders] = await sequelize.query(query, { replacements });

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
