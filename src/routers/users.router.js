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
    //이메일, 비밀번호, 비밀번호 확인, 이름을 Request Body(req.body)로 전달 받습니다.
    const { email, password, passwordConfirm, name } = req.body;

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
        //역할의 종류는 다음과 같으며, 기본 값은 APPLICANT
        role: 'APPLICANT', // 기본 역할
      },
    });
    //사용자 ID, 역할, 생성일시, 수정일시는 자동 생성
    return res.status(201).json({
      id: user.id, //사용자 id
      email: user.email, //이메일
      name, //이름
      role: user.role, //역할
      created_at: user.created_at, //생성일시
      updated_at: user.updated_at, //수정일시
    });
  } catch (err) {
    return next(err);
  }
});

export default router;
