/**
 * requireRole middleware
 * Usage: requireRole(['SELLER', 'AGENT'])
 *
 * Must come AFTER verifyToken (which sets req.userRole and req.userAgentStatus).
 *
 * For AGENT users, additionally checks that their agentStatus is APPROVED —
 * PENDING and REJECTED agents receive a descriptive 403 message instead of a
 * generic error so they understand why they are blocked.
 */
export const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    const role = req.userRole;

    if (!role) {
      return res.status(403).json({ message: "Access denied: no role found." });
    }

    if (!allowedRoles.includes(role)) {
      return res.status(403).json({
        message: `Access denied: your role (${role}) is not permitted to perform this action.`,
      });
    }

    // AGENT-specific check: must be APPROVED
    if (role === "AGENT") {
      const agentStatus = req.userAgentStatus;

      if (agentStatus === "PENDING") {
        return res.status(403).json({
          message:
            "Your agent account is currently awaiting admin approval. You will be able to post listings once approved.",
        });
      }

      if (agentStatus === "REJECTED") {
        return res.status(403).json({
          message:
            "Your agent account application has been rejected. Please contact support for more information.",
        });
      }

      if (agentStatus !== "APPROVED") {
        return res.status(403).json({
          message: "Your agent account is not yet approved.",
        });
      }
    }

    next();
  };
};
