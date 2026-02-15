import {addNewDestination, getUploadURL} from "../controllers/destinations.ts";

import express from 'express';
const router = express.Router();

router.post('/', addNewDestination);
router.get('/upload', getUploadURL);

export default router;