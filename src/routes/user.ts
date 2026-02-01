import {registerUser, loginUser, refreshToken, logout, getUserProfile} from "../controllers/user.ts";

import express from 'express';
import authenticateToken from "../middlewares/auth.ts";

const router = express.Router();

router.post('/login', loginUser);
router.post('/register', registerUser);
router.get('/refresh', refreshToken);

router.post('/logout', authenticateToken, logout);
router.get('/profile', authenticateToken, getUserProfile);

export default router;