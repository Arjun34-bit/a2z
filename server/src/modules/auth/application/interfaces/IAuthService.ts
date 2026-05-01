export interface IAuthService {
  sendOtp(phone: string): Promise<{ success: boolean; message: string }>;
  verifyOtp(phone: string, otp: string): Promise<{
    success: boolean;
    data: {
      user: { id: string; phone: string | null | undefined; role: string, profile_stage: string | null | undefined };
      tokens: { accessToken: string; refreshToken: string };
      isNewUser: boolean;
    };
  }>;
} 
