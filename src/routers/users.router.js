import express from 'express';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
// import { JWT_SECRET_KEY, JWT_EXPIRATION } from '../constants/auth.constant';

const router = express.Router();
const prisma = new PrismaClient();
const saltRounds = 10;

/** 사용자 회원가입 API **/
router.post('/auth/sign-up', async (req, res, next) => {
  try {
    const { email, password, passwordConfirm, name } = req.body;

    // 필수 입력 항목 확인
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: '이메일을 입력해주세요.' });
    }
    if (!password) {
      return res
        .status(400)
        .json({ success: false, message: '비밀번호를 입력해주세요.' });
    }
    if (!passwordConfirm) {
      return res
        .status(400)
        .json({ success: false, message: '비밀번호 확인을 입력해주세요.' });
    }
    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: '이름을 입력해주세요.' });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ success: false, message: '비밀번호는 최소 6자 이상입니다.' });
    }
    if (password !== passwordConfirm) {
      return res
        .status(400)
        .json({ success: false, message: '비밀번호가 일치하지 않습니다.' });
    }

    // 이메일 중복 체크
    const user = await prisma.user.findFirst({
      where: { email },
    });
    if (user) {
      return res
        .status(400)
        .json({ success: false, message: '사용할 수 없는 이메일입니다.' });
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 새로운 사용자 생성
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    // 응답
    return res.status(201).json({
      success: true,
      message: '회원가입 성공',
      user: {
        email: newUser.email,
        name: newUser.name,
      },
    });
  } catch (error) {
    // 에러 처리
    return res
      .status(500)
      .json({ success: false, message: '서버 에러', error: error.message });
  }
});

/** 사용자 로그인 API **/
router.post('/auth/sign-in', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 필수 입력 항목 확인
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: '이메일을 입력해주세요.' });
    }
    if (!password) {
      return res
        .status(400)
        .json({ success: false, message: '비밀번호를 입력해주세요.' });
    }

    // 사용자 찾기
    const user = await prisma.user.findFirst({
      where: { email },
    });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: '가입된 사용자가 아닙니다.' });
    }

    // 비밀번호 비교
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res
        .status(401)
        .json({ success: false, message: '비밀번호가 틀렸습니다.' });
    }
    // JWT 토큰 생성
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      secretKey,
      { expiresIn: '1h' }, // 1시간 후 만료
    );

    // 로그인 성공 응답

    return res.status(200).json({
      success: true,
      message: '로그인 성공',
      user: {
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    // 에러 처리
    return next();
    //  res
    // .status(500)
    // .json({ success: false, message: '서버 에러', error: error.message });
  }
});

export default router;
