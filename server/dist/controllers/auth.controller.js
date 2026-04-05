"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const auth_validation_1 = require("../validations/auth.validation");
const jwt_1 = require("../utils/jwt");
const auth_service_1 = require("../services/auth.service");
const user_service_1 = require("../services/user.service");
const crypto_1 = require("../utils/crypto");
class AuthController {
    register = async (req, res) => {
        try {
            const validatedData = auth_validation_1.registerSchema.parse(req.body);
            const { name, email, password, role } = validatedData;
            console.log("req.body----->", req.body);
            // Check if user exists
            const emailExists = await user_service_1.userService.checkEmailExists(email);
            if (emailExists) {
                res.status(400).json({ success: false, message: 'Email already exists' });
                return;
            }
            // Hash password
            const hashedPassword = await bcrypt_1.default.hash(password, 10);
            // Insert user
            const user = await user_service_1.userService.createUser(name, email, hashedPassword, role);
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
    login = async (req, res) => {
        try {
            let dataToValidate = req.body;
            if (req.body.payload) {
                try {
                    dataToValidate = (0, crypto_1.decryptPayload)(req.body.payload);
                }
                catch (err) {
                    res.status(400).json({ success: false, message: 'Invalid encrypted payload' });
                    return;
                }
            }
            const validatedData = auth_validation_1.loginSchema.parse(dataToValidate);
            const { email, password } = validatedData;
            // Find user
            const user = await user_service_1.userService.findUserByEmail(email);
            if (!user) {
                res.status(401).json({ success: false, message: 'Invalid credentials' });
                return;
            }
            // Check password
            const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
            if (!isPasswordValid) {
                res.status(401).json({ success: false, message: 'Invalid credentials' });
                return;
            }
            // Generate and send OTP for MFA
            await auth_service_1.authService.requestOtpService(user.email);
            res.status(200).json({
                success: true,
                message: 'Credentials valid. OTP sent to your email.',
                data: {
                    email: user.email,
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
    requestOtp = async (req, res) => {
        try {
            const { phoneOrEmail } = req.body;
            if (!phoneOrEmail) {
                res.status(400).json({ success: false, error: 'phoneOrEmail is required' });
                return;
            }
            const result = await auth_service_1.authService.requestOtpService(phoneOrEmail);
            res.status(200).json(result);
        }
        catch (error) {
            res.status(429).json({ success: false, message: error.message });
        }
    };
    verifyOtp = async (req, res) => {
        try {
            const { phoneOrEmail, otp } = req.body;
            if (!phoneOrEmail || !otp) {
                res.status(400).json({ success: false, error: 'phoneOrEmail and otp are required' });
                return;
            }
            const result = await auth_service_1.authService.verifyOtpService(phoneOrEmail, otp);
            res.status(200).json(result);
        }
        catch (error) {
            res.status(401).json({ success: false, message: error.message });
        }
    };
    refreshToken = async (req, res) => {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            res.status(401).json({ success: false, message: 'Refresh token required' });
            return;
        }
        try {
            const decoded = (0, jwt_1.verifyRefreshToken)(refreshToken);
            // Issue a new access token
            const newAccessToken = (0, jwt_1.generateToken)({ id: decoded.id, role: decoded.role });
            res.status(200).json({ success: true, data: { accessToken: newAccessToken } });
        }
        catch (error) {
            res.status(403).json({ success: false, message: 'Invalid or expired refresh token. Please log in again.' });
        }
    };
}
exports.authController = new AuthController();
