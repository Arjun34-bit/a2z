"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.poController = void 0;
const po_validation_1 = require("../validations/po.validation");
const po_service_1 = require("../services/po.service");
class POController {
    createPO = async (req, res) => {
        try {
            const validatedData = po_validation_1.createPOSchema.parse(req.body);
            const { description, supplier_ids } = validatedData;
            const poId = await po_service_1.poService.createPOInDB(description, supplier_ids);
            res.status(201).json({
                success: true,
                message: 'Purchase Order raised successfully',
                data: { poId, description, supplier_ids },
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
    getPOs = async (req, res) => {
        try {
            const pos = await po_service_1.poService.getPOsFromDB();
            res.status(200).json({
                success: true,
                data: pos,
            });
        }
        catch (error) {
            res.status(500).json({ success: false, message: 'Server error', error: error.message });
        }
    };
}
exports.poController = new POController();
