import { Router } from 'express';
import { createOrder, getOrders } from '../controllers/order.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', authenticate, createOrder); // User places order
router.get('/', authenticate, getOrders); // User views own, Admin views all

export default router;
