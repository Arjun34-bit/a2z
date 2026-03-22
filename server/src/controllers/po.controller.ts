import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import sequelize from '../db/index';
import { createPOSchema } from '../validations/po.validation';

export const createPO = async (req: AuthRequest, res: Response): Promise<void> => {
  const t = await sequelize.transaction();
  try {
    const validatedData = createPOSchema.parse(req.body);
    const { description, supplier_ids } = validatedData;

    // 1. Create Purchase Order
    const [newPO]: any = await sequelize.query(
      `INSERT INTO "PurchaseOrders" (description) 
       VALUES (:description) RETURNING id`,
      { replacements: { description }, transaction: t }
    );

    const poId = newPO[0].id;

    // 2. Link PO with selected Suppliers
    const valuesPart = supplier_ids.map((_, i) => `(:poId, :supplierId${i})`).join(', ');
    const replacements: Record<string, any> = { poId };
    supplier_ids.forEach((id, i) => {
      replacements[`supplierId${i}`] = id;
    });

    await sequelize.query(
      `INSERT INTO "POSuppliers" (po_id, supplier_id) VALUES ${valuesPart}`,
      { replacements, transaction: t }
    );

    await t.commit();

    res.status(201).json({
      success: true,
      message: 'Purchase Order raised successfully',
      data: { poId, description, supplier_ids },
    });
  } catch (error: any) {
    await t.rollback();
    if (error.name === 'ZodError') {
      res.status(400).json({ success: false, errors: error.errors });
    } else {
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  }
};

export const getPOs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // We can use JSON aggregation in PostgreSQL to get suppliers as an array
    const query = `
      SELECT 
        po.id, po.description, po.status, po.created_at, po.updated_at,
        COALESCE(
          json_agg(
            json_build_object('id', s.id, 'name', s.name, 'contact_info', s.contact_info)
          ) FILTER (WHERE s.id IS NOT NULL), '[]'
        ) AS suppliers
      FROM "PurchaseOrders" po
      LEFT JOIN "POSuppliers" pos ON po.id = pos.po_id
      LEFT JOIN "Suppliers" s ON pos.supplier_id = s.id
      GROUP BY po.id
      ORDER BY po.created_at DESC
    `;

    const [pos] = await sequelize.query(query);

    res.status(200).json({
      success: true,
      data: pos,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
