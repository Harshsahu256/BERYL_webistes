import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { ADMIN_CREDENTIALS, activeAdminTokens } from '../middleware/auth';

const router = Router();

// POST /api/admin/login
router.post('/login', (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      error: 'Username and password are required.',
    });
  }

  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    const token = 'adm_' + crypto.randomBytes(24).toString('hex');
    activeAdminTokens.add(token);

    return res.json({
      success: true,
      message: 'Admin authentication successful.',
      token,
    });
  }

  return res.status(401).json({
    success: false,
    error: 'Invalid admin credentials.',
  });
});

// POST /api/admin/logout
router.post('/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    activeAdminTokens.delete(token);
  }
  res.json({
    success: true,
    message: 'Logged out successfully.',
  });
});

export default router;
