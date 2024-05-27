import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../constants/auth.constant.js';

export const requireRefreshToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token)
    return res.status(401).json({ message: 'Refresh token required' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Invalid refresh token' });
    req.user = decoded;
    next();
  });
};
