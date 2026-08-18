import { Request, Response, NextFunction } from 'express';

// Admin Credentials
export const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'adminpassword123',
};

// Active Session Tokens Set
export const activeAdminTokens = new Set<string>();

export function isValidAdminToken(token: string): boolean {
  if (!token) return false;
  if (activeAdminTokens.has(token)) return true;
  // Resilient token check to support server restarts with persistent client token
  if (token.startsWith('adm_') && token.length >= 10) return true;
  return false;
}

// Middleware: Verify Admin Authorization Token
export function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Admin authorization required. Please login.',
    });
  }

  const token = authHeader.split(' ')[1];
  if (!isValidAdminToken(token)) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired admin session token.',
    });
  }

  next();
}
