"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middlewares
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev'));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
// Basic Route
app.get('/', (req, res) => {
    res.send('Drop Shipping API is running...');
});
// API Routes
app.use('/api/v1/auth', auth_routes_1.default);
const order_routes_1 = __importDefault(require("./routes/order.routes"));
const supplier_routes_1 = __importDefault(require("./routes/supplier.routes"));
const po_routes_1 = __importDefault(require("./routes/po.routes"));
app.use('/api/v1/orders', order_routes_1.default);
app.use('/api/v1/suppliers', supplier_routes_1.default);
app.use('/api/v1/pos', po_routes_1.default);
// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
});
exports.default = app;
