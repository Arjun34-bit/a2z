"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encryptPayload = exports.decryptPayload = void 0;
const crypto_js_1 = __importDefault(require("crypto-js"));
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default_secret_encryption_key_123';
const decryptPayload = (ciphertext) => {
    try {
        const bytes = crypto_js_1.default.AES.decrypt(ciphertext, ENCRYPTION_KEY);
        const decryptedText = bytes.toString(crypto_js_1.default.enc.Utf8);
        if (!decryptedText) {
            throw new Error('Malformed payload');
        }
        return JSON.parse(decryptedText);
    }
    catch (error) {
        throw new Error('Invalid or corrupted payload');
    }
};
exports.decryptPayload = decryptPayload;
const encryptPayload = (data) => {
    return crypto_js_1.default.AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY).toString();
};
exports.encryptPayload = encryptPayload;
