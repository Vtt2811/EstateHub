import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { requireRole } from '../middleware/requireRole.js';
import {
    getPendingAgents,
    approveAgent,
    rejectAgent,
    getAllUsers,
    updateUserRole,
    deleteUser,
} from '../controllers/admin.controller.js';

const router = express.Router();

// All admin routes require authentication AND ADMIN role
router.use(verifyToken, requireRole(['ADMIN']));

router.get('/agents/pending', getPendingAgents);
router.put('/agents/:id/approve', approveAgent);
router.put('/agents/:id/reject', rejectAgent);
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);


export default router;
