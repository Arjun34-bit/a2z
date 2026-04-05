"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const po_controller_1 = require("../controllers/po.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate, auth_middleware_1.requireAdmin); // All routes require admin
router.post('/', po_controller_1.poController.createPO); // Admin raises PO to multiple suppliers
router.get('/', po_controller_1.poController.getPOs); // Admin views all POs
exports.default = router;
