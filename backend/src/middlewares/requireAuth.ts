import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../modules/users/models/User.model';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_dev_key';

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify Access Token
    const decoded = jwt.verify(token, JWT_SECRET as string) as any as { id: string };
    
    // Load User & Check Status
    const user = await User.findById(decoded.id).populate('roles');
    
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized: User not found' });
    }

    if (user.isDeleted || user.accountStatus !== 'active') {
      return res.status(403).json({ error: `Forbidden: Account is ${user.accountStatus}` });
    }

    // Attach user to request object
    (req as any).user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
  }
};
