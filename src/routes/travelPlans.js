import express from 'express';
import { createKakaoBookmarks, getUserLists, getListDetails, deleteList, updateKakaoBookmarks } from '../controllers/travelPlansController.js';
import authenticateToken from '../middleware/auth.js';

const router = express.Router();

router.post('/add-myPlace', authenticateToken, createKakaoBookmarks); // 북마크 리스트 등록
router.get('/lists', authenticateToken, getUserLists); // 사용자의 리스트 목록 조회
router.get('/lists/:listId', authenticateToken, getListDetails); // 특정 리스트 내 장소 조회
router.patch('/lists/:listId', authenticateToken, updateKakaoBookmarks); // 리스트 업데이트
router.delete('/lists/:listId', authenticateToken, deleteList); // 리스트 삭제

export default router;
