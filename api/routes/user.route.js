import express from "express";
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  savePost,
  profilePosts,
  getNotificationNumber,
} from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
const router = express.Router();

router.get("/", getUsers);
// router.get("/:id", verifyToken, getUser); //this route is getting between fetch of tje profile page so i ahve tp remove this it i only for test purpose ps - umang
router.put("/:id", verifyToken, updateUser);
router.delete("/;id", verifyToken, deleteUser);
router.put("/:id", verifyToken, updateUser);
router.delete("/:id", verifyToken, deleteUser);
router.post("/save", verifyToken, savePost);
router.get("/profilePosts", verifyToken, profilePosts);
router.get("/notification", verifyToken, getNotificationNumber);

export default router;
