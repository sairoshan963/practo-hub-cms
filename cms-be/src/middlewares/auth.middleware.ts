import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export interface AuthRequest extends Request {
  user?: { userId: string; role: string; email: string };
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const auth = req.headers.authorization as string | undefined;
  console.log('Auth header:', auth);
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  const token = auth.split(" ")[1];
  console.log('Token:', token);
  console.log('JWT_SECRET:', JWT_SECRET);
  try {
    const payload = (jwt.verify as any)(token, JWT_SECRET) as any;
    console.log('Decoded payload:', payload);
    req.user = { userId: payload.userId, role: payload.role, email: payload.email };
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
}

export function allowRoles(roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }
    next();
  };
}
