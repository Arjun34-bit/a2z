import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import sequelize from '../db/index';
import { registerSchema, loginSchema } from '../validations/auth.validation';
import { generateToken, verifyRefreshToken } from '../utils/jwt';
import { requestOtpService, verifyOtpService } from '../services/auth.service';
import { checkEmailExists, findUserByEmail, createUser } from '../services/user.service';


export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const { name, email, password, role } = validatedData;

    console.log("req.body----->", req.body)

    // Check if user exists
    const emailExists = await checkEmailExists(email);

    if (emailExists) {
      res.status(400).json({ success: false, message: 'Email already exists' });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const user = await createUser(name, email, hashedPassword, role);
    const token = generateToken({ id: user.id, role: user.role });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: { user, token },
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ success: false, errors: error.errors });
    } else {
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const { email, password } = validatedData;

    // Find user
    const user = await findUserByEmail(email);

    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    // Generate and send OTP for MFA
    await requestOtpService(user.email);

    res.status(200).json({
      success: true,
      message: 'Credentials valid. OTP sent to your email.',
      data: {
        email: user.email,
      },
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ success: false, errors: error.errors });
    } else {
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  }
};

export const requestOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phoneOrEmail } = req.body;

    if (!phoneOrEmail) {
      res.status(400).json({ success: false, error: 'phoneOrEmail is required' });
      return;
    }

    const result = await requestOtpService(phoneOrEmail);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(429).json({ success: false, message: error.message });
  }
};

export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phoneOrEmail, otp } = req.body;

    if (!phoneOrEmail || !otp) {
      res.status(400).json({ success: false, error: 'phoneOrEmail and otp are required' });
      return;
    }

    const result = await verifyOtpService(phoneOrEmail, otp);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(401).json({ success: false, message: error.message });
  }
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  const { refreshToken } = req.body;
  
  if (!refreshToken) {
    res.status(401).json({ success: false, message: 'Refresh token required' });
    return;
  }

  try {
     const decoded: any = verifyRefreshToken(refreshToken);
     
     // Issue a new access token
     const newAccessToken = generateToken({ id: decoded.id, role: decoded.role });
     
     res.status(200).json({ success: true, data: { accessToken: newAccessToken } });
  } catch (error) {
     res.status(403).json({ success: false, message: 'Invalid or expired refresh token. Please log in again.' });
  }
};



