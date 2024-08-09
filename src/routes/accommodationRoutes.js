import express from 'express';
import { saveAccommodation, getAccommodationsByTravelId, deleteAccommodation } from '../controllers/accommodationController.js';
import { searchMiddleware } from '../middleware/search.js';
import authenticateToken from '../middleware/auth.js';

const router = express.Router();

// 검색 엔드포인트와 저장 엔드포인트 정의
router.get('/search', searchMiddleware, (req, res) => {
    res.json(req.filteredData);  // 미들웨어에서 필터링된 데이터를 응답으로 전송
  });
  
router.post('/accommodations', authenticateToken, saveAccommodation);
// 특정 travel_id로 숙박 정보를 조회하는 GET 요청 처리
router.get('/accommodations/travel/:travel_id', authenticateToken, getAccommodationsByTravelId);
// 특정 acc_id로 숙박 정보를 삭제하는 DELETE 요청 처리
router.delete('/accommodations/:acc_id', deleteAccommodation);

export default router;
