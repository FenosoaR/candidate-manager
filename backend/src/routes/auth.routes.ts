import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const router = Router();

// Demo login — in prod use a real user service
router.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Email et mot de passe requis' }); return;
  }
  // Brute-force protection is handled by rate limiter upstream
  if (email === 'admin@test.com' && password === 'Admin1234!') {
    const token = jwt.sign(
      { id: 'admin-id', email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1d' }
    );
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Identifiants invalides' });
  }
});

export default router;