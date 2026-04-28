import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const SECRET = process.env.JWT_SECRET || 'secret';
const EXPIRES_IN = (process.env.JWT_EXPIRES_IN || '15m') as any;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh-secret';
const REFRESH_EXPIRES_IN = (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as any;

export const generateToken = (payload: { id: number; role: string }) => {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });
};

export const generateTokens = (payload: { id: number; role?: string }) => {
  const accessToken = jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });
  const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES_IN });
  
  return { accessToken, refreshToken };
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, SECRET);
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, REFRESH_SECRET);
};
