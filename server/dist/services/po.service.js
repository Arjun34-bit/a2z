"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.poService = void 0;
const index_1 = __importDefault(require("../db/index"));
class POService {
    createPOInDB = async (description, supplierIds) => {
        const t = await index_1.default.transaction();
        try {
            const [newPO] = await index_1.default.query(`INSERT INTO "PurchaseOrders" (description) 
         VALUES (:description) RETURNING id`, { replacements: { description }, transaction: t });
            const poId = newPO[0].id;
            const valuesPart = supplierIds.map((_, i) => `(:poId, :supplierId${i})`).join(', ');
            const replacements = { poId };
            supplierIds.forEach((id, i) => {
                replacements[`supplierId${i}`] = id;
            });
            await index_1.default.query(`INSERT INTO "POSuppliers" (po_id, supplier_id) VALUES ${valuesPart}`, { replacements, transaction: t });
            await t.commit();
            return poId;
        }
        catch (error) {
            await t.rollback();
            throw error;
        }
    };
    getPOsFromDB = async () => {
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
        const [pos] = await index_1.default.query(query);
        return pos;
    };
}
exports.poService = new POService();
