import sequelize from '../db/index';

export const createPOInDB = async (description: string, supplierIds: number[]) => {
  const t = await sequelize.transaction();
  try {
    const [newPO]: any = await sequelize.query(
      `INSERT INTO "PurchaseOrders" (description) 
       VALUES (:description) RETURNING id`,
      { replacements: { description }, transaction: t }
    );

    const poId = newPO[0].id;

    const valuesPart = supplierIds.map((_, i) => `(:poId, :supplierId${i})`).join(', ');
    const replacements: Record<string, any> = { poId };
    supplierIds.forEach((id, i) => {
      replacements[`supplierId${i}`] = id;
    });

    await sequelize.query(
      `INSERT INTO "POSuppliers" (po_id, supplier_id) VALUES ${valuesPart}`,
      { replacements, transaction: t }
    );

    await t.commit();
    return poId;
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

export const getPOsFromDB = async () => {
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
  return pos;
};
