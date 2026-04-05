"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const index_1 = __importDefault(require("../db/index"));
class UserService {
    checkEmailExists = async (email) => {
        const [users] = await index_1.default.query(`SELECT id FROM "Users" WHERE email = :email LIMIT 1`, { replacements: { email } });
        return users.length > 0;
    };
    findUserByEmail = async (email) => {
        const [users] = await index_1.default.query(`SELECT * FROM "Users" WHERE email = :email LIMIT 1`, { replacements: { email } });
        return users.length > 0 ? users[0] : null;
    };
    createUser = async (name, email, passwordHash, role) => {
        const [newUser] = await index_1.default.query(`INSERT INTO "Users" (name, email, password, role) 
       VALUES (:name, :email, :password, :role) RETURNING id, name, email, role`, { replacements: { name, email, password: passwordHash, role } });
        return newUser[0];
    };
}
exports.userService = new UserService();
