"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrders = exports.createOrder = void 0;
const index_1 = __importDefault(require("../db/index"));
const order_validation_1 = require("../validations/order.validation");
const createOrder = async (req, res) => {
    try {
        const validatedData = order_validation_1.createOrderSchema.parse(req.body);
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }
        const { product_name, quantity } = validatedData;
        const [newOrder] = await index_1.default.query(`INSERT INTO "Orders" (user_id, product_name, quantity) 
       VALUES (:userId, :product_name, :quantity) RETURNING *`, { replacements: { userId, product_name, quantity } });
        res.status(201).json({
            success: true,
            message: 'Order placed successfully',
            data: newOrder[0],
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
exports.createOrder = createOrder;
const getOrders = async (req, res) => {
    try {
        const userId = req.user?.id;
        const role = req.user?.role;
        let query = `SELECT o.*, u.name as user_name, u.email as user_email 
                 FROM "Orders" o 
                 JOIN "Users" u ON o.user_id = u.id`;
        let replacements = {};
        if (role !== 'admin') {
            query += ` WHERE o.user_id = :userId`;
            replacements = { userId };
        }
        query += ` ORDER BY o.created_at DESC`;
        const [orders] = await index_1.default.query(query, { replacements });
        res.status(200).json({
            success: true,
            data: orders,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};
exports.getOrders = getOrders;
