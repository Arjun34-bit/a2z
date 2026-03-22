"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPOs = exports.createPO = void 0;
const index_1 = __importDefault(require("../db/index"));
const po_validation_1 = require("../validations/po.validation");
const createPO = async (req, res) => {
    const t = await index_1.default.transaction();
    try {
        const validatedData = po_validation_1.createPOSchema.parse(req.body);
        const { description, supplier_ids } = validatedData;
        // 1. Create Purchase Order
        const [newPO] = await index_1.default.query(`INSERT INTO "PurchaseOrders" (description) 
       VALUES (:description) RETURNING id`, { replacements: { description }, transaction: t });
        const poId = newPO[0].id;
        // 2. Link PO with selected Suppliers
        const valuesPart = supplier_ids.map((_, i) => `(:poId, :supplierId${i})`).join(', ');
        const replacements = { poId };
        supplier_ids.forEach((id, i) => {
            replacements[`supplierId${i}`] = id;
        });
        await index_1.default.query(`INSERT INTO "POSuppliers" (po_id, supplier_id) VALUES ${valuesPart}`, { replacements, transaction: t });
        await t.commit();
        res.status(201).json({
            success: true,
            message: 'Purchase Order raised successfully',
            data: { poId, description, supplier_ids },
        });
    }
    catch (error) {
        await t.rollback();
        if (error.name === 'ZodError') {
            res.status(400).json({ success: false, errors: error.errors });
        }
        else {
            res.status(500).json({ success: false, message: 'Server error', error: error.message });
        }
    }
};
exports.createPO = createPO;
const getPOs = async (req, res) => {
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
        const [pos] = await index_1.default.query(query);
        res.status(200).json({
            success: true,
            data: pos,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};
exports.getPOs = getPOs;
