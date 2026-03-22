"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOtpService = exports.requestOtpService = void 0;
const client_1 = __importDefault(require("../redis/client"));
const User_1 = __importDefault(require("../models/User"));
const otp_1 = require("../utils/otp");
const jwt_1 = require("../utils/jwt");
const OTP_TTL = 300; // 5 minutes in seconds
const MAX_ATTEMPTS = 5;
const requestOtpService = async (phoneOrEmail) => {
    const attemptsKey = `attempts:${phoneOrEmail}`;
    const attemptsAmount = await client_1.default.get(attemptsKey);
    if (attemptsAmount && parseInt(attemptsAmount) >= MAX_ATTEMPTS) {
        throw new Error('Too many OTP attempts. Please try again later.');
    }
    const otp = (0, otp_1.generateOTP)();
    const redisKey = `otp:${phoneOrEmail}`;
    await client_1.default.setEx(redisKey, OTP_TTL, otp);
    await client_1.default.incr(attemptsKey);
    if (!attemptsAmount) {
        await client_1.default.expire(attemptsKey, 900);
    }
    // As requested, console log the OTP instead of sending via provider
    console.log(`[SIMULATED SMS/EMAIL] -> Sending OTP ${otp} to ${phoneOrEmail}`);
    return { success: true, message: 'OTP sent successfully' };
};
exports.requestOtpService = requestOtpService;
const verifyOtpService = async (phoneOrEmail, otp) => {
    const redisKey = `otp:${phoneOrEmail}`;
    const storedOtp = await client_1.default.get(redisKey);
    if (!storedOtp) {
        throw new Error('OTP expired or not found.');
    }
    if (storedOtp !== otp) {
        throw new Error('Invalid OTP provided.');
    }
    await client_1.default.del(redisKey);
    const attemptsKey = `attempts:${phoneOrEmail}`;
    await client_1.default.del(attemptsKey);
    const [user, created] = await User_1.default.findOrCreate({
        where: { phoneOrEmail },
        defaults: { phoneOrEmail }
    });
    const tokens = (0, jwt_1.generateTokens)({ id: user.id, role: user.role });
    return {
        success: true,
        message: 'Login successful',
        isNewUser: created,
        data: {
            user: { id: user.id, phoneOrEmail: user.phoneOrEmail, role: user.role },
            tokens
        }
    };
};
exports.verifyOtpService = verifyOtpService;
