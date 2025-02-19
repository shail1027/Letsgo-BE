import express from 'express';
import { register, login, refreshToken, logout, getProfile, deleteAccount, updateUserInfo, changePassword } from '../controllers/authController.js';
import authenticateToken from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.post('/user', register);
router.post('/login', login);
router.post('/token', refreshToken);
router.post('/logout', authenticateToken, logout);
router.get('/info', authenticateToken, getProfile);
router.delete('/delete', authenticateToken, deleteAccount);
router.patch('/info/edit', authenticateToken, upload.single('profileImage'), updateUserInfo); 
router.post('/change-password', authenticateToken, changePassword); 
export default router;
