import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const SECRET = process.env.JWT_SECRET || 'secret';
const EXPIRES_IN = (process.env.JWT_EXPIRES_IN || '7d') as any;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh-secret';
const REFRESH_EXPIRES_IN = (process.env.JWT_REFRESH_EXPIRES_IN || '30d') as any;

export interface JwtPayload {
  user_id: string; // UUID
  role: string;    // customer | artist | admin
}

export const generateToken = (payload: JwtPayload) => {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });
};

export const generateTokens = (payload: JwtPayload) => {
  const accessToken = jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });
  const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES_IN });
  
  return { accessToken, refreshToken };
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, SECRET) as JwtPayload;
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  return jwt.verify(token, REFRESH_SECRET) as JwtPayload;
};
