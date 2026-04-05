import { Router } from 'express';
import { poController } from '../controllers/po.controller';
import { authenticate, requireAdmin } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate, requireAdmin); // All routes require admin

router.post('/', poController.createPO); // Admin raises PO to multiple suppliers
router.get('/', poController.getPOs); // Admin views all POs

export default router;
