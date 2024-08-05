import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import passport from 'passport';
import sequelize from './database.js';
import authRoutes from './src/routes/auth.js';
import googleAuthRoutes from './src/routes/googleAuth.js';
import locationRoutes from './src/routes/locationRoutes.js'; 
import TravelPlanRoutes from './src/routes/travelPlans.js';
import User from './src/models/user.js'; 
import TravelPlan from './src/models/travelPlan.js'; 
import FavoriteList from './src/models/FavoriteList.js'; 

// ESM 환경에서 __dirname 대체
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 정적 파일 제공 설정 (업로드된 이미지 제공)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(passport.initialize());

sequelize.authenticate()
  .then(() => {
    console.log('데이터베이스에 연결되었습니다.');
  })
  .catch(err => {
    console.error('데이터베이스 연결 오류:', err);
  });

sequelize.sync({ alter: true }) 
  .then(() => {
    console.log('모든 모델이 동기화되었습니다.');
  })
  .catch(err => {
    console.error('모델 동기화 오류:', err);
  });

app.use('/users', authRoutes);
app.use('/users', googleAuthRoutes);
app.use('/travel-plans', locationRoutes); 
app.use('/', TravelPlanRoutes);

// 에러 핸들링 미들웨어 추가
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
