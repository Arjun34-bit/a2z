"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.supplierService = void 0;
const index_1 = __importDefault(require("../db/index"));
class SupplierService {
    createSupplierInDB = async (name, contactInfo) => {
        const [newSupplier] = await index_1.default.query(`INSERT INTO "Suppliers" (name, contact_info) 
       VALUES (:name, :contact_info) RETURNING *`, { replacements: { name, contact_info: contactInfo } });
        return newSupplier[0];
    };
    getAllSuppliersFromDB = async () => {
        const [suppliers] = await index_1.default.query(`SELECT * FROM "Suppliers" ORDER BY created_at DESC`);
        return suppliers;
    };
}
exports.supplierService = new SupplierService();
