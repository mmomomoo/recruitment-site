import express from 'express';
// import dotenv from 'dotenv';
import mysql from 'mysql2';
import router from './routers/index.js';
import { errorHandler } from './middlewares/error-handler.middleware.js';
import { prisma } from './utils/prisma.util.js';
import {
  SERVER_PORT,
  DB_DATABASE,
  DB_HOST,
  DB_PASSWORD,
  DB_USER,
} from './constants/env.constant.js';

// dotenv.config(); //.env 파일의 환경 변수를 로드

const app = express();
const PORT = SERVER_PORT;

app.use(express.json());
app.use('/', router);

const connect = mysql.createConnection({
  host: DB_HOST, // AWS RDS 엔드포인트
  user: DB_USER, // AWS RDS 계정 명
  password: DB_PASSWORD, // AWS RDS 비밀번호
  database: DB_DATABASE, // 연결할 MySQL DB 이름});
});

connect.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database.');
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!');
});
