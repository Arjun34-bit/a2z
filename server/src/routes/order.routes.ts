import { Router } from 'express';
import { orderController } from '../controllers/order.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', authenticate, orderController.createOrder); // User places order
router.get('/', authenticate, orderController.getOrders); // User views own, Admin views all

export default router;
