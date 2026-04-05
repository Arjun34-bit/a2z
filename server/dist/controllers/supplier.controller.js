"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supplierController = void 0;
const supplier_validation_1 = require("../validations/supplier.validation");
const supplier_service_1 = require("../services/supplier.service");
class SupplierController {
    createSupplier = async (req, res) => {
        try {
            const validatedData = supplier_validation_1.createSupplierSchema.parse(req.body);
            const { name, contact_info } = validatedData;
            const newSupplier = await supplier_service_1.supplierService.createSupplierInDB(name, contact_info || null);
            res.status(201).json({
                success: true,
                message: 'Supplier added successfully',
                data: newSupplier,
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
    getSuppliers = async (req, res) => {
        try {
            const suppliers = await supplier_service_1.supplierService.getAllSuppliersFromDB();
            res.status(200).json({
                success: true,
                data: suppliers,
            });
        }
        catch (error) {
            res.status(500).json({ success: false, message: 'Server error', error: error.message });
        }
    };
}
exports.supplierController = new SupplierController();
