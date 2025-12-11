import type { Request, Response, NextFunction } from 'express';
import { ROLE_PERMISSIONS, type Permission, type Role } from '../config/permissions.js';

/**
 * RBAC Middleware - Checks if user has required permission for API action
 * 
 * @param requiredPermission - The permission required to access the endpoint
 * @returns Express middleware function
 */
export function checkPermission(requiredPermission: Permission) {
  return (req: any, res: Response, next: NextFunction) => {
    try {
      // Ensure user is authenticated (should be set by auth middleware)
      if (!req.user || !req.user.role) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const userRole = req.user.role as Role;

      // Check if role exists in permissions config
      if (!ROLE_PERMISSIONS[userRole]) {
        return res.status(403).json({
          success: false,
          message: 'Invalid user role'
        });
      }

      // Check if user's role has the required permission
      const userPermissions = ROLE_PERMISSIONS[userRole];
      if (!userPermissions.includes(requiredPermission)) {
        return res.status(403).json({
          success: false,
          message: `Access denied. Required permission: ${requiredPermission}`,
          userRole,
          userPermissions
        });
      }

      // Permission granted, proceed to next middleware/controller
      next();
    } catch (error) {
      console.error('Permission check error:', error);
      return res.status(500).json({
        success: false,
        message: 'Permission check failed'
      });
    }
  };
}

/**
 * Get user permissions for frontend
 * 
 * @param userRole - User's role
 * @returns Array of permissions for the role
 */
export function getUserPermissions(userRole: Role): Permission[] {
  return ROLE_PERMISSIONS[userRole] || [];
}