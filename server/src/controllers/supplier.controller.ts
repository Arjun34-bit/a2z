import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { createSupplierSchema } from '../validations/supplier.validation';
import { supplierService } from '../services/supplier.service';

class SupplierController {
  public createSupplier = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const validatedData = createSupplierSchema.parse(req.body);
      const { name, contact_info } = validatedData;

      const newSupplier = await supplierService.createSupplierInDB(name, contact_info || null);

      res.status(201).json({
        success: true,
        message: 'Supplier added successfully',
        data: newSupplier,
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        res.status(400).json({ success: false, errors: error.errors });
      } else {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
      }
    }
  };

  public getSuppliers = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const suppliers = await supplierService.getAllSuppliersFromDB();

      res.status(200).json({
        success: true,
        data: suppliers,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  };
}

export const supplierController = new SupplierController();
