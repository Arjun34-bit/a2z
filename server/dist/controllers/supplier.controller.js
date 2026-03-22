"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSuppliers = exports.createSupplier = void 0;
const index_1 = __importDefault(require("../db/index"));
const supplier_validation_1 = require("../validations/supplier.validation");
const createSupplier = async (req, res) => {
    try {
        const validatedData = supplier_validation_1.createSupplierSchema.parse(req.body);
        const { name, contact_info } = validatedData;
        const [newSupplier] = await index_1.default.query(`INSERT INTO "Suppliers" (name, contact_info) 
       VALUES (:name, :contact_info) RETURNING *`, { replacements: { name, contact_info: contact_info || null } });
        res.status(201).json({
            success: true,
            message: 'Supplier added successfully',
            data: newSupplier[0],
        });
    }
    catch (error) {
        if (error.name === 'ZodError') {
            res.status(400).json({ success: false, errors: error.errors });
        }
        else {
            res.status(500).json({ success: false, message: 'Server error', error: error.message });
        }
    }
};
exports.createSupplier = createSupplier;
const getSuppliers = async (req, res) => {
    try {
        const [suppliers] = await index_1.default.query(`SELECT * FROM "Suppliers" ORDER BY created_at DESC`);
        res.status(200).json({
            success: true,
            data: suppliers,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};
exports.getSuppliers = getSuppliers;
