import { Router } from 'express';
import { requireAccessToken } from '../middlewares/require-access-token.middleware.js';
import { requireRoles } from '../middlewares/require-roles.middleware.js';
import { ROLES } from '../constants/user.constant.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  createResumeSchema,
  updateResumeSchema,
} from '../schemas/resume.schema.js';

const router = Router();

router.use(requireAccessToken);

router.get('/', (req, res) => {
  // 이력서 목록 조회 로직 구현
});

router.get('/:id', (req, res) => {
  // 이력서 상세 조회 로직 구현
});

router.post('/', validate(createResumeSchema), (req, res) => {
  // 이력서 생성 로직 구현
});

router.patch('/:id', validate(updateResumeSchema), (req, res) => {
  // 이력서 수정 로직 구현
});

router.delete('/:id', (req, res) => {
  // 이력서 삭제 로직 구현
});

router.patch('/:id/status', requireRoles([ROLES.RECRUITER]), (req, res) => {
  // 이력서 상태 변경 로직 구현
});

export default router;
