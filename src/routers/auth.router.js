import { Router } from 'express';
import jwt from 'jsonwebtoken';
import {
  JWT_SECRET,
  JWT_EXPIRATION,
  REFRESH_TOKEN_EXPIRATION,
} from '../constants/auth.constant.js';
import { validate } from '../middlewares/validate.middleware.js';
import Joi from 'joi';
import { prisma } from '../utils/prisma.util.js';

const router = Router();

router.post('/login', validate(loginSchema), (req, res) => {
  const { email, password } = req.body;
  // 인증 로직 구현
  const user = authenticateUser(email, password); // 가정: 인증 함수

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const accessToken = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRATION,
  });
  const refreshToken = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRATION,
  });

  res.json({ accessToken, refreshToken });
});

export default router;
