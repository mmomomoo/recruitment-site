import jwt from 'jsonwebtoken';
// import { JWT_SECRET_KEY } from '../constants/auth.constant.js';

export const requireAccessToken = (req, res, next) => {
  const token =
    req.cookies.authorization?.split(' ')[1] ||
    req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: '접근이 허용되지 않습니다.' });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'default-secret-key',
    );
    req.user = decoded; // 요청 객체에 사용자 정보를 추가
    next();
  } catch (err) {
    return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
  }
};
