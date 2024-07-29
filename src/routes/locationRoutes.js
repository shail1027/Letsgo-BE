import express from 'express';
import { getLocationInfo, getLocations, getAllLocations } from '../controllers/locationController.js';
import authenticateToken from '../middleware/auth.js';

const router = express.Router();

router.post('/my-locations', authenticateToken, getLocationInfo);
router.get('/my-locations', authenticateToken, getLocations); // 새로운 경로 추가
router.get('/all-locations', getAllLocations);

export default router;
