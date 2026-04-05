"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderService = void 0;
const index_1 = __importDefault(require("../db/index"));
class OrderService {
    createOrderInDB = async (userId, productName, quantity) => {
        const [newOrder] = await index_1.default.query(`INSERT INTO "Orders" (user_id, product_name, quantity) 
       VALUES (:userId, :product_name, :quantity) RETURNING *`, { replacements: { userId, product_name: productName, quantity } });
        return newOrder[0];
    };
    getOrdersFromDB = async (role, userId) => {
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
        return orders;
    };
}
exports.orderService = new OrderService();
