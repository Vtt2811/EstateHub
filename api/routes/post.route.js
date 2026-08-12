import express from "express";
import {
  addPost,
  deletePost,
  getPost,
  getPosts,
  updatePost,
} from "../controllers/post.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { requireRole } from "../middleware/requireRole.js";

const router = express.Router();

// Read routes — public
router.get("/", getPosts);
router.get("/:id", getPost);

// Write routes — only SELLER or APPROVED AGENT
router.post("/", verifyToken, requireRole(["SELLER", "AGENT"]), addPost);
router.put("/:id", verifyToken, requireRole(["SELLER", "AGENT"]), updatePost);
router.delete("/:id", verifyToken, requireRole(["SELLER", "AGENT"]), deletePost);

export default router;
