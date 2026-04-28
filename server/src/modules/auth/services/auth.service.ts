import redisClient from '@shared/redis/client';
import User from '@shared/models/User';
import { generateOTP } from '@shared/utils/otp';
import { generateTokens } from '@shared/utils/jwt';
import { userService } from './user.service';

const OTP_TTL = 300; // 5 minutes in seconds
const MAX_ATTEMPTS = 5;

class AuthService {
  public requestOtpService = async (phoneOrEmail: string) => {
    const attemptsKey = `attempts:${phoneOrEmail}`;
    const attemptsAmount = await redisClient.get(attemptsKey);

    if (attemptsAmount && parseInt(attemptsAmount) >= MAX_ATTEMPTS) {
      throw new Error('Too many OTP attempts. Please try again later.');
    }

    const otp = generateOTP();
    const redisKey = `otp:${phoneOrEmail}`;

    await redisClient.setEx(redisKey, OTP_TTL, otp);

    await redisClient.incr(attemptsKey);
    if (!attemptsAmount) {
      await redisClient.expire(attemptsKey, 900);
    }

    // As requested, console log the OTP instead of sending via provider
    console.log(`[SIMULATED SMS/EMAIL] -> Sending OTP ${otp} to ${phoneOrEmail}`);

    return { success: true, message: 'OTP sent successfully' };
  };

  public verifyOtpService = async (phoneOrEmail: string, otp: string) => {
    const redisKey = `otp:${phoneOrEmail}`;
    const storedOtp = await redisClient.get(redisKey);

    if (!storedOtp) {
      throw new Error('OTP expired or not found.');
    }

    if (storedOtp !== otp) {
      throw new Error('Invalid OTP provided.');
    }

    await redisClient.del(redisKey);

    const attemptsKey = `attempts:${phoneOrEmail}`;
    await redisClient.del(attemptsKey);

    const user = await userService.findUserByEmail(phoneOrEmail);
    if (!user) {
      throw new Error('User not found.');
    }

    const tokens = generateTokens({ id: user.id, role: user.role });

    return {
      success: true,
      message: 'Login successful',
      data: {
        user: { id: user.id, email: user.email, role: user.role, name: user.name },
        tokens
      }
    };
  };
}

export const authService = new AuthService();
