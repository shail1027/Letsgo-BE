import express from 'express';
import { getMyTravelList, createTravelPlan, getTravelPlanDetails, updateTravelPlan } from '../controllers/travelPlansController.js';
import authenticateToken from '../middleware/auth.js';

const router = express.Router();

// 여행 생성 관련 엔트포인트
router.get('/user/my-travels', authenticateToken, getMyTravelList);                   // 내가 참여한 여행 목록 조회 // 나의 여행 조회
router.post('/user/travel-plans/:travel_id', authenticateToken, createTravelPlan);    // 여행계획방 생성 // 계획방 만들기
router.get('/travels/show/:travel_id', authenticateToken, getTravelPlanDetails);      // 여행계획방 (안내) 조회// 세부 여행 조회
router.post('/travel-plans/:travel_id/detail', authenticateToken, updateTravelPlan);  // 여행계획방 입장하기 // 여행계획방 상세페이지

// 숙소 관련 엔드포인트


export default router;