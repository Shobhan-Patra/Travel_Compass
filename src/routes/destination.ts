import {addNewDestination} from "../controllers/destinations.ts";

import express from 'express';
const router = express.Router();

router.post('/', addNewDestination);

export default router;