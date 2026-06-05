import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { ApiResponse } from '../../../utils/ApiResponse';

const setCookies = (res: Response, refreshToken: string) => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
};

export class AuthController {
  
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const ip = req.ip || req.socket.remoteAddress || 'unknown';
      const userAgent = req.headers['user-agent'] || 'unknown';

      const { user, accessToken, refreshToken } = await AuthService.login(email, password, ip, userAgent);
      
      setCookies(res, refreshToken);
      
      return res.status(200).json(new ApiResponse('Login successful', { 
        accessToken,
        user: { id: user.id, email: user.email, roles: user.roles }
      }));
    } catch (error: any) {
      return res.status(401).json({ error: error.message });
    }
  }

  static async logout(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies?.refreshToken;
      const userId = (req as any).user?.id; // Assuming requireAuth middleware sets this
      const ip = req.ip || req.socket.remoteAddress || 'unknown';

      if (refreshToken && userId) {
        await AuthService.logout(userId, refreshToken, ip);
      }
      
      res.clearCookie('refreshToken');
      return res.status(200).json(new ApiResponse('Logout successful'));
    } catch (error: any) {
      return res.status(500).json({ error: 'Logout failed' });
    }
  }

  static async refresh(req: Request, res: Response) {
    try {
      const oldRefreshToken = req.cookies?.refreshToken;
      if (!oldRefreshToken) return res.status(401).json({ error: 'No refresh token' });

      const ip = req.ip || req.socket.remoteAddress || 'unknown';
      const userAgent = req.headers['user-agent'] || 'unknown';

      const { accessToken, refreshToken } = await AuthService.refreshTokens(oldRefreshToken, ip, userAgent);
      
      setCookies(res, refreshToken);
      
      return res.status(200).json(new ApiResponse('Refresh successful', { accessToken }));
    } catch (error: any) {
      res.clearCookie('refreshToken');
      return res.status(401).json({ error: 'Session expired, please login again' });
    }
  }

  static async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const ip = req.ip || req.socket.remoteAddress || 'unknown';
      
      const token = await AuthService.forgotPassword(email, ip);
      
      // We always return 200 even if email doesn't exist to prevent enum attacks
      return res.status(200).json(new ApiResponse('If an account exists, a reset link was sent', { mockToken: token }));
    } catch (error) {
      return res.status(500).json({ error: 'Server error' });
    }
  }

  static async resetPassword(req: Request, res: Response) {
    try {
      const { token, newPassword } = req.body;
      const ip = req.ip || req.socket.remoteAddress || 'unknown';
      
      await AuthService.resetPassword(token, newPassword, ip);
      
      return res.status(200).json(new ApiResponse('Password reset successfully'));
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
