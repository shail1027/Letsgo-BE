import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createInviteLink } from '../controllers/inviteController.js';
import authenticateToken from '../middleware/auth.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

router.post('/create', authenticateToken, createInviteLink);

router.get('/StartPlanRoom/:travel_id/:inviteToken', (req, res) => {
    const { travel_id, inviteToken } = req.params;
    res.redirect(`http://localhost:3000/StartPlanRoom/${travel_id}/${inviteToken}`);
});


export default router;
