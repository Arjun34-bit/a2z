import { IAuthService } from './interfaces/IAuthService';
import { IAuthUserRepository } from './interfaces/IAuthUserRepository';
import { IOtpCacheService } from './interfaces/IOtpCacheService';
import { AuthUser } from '../domain/AuthUser.entity';
import { generateOTP, generateTokens } from '@shared/index';

const OTP_TTL = 300;
const MAX_ATTEMPTS = 5;
const ATTEMPTS_TTL = 900;

export class AuthService implements IAuthService {
  constructor(
    private readonly userRepo: IAuthUserRepository,
    private readonly otpCache: IOtpCacheService,
  ) { }

  async sendOtp(phone: string): Promise<{ success: boolean; message: string }> {
    const attempts = await this.otpCache.getAttempts(phone);

    if (attempts >= MAX_ATTEMPTS) {
      throw new Error('Too many OTP attempts. Please try again later.');
    }

    const otp = generateOTP();
    await this.otpCache.storeOtp(phone, otp, OTP_TTL);
    await this.otpCache.incrementAttempts(phone, ATTEMPTS_TTL);

    console.log(`[SIMULATED SMS] -> Sending OTP ${otp} to ${phone}`);

    return { success: true, message: 'OTP sent successfully' };
  }

  async verifyOtp(phone: string, otp: string): Promise<{
    success: boolean;
    data: {
      user: { id: string; phone: string | null | undefined; role: string, profile_stage: string | null | undefined };
      tokens: { accessToken: string; refreshToken: string };
      isNewUser: boolean;
    };
  }> {
    const storedOtp = await this.otpCache.getOtp(phone);

    if (!storedOtp || storedOtp !== otp) {
      throw new Error('Invalid or expired OTP.');
    }

    await this.otpCache.deleteOtp(phone);
    await this.otpCache.resetAttempts(phone);

    // Find or create user
    let user = await this.userRepo.findByPhone(phone);
    let isNewUser = false;
    console.log("user------->", user)

    if (!user) {
      isNewUser = true;
      const creationData = AuthUser.createNewUser(phone);
      user = await this.userRepo.create(creationData);
    }

    // Generate tokens with user_id and role from the roles table
    const tokens = generateTokens({ user_id: user.id, role: user.role });

    return {
      success: true,
      data: {
        user: { id: user.id, phone: user.phone, role: user.role, profile_stage: user.profilestage },
        tokens,
        isNewUser
      },
    };
  }
}
