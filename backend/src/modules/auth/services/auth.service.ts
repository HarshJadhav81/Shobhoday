import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User, IUser } from '../../users/models/User.model';
import { Session } from '../models/Session.model';
import { ActivityLog } from '../models/ActivityLog.model';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_dev_key';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'super_secret_refresh_key';

export class AuthService {
  
  static generateTokens(userId: string) {
    const accessToken = jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: userId }, REFRESH_SECRET, { expiresIn: '7d' });
    return { accessToken, refreshToken };
  }

  static async logActivity(userId: string, action: string, module: string, ip: string, details?: string) {
    await ActivityLog.create({ user: userId, action, module, ip, ...(details && { details }) });
  }

  static async createSession(userId: string, refreshToken: string, ip: string, userAgent: string) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await Session.create({
      user: userId,
      refreshToken,
      ip,
      userAgent,
      expiresAt
    });
  }

  static async login(email: string, password: string, ip: string, userAgent: string) {
    const user = await User.findOne({ email }).select('+password');
    if (!user) throw new Error('Invalid credentials');

    if (user.accountStatus !== 'active') throw new Error(`Account is ${user.accountStatus}`);
    if (user.isDeleted) throw new Error('Account deleted');

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new Error('Invalid credentials');

    const { accessToken, refreshToken } = this.generateTokens(user.id);
    
    await this.createSession(user.id, refreshToken, ip, userAgent);
    
    // Update login history
    user.lastLogin = new Date();
    user.loginHistory.push({ ip, userAgent, loginAt: new Date() });
    await user.save();

    await this.logActivity(user.id, 'LOGIN', 'AUTH', ip, 'User successfully logged in');

    return { user, accessToken, refreshToken };
  }

  static async logout(userId: string, refreshToken: string, ip: string) {
    await Session.findOneAndUpdate({ refreshToken }, { isValid: false });
    await this.logActivity(userId, 'LOGOUT', 'AUTH', ip, 'User logged out device');
  }

  static async refreshTokens(oldRefreshToken: string, ip: string, userAgent: string) {
    try {
      const decoded = jwt.verify(oldRefreshToken, REFRESH_SECRET) as { id: string };
      
      const session = await Session.findOne({ refreshToken: oldRefreshToken, isValid: true });
      if (!session || session.expiresAt < new Date()) {
        throw new Error('Invalid or expired session');
      }

      const user = await User.findById(decoded.id);
      if (!user || user.accountStatus !== 'active') {
        throw new Error('User inactive');
      }

      // Rotate token
      session.isValid = false;
      await session.save();

      const { accessToken, refreshToken } = this.generateTokens(user.id);
      await this.createSession(user.id, refreshToken, ip, userAgent);

      return { accessToken, refreshToken };
    } catch (error) {
      throw new Error('Refresh failed');
    }
  }

  static async forgotPassword(email: string, ip: string) {
    const user = await User.findOne({ email });
    if (!user) return; // Do not leak existence

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + 1); // 1 hour expiry
    user.resetPasswordExpires = expiry;
    
    await user.save();

    await this.logActivity(user.id, 'FORGOT_PASSWORD', 'AUTH', ip, 'Requested password reset link');
    
    // Mock email sending
    console.log(`[MOCK EMAIL] Send reset link to ${email} with token: ${resetToken}`);
    return resetToken;
  }

  static async resetPassword(token: string, newPassword: string, ip: string) {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() }
    });

    if (!user) throw new Error('Token is invalid or has expired');

    user.password = newPassword;
    user.resetPasswordToken = undefined as any;
    user.resetPasswordExpires = undefined as any;
    await user.save();

    await Session.updateMany({ user: user.id }, { isValid: false }); // logout all devices

    await this.logActivity(user.id, 'RESET_PASSWORD', 'AUTH', ip, 'Password successfully reset');
  }
}
