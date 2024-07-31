import express from 'express';
import { getLocationInfo, getLocations, getAllLocations, deleteLocation } from '../controllers/locationController.js';
import authenticateToken from '../middleware/auth.js';

const router = express.Router();

router.post('/my-locations', authenticateToken, getLocationInfo);
router.get('/my-locations', authenticateToken, getLocations);
router.get('/all-locations', getAllLocations);
router.delete('/my-locations/:locationId', authenticateToken, deleteLocation); 

export default router;
