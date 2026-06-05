import { Request, Response, NextFunction } from 'express';
import { Role } from '../modules/auth/models/Role.model';
import { Permission } from '../modules/auth/models/Permission.model';

export const requirePermission = (requiredPermissionString: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;
      if (!user) return res.status(401).json({ error: 'Unauthorized' });

      // SuperAdmin bypass
      const isSuperAdmin = user.roles.some((r: any) => r.name === 'SuperAdmin');
      if (isSuperAdmin) return next();

      // Check if any of the user's roles have the required permission
      const roleIds = user.roles.map((r: any) => r._id);
      
      const rolesWithPerms = await Role.find({ _id: { $in: roleIds } }).populate('permissions');
      
      let hasPerm = false;
      for (const role of rolesWithPerms) {
        const perms: any[] = role.permissions as any[];
        if (perms.some(p => p.name === requiredPermissionString || p.name === `${requiredPermissionString.split('.')[0]}.*`)) {
          hasPerm = true;
          break;
        }
      }

      if (!hasPerm) {
        return res.status(403).json({ error: `Forbidden: Requires permission [${requiredPermissionString}]` });
      }

      next();
    } catch (error) {
      return res.status(500).json({ error: 'Permission check failed' });
    }
  };
};
