import { Router } from 'express';
import { supplierController } from '../controllers/supplier.controller';
import { authenticate, requireAdmin } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate, requireAdmin); // All routes require admin

router.post('/', supplierController.createSupplier); // Admin adds supplier
router.get('/', supplierController.getSuppliers); // Admin views suppliers

export default router;
