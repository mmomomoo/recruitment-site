import express from 'express';
import { requireAccessToken } from '../middlewares/require-access-token.middleware.js';
import { requireRoles } from '../middlewares/require-roles.middleware.js';
import { ROLES } from '../constants/user.constant.js';
import { validate } from '../middlewares/validate.middleware.js';
import { prisma } from '../utils/prisma.util.js';
import Joi from 'joi';

const router = express.Router();

// 이력서 생성 스키마
const createResumeSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
  status: Joi.string().valid('draft', 'published').required(),
});

// 이력서 수정 스키마
const updateResumeSchema = Joi.object({
  title: Joi.string(),
  content: Joi.string(),
  status: Joi.string().valid('draft', 'published'),
});

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
    if (!resume || resume.userId !== req.user.userId) {
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
    const resume = await prisma.resume.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (!resume || resume.userId !== req.user.userId) {
      return res.status(404).json({ message: '이력서를 찾을 수 없습니다.' });
    }

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
