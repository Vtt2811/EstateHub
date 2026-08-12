import prisma from '../lib/prisma.js';

/** GET /api/admin/agents/pending — list agents awaiting review */
export const getPendingAgents = async (req, res) => {
    try {
        const agents = await prisma.user.findMany({
            where: { role: 'AGENT', agentStatus: 'PENDING' },
            select: {
                id: true,
                username: true,
                email: true,
                licenseDocument: true,
                createdAt: true,
                agentStatus: true,
            },
            orderBy: { createdAt: 'asc' },
        });
        res.status(200).json(agents);
    } catch (err) {
        console.error('getPendingAgents error:', err);
        res.status(500).json({ message: 'Failed to fetch pending agents' });
    }
};

/** PUT /api/admin/agents/:id/approve */
export const approveAgent = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await prisma.user.update({
            where: { id },
            data: { agentStatus: 'APPROVED', rejectionReason: null },
            select: { id: true, username: true, agentStatus: true },
        });
        res.status(200).json({ message: 'Agent approved successfully', user });
    } catch (err) {
        console.error('approveAgent error:', err);
        res.status(500).json({ message: 'Failed to approve agent' });
    }
};

/** PUT /api/admin/agents/:id/reject */
export const rejectAgent = async (req, res) => {
    const { id } = req.params;
    const { rejectionReason } = req.body;
    try {
        const user = await prisma.user.update({
            where: { id },
            data: {
                agentStatus: 'REJECTED',
                rejectionReason: rejectionReason || null,
            },
            select: { id: true, username: true, agentStatus: true, rejectionReason: true },
        });
        res.status(200).json({ message: 'Agent rejected', user });
    } catch (err) {
        console.error('rejectAgent error:', err);
        res.status(500).json({ message: 'Failed to reject agent' });
    }
};

/** GET /api/admin/users — list all users */
export const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                agentStatus: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        res.status(200).json(users);
    } catch (err) {
        console.error('getAllUsers error:', err);
        res.status(500).json({ message: 'Failed to fetch users' });
    }
};

/** PUT /api/admin/users/:id/role — change a user's role */
export const updateUserRole = async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    const validRoles = ['BUYER', 'SELLER', 'AGENT', 'ADMIN'];
    if (!validRoles.includes(role)) {
        return res.status(400).json({ message: `Invalid role: ${role}` });
    }

    try {
        const updateData = { role };
        // If changing to AGENT from non-agent, set status to PENDING unless already set
        if (role === 'AGENT') {
            updateData.agentStatus = 'PENDING';
        } else {
            // Clear agent-specific fields for non-agent roles
            updateData.agentStatus = null;
        }

        const user = await prisma.user.update({
            where: { id },
            data: updateData,
            select: { id: true, username: true, role: true, agentStatus: true },
        });
        res.status(200).json({ message: 'Role updated successfully', user });
    } catch (err) {
        console.error('updateUserRole error:', err);
        res.status(500).json({ message: 'Failed to update role' });
    }
};

/** DELETE /api/admin/users/:id — permanently delete a user and all related data */
export const deleteUser = async (req, res) => {
    const { id } = req.params;
    const adminId = req.userId;

    // Prevent an admin from deleting their own account
    if (id === adminId) {
        return res.status(400).json({ message: 'You cannot delete your own account.' });
    }

    try {
        // ── 1. Confirm the target user exists ──────────────────────────────────
        const targetUser = await prisma.user.findUnique({ where: { id } });
        if (!targetUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // ── 2. Delete SavedPost rows where this user is the saver ──────────────
        await prisma.savedPost.deleteMany({ where: { userId: id } });

        // ── 3. Clean up posts owned by this user ───────────────────────────────
        const userPosts = await prisma.post.findMany({
            where: { userId: id },
            include: { postDetail: true },
        });

        for (const post of userPosts) {
            // 3a. Remove any saved-post entries pointing to this post
            await prisma.savedPost.deleteMany({ where: { postId: post.id } });

            // 3b. Delete the PostDetail if one exists
            if (post.postDetail) {
                await prisma.postDetail.delete({ where: { postId: post.id } });
            }

            // 3c. Delete the post itself
            await prisma.post.delete({ where: { id: post.id } });
        }

        // ── 4. Clean up chats this user participated in ────────────────────────
        const chats = await prisma.chat.findMany({
            where: { userIDs: { hasSome: [id] } },
        });

        for (const chat of chats) {
            // Delete all messages sent by the deleted user in this chat
            await prisma.message.deleteMany({
                where: { chatId: chat.id, userId: id },
            });

            // Compute remaining valid participants (excluding the deleted user)
            const remainingIDs = chat.userIDs.filter((uid) => uid !== id);

            if (remainingIDs.length === 0) {
                // No participants left — delete all remaining messages then the chat
                await prisma.message.deleteMany({ where: { chatId: chat.id } });
                await prisma.chat.delete({ where: { id: chat.id } });
            } else {
                // Remove the deleted user from the chat's participant list
                await prisma.chat.update({
                    where: { id: chat.id },
                    data: {
                        userIDs: { set: remainingIDs },
                        seenBy: {
                            set: chat.seenBy.filter((uid) => uid !== id),
                        },
                    },
                });
            }
        }

        // ── 5. Delete the user record itself ───────────────────────────────────
        await prisma.user.delete({ where: { id } });

        res.status(200).json({
            message: `User "${targetUser.username}" and all related data deleted successfully.`,
        });
    } catch (err) {
        console.error('deleteUser error:', err);
        res.status(500).json({ message: 'Failed to delete user.' });
    }
};
