"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const index_1 = require("./db/index");
const init_1 = require("./db/init");
const client_1 = require("./redis/client");
const PORT = process.env.PORT || 8000;
const startServer = async () => {
    await (0, index_1.connectDB)();
    await (0, init_1.initializeDatabase)();
    await (0, client_1.connectRedis)();
    app_1.default.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};
startServer();
