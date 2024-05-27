import express from 'express';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { validateSignUp } from '../middlewares/validation.middleware.js';

const router = express.Router();
const prisma = new PrismaClient();
const saltRounds = 10;

/** 사용자 회원가입 API **/
router.post('/auth/sign-up', validateSignUp, async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    // 이메일 중복 체크
    const isExistUser = await prisma.user.findUnique({ where: { email } });
    if (isExistUser) {
      const err = new Error('이미 가입 된 사용자입니다.');
      err.status = 409;
      return next(err);
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // User 테이블에 사용자를 추가합니다.
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'APPLICANT', // 기본 역할
      },
    });

    return res.status(201).json({
      id: user.id,
      email: user.email,
      name,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at,
    });
  } catch (err) {
    return next(err);
  }
});

export default router;
