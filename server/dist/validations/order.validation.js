"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrderSchema = void 0;
const zod_1 = require("zod");
exports.createOrderSchema = zod_1.z.object({
    product_name: zod_1.z.string().min(1, 'Product name is required'),
    quantity: zod_1.z.number().int().positive('Quantity must be a positive integer'),
});
