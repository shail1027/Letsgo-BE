import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import passport from 'passport';
import morgan from 'morgan';
import sequelize from './database.js';
import authRoutes from './src/routes/auth.js';
import googleAuthRoutes from './src/routes/googleAuth.js';
import locationRoutes from './src/routes/locationRoutes.js';
import travelPlanRoutes from './src/routes/travelPlans.js';

// 모델 파일들
import './src/models/user.js';
import './src/models/travelPlan.js';
import './src/models/FavoriteList.js';
import './src/models/Location.js';
import './src/models/Candidates.js';
import './src/models/myPlaceList.js';
import './src/models/MyPlaceListMapping.js';
import './src/models/accommodation.js';
import './src/models/travelRoute.js';
import './src/models/user_travelPlan.js';
import './src/models/vote.js';
import './src/models/associations.js'; // 관계 설정 파일

dotenv.config();

// ESM 환경에서 __dirname 대체
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

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

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 정적 파일 제공 설정 (업로드된 이미지 제공)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(passport.initialize());

app.use('/users', authRoutes);
app.use('/users', googleAuthRoutes);
app.use('/travel-plans', locationRoutes);
app.use('/', travelPlanRoutes);

// 라우터가 없는 경우에 대한 처리
app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

// 에러 핸들링 미들웨어 추가
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
