"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderController = void 0;
const order_validation_1 = require("../validations/order.validation");
const order_service_1 = require("../services/order.service");
class OrderController {
    createOrder = async (req, res) => {
        try {
            const validatedData = order_validation_1.createOrderSchema.parse(req.body);
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ success: false, message: 'Unauthorized' });
                return;
            }
            const { product_name, quantity } = validatedData;
            const newOrder = await order_service_1.orderService.createOrderInDB(userId, product_name, quantity);
            res.status(201).json({
                success: true,
                message: 'Order placed successfully',
                data: newOrder,
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
    getOrders = async (req, res) => {
        try {
            const userId = req.user?.id;
            const role = req.user?.role;
            const orders = await order_service_1.orderService.getOrdersFromDB(role, userId);
            res.status(200).json({
                success: true,
                data: orders,
            });
        }
        catch (error) {
            res.status(500).json({ success: false, message: 'Server error', error: error.message });
        }
    };
}
exports.orderController = new OrderController();
