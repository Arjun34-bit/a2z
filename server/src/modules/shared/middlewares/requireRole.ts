import { Response, NextFunction } from 'express';
import { AuthRequest } from './requireAuth';

/**
 * Role-based authorization middleware factory.
 * Usage: router.get('/admin', requireAuth, requireRole('admin'), controller.foo);
 */
export const requireRole = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized - User not authenticated' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ 
        success: false, 
        message: `Forbidden - Requires one of roles: ${allowedRoles.join(', ')}` 
      });
      return;
    }

    next();
  };
};
