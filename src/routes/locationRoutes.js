import express from 'express';
import { getLocationInfo } from '../controllers/locationController.js';
import authenticateToken from '../middleware/auth.js';

const router = express.Router();

router.post('/fetch-place', authenticateToken, getLocationInfo);

export default router;
