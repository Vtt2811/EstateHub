import express from 'express';
import { login, logout, register, verifyEmail, resendVerification, updateEmail, sendVerificationEmail } from '../controllers/auth.controllers.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerification);
router.post("/update-email", updateEmail);
router.post("/send-verification", verifyToken, sendVerificationEmail);

export default router;