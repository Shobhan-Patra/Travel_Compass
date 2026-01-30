import {registerUser, loginUser, refreshToken} from "../controllers/user.ts";

import express from 'express';

const router = express.Router();

router.post('/login', loginUser);
router.post('/register', registerUser);
router.get('/refresh', refreshToken);

export default router;