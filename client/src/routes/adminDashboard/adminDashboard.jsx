import { useState, useEffect, useCallback, useContext } from "react";
import { toast } from "react-toastify";
import apiRequest from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";
import "./adminDashboard.scss";

const ROLES = ["BUYER", "SELLER", "AGENT", "ADMIN"];

function AdminDashboard() {
  const { currentUser } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState("pending");
  const [pendingAgents, setPendingAgents] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rejectModal, setRejectModal] = useState(null); // { id, username }
  const [rejectReason, setRejectReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Delete confirmation modal state
  const [deleteModal, setDeleteModal] = useState(null); // { id, username }
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchPending = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiRequest.get("/admin/agents/pending");
      setPendingAgents(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load pending agents");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAllUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiRequest.get("/admin/users");
      setAllUsers(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "pending") fetchPending();
    else fetchAllUsers();
  }, [activeTab, fetchPending, fetchAllUsers]);

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleApprove = async (id) => {
    setActionLoading(true);
    try {
      await apiRequest.put(`/admin/agents/${id}/approve`);
      showSuccess("Agent approved successfully!");
      fetchPending();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to approve agent");
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenReject = (agent) => {
    setRejectModal({ id: agent.id, username: agent.username });
    setRejectReason("");
  };

  const handleConfirmReject = async () => {
    if (!rejectModal) return;
    setActionLoading(true);
    try {
      await apiRequest.put(`/admin/agents/${rejectModal.id}/reject`, {
        rejectionReason: rejectReason.trim() || undefined,
      });
      showSuccess(`Agent "${rejectModal.username}" rejected.`);
      setRejectModal(null);
      fetchPending();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to reject agent");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await apiRequest.put(`/admin/users/${userId}/role`, { role: newRole });
      showSuccess("Role updated!");
      fetchAllUsers();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update role");
    }
  };

  // ── Delete handlers ──────────────────────────────────────────────────────
  const handleOpenDelete = (user) => {
    setDeleteModal({ id: user.id, username: user.username });
  };

  const handleCancelDelete = () => {
    setDeleteModal(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal) return;
    setDeleteLoading(true);
    try {
      await apiRequest.delete(`/admin/users/${deleteModal.id}`);
      // Optimistically remove from table
      setAllUsers((prev) => prev.filter((u) => u.id !== deleteModal.id));
      toast.success(`User "${deleteModal.username}" has been permanently deleted.`);
      setDeleteModal(null);
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to delete user.";
      toast.error(msg);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-72px)] bg-surface-50">
      <div className="section-container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-display-sm text-navy-900 mb-2">Admin Dashboard</h1>
          <p className="font-body text-body-sm text-navy-400">Manage agent applications and user roles</p>
        </div>

        {/* Success message */}
        {successMsg && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-btn p-4 flex items-center gap-2">
            <span className="text-green-600">✓</span>
            <span className="font-body text-body-sm text-green-800">{successMsg}</span>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-btn p-4">
            <p className="font-body text-body-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-white rounded-card p-1.5 shadow-card w-fit">
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-6 py-2.5 rounded-btn font-body font-semibold text-body-sm transition-all duration-250 ${
              activeTab === "pending"
                ? "bg-accent-500 text-white shadow-sm"
                : "text-navy-600 hover:bg-surface-100"
            }`}
          >
            ⏳ Pending Agents
            {pendingAgents.length > 0 && activeTab === "pending" && (
              <span className="ml-2 w-5 h-5 bg-white/30 rounded-full inline-flex items-center justify-center text-xs">
                {pendingAgents.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-6 py-2.5 rounded-btn font-body font-semibold text-body-sm transition-all duration-250 ${
              activeTab === "users"
                ? "bg-accent-500 text-white shadow-sm"
                : "text-navy-600 hover:bg-surface-100"
            }`}
          >
            👥 All Users
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-16 text-navy-400 font-body">
            <div className="admin-spinner mx-auto mb-4" />
            Loading…
          </div>
        )}

        {/* ===== PENDING AGENTS TAB ===== */}
        {!loading && activeTab === "pending" && (
          <div>
            {pendingAgents.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-card shadow-card">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="font-heading text-xl text-navy-800 mb-2">No Pending Applications</h3>
                <p className="font-body text-body-sm text-navy-400">All agent applications have been reviewed.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {pendingAgents.map((agent) => (
                  <div key={agent.id} className="bg-white rounded-card shadow-card overflow-hidden hover:shadow-card-hover transition-shadow duration-300">
                    {/* License Document */}
                    <div className="relative">
                      {agent.licenseDocument ? (
                        <a href={agent.licenseDocument} target="_blank" rel="noopener noreferrer" className="block">
                          <img
                            src={agent.licenseDocument}
                            alt={`${agent.username}'s license`}
                            className="w-full h-44 object-cover hover:opacity-90 transition-opacity"
                          />
                          <div className="absolute bottom-2 right-2 bg-navy-900/70 text-white text-caption px-2 py-1 rounded-pill font-body backdrop-blur-sm">
                            🔍 Click to view full size
                          </div>
                        </a>
                      ) : (
                        <div className="w-full h-44 bg-surface-100 flex items-center justify-center">
                          <div className="text-center text-navy-400">
                            <div className="text-3xl mb-2">📄</div>
                            <p className="font-body text-caption">No document uploaded</p>
                          </div>
                        </div>
                      )}
                      <div className="absolute top-3 left-3">
                        <span className="bg-amber-500 text-white font-body font-semibold text-caption px-2.5 py-1 rounded-pill">
                          PENDING
                        </span>
                      </div>
                    </div>

                    {/* Agent Info */}
                    <div className="p-5">
                      <h3 className="font-heading text-lg text-navy-900 mb-1">{agent.username}</h3>
                      <p className="font-body text-body-sm text-navy-400 mb-1">{agent.email}</p>
                      <p className="font-body text-caption text-navy-300 mb-4">
                        Applied {new Date(agent.createdAt).toLocaleDateString("en-US", { dateStyle: "medium" })}
                      </p>

                      {/* Actions */}
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleApprove(agent.id)}
                          disabled={actionLoading}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-green-500 text-white font-body font-semibold text-body-sm rounded-btn hover:bg-green-600 transition-colors disabled:opacity-50"
                        >
                          ✓ Approve
                        </button>
                        <button
                          onClick={() => handleOpenReject(agent)}
                          disabled={actionLoading}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-red-500 text-white font-body font-semibold text-body-sm rounded-btn hover:bg-red-600 transition-colors disabled:opacity-50"
                        >
                          ✗ Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===== ALL USERS TAB ===== */}
        {!loading && activeTab === "users" && (
          <div className="bg-white rounded-card shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-surface-50 border-b border-surface-200">
                    <th className="text-left py-4 px-5 font-body font-semibold text-body-sm text-navy-600">User</th>
                    <th className="text-left py-4 px-5 font-body font-semibold text-body-sm text-navy-600">Email</th>
                    <th className="text-left py-4 px-5 font-body font-semibold text-body-sm text-navy-600">Current Role</th>
                    <th className="text-left py-4 px-5 font-body font-semibold text-body-sm text-navy-600">Agent Status</th>
                    <th className="text-left py-4 px-5 font-body font-semibold text-body-sm text-navy-600">Change Role</th>
                    <th className="text-left py-4 px-5 font-body font-semibold text-body-sm text-navy-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers.map((user, idx) => (
                    <tr key={user.id} className={`border-b border-surface-100 hover:bg-surface-50 transition-colors ${idx % 2 === 0 ? "" : "bg-surface-50/50"}`}>
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 bg-navy-100 rounded-full flex items-center justify-center font-body font-bold text-navy-700 text-caption">
                            {user.username[0].toUpperCase()}
                          </div>
                          <span className="font-body font-medium text-body-sm text-navy-800">{user.username}</span>
                        </div>
                      </td>
                      <td className="py-4 px-5 font-body text-body-sm text-navy-500">{user.email}</td>
                      <td className="py-4 px-5">
                        <span className={`inline-block px-2.5 py-1 rounded-pill font-body font-semibold text-caption ${
                          user.role === "ADMIN" ? "bg-navy-900 text-white" :
                          user.role === "AGENT" ? "bg-accent-50 text-accent-700 border border-accent-200" :
                          user.role === "SELLER" ? "bg-green-50 text-green-700 border border-green-200" :
                          "bg-surface-200 text-navy-600"
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-4 px-5">
                        {user.agentStatus ? (
                          <span className={`inline-block px-2.5 py-1 rounded-pill font-body text-caption ${
                            user.agentStatus === "APPROVED" ? "bg-green-50 text-green-700" :
                            user.agentStatus === "PENDING" ? "bg-amber-50 text-amber-700" :
                            "bg-red-50 text-red-700"
                          }`}>
                            {user.agentStatus}
                          </span>
                        ) : (
                          <span className="text-navy-300 font-body text-caption">—</span>
                        )}
                      </td>
                      <td className="py-4 px-5">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className="px-3 py-1.5 bg-white border border-navy-200 rounded-btn text-body-sm font-body text-navy-800 cursor-pointer hover:border-navy-300 focus:outline-none focus:ring-2 focus:ring-accent-400/30 focus:border-accent-400 transition-all"
                        >
                          {ROLES.map((r) => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                      </td>
                      <td className="py-4 px-5">
                        {/* Hide delete button on the admin's own row */}
                        {currentUser && user.id !== currentUser.id ? (
                          <button
                            onClick={() => handleOpenDelete(user)}
                            title={`Delete ${user.username}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-500 text-white font-body font-semibold text-caption rounded-btn hover:bg-red-600 active:bg-red-700 transition-colors"
                          >
                            🗑 Delete
                          </button>
                        ) : (
                          <span className="text-navy-300 font-body text-caption italic">You</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {allUsers.length === 0 && (
                <div className="text-center py-12 text-navy-400 font-body text-body-sm">No users found.</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ===== REJECT MODAL ===== */}
      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-navy-950/60 backdrop-blur-sm" onClick={() => setRejectModal(null)} />
          <div className="relative z-10 bg-white rounded-card shadow-elevated p-8 w-full max-w-md mx-4">
            <h2 className="font-heading text-xl text-navy-900 mb-2">Reject Agent Application</h2>
            <p className="font-body text-body-sm text-navy-500 mb-5">
              You are rejecting <strong>{rejectModal.username}</strong>'s application. Provide an optional reason that the agent will see on their profile.
            </p>
            <div className="mb-5">
              <label className="label-text mb-1.5 block">Reason (optional)</label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. License document is unclear or expired. Please resubmit with a valid document."
                rows={3}
                className="w-full px-4 py-3 bg-white border border-navy-200 rounded-btn text-body text-navy-800 placeholder-navy-300 focus:outline-none focus:ring-2 focus:ring-accent-400/30 focus:border-accent-400 resize-none transition-all"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setRejectModal(null)}
                className="flex-1 btn-outline"
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                disabled={actionLoading}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-500 text-white font-semibold text-body-sm rounded-btn hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {actionLoading ? "Rejecting…" : "Confirm Reject"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== DELETE CONFIRMATION MODAL ===== */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-navy-950/70 backdrop-blur-sm" onClick={!deleteLoading ? handleCancelDelete : undefined} />
          <div className="relative z-10 bg-white rounded-card shadow-elevated p-8 w-full max-w-md mx-4">
            {/* Icon */}
            <div className="flex items-center justify-center w-14 h-14 bg-red-100 rounded-full mx-auto mb-5">
              <span className="text-2xl">🗑</span>
            </div>
            <h2 className="font-heading text-xl text-navy-900 mb-2 text-center">Delete Account</h2>
            <p className="font-body text-body-sm text-navy-600 mb-2 text-center">
              Are you sure you want to permanently delete{" "}
              <strong className="text-navy-900">{deleteModal.username}</strong>?
            </p>
            <p className="font-body text-body-sm text-navy-500 mb-6 text-center">
              This will also delete their listings, saved posts, and chat history.{" "}
              <span className="font-semibold text-red-600">This cannot be undone.</span>
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleCancelDelete}
                disabled={deleteLoading}
                className="flex-1 px-6 py-3 border border-navy-200 rounded-btn font-body font-semibold text-body-sm text-navy-700 hover:bg-surface-100 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleteLoading}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white font-semibold text-body-sm rounded-btn hover:bg-red-700 active:bg-red-800 transition-colors disabled:opacity-50"
              >
                {deleteLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Deleting…
                  </>
                ) : (
                  "Confirm Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
