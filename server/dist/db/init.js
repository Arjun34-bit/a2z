"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDatabase = void 0;
const index_1 = __importDefault(require("./index"));
const initializeDatabase = async () => {
    try {
        const queryInterface = index_1.default.getQueryInterface();
        // 1. Create Users Table
        // Updated to support either (name, email, password) for regular registration, or just (phoneOrEmail) for OTP
        await index_1.default.query(`
      CREATE TABLE IF NOT EXISTS "Users" (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NULL,
        email VARCHAR(255) UNIQUE NULL,
        password VARCHAR(255) NULL,
        "phoneOrEmail" VARCHAR(255) UNIQUE NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'user',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
        // Add columns dynamically in case the table already exists from previous runs
        await index_1.default.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Users' AND column_name='phoneOrEmail') THEN
          ALTER TABLE "Users" ADD COLUMN "phoneOrEmail" VARCHAR(255) UNIQUE NULL;
        END IF;

        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Users' AND column_name='name' AND is_nullable='NO') THEN
          ALTER TABLE "Users" ALTER COLUMN name DROP NOT NULL;
        END IF;

        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Users' AND column_name='password' AND is_nullable='NO') THEN
          ALTER TABLE "Users" ALTER COLUMN password DROP NOT NULL;
        END IF;
      END $$;
    `);
        // 2. Create Suppliers Table
        await index_1.default.query(`
      CREATE TABLE IF NOT EXISTS "Suppliers" (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        contact_info VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
        // 3. Create Orders Table (Placed by Users)
        await index_1.default.query(`
      CREATE TABLE IF NOT EXISTS "Orders" (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES "Users"(id) ON DELETE CASCADE,
        product_name VARCHAR(255) NOT NULL,
        quantity INTEGER NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
        // 4. Create PurchaseOrders Table (Raised by Admins)
        await index_1.default.query(`
      CREATE TABLE IF NOT EXISTS "PurchaseOrders" (
        id SERIAL PRIMARY KEY,
        description TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'issued',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
        // 5. Create PO_Suppliers (Join table for Admin selecting multiple suppliers for a PO)
        await index_1.default.query(`
      CREATE TABLE IF NOT EXISTS "POSuppliers" (
        po_id INTEGER REFERENCES "PurchaseOrders"(id) ON DELETE CASCADE,
        supplier_id INTEGER REFERENCES "Suppliers"(id) ON DELETE CASCADE,
        PRIMARY KEY (po_id, supplier_id)
      );
    `);
        console.log('Database tables verified/created successfully via raw SQL.');
    }
    catch (error) {
        console.error('Error initializing database:', error);
    }
};
exports.initializeDatabase = initializeDatabase;
