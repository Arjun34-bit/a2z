"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const supplier_controller_1 = require("../controllers/supplier.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate, auth_middleware_1.requireAdmin); // All routes require admin
router.post('/', supplier_controller_1.createSupplier); // Admin adds supplier
router.get('/', supplier_controller_1.getSuppliers); // Admin views suppliers
exports.default = router;
