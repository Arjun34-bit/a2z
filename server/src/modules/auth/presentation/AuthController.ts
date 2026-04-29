import { Request, Response } from 'express';
import { IAuthService } from '../application/interfaces/IAuthService';
import { verifyRefreshToken, generateToken } from '@shared/index';

export class AuthController {
  constructor(private readonly authService: IAuthService) {}

  sendOtp = async (req: Request, res: Response): Promise<void> => {
    try {
      const { phone } = req.body;
      if (!phone) {
        res.status(400).json({ success: false, message: 'Phone is required' });
        return;
      }

      const result = await this.authService.sendOtp(phone);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(429).json({ success: false, message: error.message });
    }
  };

  verifyOtp = async (req: Request, res: Response): Promise<void> => {
    try {
      const { phone, otp } = req.body;
      if (!phone || !otp) {
        res.status(400).json({ success: false, message: 'Phone and OTP are required' });
        return;
      }

      const result = await this.authService.verifyOtp(phone, otp);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(401).json({ success: false, message: error.message });
    }
  };

  refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        res.status(401).json({ success: false, message: 'Refresh token required' });
        return;
      }

      const decoded = verifyRefreshToken(refreshToken);
      const newAccessToken = generateToken({ user_id: decoded.user_id, role: decoded.role });

      res.status(200).json({ success: true, data: { accessToken: newAccessToken } });
    } catch (error) {
      res.status(403).json({ success: false, message: 'Invalid or expired refresh token' });
    }
  };
}
