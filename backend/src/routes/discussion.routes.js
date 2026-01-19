// import { Router } from "express";
// import {
//   createPost,
//   getAllPosts,
//   getPostWithComments,
//   addComment,
//   deletePost
// } from "../controllers/discussion.controller.js";

// import { authenticate } from "../middleware/auth.middleware.js";
// import { authorize } from "../middleware/rbac.middleware.js";

// const router = Router();

// router.post("/", authenticate, createPost);
// router.get("/", getAllPosts);
// router.get("/:id", getPostWithComments);
// router.post("/:id/comments", authenticate, addComment);
// router.delete("/:id", authenticate, authorize(["ADMIN"]), deletePost);

// export default router;

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
