import { Router } from 'express';
import { requireAccessToken } from '../middlewares/require-access-token.middleware.js';
import { requireRoles } from '../middlewares/require-roles.middleware.js';
import { ROLES } from '../constants/user.constant.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  createResumeSchema,
  updateResumeSchema,
} from '../schemas/resume.schema.js';
import { prisma } from '../utils/prisma.util.js';

const router = Router();

router.use(requireAccessToken);

// 이력서 목록 조회
router.get('/resumes', async (req, res, next) => {
  try {
    const resumes = await prisma.resume.findMany({
      where: { userId: req.user.userId },
    });
    res.json(resumes);
  } catch (err) {
    next(err);
  }
});

// 이력서 상세 조회
router.get('/resumes/:id', async (req, res, next) => {
  try {
    const resume = await prisma.resume.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (!resume) {
      return res.status(404).json({ message: '이력서를 찾을 수 없습니다.' });
    }
    res.json(resume);
  } catch (err) {
    next(err);
  }
});

// 이력서 생성
router.post(
  '/resumes',
  validate(createResumeSchema),
  async (req, res, next) => {
    try {
      const { title, content, status } = req.body;
      const resume = await prisma.resume.create({
        data: {
          title,
          content,
          status,
          userId: req.user.userId,
        },
      });
      res.status(201).json(resume);
    } catch (err) {
      next(err);
    }
  },
);

// 이력서 수정
router.patch(
  '/resumes/:id',
  validate(updateResumeSchema),
  async (req, res, next) => {
    try {
      const { title, content, status } = req.body;
      const resume = await prisma.resume.update({
        where: { id: parseInt(req.params.id) },
        data: { title, content, status },
      });
      res.json(resume);
    } catch (err) {
      next(err);
    }
  },
);

// 이력서 삭제
router.delete('/resumes/:id', async (req, res, next) => {
  try {
    await prisma.resume.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

// 이력서 상태 변경
router.patch(
  '/resumes/:id/status',
  requireRoles([ROLES.RECRUITER]),
  async (req, res, next) => {
    try {
      const { status } = req.body;
      const resume = await prisma.resume.update({
        where: { id: parseInt(req.params.id) },
        data: { status },
      });
      res.json(resume);
    } catch (err) {
      next(err);
    }
  },
);

export default router;
