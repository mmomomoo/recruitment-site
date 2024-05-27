import express from 'express';
import 'dotenv/config';

const app = express();
const PORT = process.env.SERVER_PORT;

app.use(express.json());

app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!');
});
