import Chat from "../../components/chat/Chat";
import List from "../../components/list/List";
import "./profilePage.scss";
import apiRequest from "../../lib/apiRequest";
import { Await, Link, useLoaderData, useNavigate } from "react-router-dom";
import { Suspense, useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Notification from "../../components/notification/Notification";

function ProfilePage() {
  const data = useLoaderData();
  const { updateUser, currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [notification, setNotification] = useState({ message: "", type: "", visible: false });
  const [isVerifying, setIsVerifying] = useState(false);

  const handleLogout = async () => {
    try {
      await apiRequest.post("/auth/logout");
      updateUser(null);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  const handleVerifyEmail = async () => {
    try {
      setIsVerifying(true);
      const res = await apiRequest.post("/auth/send-verification");
      setNotification({ message: res.data.message || "Verification email sent. Please check your inbox.", type: "success", visible: true });
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to send verification email.";
      setNotification({ message: msg, type: "error", visible: true });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleDelete = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      await apiRequest.delete(`/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/profile");
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  const handleUpdate = (postId) => {
    navigate(`/posts/update/${postId}`);
  };

  const role = currentUser?.role;
  const agentStatus = currentUser?.agentStatus;
  const rejectionReason = currentUser?.rejectionReason;

  // Can the user post listings?
  const canPost =
    role === "SELLER" ||
    role === "ADMIN" ||
    (role === "AGENT" && agentStatus === "APPROVED");

  // Determine banner state for agents
  const showPendingBanner = role === "AGENT" && agentStatus === "PENDING";
  const showRejectedBanner = role === "AGENT" && agentStatus === "REJECTED";

  return (
    <div className="min-h-[calc(100vh-72px)] flex flex-col lg:flex-row bg-surface-50">
      {/* Details Container */}
      <div className="flex-1 lg:w-3/5 p-6 lg:p-8 space-y-8 overflow-y-auto">
        {/* User Card */}
        <div className="bg-white rounded-card shadow-card p-6 md:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-surface-200">
            <div className="flex items-center gap-4">
              <img
                src={currentUser.avatar || "/noavatar.jpg"}
                alt={currentUser.username}
                className="w-16 h-16 rounded-full object-cover ring-4 ring-accent-100"
              />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-heading text-heading text-navy-900">{currentUser.username}</h1>
                  {/* Agent badge — only for APPROVED agents */}
                  {role === "AGENT" && agentStatus === "APPROVED" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-accent-50 border border-accent-200 rounded-pill text-accent-700 font-body font-semibold text-caption">
                      🏅 Verified Agent
                    </span>
                  )}
                  {/* Role badge for Admin */}
                  {role === "ADMIN" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-navy-900 rounded-pill text-white font-body font-semibold text-caption">
                      ⚙ Admin
                    </span>
                  )}
                </div>
                <p className="text-navy-400 font-body text-body-sm">{currentUser.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Link to="/profile/update" className="btn-outline flex-1 sm:flex-initial !py-2.5">
                Edit Profile
              </Link>
              <button onClick={handleLogout} className="btn-ghost !text-red-600 hover:!bg-red-50 !py-2.5">
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Email Verification Section */}
        <div className="bg-white rounded-card shadow-card p-6 md:p-8 border-t border-surface-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-heading text-lg text-navy-900 mb-1">Email Verification</h2>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-navy-400 font-body text-body-sm">Email:</span>
                <span className="text-navy-900 font-body text-body-sm font-medium">{currentUser.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-navy-400 font-body text-body-sm">Status:</span>
                {currentUser.isVerified ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 font-body font-semibold text-caption rounded-pill border border-green-200">
                    ✅ Email Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-700 font-body font-semibold text-caption rounded-pill border border-amber-200">
                    ⚠️ Email Not Verified
                  </span>
                )}
              </div>
              {!currentUser.isVerified && (
                <p className="font-body text-body-sm text-navy-400 mt-3 max-w-lg">
                  Your email address has not been verified yet. Verifying your email helps secure your account.
                </p>
              )}
            </div>
            {!currentUser.isVerified && (
              <button 
                onClick={handleVerifyEmail} 
                disabled={isVerifying}
                className="btn-primary whitespace-nowrap"
              >
                {isVerifying ? "Sending..." : "Verify Email"}
              </button>
            )}
          </div>
        </div>

        {/* Agent Status Banners */}
        {showPendingBanner && (
          <div className="bg-amber-50 border border-amber-200 rounded-card p-5 flex items-start gap-3">
            <span className="text-amber-500 text-2xl flex-shrink-0">⏳</span>
            <div>
              <h3 className="font-heading text-subheading text-amber-800 mb-1">Account Pending Review</h3>
              <p className="font-body text-body-sm text-amber-700">
                Your agent account is awaiting admin approval. Once approved, you'll be able to post and manage listings. We'll notify you when your account is reviewed.
              </p>
            </div>
          </div>
        )}

        {showRejectedBanner && (
          <div className="bg-red-50 border border-red-200 rounded-card p-5 flex items-start gap-3">
            <span className="text-red-500 text-2xl flex-shrink-0">❌</span>
            <div>
              <h3 className="font-heading text-subheading text-red-800 mb-1">Agent Application Rejected</h3>
              <p className="font-body text-body-sm text-red-700 mb-2">
                Your agent account application was not approved. You cannot post listings at this time.
              </p>
              {rejectionReason && (
                <div className="bg-red-100 border border-red-200 rounded-btn p-3">
                  <p className="font-body font-semibold text-caption text-red-800 mb-1">Reason provided by admin:</p>
                  <p className="font-body text-body-sm text-red-700 italic">"{rejectionReason}"</p>
                </div>
              )}
              <p className="font-body text-caption text-red-600 mt-2">
                Please contact support if you believe this is an error.
              </p>
            </div>
          </div>
        )}

        {/* My Listings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-xl text-navy-900">My Property Listings</h2>
            {canPost ? (
              <Link to="/add" className="btn-primary !py-2 !px-4">
                + Add Property
              </Link>
            ) : showPendingBanner ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-700 font-body text-caption rounded-btn">
                ⏳ Pending Approval
              </span>
            ) : showRejectedBanner ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-200 text-red-700 font-body text-caption rounded-btn">
                ✗ Access Denied
              </span>
            ) : null}
          </div>
          <Suspense fallback={<div className="py-8 text-center text-navy-400">Loading listings...</div>}>
            <Await resolve={data.postResponse} errorElement={<p className="text-red-500">Error loading posts!</p>}>
              {(postResponse) => (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <List
                    posts={postResponse.data.userPosts}
                    onDelete={handleDelete}
                    onUpdate={handleUpdate}
                    isMyListing={true}
                  />
                </div>
              )}
            </Await>
          </Suspense>
        </div>

        {/* Saved Listings */}
        <div className="space-y-4 pt-4">
          <h2 className="font-heading text-xl text-navy-900">Saved Properties</h2>
          <Suspense fallback={<div className="py-8 text-center text-navy-400">Loading saved properties...</div>}>
            <Await resolve={data.postResponse} errorElement={<p className="text-red-500">Error loading posts!</p>}>
              {(postResponse) => (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <List
                    posts={postResponse.data.savedPosts}
                    onDelete={handleDelete}
                    onUpdate={handleUpdate}
                    isMyListing={false}
                  />
                </div>
              )}
            </Await>
          </Suspense>
        </div>
      </div>

      {/* Chat Sidebar */}
      <div className="lg:w-2/5 bg-white border-l border-surface-200 min-h-[500px] lg:min-h-0 flex flex-col">
        <Suspense fallback={<div className="p-8 text-center text-navy-400">Loading chats...</div>}>
          <Await resolve={data.chatResponse} errorElement={<p className="p-8 text-red-500">Error loading chats!</p>}>
            {(chatResponse) => <Chat chats={chatResponse.data} />}
          </Await>
        </Suspense>
      </div>

      <Notification
        message={notification.message}
        type={notification.type}
        visible={notification.visible}
        onClose={() => setNotification({ ...notification, visible: false })}
      />
    </div>
  );
}

export default ProfilePage;
