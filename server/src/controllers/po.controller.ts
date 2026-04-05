import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { createPOSchema } from '../validations/po.validation';
import { poService } from '../services/po.service';

class POController {
  public createPO = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const validatedData = createPOSchema.parse(req.body);
      const { description, supplier_ids } = validatedData;

      const poId = await poService.createPOInDB(description, supplier_ids);

      res.status(201).json({
        success: true,
        message: 'Purchase Order raised successfully',
        data: { poId, description, supplier_ids },
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        res.status(400).json({ success: false, errors: error.errors });
      } else {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
      }
    }
  };

  public getPOs = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const pos = await poService.getPOsFromDB();

      res.status(200).json({
        success: true,
        data: pos,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  };
}

export const poController = new POController();
