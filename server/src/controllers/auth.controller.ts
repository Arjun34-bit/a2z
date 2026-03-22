import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import sequelize from '../db/index';
import { registerSchema, loginSchema } from '../validations/auth.validation';
import { generateToken } from '../utils/jwt';
import { requestOtpService, verifyOtpService } from '../services/auth.service';


export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const { name, email, password, role } = validatedData;

    // Check if user exists
    const [users]: any = await sequelize.query(
      `SELECT id FROM "Users" WHERE email = :email LIMIT 1`,
      { replacements: { email } }
    );

    if (users.length > 0) {
      res.status(400).json({ success: false, message: 'Email already exists' });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const [newUser]: any = await sequelize.query(
      `INSERT INTO "Users" (name, email, password, role) 
       VALUES (:name, :email, :password, :role) RETURNING id, name, email, role`,
      { replacements: { name, email, password: hashedPassword, role } }
    );

    const user = newUser[0];
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
    const [users]: any = await sequelize.query(
      `SELECT * FROM "Users" WHERE email = :email LIMIT 1`,
      { replacements: { email } }
    );

    if (users.length === 0) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    const user = users[0];

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    const token = generateToken({ id: user.id, role: user.role });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
        token,
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

