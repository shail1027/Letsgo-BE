import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/user.js';

dotenv.config();

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (token == null) return res.sendStatus(401); // 토큰이 없는 경우

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findByPk(decoded.userId); // 토큰에서 사용자 ID를 가져와 사용자 정보를 요청에 추가
    if (!req.user) {
      return res.sendStatus(403); // 사용자를 찾을 수 없는 경우
    }
    console.log('Authenticated User:', req.user); // 디버깅 로그 추가
    next(); // 다음 미들웨어 또는 라우트로 이동
  } catch (err) {
    res.sendStatus(403); // 토큰이 유효하지 않은 경우
  }
};

export default authenticateToken;