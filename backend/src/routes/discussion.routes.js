import express from "express";
import {
  createPost,
  getPosts,
  getPost,
  addComment,
  likePost,
  unlikePost,
  toggleLike
} from "../controllers/discussion.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/posts", getPosts);
router.get("/posts/:id", getPost);

router.post("/posts", authMiddleware, createPost);
router.post("/posts/:id/comments", authMiddleware, addComment);

router.post("/posts/:id/like", authMiddleware, toggleLike);
router.post("/posts/:id/unlike", authMiddleware, unlikePost);

export default router;