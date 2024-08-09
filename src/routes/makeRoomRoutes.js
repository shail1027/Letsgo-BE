import { Router } from 'express';
import MakeRoomController from '../controllers/makeRoomController.js';
import authenticateToken from '../middleware/auth.js';

const router = Router();

router.post('/makeRoom', authenticateToken, MakeRoomController.uploadMiddleware, MakeRoomController.createMakeRoom);
router.get('/makeRoom', authenticateToken, MakeRoomController.getMakeRooms);
router.get('/makeRoom/:id', authenticateToken, MakeRoomController.getMakeRoom);
router.put('/makeRoom/:id', authenticateToken, MakeRoomController.uploadMiddleware, MakeRoomController.updateMakeRoom);
router.delete('/makeRoom/:id', authenticateToken, MakeRoomController.deleteMakeRoom);
router.get('/myRooms', authenticateToken, MakeRoomController.getMyRooms);


export default router;
