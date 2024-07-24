import express from 'express';
import sequelize from './database.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Sequelize 연결 확인
sequelize.authenticate()
  .then(() => {
    console.log('데이터베이스에 연결되었습니다.');
  })
  .catch(err => {
    console.error('데이터베이스 연결 오류:', err);
  });

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});
