"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSupplierSchema = void 0;
const zod_1 = require("zod");
exports.createSupplierSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Supplier name is required'),
    contact_info: zod_1.z.string().optional(),
});
