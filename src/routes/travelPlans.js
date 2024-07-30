import express from 'express';
import { createKakaoBookmarks, getUserLists, getListDetails, deleteList, updateKakaoBookmarks, addPlaceToFavoriteList, getFavoriteList, getAllFavoriteLists, getMyFavoriteList } from '../controllers/travelPlansController.js';
import authenticateToken from '../middleware/auth.js';

const router = express.Router();

router.post('/users/add-myPlace', authenticateToken, createKakaoBookmarks); // 북마크 리스트 등록
router.get('/users/lists', authenticateToken, getUserLists); // 사용자의 리스트 목록 조회
router.get('/users/lists/:listId', authenticateToken, getListDetails); // 특정 리스트 내 장소 조회
router.patch('/users/lists/:listId', authenticateToken, updateKakaoBookmarks); // 리스트 업데이트
router.delete('/users/lists/:listId', authenticateToken, deleteList); // 리스트 삭제
router.post('/travel-plans/add-place', authenticateToken, addPlaceToFavoriteList); // 리스트의 장소를 즐겨찾기에 추가
router.get('/travel-plans/favorite-list/:userId', authenticateToken, getFavoriteList); // 특정 사용자의 즐겨찾기 목록 조회
router.get('/travel-plans/all-favorite-lists', authenticateToken, getAllFavoriteLists); // 모든 사용자의 즐겨찾기 목록 조회
router.get('/travel-plans/favorite-list', authenticateToken, getMyFavoriteList); // 현재 사용자의 즐겨찾기 목록 조회

export default router;
