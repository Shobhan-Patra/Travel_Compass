import {createPost, deletePost, updatePost} from "../controllers/posts.ts";

import express from 'express';
const router = express.Router();

router.post('/', createPost);
router.patch('/:postId', updatePost);
router.delete('/:postId', deletePost);

export default router;