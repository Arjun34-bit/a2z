export interface IAuthService {
  sendOtp(phone: string): Promise<{ success: boolean; message: string }>;
  verifyOtp(phone: string, otp: string): Promise<{
    success: boolean;
    data: {
      user: { id: string; phone: string; role: string };
      tokens: { accessToken: string; refreshToken: string };
      isNewUser: boolean;
    };
  }>;
}
