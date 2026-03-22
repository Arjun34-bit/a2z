"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOtp = exports.requestOtp = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const index_1 = __importDefault(require("../db/index"));
const auth_validation_1 = require("../validations/auth.validation");
const jwt_1 = require("../utils/jwt");
const auth_service_1 = require("../services/auth.service");
const register = async (req, res) => {
    try {
        const validatedData = auth_validation_1.registerSchema.parse(req.body);
        const { name, email, password, role } = validatedData;
        // Check if user exists
        const [users] = await index_1.default.query(`SELECT id FROM "Users" WHERE email = :email LIMIT 1`, { replacements: { email } });
        if (users.length > 0) {
            res.status(400).json({ success: false, message: 'Email already exists' });
            return;
        }
        // Hash password
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        // Insert user
        const [newUser] = await index_1.default.query(`INSERT INTO "Users" (name, email, password, role) 
       VALUES (:name, :email, :password, :role) RETURNING id, name, email, role`, { replacements: { name, email, password: hashedPassword, role } });
        const user = newUser[0];
        const token = (0, jwt_1.generateToken)({ id: user.id, role: user.role });
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: { user, token },
        });
    }
    catch (error) {
        if (error.name === 'ZodError') {
            res.status(400).json({ success: false, errors: error.errors });
        }
        else {
            res.status(500).json({ success: false, message: 'Server error', error: error.message });
        }
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const validatedData = auth_validation_1.loginSchema.parse(req.body);
        const { email, password } = validatedData;
        // Find user
        const [users] = await index_1.default.query(`SELECT * FROM "Users" WHERE email = :email LIMIT 1`, { replacements: { email } });
        if (users.length === 0) {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
            return;
        }
        const user = users[0];
        // Check password
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
            return;
        }
        const token = (0, jwt_1.generateToken)({ id: user.id, role: user.role });
        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: { id: user.id, name: user.name, email: user.email, role: user.role },
                token,
            },
        });
    }
    catch (error) {
        if (error.name === 'ZodError') {
            res.status(400).json({ success: false, errors: error.errors });
        }
        else {
            res.status(500).json({ success: false, message: 'Server error', error: error.message });
        }
    }
};
exports.login = login;
const requestOtp = async (req, res) => {
    try {
        const { phoneOrEmail } = req.body;
        if (!phoneOrEmail) {
            res.status(400).json({ success: false, error: 'phoneOrEmail is required' });
            return;
        }
        const result = await (0, auth_service_1.requestOtpService)(phoneOrEmail);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(429).json({ success: false, error: error.message });
    }
};
exports.requestOtp = requestOtp;
const verifyOtp = async (req, res) => {
    try {
        const { phoneOrEmail, otp } = req.body;
        if (!phoneOrEmail || !otp) {
            res.status(400).json({ success: false, error: 'phoneOrEmail and otp are required' });
            return;
        }
        const result = await (0, auth_service_1.verifyOtpService)(phoneOrEmail, otp);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(401).json({ success: false, error: error.message });
    }
};
exports.verifyOtp = verifyOtp;
