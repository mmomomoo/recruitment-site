import { Router } from 'express';
// import authRouter from './auth.router.js';
import userRouter from './users.router.js';
import router from './users.router.js';
// import resumeRouter from './resumes.router.js';

// const router = Router();

// router.use('/auth', authRouter);
router.use('/users', userRouter);

// router.use('/resumes', resumeRouter);

export default router;
