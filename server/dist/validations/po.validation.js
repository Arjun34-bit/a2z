"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPOSchema = void 0;
const zod_1 = require("zod");
exports.createPOSchema = zod_1.z.object({
    description: zod_1.z.string().min(1, 'PO description is required'),
    supplier_ids: zod_1.z.array(zod_1.z.number().int().positive()).nonempty('At least one supplier must be selected'),
});
