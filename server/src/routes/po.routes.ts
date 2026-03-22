import { Router } from 'express';
import { createPO, getPOs } from '../controllers/po.controller';
import { authenticate, requireAdmin } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate, requireAdmin); // All routes require admin

router.post('/', createPO); // Admin raises PO to multiple suppliers
router.get('/', getPOs); // Admin views all POs

export default router;
